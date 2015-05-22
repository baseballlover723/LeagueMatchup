<?php
	include 'connectToDb.php';
	$matchupFileUrl = "SQL/tempSQL/matchups";

	# main program
	if (!isset($_SERVER["REQUEST_METHOD"]) || $_SERVER["REQUEST_METHOD"] != "POST") {
		header("HTTP/1.1 400 Invalid Request");
		die("ERROR 400: Invalid request - This service accepts only POST requests.");
	}

	$hasArgs = isset($_POST["matchId"]) && isset($_POST["rank"])
		&& isset($_POST["champM1"]) && isset($_POST["killsM1"]) && isset($_POST["deathsM1"]) && isset($_POST["assistsM1"])
		&& isset($_POST["laneKillsM1"]) && isset($_POST["laneDeathsM1"]) && isset($_POST["laneAssistsM1"]) && isset($_POST["towerKillsM1"])
		&& isset($_POST["csM1"]) && isset($_POST["goldM1"]) && isset($_POST["champS1"]) && isset($_POST["killsS1"])
		&& isset($_POST["deathsS1"]) && isset($_POST["assistsS1"]) && isset($_POST["laneKillsS1"]) && isset($_POST["laneDeathsS1"])
		&& isset($_POST["laneAssistsS1"]) && isset($_POST["towerKillsS1"]) && isset($_POST["csS1"]) && isset($_POST["goldS1"])
		&& isset($_POST["champM2"]) && isset($_POST["killsM2"]) && isset($_POST["deathsM2"]) && isset($_POST["assistsM2"])
		&& isset($_POST["laneKillsM2"]) && isset($_POST["laneDeathsM2"]) && isset($_POST["laneAssistsM2"]) && isset($_POST["towerKillsM2"])
		&& isset($_POST["csM2"]) && isset($_POST["goldM2"]) && isset($_POST["champS2"]) && isset($_POST["killsS2"])
		&& isset($_POST["deathsS2"]) && isset($_POST["assistsS2"]) && isset($_POST["laneKillsS2"]) && isset($_POST["laneDeathsS2"])
		&& isset($_POST["laneAssistsS2"]) && isset($_POST["towerKillsS2"]) && isset($_POST["csS2"]) && isset($_POST["goldS2"]) && isset($_POST["fileNo"]);
	if (isset($_POST["method"])) {
		if ($_POST["method"] == "resetFile") {
			deleteFile();
		}
	} else if (!$hasArgs) {
		header("HTTP/1.1 400 Invalid Request");
		die("ERROR 400: Invalid request - request requires params 'id', 'name', 'description', 'imageURL'");
	} else {
		$itemFile = fopen($matchupFileUrl . $_POST["fileNo"] .".sql", "a") or die("ERROR 503: Server could not open the file"); // a for append, w for write

		$matchId = htmlspecialchars($_POST["matchId"], ENT_QUOTES);
		$rank = htmlspecialchars($_POST["rank"], ENT_QUOTES);

		$champM1 = htmlspecialchars($_POST["champM1"], ENT_QUOTES);
		$killsM1 = htmlspecialchars($_POST["killsM1"], ENT_QUOTES);
		$assistsM1 = htmlspecialchars($_POST["assistsM1"], ENT_QUOTES);
		$deathsM1 = htmlspecialchars($_POST["deathsM1"], ENT_QUOTES);
		$laneKillsM1 = htmlspecialchars($_POST["laneKillsM1"], ENT_QUOTES);
		$laneAssistsM1 = htmlspecialchars($_POST["laneAssistsM1"], ENT_QUOTES);
		$laneDeathsM1 = htmlspecialchars($_POST["laneDeathsM1"], ENT_QUOTES);
		$towerKillsM1 = htmlspecialchars($_POST["towerKillsM1"], ENT_QUOTES);
		$csM1 = htmlspecialchars($_POST["csM1"], ENT_QUOTES);
		$goldM1 = htmlspecialchars($_POST["goldM1"], ENT_QUOTES);

		$champS1 = htmlspecialchars($_POST["champS1"], ENT_QUOTES);
		$killsS1 = htmlspecialchars($_POST["killsS1"], ENT_QUOTES);
		$assistsS1 = htmlspecialchars($_POST["assistsS1"], ENT_QUOTES);
		$deathsS1 = htmlspecialchars($_POST["deathsS1"], ENT_QUOTES);
		$laneKillsS1 = htmlspecialchars($_POST["laneKillsS1"], ENT_QUOTES);
		$laneAssistsS1 = htmlspecialchars($_POST["laneAssistsS1"], ENT_QUOTES);
		$laneDeathsS1 = htmlspecialchars($_POST["laneDeathsS1"], ENT_QUOTES);
		$towerKillsS1 = htmlspecialchars($_POST["towerKillsS1"], ENT_QUOTES);
		$csS1 = htmlspecialchars($_POST["csS1"], ENT_QUOTES);
		$goldS1 = htmlspecialchars($_POST["goldS1"], ENT_QUOTES);

		$champM2 = htmlspecialchars($_POST["champM2"], ENT_QUOTES);
		$killsM2 = htmlspecialchars($_POST["killsM2"], ENT_QUOTES);
		$assistsM2 = htmlspecialchars($_POST["assistsM2"], ENT_QUOTES);
		$deathsM2 = htmlspecialchars($_POST["deathsM2"], ENT_QUOTES);
		$laneKillsM2 = htmlspecialchars($_POST["laneKillsM2"], ENT_QUOTES);
		$laneAssistsM2 = htmlspecialchars($_POST["laneAssistsM2"], ENT_QUOTES);
		$laneDeathsM2 = htmlspecialchars($_POST["laneDeathsM2"], ENT_QUOTES);
		$towerKillsM2 = htmlspecialchars($_POST["towerKillsM2"], ENT_QUOTES);
		$csM2 = htmlspecialchars($_POST["csM2"], ENT_QUOTES);
		$goldM2 = htmlspecialchars($_POST["goldM2"], ENT_QUOTES);

		$champS2 = htmlspecialchars($_POST["champS2"], ENT_QUOTES);
		$killsS2 = htmlspecialchars($_POST["killsS2"], ENT_QUOTES);
		$assistsS2 = htmlspecialchars($_POST["assistsS2"], ENT_QUOTES);
		$deathsS2 = htmlspecialchars($_POST["deathsS2"], ENT_QUOTES);
		$laneKillsS2 = htmlspecialchars($_POST["laneKillsS2"], ENT_QUOTES);
		$laneAssistsS2 = htmlspecialchars($_POST["laneAssistsS2"], ENT_QUOTES);
		$laneDeathsS2 = htmlspecialchars($_POST["laneDeathsS2"], ENT_QUOTES);
		$towerKillsS2 = htmlspecialchars($_POST["towerKillsS2"], ENT_QUOTES);
		$csS2 = htmlspecialchars($_POST["csS2"], ENT_QUOTES);
		$goldS2 = htmlspecialchars($_POST["goldS2"], ENT_QUOTES);

		$itemM10 = $_POST["itemM10"];
		$itemM11 = $_POST["itemM11"];
		$itemM12 = $_POST["itemM12"];
		$itemM13 = $_POST["itemM13"];
		$itemM14 = $_POST["itemM14"];
		$itemM15 = $_POST["itemM15"];

		$itemS10 = $_POST["itemS10"];
		$itemS11 = $_POST["itemS11"];
		$itemS12 = $_POST["itemS12"];
		$itemS13 = $_POST["itemS13"];
		$itemS14 = $_POST["itemS14"];
		$itemS15 = $_POST["itemS15"];


		$itemM20 = $_POST["itemM20"];
		$itemM21 = $_POST["itemM21"];
		$itemM22 = $_POST["itemM22"];
		$itemM23 = $_POST["itemM23"];
		$itemM24 = $_POST["itemM24"];
		$itemM25 = $_POST["itemM25"];

		$itemS20 = $_POST["itemS20"];
		$itemS21 = $_POST["itemS21"];
		$itemS22 = $_POST["itemS22"];
		$itemS23 = $_POST["itemS23"];
		$itemS24 = $_POST["itemS24"];
		$itemS25 = $_POST["itemS25"];

		//	echo "name = $name, id = $id, title = $title, primary role = $primaryRole, secondary role = $secondaryRole <br/>";
		// id name title role1 role2

		$query = "CALL insertDouble('$matchId', '$rank', '$champM1', '$killsM1', '$assistsM1', '$deathsM1', '$laneKillsM1', "
			. "'$laneAssistsM1', '$laneDeathsM1', '$towerKillsM1', '$csM1', '$goldM1', '$champS1', '$killsS1', '$assistsS1', '$deathsS1', "
			. "'$laneKillsS1', '$laneAssistsS1', '$laneDeathsS1', '$towerKillsS1', '$csS1', '$goldS1', '$champM2', '$killsM2', '$assistsM2', '$deathsM2', "
			. "'$laneKillsM2', " . "'$laneAssistsM2', '$laneDeathsM2', '$towerKillsM2', '$csM2', '$goldM2', '$champS2', '$killsS2', '$assistsS2', "
			. "'$deathsS2', " . "'$laneKillsS2', '$laneAssistsS2', '$laneDeathsS2', '$towerKillsS2', '$csS2', '$goldS2');";
//		echo $query;		
		fwrite($itemFile, "$query\n");
		$result0 = $result = mysqli_query($con, $query);
		if (!$result) {
			echo mysqli_error($con);
			echo "ERROR with query: $query";
			exit();
		}
		reconnect();

		$itemQueryM1 = "CALL insertItemSet('$champM1', '$champM2', 'BOT', '$killsM1', '$deathsM1', '$assistsM1', '$laneKillsM1', "
			. "'$laneDeathsM1', '$laneAssistsM1', '$towerKillsM1', '$csM1', '$goldM1', $itemM10, $itemM11, $itemM12, $itemM13, $itemM14, $itemM15);";
//		$itemQueryM1 = "CALL insertItemUsage_Match('$champM1', '$matchId', $itemM10, $itemM11, $itemM12, $itemM13, $itemM14, $itemM15);";
		fwrite($itemFile,"$itemQueryM1\n");
		$result1 = $result = mysqli_query($con, $itemQueryM1);
		if (!$result) {
			echo mysqli_error($con);
			echo "ERROR with query: $itemQueryM1";
		}
		reconnect();

		$itemQueryS1 = "CALL insertItemSet('$champS1', '$champS2', 'BOT', '$killsS1', '$deathsS1', '$assistsS1', '$laneKillsS1', "
			. "'$laneDeathsS1', '$laneAssistsS1', '$towerKillsS1', '$csS1', '$goldS1', $itemS10, $itemS11, $itemS12, $itemS13, $itemS14, $itemS15);";
//		$itemQueryS1 = "CALL insertItemUsage_Match('$champS1', '$matchId', $itemS10, $itemS11, $itemS12, $itemS13, $itemS14, $itemS15);";
		fwrite($itemFile,"$itemQueryS1\n");
		$result2 = $result = mysqli_query($con, $itemQueryS1);
		if (!$result) {
			echo mysqli_error($con);
			echo "ERROR with query: $itemQueryS1";
		}
		reconnect();

		$itemQueryM2 = "CALL insertItemSet('$champM2', '$champM1', 'BOT', '$killsM2', '$deathsM2', '$assistsM2', '$laneKillsM2', "
			. "'$laneDeathsM2', '$laneAssistsM2', '$towerKillsM2', '$csM2', '$goldM2', $itemM20, $itemM21, $itemM22, $itemM23, $itemM24, $itemM25);";
//		$itemQueryM2 = "CALL insertItemUsage_Match('$champM2', '$matchId', $itemM20, $itemM21, $itemM22, $itemM23, $itemM24, $itemM25);";
		fwrite($itemFile,"$itemQueryM2\n");
		$result3 = $result = mysqli_query($con, $itemQueryM2);
		if (!$result) {
			echo mysqli_error($con);
			echo "ERROR with query: $itemQueryM2";
		}
		reconnect();

		$itemQueryS2 = "CALL insertItemSet('$champS2', '$champS1', 'BOT', '$killsS2', '$deathsS2', '$assistsS2', '$laneKillsS2', "
			. "'$laneDeathsS2', '$laneAssistsS2', '$towerKillsS2', '$csS2', '$goldS2', $itemS20, $itemS21, $itemS22, $itemS23, $itemS24, $itemS25);";
//		$itemQueryS2 = "CALL insertItemUsage_Match('$champS2', '$matchId', $itemS20, $itemS21, $itemS22, $itemS23, $itemS24, $itemS25);";
		fwrite($itemFile,"$itemQueryS2\n");
		$result4 = $result = mysqli_query($con, $itemQueryS2);
		if (!$result) {
			echo mysqli_error($con);
			echo "ERROR with query: $itemQueryS2";
		}
		reconnect();
		
		if ($result0 && $result1 && $result2 && $result3 && $result4) {
//			echo "All sucessful adding BOT matchup";
		}

		fclose($itemFile);
	}

	function deleteFile() {
		global $matchupFileUrl;
		echo "DELETED $matchupFileUrl";
		unlink($matchupFileUrl);
	}

?>