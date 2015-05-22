<?php
	include 'connectToDb.php';
	if (!isset($_SERVER["REQUEST_METHOD"]) || $_SERVER["REQUEST_METHOD"] != "GET") {
		header("HTTP/1.1 400 Invalid Request");
		die("ERROR 400: Invalid request - This service accepts only GET requests.");
	} else if (!(isset($_GET["champId1"]) && isset($_GET["champId2"]) && isset($_GET["lane"]))) {
		header("HTTP/1.1 400 Invalid Request");
		die("ERROR 400: Invalid request - request requires params 'champ1', 'champ2', 'lane'");
	}

	$champ1 = $_GET["champId1"];
	$champ2 = $_GET["champId2"];
	$lane = $_GET["lane"];

	$query = "CALL getAvgSoloStats('$champ1', '$champ2', '$lane')";
	$result = mysqli_query($con, $query);
	if (!$result) {
		echo mysqli_error($con);
	}
//	$returnArray = [];
//	$row = mysqli_fetch_array($result)[0];
//		for ($k = 0; $k < count($row); $k++) {
//			$returnArray[] = $row[$k];
//		}
//	echo json_encode($returnArray);
	echo json_encode(mysqli_fetch_array($result));
?>