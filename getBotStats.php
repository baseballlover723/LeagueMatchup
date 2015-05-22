<?php
	include 'connectToDb.php';
	if (!isset($_SERVER["REQUEST_METHOD"]) || $_SERVER["REQUEST_METHOD"] != "GET") {
		header("HTTP/1.1 400 Invalid Request");
		die("ERROR 400: Invalid request - This service accepts only GET requests.");
	} else if (!(isset($_GET["champIdM1"]) && isset($_GET["champIdS1"]) && isset($_GET["champIdM2"]) && isset($_GET["champIdS2"]))) {
		header("HTTP/1.1 400 Invalid Request");
		die("ERROR 400: Invalid request - request requires params 'champM1', 'champS1', 'champM2', 'champS2'");
	}

	$champM1 = $_GET["champIdM1"];
	$champS1 = $_GET["champIdS1"];
	$champM2 = $_GET["champIdM2"];
	$champS2 = $_GET["champIdS2"];

	$query = "CALL getAvgBotStats('$champM1', '$champS1', '$champM2', '$champS2')";
	$result = mysqli_query($con, $query);
//		$returnArray = [];
//	$returnArray[] = $query;
//	$returnArray[] = mysqli_fetch_array($result);
	//	$row = mysqli_fetch_array($result)[0];
	//		for ($k = 0; $k < count($row); $k++) {
	//			$returnArray[] = $row[$k];
	//		}
//		echo json_encode($returnArray);
	echo json_encode(mysqli_fetch_array($result));
?>
