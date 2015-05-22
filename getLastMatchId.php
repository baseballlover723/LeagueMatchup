<?php
	include 'connectToDb.php';
	if (!isset($_SERVER["REQUEST_METHOD"]) || $_SERVER["REQUEST_METHOD"] != "GET") {
		header("HTTP/1.1 400 Invalid Request");
		die("ERROR 400: Invalid request - This service accepts only GET requests.");
	}
	$query = "SELECT Min(Match_ID) FROM double_matchup";
	$result = mysqli_query($con, $query);
	echo mysqli_fetch_array($result)[0];

?>