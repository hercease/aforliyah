<?php
// Create connection
$conn = mysqli_connect("127.0.0.1", "phpmyadmin_user", "humble", "aforliyah", "3306");

// Check connection
if (!$conn) {
	die("Connection failed: " . mysqli_connect_error());
}

                                         
?>