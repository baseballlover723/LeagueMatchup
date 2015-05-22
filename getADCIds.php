<?php
	include 'connectToDb.php';
	if (!isset($_SERVER["REQUEST_METHOD"]) || $_SERVER["REQUEST_METHOD"] != "GET") {
		header("HTTP/1.1 400 Invalid Request");
		die("ERROR 400: Invalid request - This service accepts only GET requests.");
	}
	$query = "SELECT Champ_ID FROM champions WHERE Role_1 = 'Marksman'";
	$result = mysqli_query($con, $query);
	$returnArray = [];
	while ($row = mysqli_fetch_array($result)) {
		$returnArray[] = $row["Champ_ID"];
//		echo $row["Champ_ID"];
	}
	echo json_encode($returnArray);

?>