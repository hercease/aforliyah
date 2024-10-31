<?php
	
   include("functions.php");
   include("connection.php");
	
	date_default_timezone_set("Africa/lagos");

	$date1=date("Y-m-d H:i:s");
	
	$newdate = date('Y-m-d H:i:s',strtotime('+4 hours 45 minutes',strtotime($date1)));
	
	$fetchtoken = fetchtoken($conn,"thomalex",'');
	
	$thomalex_token = $fetchtoken['token'] ?? null;
	$thomalex_date = $fetchtoken['date'] ?? null;
	
	$count_rows = mysqli_num_rows(mysqli_query($conn,"SELECT token,date FROM thomalex"));

    $url = $website_url.''.'public/token?clientname=s58XU19VLap';
	
	if($thomalex_token == '' || strtotime($date1) >= strtotime($thomalex_date)){
			
		$api = generateApi($url);
		//print_r($api);
		
		if($count_rows==0){
			$stmt = $conn->prepare("INSERT IGNORE INTO thomalex (token, date) VALUES (?, ?)");
			$stmt->bind_param("ss",$api->Token,$newdate);
			$stmt->execute();
			$stmt->close();
		}else{
			$stmt = $conn->prepare("UPDATE thomalex SET token = ?, date = ?");
			$stmt->bind_param("ss", $api->Token,$newdate);
			$stmt->execute();
			$stmt->close();
		}
		
	}

?>