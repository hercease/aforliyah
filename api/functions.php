<?php
	$website_url = "https://rest.resvoyage.com/api/v1/";
		
	use PHPMailer\PHPMailer\PHPMailer; 
	use PHPMailer\PHPMailer\Exception;
	use PHPMailer\PHPMailer\SMTP;
	require 'PHPMailer/src/Exception.php';
	require 'PHPMailer/src/PHPMailer.php';
	require 'PHPMailer/src/SMTP.php';
	function sendmail($email,$name,$body,$subject){

	$mail = new PHPMailer(true);

	try {
		
//$mail->SMTPDebug = SMTP::DEBUG_SERVER; 
		$mail->isSMTP();                           
		$mail->Host       = 'server315.web-hosting.com';      
		$mail->SMTPAuth   = true;
		$mail->SMTPKeepAlive = true; //SMTP connection will not close after each email sent, reduces SMTP overhead	
		$mail->Username   = 'no-reply@afotravels.com';    
		$mail->Password   = 'M@kings124';             
		$mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;   
		$mail->Port       = 465;               

		//Recipients
		$mail->setFrom('no-reply@afotravels.com', 'Aforliyah Travels Limited');
		$mail->addAddress("$email", "$name"); 
		
		$mail->isHTML(true); 
		$mail->Subject = $subject;
		$mail->Body    = $body;

		$mail->send();
		$mail->clearAddresses();
		return '1';
		
	} catch (Exception $e){
		return "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
	}
	}
	
	function sanitizeInput($data) {
		$data = trim($data); // Remove unnecessary spaces
		$data = stripslashes($data); // Remove backslashes
		$data = htmlspecialchars($data); // Convert special characters to HTML entities
		return $data;
	}
	
	function generateApi($url){
		$api = curlwithoutHeader($url);
		return $api;
	}
	
	function updatetoken($conn,$tablename,$token, $key, $date){
		$stmt = $conn->prepare("UPDATE $tablename SET token = ?, key_key = ?, date = ?");
		$stmt->bind_param("sss", $token,$key,$date);
		$stmt->execute();
		$stmt->close();
	}

	function inserttoken($conn, $tablename, $token, $key, $date){
		$stmt = $conn->prepare("INSERT IGNORE INTO $tablename(token, key_key, date) VALUES (?, ?, ?)");
		$stmt->bind_param("sss",$token, $key, $date);
		$stmt->execute();
		$stmt->close();
	}
	
	function curlwithoutHeader($url){
		$curl = curl_init();
		curl_setopt($curl, CURLOPT_URL, $url);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
		$output = curl_exec($curl);
		curl_error($curl);
		curl_close($curl);
		$response = json_decode($output, false);
		return $response;
	}
	
	function extractMinMaxDateTime($dateRanges){
		$dates = [];

		foreach ($dateRanges as $range) {
			// Split each range into start and end dates
			list($start, $end) = explode(' - ', $range);

			// Add the dates to the dates array
			$dates[] = new DateTime($start);
			$dates[] = new DateTime($end);
		}

		// Find the minimum and maximum dates
		$minDate = min($dates);
		$maxDate = max($dates);

		// Return the dates in a formatted string
		return [
			'min' => $minDate->format('Y-m-d\TH:i:s'),
			'max' => $maxDate->format('Y-m-d\TH:i:s')
		];
	}

	
	function fetchtoken($conn,$tablename,$where){
		$sql = "SELECT * FROM $tablename $where";
		$result = mysqli_query($conn, $sql);
		$row = mysqli_fetch_assoc($result);
		return $row;
	}
	
	function curlwithHeader($u,$token){
		$curl = curl_init($u);
		curl_setopt_array($curl, array(
			CURLOPT_URL => $u,// your preferred link
			CURLOPT_RETURNTRANSFER => true,
			CURLOPT_SSL_VERIFYPEER => false,
			CURLOPT_ENCODING => "",
			CURLOPT_TIMEOUT => 30000,
			CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
			CURLOPT_CUSTOMREQUEST => "GET",
			CURLOPT_HTTPHEADER => array(
				'Content-Type: application/json',
				'Authorization: Bearer '.$token
			),

		));
			$response = curl_exec($curl);
			$err = curl_error($curl);
			curl_close($curl);
			return json_decode($response,true);
	}
	
	function curlwithBody($u,$token,$postData){
	
		$ch = curl_init($u);
		curl_setopt_array($ch, array(
			CURLOPT_POST => TRUE,
			CURLOPT_RETURNTRANSFER => TRUE,
			CURLOPT_SSL_VERIFYPEER => false,
			CURLOPT_HTTPHEADER => array(
				'Content-Type: application/json',
				'Authorization: Bearer '.$token
			),
			CURLOPT_POSTFIELDS => json_encode($postData)
		));

		//Send the request
		$response = curl_exec($ch);
		return json_decode($response, TRUE);
		// Close the cURL handler
		curl_close($ch);
	}
	
	function detectCountry($currencyArray){
	
		$access_token = '6da4089cb5b54e';
		$userIP = $_SERVER['REMOTE_ADDR'];
		if($userIP=="::1"){
			$resp = curlwithHeader("https://ipinfo.io?token=6da4089cb5b54e",$access_token);
		}else{
			$resp = curlwithHeader("https://ipinfo.io/$userIP?token=6da4089cb5b54e",$access_token);
		}
		
		$r = $resp['country'] ?? 'NG';
		$city = $resp['city'] ?? 'Lagos';
		$region = $resp['region'] ?? 'Africa/Lagos';
		$code = "";
		$country_name = "";
		
		foreach($currencyArray['country'] as $value){
			if ($value['countryCode'] == $r){
				$code = $value['currencyCode'];
				$country_name = $value['countryName'];
			}
		}
		
		return [
			'country' => $r,
			'currencyCode' => $code,
			'city' => $resp['city'] ?? "",
			'country_name' => $country_name,
			'region' => $resp['region'] ?? "",
		];
	}
	
	function Insertbooking($conn,$email,$firstname,$lastname,$reference,$amount,$passport,$phone,$date,$status){
		$stmt4 = $conn->prepare("INSERT INTO flight_booking (email,firstname,lastname,phone,reference_no,amount,passport_no,date,status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
		$stmt4->bind_param("sssssssss",$email,$firstname,$lastname,$phone,$reference,$amount,$passport,$date,$status);
		$stmt4->execute();
		$stmt4->close();
		
		  // Retrieve the ID of the inserted record
		$inserted_id = $conn->insert_id;

		// Return the inserted ID
		return $inserted_id;
	}

	function safelog($data,$dir){
		// Specify the log file path
		$logFile = $dir;
	
		// Add a timestamp to the log entry
		$timestamp = date("Y-m-d H:i:s");
	
		// Convert the JSON string into a human-readable format
		$jsonResponseFormatted = json_encode(($data), JSON_PRETTY_PRINT);
	
		// Create the log entry with a timestamp
		$logEntry = "[$timestamp] API Response:\n" . $jsonResponseFormatted . "\n\n";
	
		// Write the log entry to the file
		file_put_contents($logFile, $logEntry, FILE_APPEND);
	}

	function timeStringToMinutes($timeString) {
		// Split the time string into hours, minutes, and seconds
		list($hours, $minutes, $seconds) = explode(':', $timeString);
		
		// Convert hours and minutes to total minutes
		return ($hours * 60) + $minutes;
	}
	
	function minutesToHoursAndMinutes($minutes){
		if (!is_numeric($minutes)) {
			return "Invalid input";
		}
	
		$hours = floor($minutes / 60);
		$remainingMinutes = $minutes % 60;
	
		if ($hours == 0) {
			return "{$remainingMinutes} minute" . ($remainingMinutes != 1 ? 's' : '');
		}
	
		$hourStr = ($hours == 1) ? 'hour' : 'hours';
		$minuteStr = ($remainingMinutes == 1) ? 'minute' : 'minutes';
	
		return "{$hours} {$hourStr} {$remainingMinutes} {$minuteStr}";
	}

	
?>