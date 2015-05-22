<?php
	include 'connectToDb.php';
	if (!isset($_SERVER["REQUEST_METHOD"]) || $_SERVER["REQUEST_METHOD"] != "GET") {
		header("HTTP/1.1 400 Invalid Request");
		die("ERROR 400: Invalid request - This service accepts only GET requests.");
	} else if (!(isset($_GET["champId1"]) && isset($_GET["champId2"]) && isset($_GET["lane"]) && isset($_GET["swap"]))) {
		header("HTTP/1.1 400 Invalid Request");
		die("ERROR 400: Invalid request - request requires params 'champ1', 'champ2', 'lane', 'swap'");
	}

	$champ1 = $_GET["champId1"];
	$champ2 = $_GET["champId2"];
	$lane = $_GET["lane"];
	$swap = $_GET["swap"] == "true";

	$returnArray = [];
	if ($lane == "BOT") {
		if (!isset($_GET["isADC"])) {
			die("ERROR 400: Invalid request - request requires params 'isADC'");
		}
//		$returnArray[]=$_GET["isADC"];
		$isADC = $_GET["isADC"] == "true";
//		$returnArray[]=$isADC;

		$avgScoreQuery = "SELECT getAvgBotSoloCounterScore('$champ1', '$champ2', '".($isADC ? 1 : 0)."', '" . ($swap ? 0 : 1) . "')";
	}else {
		$avgScoreQuery = "SELECT getAvgSoloCounterScore('$champ1', '$champ2', '$lane', '" . ($swap ? 0 : 1) . "')";
	}
//	$returnArray[] = $avgScoreQuery;
	$avgScore = mysqli_query($con, $avgScoreQuery);
	if (!$avgScore) {
		$returnArray[] = mysqli_error($con);
	}
	$returnArray[] = mysqli_fetch_array($avgScore)[0];

	reconnect();

	$query = "CALL getBestItemsFromMatchups('" . ($swap ? $champ2 : $champ1) . "', '" . ($swap ? $champ1 : $champ2) . "', '$lane')";
//	$returnArray[] = $query;
	$result = mysqli_query($con, $query);
	if (!$result) {
		$returnArray[] = mysqli_error($con);
	}
	$items = [];
	while ($row = mysqli_fetch_array($result)) {
		reconnect();
		$rowArray = [];
		$itemQuery = "CALL getItem('".$row[0]."')";
		$item = mysqli_fetch_array(mysqli_query($con, $itemQuery));
		$rowArray[] = [htmlspecialchars_decode($item[0], ENT_QUOTES), htmlspecialchars_decode($item[1], ENT_QUOTES), $item[2]];
		for ($k = 1; $k < 3; $k++) {
			$rowArray[] = $row[$k];
		}
		$items[] = $rowArray;
	}
	$returnArray[] = $items;
	echo json_encode($returnArray);
//	echo $returnArray;
?>