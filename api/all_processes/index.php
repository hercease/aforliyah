<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
include('../functions.php');
include('../connection.php');
//date_default_timezone_set("Africa/lagos");
$jsonData = json_decode(file_get_contents("../countrycurrencies.json"), true);
include("../phonePrefixCodesWithCountry.php");
if($_SERVER['REQUEST_METHOD'] == "POST"){
	
	$request = json_decode(file_get_contents('php://input'));
	$fetchtoken = fetchtoken($conn, 'thomalex', "");
	$api_key = $fetchtoken['token'];
	
	$uniqueStrings = [];
	$flightsegment = [];
	$allArtinery = [];
	$completeArtinery = [];
	$journeyduration = [];
	$departure = [];
	$arrival = [];
	$allmatrix = [];
	$count_stops = isset($_POST['filter_stops_return']) ? $_POST['filter_stops_return'] : [];
	$limit = 10;
	$select_filter = sanitizeInput($request->select_filter ?? "");
	$totalMarketAirlines = 0;
	$airlineCounts = []; // To keep track of the counts of each airline
	$marketairline = $request->airlines ?? []; // To keep track of the counts of each airline
	$outbound_departure = $request->outbound_departure ?? []; // To keep track of the counts of each airline
	$outbound_arrival = $request->outbound_arrival ?? []; // To keep track of the counts of each airline
	$count_stops = $request->stops ?? []; // To keep track of the counts of each airline
	$page = isset($request->page) ? (int)$request->page : 1;
	$offset = ($page - 1) * $limit;

	if(trim($request->request_type)=='one-way'){

		$cabin = sanitizeInput($request->cabin);
		$adults = sanitizeInput($request->adult);
		$children = sanitizeInput($request->child);
		$infant = sanitizeInput($request->infant);
		$departure = sanitizeInput($request->departure);
		$arrival = sanitizeInput($request->arrival);
		$departure_date = sanitizeInput($request->departure_date);
		
		$direct = in_array("direct",$count_stops) ? 'true' : 'false';
	
		$build_query = "currencyCode=NGN&from1=$departure&to1=$arrival&departureDate1=$departure_date&adults=$adults&infants=$infant&children=$children&flightClass=$cabin&directFlightsOnly=$direct";
		$search_url = $website_url.'air/search?'.''. $build_query .'';
		$resp = curlwithHeader($search_url,$api_key);

		$search_url = $website_url.'air/search?'.''. $build_query .'';
		$resp = curlwithHeader($search_url,$api_key);

		if(!empty($resp) && is_array($resp)){

			$totalmatrix = count($resp['Matrix']['DirectAirlines'] ?? []) + count($resp['Matrix']['TwoStopsAirlines'] ?? []) + count($resp['Matrix']['OneStopAirlines'] ?? []);
			$mergematrix = array_merge($resp['Matrix']['DirectAirlines'] ?? [],$resp['Matrix']['TwoStopsAirlines'] ?? [],$resp['Matrix']['OneStopAirlines'] ?? []);
			$allmatrix = [];
			$nonstop = $resp['Matrix']['DirectAirlines'] ?? [];
			$twostop = $resp['Matrix']['TwoStopsAirlines'] ?? [];
			$onestop = $resp['Matrix']['OneStopAirlines'] ?? [];

			foreach($mergematrix as $value){
				$d = array("name" => $value['Airline'], "code" => $value['AirlineCode']);
				if (!in_array($d, $allmatrix)){
					$allmatrix[] = $d;
				}
			}
			
			$cheapest = $resp['PricedItineraries'][0]['AirItineraryPricingInfo']['TotalPrice'] ?? 0;

			$fastestFlight = null;
			$cheapestFlight = null;
			$bestCombinationFlight = null;

			$minDuration = PHP_INT_MAX;
			$minPrice = PHP_INT_MAX;
			$bestCombinationValue = PHP_INT_MAX;

			foreach($resp['PricedItineraries'] ?? [] as $k => $a){

				$a['originalIndex'] = $k;
				$allArtinery[] = $a;
				$completeArtinery[] = $a;
				foreach($a['AirItinerary']['OriginDestinationOptions'] as $c){
					foreach($c['FlightSegments'] as $key => $d){
						$airlineName = $d['MarketingAirlineName'];
						$airlineCode = $d['MarketingAirlineCode'];
						
						$price = $a['AirItineraryPricingInfo']['TotalPrice'];
						$totalduration = $c['JourneyTotalDuration']; 

						// Calculate the cheapest flight
						if ($price < $minPrice) {
							$minPrice = $price;
							$cheapestFlight = $a;
						}

						// Calculate the fastest flight
						if ($totalduration < $minDuration) {
							$minDuration = $totalduration;
							$fastestFlight = $a;
						}

						// Calculate the best combination of duration and price
						$combinationValue = $totalduration + $price; // or use a weighted combination if needed

						if ($combinationValue < $bestCombinationValue) {
							$bestCombinationValue = $combinationValue;
							$bestCombinationFlight = $a;
						}
						// Increment the total number of all market airlines
						$totalMarketAirlines++;

						// Initialize or increment the count for this airline
						if (!isset($airlineCounts[$airlineName])) {
							$airlineCounts[$airlineName] = 1; // Initialize count if not set
						} else {
							$airlineCounts[$airlineName]++; // Increment count if already set
						}
						
						$marketAirlineKey = $airlineName . '-' . $airlineCode;
						// Check if the airline is already in the uniqueStrings array
						$exists = false;
						foreach ($uniqueStrings as &$uniqueString) {
							if ($uniqueString['key'] === $marketAirlineKey){
								$uniqueString['count']++;
								$exists = true;
								break;
							}
						}

						// If the airline is not in the uniqueStrings array, add it
						if (!$exists) {
							$uniqueStrings[] = [
								"name" => $airlineName,
								"code" => $airlineCode,
								"count" => $airlineCounts[$airlineName], // Add the count to the array
								"key" => $marketAirlineKey, // Include the unique key for comparison
							];
						}
					}
				}

			}
			
			if(!empty($marketairline)){
				//$airline = $count_airlines;
				$allArtinery = array_filter($allArtinery, function($var) use ($marketairline) {  
					$evtime = $var['AirItinerary']['OriginDestinationOptions'][0]['FlightSegments'][0]['MarketingAirlineName'];
					return in_array($evtime,$marketairline);  
				});
			}
			
			if(!empty($outbound_departure)){
				$result = extractMinMaxDateTime($outbound_departure);
				$startDate = $result['min'];
				$endDate = $result['max'];
				$allArtinery = array_filter($allArtinery, function($var) use ($startDate, $endDate){  
				$evtime = $var['AirItinerary']['OriginDestinationOptions'][0]["FlightSegments"][0]['DepartureDate'];
					//print_r($evtime);
					return ($evtime >= $startDate  && $evtime <= $endDate); 
				});
			}
			
			if(!empty($outbound_arrival)){
				$result = extractMinMaxDateTime($outbound_arrival);
				$startDate = $result['min'];
				$endDate = $result['max'];
				$allArtinery = array_filter($allArtinery, function($var) use ($startDate, $endDate){  
					$evtime = $var['AirItinerary']['OriginDestinationOptions'][0]["FlightSegments"][0]['ArrivalDate'];
					return $evtime <= $endDate && $evtime >= $startDate;  
				});
			}
			
			if(!empty($count_stops)){
				$stops = end($count_stops);	
				if($stops=='direct'){
					$allArtinery = array_filter($allArtinery, function($var) use ($stops){
						return count($var['AirItinerary']['OriginDestinationOptions'][0]["FlightSegments"]) == 1 ;
						//return $count == 1; 
					});
				}
				
				if($stops=='onestop'){
					$allArtinery = array_filter($allArtinery, function($var) use ($stops){
						return count($var['AirItinerary']['OriginDestinationOptions'][0]["FlightSegments"]) == 2 ;
						//return $count == 1; 
					});
				}
				
				if($stops=='twostop'){
					$allArtinery = array_filter($allArtinery, function($var) use ($stops){
						return count($var['AirItinerary']['OriginDestinationOptions'][0]["FlightSegments"]) >= 2;
					});
				}
			}
			
			if($select_filter != ""){
				
				if($select_filter=='shortest first'){
					array_multisort(array_map(static function($element){
						return $element['AirItinerary']['OriginDestinationOptions'][0]["JourneyTotalDuration"];
					},$allArtinery),SORT_ASC,$allArtinery);
				}
				if($select_filter=='cheapest first'){
					array_multisort(array_map(static function ($element){
						return $element['AirItineraryPricingInfo']['TotalPrice'];
					},$allArtinery),SORT_ASC,$allArtinery);
				}
				if($select_filter=='departure earliest'){
					array_multisort(array_map(static function ($element){
						return $element['AirItinerary']['OriginDestinationOptions'][0]["FlightSegments"][0]['DepartureDate'];
					},$allArtinery),SORT_ASC,$allArtinery);
				}
				if($select_filter=='departure latest'){
					array_multisort(array_map(static function ($element){
						return $element['AirItinerary']['OriginDestinationOptions'][0]["FlightSegments"][0]['DepartureDate'];
					},$allArtinery),SORT_DESC,$allArtinery);
				}
				if($select_filter=='arrival latest'){
					array_multisort(array_map(static function ($element){
						return $element['AirItinerary']['OriginDestinationOptions'][0]["FlightSegments"][0]['ArrivalDate'];
					},$allArtinery),SORT_DESC,$allArtinery);
				}
				if($select_filter=='arrival earliest'){
					array_multisort(array_map(static function ($element){
						return $element['AirItinerary']['OriginDestinationOptions'][0]["FlightSegments"][0]['ArrivalDate'];
					},$allArtinery),SORT_ASC,$allArtinery);
				}
				
			}

			$total_records = count($allArtinery);
			$allArtinery = array_slice($allArtinery, $offset, $limit);
			$total_pages   = ceil($total_records / $limit);
			$response = ["status" => 0, 'cheapest' => $cheapest, 'nonstop' => $nonstop, 'twostop' => $twostop, 'onestop' => $onestop, 'all_matrix' => $allmatrix,  'allflights' => $completeArtinery, 'recommended' => $bestCombinationFlight, 'fastest_artinery' => $fastestFlight, 'cheapest_artinery' => $cheapestFlight, 'sessionId' => $resp['SessionId']?? [], 'outbound_departure' => $outbound_departure, 'page' => $page, 'airlines' => $uniqueStrings,  "total_pages" => $total_pages, "flights" => $allArtinery];
			
			
		}else{
			$response = ["status" => 1, 'page' => 0, 'airlines' => [], "total_pages" => 0, "flights" => []];
		}
		
		echo json_encode($response);

	}
	
	if(trim($request->request_type)== 'round-trip'){
		
		$cabin = sanitizeInput($request->cabin);
		$adults = sanitizeInput($request->adult);
		$children = sanitizeInput($request->child);
		$infant = sanitizeInput($request->infant);
		$departure = sanitizeInput($request->departure);
		$arrival = sanitizeInput($request->arrival);
		$departure_date = sanitizeInput($request->departure_date);
		$arrival_date = sanitizeInput($request->arrival_date);
		$direct = in_array("direct",$count_stops) ? 'true' : 'false';
	
		$build_query = "currencyCode=NGN&from1=$departure&to1=$arrival&from2=$arrival&to2=$departure&departureDate1=$departure_date&departureDate2=$arrival_date&adults=$adults&infants=$infant&children=$children&flightClass=$cabin&directFlightsOnly=$direct";
		$search_url = $website_url.'air/search?'.''. $build_query .'';
		$resp = curlwithHeader($search_url,$api_key);

		if(!empty($resp) && is_array($resp)){

			$totalmatrix = count($resp['Matrix']['DirectAirlines'] ?? []) + count($resp['Matrix']['TwoStopsAirlines'] ?? []) + count($resp['Matrix']['OneStopAirlines'] ?? []);
			$mergematrix = array_merge($resp['Matrix']['DirectAirlines'] ?? [],$resp['Matrix']['TwoStopsAirlines'] ?? [],$resp['Matrix']['OneStopAirlines'] ?? []);
			$allmatrix = [];
			$nonstop = $resp['Matrix']['DirectAirlines'] ?? [];
			$twostop = $resp['Matrix']['TwoStopsAirlines'] ?? [];
			$onestop = $resp['Matrix']['OneStopAirlines'] ?? [];

			foreach($mergematrix as $value){
				$d = array("name" => $value['Airline'], "code" => $value['AirlineCode']);
				if (!in_array($d, $allmatrix)){
					$allmatrix[] = $d;
				}
			}
			
			$cheapest = $resp['PricedItineraries'][0]['AirItineraryPricingInfo']['TotalPrice'] ?? 0;

			$fastestFlight = null;
			$cheapestFlight = null;
			$bestCombinationFlight = null;

			$minDuration = PHP_INT_MAX;
			$minPrice = PHP_INT_MAX;
			$bestCombinationValue = PHP_INT_MAX;

			foreach($resp['PricedItineraries'] ?? [] as $k => $a){

				$a['originalIndex'] = $k;
				$allArtinery[] = $a;
				$completeArtinery[] = $a;
				foreach($a['AirItinerary']['OriginDestinationOptions'] as $c){
					foreach($c['FlightSegments'] as $key => $d){
						$airlineName = $d['MarketingAirlineName'];
						$airlineCode = $d['MarketingAirlineCode'];
						
						$price = $a['AirItineraryPricingInfo']['TotalPrice'];
						$totalduration = $c['JourneyTotalDuration']; 

						// Calculate the cheapest flight
						if ($price < $minPrice) {
							$minPrice = $price;
							$cheapestFlight = $a;
						}

						// Calculate the fastest flight
						if ($totalduration < $minDuration) {
							$minDuration = $totalduration;
							$fastestFlight = $a;
						}

						// Calculate the best combination of duration and price
						$combinationValue = $totalduration + $price; // or use a weighted combination if needed

						if ($combinationValue < $bestCombinationValue) {
							$bestCombinationValue = $combinationValue;
							$bestCombinationFlight = $a;
						}
						// Increment the total number of all market airlines
						$totalMarketAirlines++;

						// Initialize or increment the count for this airline
						if (!isset($airlineCounts[$airlineName])) {
							$airlineCounts[$airlineName] = 1; // Initialize count if not set
						} else {
							$airlineCounts[$airlineName]++; // Increment count if already set
						}
						
						$marketAirlineKey = $airlineName . '-' . $airlineCode;
						// Check if the airline is already in the uniqueStrings array
						$exists = false;
						foreach ($uniqueStrings as &$uniqueString) {
							if ($uniqueString['key'] === $marketAirlineKey){
								$uniqueString['count']++;
								$exists = true;
								break;
							}
						}

						// If the airline is not in the uniqueStrings array, add it
						if (!$exists) {
							$uniqueStrings[] = [
								"name" => $airlineName,
								"code" => $airlineCode,
								"count" => $airlineCounts[$airlineName], // Add the count to the array
								"key" => $marketAirlineKey, // Include the unique key for comparison
							];
						}
					}
				}

			}
			
			if(!empty($marketairline)){
				//$airline = $count_airlines;
				$allArtinery = array_filter($allArtinery, function($var) use ($marketairline) {  
					$evtime = $var['AirItinerary']['OriginDestinationOptions'][0]['FlightSegments'][0]['MarketingAirlineName'];
					return in_array($evtime,$marketairline);  
				});
			}
			
			if(!empty($outbound_departure)){
				$result = extractMinMaxDateTime($outbound_departure);
				$startDate = $result['min'];
				$endDate = $result['max'];
				$allArtinery = array_filter($allArtinery, function($var) use ($startDate, $endDate){  
				$evtime = $var['AirItinerary']['OriginDestinationOptions'][0]["FlightSegments"][0]['DepartureDate'];
					//print_r($evtime);
					return ($evtime >= $startDate  && $evtime <= $endDate); 
				});
			}
			
			if(!empty($outbound_arrival)){
				$result = extractMinMaxDateTime($outbound_arrival);
				$startDate = $result['min'];
				$endDate = $result['max'];
				$allArtinery = array_filter($allArtinery, function($var) use ($startDate, $endDate){  
					$evtime = $var['AirItinerary']['OriginDestinationOptions'][0]["FlightSegments"][0]['ArrivalDate'];
					return $evtime <= $endDate && $evtime >= $startDate;  
				});
			}
			
			if(!empty($count_stops)){
				$stops = end($count_stops);	
				if($stops=='direct'){
					$allArtinery = array_filter($allArtinery, function($var) use ($stops){
						return count($var['AirItinerary']['OriginDestinationOptions'][0]["FlightSegments"]) == 1 ;
						//return $count == 1; 
					});
				}
				
				if($stops=='onestop'){
					$allArtinery = array_filter($allArtinery, function($var) use ($stops){
						return count($var['AirItinerary']['OriginDestinationOptions'][0]["FlightSegments"]) == 2 ;
						//return $count == 1; 
					});
				}
				
				if($stops=='twostop'){
					$allArtinery = array_filter($allArtinery, function($var) use ($stops){
						return count($var['AirItinerary']['OriginDestinationOptions'][0]["FlightSegments"]) >= 2;
					});
				}
			}
			
			if($select_filter != ""){
				
				if($select_filter=='shortest first'){
					array_multisort(array_map(static function($element){
						return $element['AirItinerary']['OriginDestinationOptions'][0]["JourneyTotalDuration"];
					},$allArtinery),SORT_ASC,$allArtinery);
				}
				if($select_filter=='cheapest first'){
					array_multisort(array_map(static function ($element){
						return $element['AirItineraryPricingInfo']['TotalPrice'];
					},$allArtinery),SORT_ASC,$allArtinery);
				}
				if($select_filter=='departure earliest'){
					array_multisort(array_map(static function ($element){
						return $element['AirItinerary']['OriginDestinationOptions'][0]["FlightSegments"][0]['DepartureDate'];
					},$allArtinery),SORT_ASC,$allArtinery);
				}
				if($select_filter=='departure latest'){
					array_multisort(array_map(static function ($element){
						return $element['AirItinerary']['OriginDestinationOptions'][0]["FlightSegments"][0]['DepartureDate'];
					},$allArtinery),SORT_DESC,$allArtinery);
				}
				if($select_filter=='arrival latest'){
					array_multisort(array_map(static function ($element){
						return $element['AirItinerary']['OriginDestinationOptions'][0]["FlightSegments"][0]['ArrivalDate'];
					},$allArtinery),SORT_DESC,$allArtinery);
				}
				if($select_filter=='arrival earliest'){
					array_multisort(array_map(static function ($element){
						return $element['AirItinerary']['OriginDestinationOptions'][0]["FlightSegments"][0]['ArrivalDate'];
					},$allArtinery),SORT_ASC,$allArtinery);
				}
				
			}

			$total_records = count($allArtinery);
			$allArtinery = array_slice($allArtinery, $offset, $limit);
			$total_pages   = ceil($total_records / $limit);
			$response = ["status" => 0, 'cheapest' => $cheapest, 'nonstop' => $nonstop, 'twostop' => $twostop, 'onestop' => $onestop, 'all_matrix' => $allmatrix,  'allflights' => $completeArtinery, 'recommended' => $bestCombinationFlight, 'fastest_artinery' => $fastestFlight, 'cheapest_artinery' => $cheapestFlight, 'sessionId' => $resp['SessionId']?? [], 'outbound_departure' => $outbound_departure, 'page' => $page, 'airlines' => $uniqueStrings,  "total_pages" => $total_pages, "flights" => $allArtinery];
			
			
		}else{
			$response = ["status" => 1, 'page' => 0, 'airlines' => [], "total_pages" => 0, "flights" => []];
		}
		
		echo json_encode($response);

	}
	
	if(trim($request->request_type)== "multi-city"){

		$page = isset($request->page) ? (int)$request->page : 1;
		$offset = ($page - 1) * $limit;
		$departureCount = 0;
		$cabinArray = [];

		// Iterate through the request properties
		foreach ($request as $key => $value) {
			// Check if the key contains the string "cabin" and if the value is not empty or null
			if (strpos($key, 'arrival') !== false && !empty($value)) {
				$departureCount++;
			}
			/*if (strpos($key, 'cabin') !== false && !empty($value)){
				$cabinArray[] = $value;
			}*/
		}
		
		//$cabin = sanitizeInput($request->cabin);
		$adults = sanitizeInput($request->adult);
		$children = sanitizeInput($request->child);
		$infant = sanitizeInput($request->infant);
		$cabin = sanitizeInput($request->cabin);
		$direct = in_array("direct",$count_stops) ? 'true' : 'false';
		$build_query = "";
		
		for($i=1; $i <= $departureCount; $i++){
			
			$departure = sanitizeInput($request->{"departure$i"});
			$arrival = sanitizeInput($request->{"arrival$i"});
			$departure_date = sanitizeInput($request->{"departure_date$i"});
			//$cab = sanitizeInput($request->{"cabin$i"});
			
			$build_query .= "from$i=$departure&to$i=$arrival&departureDate$i=$departure_date&";
		
		}
		
		$build_query .= "adults=$adults&infants=$infant&children=$children&directFlightsOnly=$direct&flightClass=$cabin";

		$search_url = $website_url.'air/search?'.''. $build_query .'';
		$resp = curlwithHeader($search_url,$api_key);

		if(!empty($resp) && is_array($resp)){

			$totalmatrix = count($resp['Matrix']['DirectAirlines'] ?? []) + count($resp['Matrix']['TwoStopsAirlines'] ?? []) + count($resp['Matrix']['OneStopAirlines'] ?? []);
			$mergematrix = array_merge($resp['Matrix']['DirectAirlines'] ?? [],$resp['Matrix']['TwoStopsAirlines'] ?? [],$resp['Matrix']['OneStopAirlines'] ?? []);
			$allmatrix = [];
			$nonstop = $resp['Matrix']['DirectAirlines'] ?? [];
			$twostop = $resp['Matrix']['TwoStopsAirlines'] ?? [];
			$onestop = $resp['Matrix']['OneStopAirlines'] ?? [];

			foreach($mergematrix as $value){
				$d = array("name" => $value['Airline'], "code" => $value['AirlineCode']);
				if (!in_array($d, $allmatrix)){
					$allmatrix[] = $d;
				}
			}
			
			$cheapest = $resp['PricedItineraries'][0]['AirItineraryPricingInfo']['TotalPrice'] ?? 0;

			$fastestFlight = null;
			$cheapestFlight = null;
			$bestCombinationFlight = null;

			$minDuration = PHP_INT_MAX;
			$minPrice = PHP_INT_MAX;
			$bestCombinationValue = PHP_INT_MAX;

			foreach($resp['PricedItineraries'] ?? [] as $k => $a){

				$a['originalIndex'] = $k;
				$allArtinery[] = $a;
				$completeArtinery[] = $a;
				foreach($a['AirItinerary']['OriginDestinationOptions'] as $c){
					foreach($c['FlightSegments'] as $key => $d){
						$airlineName = $d['MarketingAirlineName'];
						$airlineCode = $d['MarketingAirlineCode'];
						
						$price = $a['AirItineraryPricingInfo']['TotalPrice'];
						$totalduration = $c['JourneyTotalDuration']; 

						// Calculate the cheapest flight
						if ($price < $minPrice) {
							$minPrice = $price;
							$cheapestFlight = $a;
						}

						// Calculate the fastest flight
						if ($totalduration < $minDuration) {
							$minDuration = $totalduration;
							$fastestFlight = $a;
						}

						// Calculate the best combination of duration and price
						$combinationValue = $totalduration + $price; // or use a weighted combination if needed

						if ($combinationValue < $bestCombinationValue) {
							$bestCombinationValue = $combinationValue;
							$bestCombinationFlight = $a;
						}
						// Increment the total number of all market airlines
						$totalMarketAirlines++;

						// Initialize or increment the count for this airline
						if (!isset($airlineCounts[$airlineName])) {
							$airlineCounts[$airlineName] = 1; // Initialize count if not set
						} else {
							$airlineCounts[$airlineName]++; // Increment count if already set
						}
						
						$marketAirlineKey = $airlineName . '-' . $airlineCode;
						// Check if the airline is already in the uniqueStrings array
						$exists = false;
						foreach ($uniqueStrings as &$uniqueString) {
							if ($uniqueString['key'] === $marketAirlineKey){
								$uniqueString['count']++;
								$exists = true;
								break;
							}
						}

						// If the airline is not in the uniqueStrings array, add it
						if (!$exists) {
							$uniqueStrings[] = [
								"name" => $airlineName,
								"code" => $airlineCode,
								"count" => $airlineCounts[$airlineName], // Add the count to the array
								"key" => $marketAirlineKey, // Include the unique key for comparison
							];
						}
					}
				}

			}
			
			if(!empty($marketairline)){
				//$airline = $count_airlines;
				$allArtinery = array_filter($allArtinery, function($var) use ($marketairline) {  
					$evtime = $var['AirItinerary']['OriginDestinationOptions'][0]['FlightSegments'][0]['MarketingAirlineName'];
					return in_array($evtime,$marketairline);  
				});
			}
			
			if(!empty($outbound_departure)){
				$result = extractMinMaxDateTime($outbound_departure);
				$startDate = $result['min'];
				$endDate = $result['max'];
				$allArtinery = array_filter($allArtinery, function($var) use ($startDate, $endDate){  
				$evtime = $var['AirItinerary']['OriginDestinationOptions'][0]["FlightSegments"][0]['DepartureDate'];
					//print_r($evtime);
					return ($evtime >= $startDate  && $evtime <= $endDate); 
				});
			}
			
			if(!empty($outbound_arrival)){
				$result = extractMinMaxDateTime($outbound_arrival);
				$startDate = $result['min'];
				$endDate = $result['max'];
				$allArtinery = array_filter($allArtinery, function($var) use ($startDate, $endDate){  
					$evtime = $var['AirItinerary']['OriginDestinationOptions'][0]["FlightSegments"][0]['ArrivalDate'];
					return $evtime <= $endDate && $evtime >= $startDate;  
				});
			}
			
			if(!empty($count_stops)){
				$stops = end($count_stops);	
				if($stops=='direct'){
					$allArtinery = array_filter($allArtinery, function($var) use ($stops){
						return count($var['AirItinerary']['OriginDestinationOptions'][0]["FlightSegments"]) == 1 ;
						//return $count == 1; 
					});
				}
				
				if($stops=='onestop'){
					$allArtinery = array_filter($allArtinery, function($var) use ($stops){
						return count($var['AirItinerary']['OriginDestinationOptions'][0]["FlightSegments"]) == 2 ;
						//return $count == 1; 
					});
				}
				
				if($stops=='twostop'){
					$allArtinery = array_filter($allArtinery, function($var) use ($stops){
						return count($var['AirItinerary']['OriginDestinationOptions'][0]["FlightSegments"]) >= 2;
					});
				}
			}
			
			if($select_filter != ""){
				
				if($select_filter=='shortest first'){
					array_multisort(array_map(static function($element){
						return $element['AirItinerary']['OriginDestinationOptions'][0]["JourneyTotalDuration"];
					},$allArtinery),SORT_ASC,$allArtinery);
				}
				if($select_filter=='cheapest first'){
					array_multisort(array_map(static function ($element){
						return $element['AirItineraryPricingInfo']['TotalPrice'];
					},$allArtinery),SORT_ASC,$allArtinery);
				}
				if($select_filter=='departure earliest'){
					array_multisort(array_map(static function ($element){
						return $element['AirItinerary']['OriginDestinationOptions'][0]["FlightSegments"][0]['DepartureDate'];
					},$allArtinery),SORT_ASC,$allArtinery);
				}
				if($select_filter=='departure latest'){
					array_multisort(array_map(static function ($element){
						return $element['AirItinerary']['OriginDestinationOptions'][0]["FlightSegments"][0]['DepartureDate'];
					},$allArtinery),SORT_DESC,$allArtinery);
				}
				if($select_filter=='arrival latest'){
					array_multisort(array_map(static function ($element){
						return $element['AirItinerary']['OriginDestinationOptions'][0]["FlightSegments"][0]['ArrivalDate'];
					},$allArtinery),SORT_DESC,$allArtinery);
				}
				if($select_filter=='arrival earliest'){
					array_multisort(array_map(static function ($element){
						return $element['AirItinerary']['OriginDestinationOptions'][0]["FlightSegments"][0]['ArrivalDate'];
					},$allArtinery),SORT_ASC,$allArtinery);
				}
				
			}

			$total_records = count($allArtinery);
			$allArtinery = array_slice($allArtinery, $offset, $limit);
			$total_pages   = ceil($total_records / $limit);
			$response = ["status" => 0, 'cheapest' => $cheapest, 'nonstop' => $nonstop, 'twostop' => $twostop, 'onestop' => $onestop, 'all_matrix' => $allmatrix,  'allflights' => $completeArtinery, 'recommended' => $bestCombinationFlight, 'fastest_artinery' => $fastestFlight, 'cheapest_artinery' => $cheapestFlight, 'sessionId' => $resp['SessionId']?? [], 'outbound_departure' => $outbound_departure, 'page' => $page, 'airlines' => $uniqueStrings,  "total_pages" => $total_pages, "flights" => $allArtinery];
			
			
		}else{
			$response = ["status" => 1, 'page' => 0, 'airlines' => [], "total_pages" => 0, "flights" => []];
		}
		
		echo json_encode($response);
		
	}

	/*if(trim($request->request_type)=='one-way' || trim($request->request_type)== 'round-trip' || trim($request->request_type)== "multi-city"){

		$search_url = $website_url.'air/search?'.''. $build_query .'';
		$resp = curlwithHeader($search_url,$api_key);

		if(!empty($resp) && is_array($resp)){

			$totalmatrix = count($resp['Matrix']['DirectAirlines'] ?? []) + count($resp['Matrix']['TwoStopsAirlines'] ?? []) + count($resp['Matrix']['OneStopAirlines'] ?? []);
			$mergematrix = array_merge($resp['Matrix']['DirectAirlines'] ?? [],$resp['Matrix']['TwoStopsAirlines'] ?? [],$resp['Matrix']['OneStopAirlines'] ?? []);
			$allmatrix = [];
			$nonstop = $resp['Matrix']['DirectAirlines'] ?? [];
			$twostop = $resp['Matrix']['TwoStopsAirlines'] ?? [];
			$onestop = $resp['Matrix']['OneStopAirlines'] ?? [];

			foreach($mergematrix as $value){
				$d = array("name" => $value['Airline'], "code" => $value['AirlineCode']);
				if (!in_array($d, $allmatrix)){
					$allmatrix[] = $d;
				}
			}
			
			$cheapest = $resp['PricedItineraries'][0]['AirItineraryPricingInfo']['TotalPrice'] ?? 0;

			$fastestFlight = null;
			$cheapestFlight = null;
			$bestCombinationFlight = null;

			$minDuration = PHP_INT_MAX;
			$minPrice = PHP_INT_MAX;
			$bestCombinationValue = PHP_INT_MAX;

			foreach($resp['PricedItineraries'] ?? [] as $k => $a){

				$a['originalIndex'] = $k;
				$allArtinery[] = $a;
				$completeArtinery[] = $a;
				foreach($a['AirItinerary']['OriginDestinationOptions'] as $c){
					foreach($c['FlightSegments'] as $key => $d){
						$airlineName = $d['MarketingAirlineName'];
						$airlineCode = $d['MarketingAirlineCode'];
						
						$price = $a['AirItineraryPricingInfo']['TotalPrice'];
						$totalduration = $c['JourneyTotalDuration']; 

						// Calculate the cheapest flight
						if ($price < $minPrice) {
							$minPrice = $price;
							$cheapestFlight = $a;
						}

						// Calculate the fastest flight
						if ($totalduration < $minDuration) {
							$minDuration = $totalduration;
							$fastestFlight = $a;
						}

						// Calculate the best combination of duration and price
						$combinationValue = $totalduration + $price; // or use a weighted combination if needed

						if ($combinationValue < $bestCombinationValue) {
							$bestCombinationValue = $combinationValue;
							$bestCombinationFlight = $a;
						}
						// Increment the total number of all market airlines
						$totalMarketAirlines++;

						// Initialize or increment the count for this airline
						if (!isset($airlineCounts[$airlineName])) {
							$airlineCounts[$airlineName] = 1; // Initialize count if not set
						} else {
							$airlineCounts[$airlineName]++; // Increment count if already set
						}
						
						$marketAirlineKey = $airlineName . '-' . $airlineCode;
						// Check if the airline is already in the uniqueStrings array
						$exists = false;
						foreach ($uniqueStrings as &$uniqueString) {
							if ($uniqueString['key'] === $marketAirlineKey){
								$uniqueString['count']++;
								$exists = true;
								break;
							}
						}

						// If the airline is not in the uniqueStrings array, add it
						if (!$exists) {
							$uniqueStrings[] = [
								"name" => $airlineName,
								"code" => $airlineCode,
								"count" => $airlineCounts[$airlineName], // Add the count to the array
								"key" => $marketAirlineKey, // Include the unique key for comparison
							];
						}
					}
				}

			}
			
			if(!empty($marketairline)){
				//$airline = $count_airlines;
				$allArtinery = array_filter($allArtinery, function($var) use ($marketairline) {  
					$evtime = $var['AirItinerary']['OriginDestinationOptions'][0]['FlightSegments'][0]['MarketingAirlineName'];
					return in_array($evtime,$marketairline);  
				});
			}
			
			if(!empty($outbound_departure)){
				$result = extractMinMaxDateTime($outbound_departure);
				$startDate = $result['min'];
				$endDate = $result['max'];
				$allArtinery = array_filter($allArtinery, function($var) use ($startDate, $endDate){  
				$evtime = $var['AirItinerary']['OriginDestinationOptions'][0]["FlightSegments"][0]['DepartureDate'];
					//print_r($evtime);
					return ($evtime >= $startDate  && $evtime <= $endDate); 
				});
			}
			
			if(!empty($outbound_arrival)){
				$result = extractMinMaxDateTime($outbound_arrival);
				$startDate = $result['min'];
				$endDate = $result['max'];
				$allArtinery = array_filter($allArtinery, function($var) use ($startDate, $endDate){  
					$evtime = $var['AirItinerary']['OriginDestinationOptions'][0]["FlightSegments"][0]['ArrivalDate'];
					return $evtime <= $endDate && $evtime >= $startDate;  
				});
			}
			
			if(!empty($count_stops)){
				$stops = end($count_stops);	
				if($stops=='direct'){
					$allArtinery = array_filter($allArtinery, function($var) use ($stops){
						return count($var['AirItinerary']['OriginDestinationOptions'][0]["FlightSegments"]) == 1 ;
						//return $count == 1; 
					});
				}
				
				if($stops=='onestop'){
					$allArtinery = array_filter($allArtinery, function($var) use ($stops){
						return count($var['AirItinerary']['OriginDestinationOptions'][0]["FlightSegments"]) == 2 ;
						//return $count == 1; 
					});
				}
				
				if($stops=='twostop'){
					$allArtinery = array_filter($allArtinery, function($var) use ($stops){
						return count($var['AirItinerary']['OriginDestinationOptions'][0]["FlightSegments"]) >= 2;
					});
				}
			}
			
			if($select_filter != ""){
				
				if($select_filter=='shortest first'){
					array_multisort(array_map(static function($element){
						return $element['AirItinerary']['OriginDestinationOptions'][0]["JourneyTotalDuration"];
					},$allArtinery),SORT_ASC,$allArtinery);
				}
				if($select_filter=='cheapest first'){
					array_multisort(array_map(static function ($element){
						return $element['AirItineraryPricingInfo']['TotalPrice'];
					},$allArtinery),SORT_ASC,$allArtinery);
				}
				if($select_filter=='departure earliest'){
					array_multisort(array_map(static function ($element){
						return $element['AirItinerary']['OriginDestinationOptions'][0]["FlightSegments"][0]['DepartureDate'];
					},$allArtinery),SORT_ASC,$allArtinery);
				}
				if($select_filter=='departure latest'){
					array_multisort(array_map(static function ($element){
						return $element['AirItinerary']['OriginDestinationOptions'][0]["FlightSegments"][0]['DepartureDate'];
					},$allArtinery),SORT_DESC,$allArtinery);
				}
				if($select_filter=='arrival latest'){
					array_multisort(array_map(static function ($element){
						return $element['AirItinerary']['OriginDestinationOptions'][0]["FlightSegments"][0]['ArrivalDate'];
					},$allArtinery),SORT_DESC,$allArtinery);
				}
				if($select_filter=='arrival earliest'){
					array_multisort(array_map(static function ($element){
						return $element['AirItinerary']['OriginDestinationOptions'][0]["FlightSegments"][0]['ArrivalDate'];
					},$allArtinery),SORT_ASC,$allArtinery);
				}
				
			}

			$total_records = count($allArtinery);
			$allArtinery = array_slice($allArtinery, $offset, $limit);
			$total_pages   = ceil($total_records / $limit);
			$response = ["status" => 0, 'cheapest' => $cheapest, 'nonstop' => $nonstop, 'twostop' => $twostop, 'onestop' => $onestop, 'all_matrix' => $allmatrix,  'allflights' => $completeArtinery, 'recommended' => $bestCombinationFlight, 'fastest_artinery' => $fastestFlight, 'cheapest_artinery' => $cheapestFlight, 'sessionId' => $resp['SessionId']?? [], 'outbound_departure' => $outbound_departure, 'page' => $page, 'airlines' => $uniqueStrings,  "total_pages" => $total_pages, "flights" => $allArtinery];
			
			
		}else{
			$response = ["status" => 1, 'page' => 0, 'airlines' => [], "total_pages" => 0, "flights" => []];
		}
		
		echo json_encode($response);
	}*/

	

	
	if(trim($request->request_type)=='flight_detail'){
		
		$adults = sanitizeInput($request->adult);
		$children = sanitizeInput($request->children);
		$infant = sanitizeInput($request->infant);
		$sessionId = sanitizeInput($request->session);
		$flightId = sanitizeInput($request->flight_id);
		$postData = array(
			'SessionId' => $sessionId,
			'ItemId' => $flightId
		);
		$search_url = $website_url.'/cart/air/add';
		$resp = curlwithBody($search_url,$api_key,$postData);
		
		// SQL query to select data
		$sql = "SELECT * FROM account_numbers";
		$result = $conn->query($sql);

		// Initialize an empty array
		$bankArray = [];

		if ($result->num_rows > 0) {
			// Loop through the result set and store each row into the array
			while($row = $result->fetch_assoc()) {
				$bankArray[] = $row;
			}
		}
		
		if (is_array($resp) && array_key_exists("StatusCode", $resp)){
			$response = ["status" => 1, 'result' => $resp];
		}else{
			$response = ["status" => 0, 'bankaccount' => $bankArray,  'air' => $resp['ShoppingCart']['Air']['AirItinerary']['OriginDestinationOptions'] ?? [], 'allresponse' => $resp];
		}
		
		
		echo json_encode($response);
	}

	if(trim($request->request_type) == 'search_destination') {
		
		$search = sanitizeInput($request->term);
		$search_url = $website_url.'/hotel/references/destination/'.$search;
		
		$resp = curlwithHeader($search_url, $api_key);
		
		// Check if response is empty and return an empty JSON object if so
		if (empty($resp)) {
			echo json_encode([]);
		} else {
			echo json_encode($resp);
		}
	}


	if (trim($request->request_type) == 'hotel_search') {
		$apiPayload = [];
		$roomCount = isset($request->room) ? (int)$request->room : 0;
	
		for ($i = 0; $i < $roomCount; $i++) {

			if($i==0){

				if (isset($request->{"room{$i}_adults"})) {
					$apiPayload["adults"] = (int)$request->{"room{$i}_adults"};
				}
		
				if (isset($request->{"room{$i}_children"})) {
					$apiPayload["children"] = (int)$request->{"room{$i}_children"};
				}
		
				for ($j = 0; $j < ($request->{"room{$i}_children"} ?? 0); $j++) {
					if (isset($request->{"room{$i}_child{$j}_age"})) {
						$apiPayload["childrenAge"] = (int)$request->{"room{$i}_child{$j}_age"};
					}
				}

			}else{

				if (isset($request->{"room{$i}_adults"})) {
					$apiPayload["adults" . ($i + 1)] = (int)$request->{"room{$i}_adults"};
				}
		
				if (isset($request->{"room{$i}_children"})) {
					$apiPayload["children" . ($i + 1)] = (int)$request->{"room{$i}_children"};
				}
		
				for ($j = 0; $j < ($request->{"room{$i}_children"} ?? 0); $j++) {
					if (isset($request->{"room{$i}_child{$j}_age"})) {
						$apiPayload["childrenAge" . ($i + 1)] = (int)$request->{"room{$i}_child{$j}_age"};
					}
				}
			}
			
		}
	
		$apiPayload['checkInDate'] = $request->checkin_date ?? null;
		$apiPayload['checkOutDate'] = $request->checkout_date ?? null;
		$apiPayload['placeId'] = $request->destination ?? null;
		$apiPayload['roomCount'] = $roomCount;
		$apiPayload['page'] = 1;

		// Build the query string from $apiPayload
		$build_query = http_build_query($apiPayload);

		$search_url = $website_url.'hotel/search?'.''. $build_query .'';
		$resp = curlwithHeader($search_url,$api_key);
	
		//header('Content-Type: application/json');
		echo json_encode($resp);
	}

	if (trim($request->request_type) == 'hotel_detail') {

		$apiPayload = [];
		$sessionId = sanitizeInput($request->session);
		$hotelId = sanitizeInput($request->hotel_id);
		$apiPayload['SessionId'] = $sessionId;
		$apiPayload['hotelId'] = $hotelId;
		$build_query = http_build_query($apiPayload);
		$search_url = $website_url.'hotel/details?'.''. $build_query .'';
		$resp = curlwithHeader($search_url,$api_key);

		echo json_encode($resp);
	}

	


	
	
	if(trim($request->request_type)=='check_payment'){
	
		$curl = curl_init();
		$ref =  $request->reference;
		$date1 = date("Y-m-d H:i:s");
	  
		  curl_setopt_array($curl, array(
			CURLOPT_URL => "https://api.paystack.co/transaction/verify/".$ref,
			CURLOPT_RETURNTRANSFER => true,
			CURLOPT_SSL_VERIFYPEER => false,
			CURLOPT_ENCODING => "",
			CURLOPT_MAXREDIRS => 10,
			CURLOPT_TIMEOUT => 30,
			CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
			CURLOPT_CUSTOMREQUEST => "GET",
			CURLOPT_HTTPHEADER => array(
			  "Authorization: Bearer sk_test_bb839f91b6202459263846dbe294f48a05882a9d",
			  "Cache-Control: no-cache",
			),
		  ));
	  
		$response = curl_exec($curl);
		$err = curl_error($curl);

		curl_close($curl);
	  
		if($err){
			// there was an error contacting the Paystack API
		  die('Curl returned error: ' . $err);
		}

		$tranx = json_decode($response);

		if(!$tranx->status){
			['status' => 0, 'message' => "Transaction could not be completed" ];
		}

		if('success' == $tranx->data->status){
			$response = ['status' => 1 ];
		}
		echo json_encode($response);
	}

	if(trim($request->request_type)=='book_flight'){
		
		$detect_country = detectCountry($jsonData);
		$phonecode = $phoneCodes[$detect_country['country']];
		$sign = "+";
		$session_id = sanitizeInput($request->sessionid);
		$itenary_id = sanitizeInput($request->itenary_id);
		$adult_count = intval($request->countadult);
		$child_count = intval($request->countchild);
		$infant_count = intval($request->countinfant);
		$amount = sanitizeInput($request->amount);
		$payment_method = sanitizeInput($request->payment_method);
		$phone =  $sign.''.$phonecode.''.$request->adult_phone_0;
		$date = date("Y-m-d H:i:s");
		$status = "";
		$year = date('Y', strtotime(' + 3 years'));
		// Create an empty array to store the data
		$data = array();
		// Add NotesForAgent
		$data['NotesForAgent'] = '';
		// Create an array for Travellers
		$data['Travellers'] = array();
		// Add SessionId
		$data['SessionId'] = $session_id;
		$email = $request->adult_email_0;
		$flights = $request->{'flight'};
		$flightSegments = '';
		$paymentdetails = '';
		$total_count = $adult_count + $child_count + $infant_count;
		
		if(isset($request->{'adult_title_0'})){
			for ($i=0; $i < $adult_count; $i++){
					$adult = array(
						'Id' => $itenary_id,
						'IndexInSequence' => $i,
						'Title' => sanitizeInput($request->{"adult_title_$i"}),
						'TypeCode' => sanitizeInput($request->{"adult_typecode_$i"}),
						'FirstName' => sanitizeInput($request->{"adult_firstname_$i"}),
						'MiddleName' => null,
						'LastName' => sanitizeInput($request->{"adult_lastname_$i"}),
						'Email' => sanitizeInput($request->{"adult_email_$i"}),
						'CountryCode' => $detect_country['country'] ?? null,
						'Phone' => $request->{"adult_phone_$i"},
						'PhoneCode' => $phonecode ?? null,
						'SkypeID' => null,
						'LoyalityProgram' => null,
						'MealsNSeatReq' => null,
						'Gender' => $request->{"adult_gender_$i"},
						'DateOfBirthString' => sanitizeInput($request->{"adult_dob_$i"}),
						'PaymentInfoObject' => null,
						'BaggagePiecesQty' => $request->{"adult_baggageqty_$i"},
						'Gen' => null,
						'UserRole' => null,
						'EmployeeId' => 0
					);
					
					// Append the traveller to the "Travellers" array
					$data['Travellers'][] = $adult;
				}
			}
			
			
			if(isset($request->{'child_firstname_0'})){
				for ($i=0; $i < $child_count; $i++){
					// Create a new traveller object with the input data
					$child = array(
						'Id' => $itenary_id,
						'IndexInSequence' => $i,
						'Title' => null,
						'TypeCode' => $request->{"child_typecode_$i"},
						'FirstName' => sanitizeInput($request->{"child_firstname_$i"}),
						'MiddleName' => null,
						'LastName' => sanitizeInput($request->{"child_lastname_$i"}),
						'Email' => null,
						'CountryCode' => null,
						'Phone' => null,
						'PhoneCode' => null,
						'SkypeID' => null,
						'LoyalityProgram' => null,
						'MealsNSeatReq' => null,
						'Gender' => sanitizeInput($request->{"child_gender_$i"}),
						'DateOfBirthString' => sanitizeInput($request->{"child_dob_$i"}),
						'PaymentInfoObject' => null,
						'BaggagePiecesQty' => $request->{"child_baggageqty_$i"},
						'Gen' => null,
						'UserRole' => null,
						'EmployeeId' => 0
					);

					// Append the traveller to the "Travellers" array
					$data['Travellers'][] = $child;
				}
			}
		
		if(isset($request->{'infant_firstname_0'})){
			for ($i=0; $i < $infant_count; $i++){
				$infant = array(
					'Id' => $itenary_id,
					'IndexInSequence' => $i,
					'Title' => null,
					'TypeCode' => sanitizeInput($request->{"infant_typecode_$i"}),
					'FirstName' => sanitizeInput($request->{"infant_firstname_$i"}),
					'MiddleName' => null,
					'LastName' => sanitizeInput($request->{"infant_lastname_$i"}),
					'Email' => null,
					'CountryCode' => null,
					'Phone' => null,
					'PhoneCode' => null,
					'SkypeID' => null,
					'LoyalityProgram' => null,
					'MealsNSeatReq' => null,
					'Gender' => $request->{"infant_gender_$i"},
					'DateOfBirthString' => $request->{"infant_dob_$i"},
					'PaymentInfoObject' => null,
					'BaggagePiecesQty' => $request->{"infant_baggageqty_$i"},
					'Gen' => null,
					'UserRole' => null,
					'EmployeeId' => 0
				);
				
				$data['Travellers'][] = $infant;
			}
		}
		
		// Create an array for PaymentDetails
		$data['PaymentDetails'] = array(
			array(
				'TravelType' => 'AIR',
				//'CorporateCreditCard' => false,
				'PaymentOption' => 'Cash',
				/*'Address' => array(
					'CountryCode' => $detect_country['country'] ?? "NG",
					'CountryName' => $detect_country['country_name'] ?? "Nigeria",
					'RegionName' => $detect_country['region'] ?? "Africa",
					'ZIP' => '1000001',
					'CityName' => $detect_country['city'] ?? "Lagos",
					'StreetAddress' => 'A'
				),
				'CardInfo' => array(
					'CardholderName' => 'Name On Card',
					'CardType' => 'VI',
					'CardTypeCode' => 'VI',
					'CardNumber' => '4111111111111111',
					'ExpirationMonth' => '12',
					'ExpirationYear' => $year,
					'CVV' => '123',
					'BankName' => 'Bank name',
					'BankPhone' => $phone
				)*/
			)
		);
		
		$url = $website_url.'/cart/book';
		$resp = curlwithBody($url,$api_key,$data);
		$index = 'StatusCode'; // Index you want to check
		if (array_key_exists($index, $resp)){
			
			echo json_encode(array("status" => 0,"data" => $resp['ErrorMessage'].' '.$resp['ErrorId']));
			
		}else{

			safelog($resp,'api_response.log');
			
			if(isset($request->bank)){
				
				$bank = sanitizeInput($request->bank);
				
				$stmt = $conn->prepare("SELECT bank_name, account_number, account_name FROM account_numbers where bank_name = ?");
				$stmt->bind_param("s",$bank);
				$stmt->execute();
				$stmt->store_result();
				$stmt->bind_result($bank_name, $account_number, $account_name);
				$stmt->fetch();
					$bank_name; $account_number; $account_name;
				$stmt->close();
				
			}

			$pnr = $resp['ReferenceNumber'];
			$price_details = $resp['BookingDetails']['Flights'][0]['AirItineraryPricingInfo'];
			$TotalPrice = number_format($price_details['TotalPrice']);
			$BasePrice = number_format($price_details['BasePrice']);
			$Tax = number_format($price_details['Tax']);
			//echo "<pre>";
			//print_r($resp['BookingDetails']['Flights'][0]['AirItineraryPricingInfo']);
			//print_r($resp['BookingDetails']['Travellers'][0]['SelectedPrepaidBaggage']);

			/*$html = "<table style='width:100%;margin:0 auto;display:block'>
				<table style='max-width:1000px;display: table; border-collapse: separate; box-sizing: border-box; text-indent: initial; border-spacing: 2px; border-color: gray;' border='0' align='center' cellpadding='0' cellspacing='0'>
					<tbody style='border-collapse: separate; text-indent: initial; border-spacing: 2px;'>
						<tr>
							<td style='padding: 5px;'>
								<table style='width:100%;display: table; border-collapse: separate; box-sizing: border-box; text-indent: initial; border-spacing: 2px; border-color: gray;' cellpadding='0' cellspacing='0'>
									<tbody>
										<tr>
											<td style='padding: 5px;'>
												<img height='85' src='https://afotravels.com/assets/imgs/logo.png' />
											</td>
											<td style='text-align:right;padding:5px'>
												<h3 style='margin-top:5px;margin-bottom:5px'>Aforliyah Travel Limited: Suite 108, Aminu Kano Crescent, Wuse 2</h3>
												<h3 style='margin-top:5px;margin-bottom:5px'>Abuja, NG</h3>
												<h3 style='margin-top:5px;margin-bottom:5px'><a href='mailto:aforliyahtravels@gmail.com' target='_blank'>aforliyahtravels@gmail.com</a></h3>
											</td>
										</tr>
									</tbody>
								</table>
								<table style='width:100%;background-color:#054688;color:white;text-align:center'>
								<tbody>
								<tr>
									<td style='padding:10px; font-size: 20px; margin: 10px 0px 0px 0px;color: white; text-align: center;'>
										<table style='margin: 0px;width:100%;color:white;' class='m_-3631454989756343638no-margins-table'>
											<tbody>
												<tr>
													<td align='left' class='m_-3631454989756343638header-font' style='padding:0px;font-size: 20px;margin: 0;'>
														<b>Your trip</b>
													</td>
													<td align='right' width='40%' style='margin: 0;'>
														<table style='margin: 0;color:white;' class='m_-3631454989756343638no-margins-table'>
															<tbody>
															<tr>
																<td align='right' class='m_-3631454989756343638middle-name' style='padding:0px; font-size: 16px;'>
																	<b>Booking ref:</b>
																</td>
																<td class='m_-3631454989756343638middle-name' style='padding:0 0 0 10px; font-size: 16px;'>
																	$pnr
																</td>
															</tr>
														</tbody></table>
													</td>
												</tr>
											</tbody>
										</table>
									</td>
								</tr>
							</tbody>
						</table>
						
					<table>
						<tbody>
							<tr>
								<td style='padding:10px'></td>
							</tr>
						</tbody>
					</table>
					
					<table class='m_-3631454989756343638segment-table' style='width:100%;padding:10px;background-color:#f3f0f0'>
						<tbody>
							<tr>
								<td style='font-size:20px'>
									Passengers
								</td>
							</tr>
						</tbody>
					</table>";
					
					$html .= "<table style='width: 970px;margin: 10px 10px 0px 10px;border-collapse: collapse;font-size: 14px;'>
						<tbody>
							<tr style='border-bottom: 1px solid rgb(243,240,240);'>
								<td style='padding: 5px;' width='25%'>
									<b>Name</b>
								</td>
								<td style='padding: 5px;' width='25%'>
									<b>Type</b>
								</td>
								<td style='padding: 5px;' width='25%'>
									<b>Date Of Birth</b>
								</td>
								<td style='padding: 5px;' width='25%'>
									<b>Passport no</b>
								</td>
							</tr>";

						if(isset($request->{'adult_firstname_0'})){	
							for ($i=0; $i < $adult_count; $i++){
								$passenger_name = ucfirst($request->{"adult_title_$i"}).' '.$request->{"adult_lastname_$i"}.' '.$request->{"adult_firstname_$i"};
								$passenger_type = $request->{"adult_typecode_$i"};
								$passenger_dob = $request->{"adult_dob_$i"};
								$passport = $request->{"adult_passport_$i"};
								
								$html .= "<tr style='border-bottom: 1px solid rgb(243,240,240);'>
											<td style='padding: 5px;'>
												$passenger_name
											</td>
											<td style='padding: 5px;'>
												$passenger_type
											</td>
											<td style='padding: 5px;'>
												$passenger_dob
											</td>
											<td style='padding: 5px;'>
												$passport
											</td>
										</tr>";
							}
						}

						if(isset($request->{'child_firstname_0'})){	
							for ($i=0; $i < $child_count; $i++){
								$passenger_name = $request->{"child_lastname_$i"}.' '.$request->{"child_firstname_$i"};
								$passenger_type = $request->{"child_typecode_$i"};
								$passenger_dob = $request->{"child_dob_$i"};
								$passport = $request->{"child_passport_$i"};
								
								$html .= "<tr style='border-bottom: 1px solid rgb(243,240,240);'>
											<td style='padding: 5px;'>
												$passenger_name
											</td>
											<td style='padding: 5px;'>
												$passenger_type
											</td>
											<td style='padding: 5px;'>
												$passenger_dob
											</td>
											<td style='padding: 5px;'>
												$passport
											</td>
										</tr>";
								}
							}

							if(isset($request->{'infant_firstname_0'})){	
								for ($i=0; $i < $infant_count; $i++){
									$passenger_name = $request->{"infant_lastname_$i"}.' '.$request->{"infant_firstname_$i"};
									$passenger_type = $request->{"infant_typecode_$i"};
									$passenger_dob = $request->{"infant_dob_$i"};
									$passport = $request->{"infant_passport_$i"};
									
									$html .= "<tr style='border-bottom: 1px solid rgb(243,240,240);'>
												<td style='padding: 5px;'>
													$passenger_name
												</td>
												<td style='padding: 5px;'>
													$passenger_type
												</td>
												<td style='padding: 5px;'>
													$passenger_dob
												</td>
												<td style='padding: 5px;'>
													$passport
												</td>
											</tr>";
									}
							}

							$html .= "</tbody></table>
									<table style='width:100%'>
										<tbody>
											<tr>
												<td style='padding:10px'></td>
											</tr>
										</tbody>
									</table>";
									
								foreach($resp['BookingDetails']['Flights'] as $item){
									foreach($item['AirItinerary']['OriginDestinationOptions'] as $k => $value){
										
										foreach($value['FlightSegments'] as $key => $bounds){
										
										$image = "https://images.kiwi.com/airlines/64/".$bounds['MarketingAirlineCode'].''.'.png';
										$airline = $bounds['OperatingAirlineName'];
										$departure_date = date("l j M  Y", strtotime($bounds['DepartureDate']));
										$duration = minutesToHoursAndMinutes(timeStringToMinutes($bounds['Duration']));
										$cabin = $bounds['Cabin'];
										$equipment = $bounds['Aircraft'];
										$departure_time = date("j M  g:i a", strtotime($bounds['DepartureDate']));
										$arrival_time = date("j M  g:i a", strtotime($bounds['ArrivalDate']));
										$airport_from = $bounds['DepartureAirport'];
										$airport_to = $bounds['ArrivalAirport'];
										$airport_full_from = $bounds['DepartureAirportName'];
										$airport_full_to = $bounds['ArrivalAirportName'];
										$airport_full_name_from = $airport_from.', '.$airport_full_from;
										$airport_full_name_to = $airport_full_to.', '.$airport_full_to;
										$service = $bounds['RouteNumber'];
										$baggage = $bounds['FreeBaggages'][0]['FreeQuantity'].' x Checked Baggage';
										//$nam = array_key_exists($key, $Travellers) ? ucfirst($Travellers[$key]['Title']).' '.$Travellers[$key]['LastName'].' '.$Travellers[$key]['FirstName'] : ucfirst($Travellers[0]['Title']).' '.$Travellers[0]['LastName'].' '.$Travellers[0]['FirstName'];
										$arrivalTerminal = $bounds['ArrivalTerminal'];
										$departureTerminal = $bounds['DepartureTerminal'];
					
					$html .="<div style='page-break-inside:avoid'>
						<table style='padding:0px 10px 10px 10px;width:100%'>
							<tbody>
								<tr>
									<td style='font-size:20px;padding:0px'>
										$departure_date
									</td>
								</tr>
							</tbody>
						</table>
						<table style='background-color: rgb(243,240,240); padding: 10px 15px; width:100%' class='m_-3631454989756343638segment-table'>
							<tbody>
								<tr>
									<td style='padding: 5px;' align='left'>
											<img src='$image' width='40' class='CToWUd' data-bit='iit'>
									</td>
									<td style='padding: 5px;' valign='middle' colspan='2'>
										<p style='padding: 3px 0px; margin: 0px;' class='m_-3631454989756343638middle-name'>$airline</p>
									</td>
									<td style='padding: 5px;' align='right' style='padding-right:20px' valign='middle'></td>
								</tr>
								<tr style='font-size: 14px; margin: 10px 0px;' class='m_-3631454989756343638name'>
									<td style='padding: 5px;'>
										<b>Departure</b>
									</td>
									<td style='padding: 5px;'>
										$departure_time
									</td>
									<td style='padding: 5px;'>
										<b>$airport_from</b>, $airport_full_name_from
									</td>
									<td style='padding: 5px;'>
										<p style='padding: 3px 0px; margin: 0px;'>Terminal: $departureTerminal </p>
									</td>
								</tr>
								<tr style='font-size: 14px; margin: 10px 0px;' class='m_-3631454989756343638name'>
									<td style='padding: 5px;'>
										<b>Arrival</b>
									</td>
									<td style='padding: 5px;'>
										$arrival_time
									</td>
									<td style='padding: 5px;'>
										<b>$airport_to</b>, $airport_full_name_to
									</td>
									<td style='padding: 5px;'>
										<p style='padding: 3px 0px; margin: 0px;'>Terminal: $arrivalTerminal </p>
									</td>
								</tr>
								<tr style='font-size: 14px; margin: 10px 0px;' class='m_-3631454989756343638name'>
									<td style='padding: 5px;'>
										<b>Duration</b>
									</td>
									<td style='padding: 5px;' colspan='3'>
										$duration
									</td>
								</tr>
								<tr style='font-size: 14px; margin: 10px 0px;' class='m_-3631454989756343638name'>
									<td style='padding: 5px;'>
										<b>Class</b>
									</td>
									<td style='padding: 5px;' colspan='3'>
										$cabin
									</td>
								</tr>
								<tr style='font-size: 14px; margin: 10px 0px;' class='m_-3631454989756343638name'>
									<td style='padding: 5px;'>
										<b>Equipment</b>
									</td>
									<td style='padding: 5px;' colspan='3'>
										$equipment
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					
					<table>
						<tbody>
							<tr>
								<td style='padding:10px'></td>
							</tr>
						</tbody>
					</table>
					
					<div style='page-break-inside:avoid'>
						<table class='m_-3631454989756343638segment-table' style= 'padding:10px;background-color:#f3f0f0; width:100%'>
							<tbody>
								<tr>
									<td style='font-size:20px;padding: 5px;'>
										Services - $service
									</td>
								</tr>
							</tbody>
						</table>";
			

					foreach($resp['BookingDetails']['Travellers'] as $key => $person){

						$passport = "";
						$nam =ucfirst($person['Title']).' '.$person['LastName'].' '.$person['FirstName'];

						//$baggage = $bounds['FreeBaggages'][$key]['FreeQuantity'].' x Checked Baggage';

							$html .="<table style='width: 970px; margin: 10px 10px 0px 10px; font-size: 14px; margin: 10px 0px;' class='m_-3631454989756343638name m_-3631454989756343638services m_-3631454989756343638main-table'>
								<tbody>
									<tr>
										<td style='padding: 5px;' width='25%'><b>Name</b></td>
										<td style='padding: 5px;' width='30%'><b>Baggage</b></td>
										<td style='padding: 5px;' width='15%'><b>Seat</b></td>
										<td style='padding: 5px;' width='30%'><b>Other</b></td>
									</tr>
										<tr valign='center'>
											<td style='padding: 5px;'>$nam</td>
											<td style='padding: 5px;'>$baggage</td>
											<td style='padding: 5px;'>/</td>
											<td style='padding: 5px;'>/</td>
										</tr>
								</tbody>
							</table>
						</div>";
					}
				}
			}
		}

					$html.="<div style='page-break-inside:avoid'>
						<table class='m_-3631454989756343638segment-table' style= 'padding:10px;background-color:#f3f0f0; width:100%'>
							<tbody>
								<tr>
									<td style='font-size:20px;padding: 5px;'>
										Payment details
									</td>
								</tr>
							</tbody>
						</table>";

						if(isset($request->bank)){

							$html.= "<table style='width: 970px; margin: 10px 10px 0px 10px; font-size: 14px; margin: 10px 0px;' class='m_-3631454989756343638name m_-3631454989756343638services m_-3631454989756343638main-table'>
									<tbody>
										<tr>
											<td style='padding: 5px;' width='25%'><b>Type</b></td>
											<td style='padding: 5px;' width='30%'><b>Bank</b></td>
											<td style='padding: 5px;' width='15%'><b>Acct no</b></td>
											<td style='padding: 5px;' width='30%'><b>Acct name</b></td>
										</tr>
											<tr valign='center'>
												<td style='padding: 5px;'>Cash Transfer</td>
												<td style='padding: 5px;'>$bank_name</td>
												<td style='padding: 5px;'>$account_number</td>
												<td style='padding: 5px;'>$account_name</td>
											</tr>
									</tbody>
								</table>";

					}else{

						$html.= "<table style='width: 970px; margin: 10px 10px 0px 10px; font-size: 14px; margin: 10px 0px;' class='m_-3631454989756343638name m_-3631454989756343638services m_-3631454989756343638main-table'>
									<tbody>
										<tr>
											<td style='padding: 5px;' width='25%'><b>Type</b></td>
											<td style='padding: 5px;' width='30%'><b>Bank</b></td>
											<td style='padding: 5px;' width='15%'><b>Acct no</b></td>
											<td style='padding: 5px;' width='30%'><b>Acct name</b></td>
										</tr>
											<tr valign='center'>
												<td style='padding: 5px;'>Online payment (Paystack)</td>
												<td style='padding: 5px;'>/</td>
												<td style='padding: 5px;'>/</td>
												<td style='padding: 5px;'>/</td>
											</tr>
									</tbody>
								</table>";

					}

					$html.="</div>";
					
					$html .= "<div style='page-break-inside:avoid'>
						<table style='background-color:#054688;font-size:16px;color:white;text-align:center;width:100%'>
							<tbody>
								<tr style='padding:15px 10px 0px 10px'>
									<td align='left' width='15%' style='padding-top:15px;padding-left:10px'>Base price</td>
									<td align='left' width='15%' style='padding-top:15px'>Taxes</td>
									<td align='left' width='15%' style='padding-top:15px'>Service Fee</td>
									<td align='right' style='padding-top:15px;padding-right:10px'>Total Price</td>
								</tr>
								<tr>
									<td colspan='4'>
										<table>
											<tbody>
												<tr>
													<td height='1' style='border-top:1px solid white;margin:0px 5px;padding:0px'></td>
												</tr>
											</tbody>
										</table>
									</td>
								</tr>
								<tr style='padding:0px 10px 15px 10px'>
									<td align='left' style='padding-bottom:15px;padding-left:10px'>&#8358; $BasePrice</td>
									<td align='left' style='padding-bottom:15px'>&#8358; $Tax</td>
									<td align='left' style='padding-bottom:15px'>&#8358; 0.00</td>
									<td align='right' style='padding-bottom:15px;padding-right:10px'>&#8358; $TotalPrice</td>
								</tr>
							</tbody>
						</table>
					</div>
					
					<table>
						<tbody>
							<tr>
								<td style='padding:10px'></td>
							</tr>
						</tbody>
					</table>
					
				</td>
				</tr>
				</tbody>
				</table>
				</table>";*/


			$email_template = file_get_contents('../email_template.html');

			foreach ($flights as $data) {
				// Accessing 'FlightSegments' as an object
				$countFlightSegment = count($data->FlightSegments) - 1;
				
				// Accessing properties within FlightSegments
				$ArrivalAirportcode = $data->FlightSegments[$countFlightSegment]->ArrivalAirport;
				$ArrivalAirportname = $data->FlightSegments[$countFlightSegment]->ArrivalAirportName;
				$ArrivalDate = date("D, F j", strtotime($data->FlightSegments[$countFlightSegment]->ArrivalDate)) . ' ' . date("g:i", strtotime($data->FlightSegments[$countFlightSegment]->ArrivalDate)) . ' ' . date("a", strtotime($data->FlightSegments[$countFlightSegment]->ArrivalDate));
				
				$DepartureAirportcode = $data->FlightSegments[0]->DepartureAirport;
				$DepartureAirportname = $data->FlightSegments[0]->DepartureAirportName;
				$DepartureDate = date("D, F j", strtotime($data->FlightSegments[0]->DepartureDate)) . ' ' . date("g:i", strtotime($data->FlightSegments[0]->DepartureDate)) . ' ' . date("a", strtotime($data->FlightSegments[0]->DepartureDate));
				
				// Construct the flight segment table rows
				$flightSegments .= '<tr><td><strong>Departure Date</strong></td><td>' . $DepartureDate . '</td></tr>';
				$flightSegments .= '<tr><td><strong>Departure</strong></td><td>' . $DepartureAirportname . ' (' . $DepartureAirportcode . ')</td></tr>';
				$flightSegments .= '<tr><td><strong>Arrival Date</strong></td><td>' . $ArrivalDate . '</td></tr>';
				$flightSegments .= '<tr><td><strong>Arrival</strong></td><td>' . $ArrivalAirportname . ' (' . $ArrivalAirportcode . ')</td></tr>';
			}

			$FirstName = $request->{"adult_firstname_0"};
			$LastName = $request->{"adult_lastname_0"};
			
			$email_template = str_replace('[PNR]', $resp['ReferenceNumber'], $email_template);
			$email_template = str_replace('[FlightInfo]', $flightSegments, $email_template);
			$email_template = str_replace('[CustomerName]', $FirstName.' '.$LastName, $email_template);
			
			if(isset($request->bank)){
				$paymentdetails='<div class="payment-details">';
                $paymentdetails.= '<h3>Payment Information</h3>';
                $paymentdetails .='<p>Please complete your payment using the details below to finalize your booking:</p>';
                $paymentdetails.='<table>';
                    $paymentdetails.='<tr>';
                        $paymentdetails.='<td><strong>Bank Name</strong></td>';
                        $paymentdetails.='<td>'. $bank_name .'</td>';
                    $paymentdetails.='</tr>';
                    $paymentdetails.='<tr>';
                        $paymentdetails.='<td><strong>Account Name</strong></td>';
                        $paymentdetails.='<td>'. $account_name .'</td>';
                    $paymentdetails.='</tr>';
                    $paymentdetails.='<tr>';
                        $paymentdetails.='<td><strong>Account Number</strong></td>';
                         $paymentdetails.='<td>'. $account_number .'</td>';
                    $paymentdetails.='</tr>';
                $paymentdetails.='</table>';
                $paymentdetails.='<p><strong>Note:</strong> Kindly make the payment within <strong>24 hours</strong> to avoid cancellation.</p>';
				$paymentdetails.='</div>';
				$email_template = str_replace('[Payment Details]', $paymentdetails, $email_template);
			}
			
			$email_template = str_replace('[Your Website URL]', 'https://afotravels.com', $email_template);
			$email_template = str_replace('[Your Company Name]', 'Aforliyah Travels Limited', $email_template);
			
			$result = sendmail($email,$FirstName.''.$LastName,$email_template,'Flight Booking Confirmation - PNR:'.$resp['ReferenceNumber']);
			//Insert Adult Information
			if(isset($request->{'adult_title_0'})){
				for ($i=0; $i < $adult_count; $i++){
					$passport = $request->{"adult_passport_$i"};
					$id = Insertbooking($conn,$email,$request->{"adult_firstname_$i"},$request->{"adult_lastname_$i"},$resp['ReferenceNumber'],$amount,$passport,$phone,$date,"");
				}
			}
			
			//Insert Infant Information if exists
			if(isset($request->{'infant_firstname_0'})){
				for ($i=0; $i < $infant_count; $i++){
					$passport = $request->{"infant_passport_$i"};
					Insertbooking($conn,$email,$request->{"infant_firstname_$i"},$request->{"infant_lastname_$i"},$resp['ReferenceNumber'],$amount,$phone,$passport,$date,"");
				}
			}
			
			//Insert Child Information if exists
			if(isset($request->{'child_firstname_0'})){
				for ($i=0; $i < $child_count; $i++){
					$passport = $request->{"child_passport_$i"};
					Insertbooking($conn,$email,$request->{"child_firstname_$i"},$request->{"child_lastname_$i"},$resp['ReferenceNumber'],$amount,$passport,$phone,$date,"");
				}
			}
			
			echo json_encode(array("status" => 1, 'json' => $resp, 'id' => $id ));
			
		}
	}
	
	if(trim($request->request_type)=='fetch_flight'){
		
		$id = intval($request->id);
		
		$stmt = $conn->prepare("SELECT reference_no FROM flight_booking WHERE id = ?");
		$stmt->bind_param("i", $id);
		$stmt->execute();
		$stmt->store_result();
		$stmt->bind_result($reference_no);
		$stmt->fetch();
			$reference_no;
		$stmt->close();
		
		if($stmt){
			echo json_encode(array("status" => 1, 'pnr' => $reference_no ));
		}
		
	}
	
	
}




