<?php
	$itemFileUrl = "SQL/itemQueries.sql";
	# A PHP script to return book data.  Author: Marty Stepp, Nov 30 2008

	# main program
	if (!isset($_SERVER["REQUEST_METHOD"]) || $_SERVER["REQUEST_METHOD"] != "POST") {
		header("HTTP/1.1 400 Invalid Request");
		die("ERROR 400: Invalid request - This service accepts only POST requests.");
	}
	if (isset($_POST["method"])) {
		if ($_POST["method"] == "resetFile") {
			deleteFile();
		}
	} else if (!(isset($_POST["id"]) && isset($_POST["name"]) && isset($_POST["description"]) && isset($_POST["imageURL"]))) {
		header("HTTP/1.1 400 Invalid Request");
		die("ERROR 400: Invalid request - request requires params 'id', 'name', 'description', 'imageURL'");
	} else {
		$itemFile = fopen($itemFileUrl, "a") or die("ERROR 503: Server could not open the file"); // a for append, w for write

		$id = $_POST["id"];
		$name = htmlspecialchars($_POST["name"], ENT_QUOTES);
		$description = htmlspecialchars($_POST["description"], ENT_QUOTES);
		$imageURL = htmlspecialchars($_POST["imageURL"], ENT_QUOTES);
		//	echo "name = $name, id = $id, title = $title, primary role = $primaryRole, secondary role = $secondaryRole <br/>";
		// id name title role1 role2
		$query = "CALL insertItem('$id', '$name', '$description', '$imageURL');";
		fwrite($itemFile, "$query\n");

		//insertChildren @Parent_ID int, @Child_1_ID int, @Child_2_ID int = NULL, @Child_3_ID int = NULL
//		echo $query;
		$from0 = isset($_POST["from0"]) ? "'".$_POST["from0"]."'" : "NULL";
		$from1 = isset($_POST["from1"]) ? "'".$_POST["from1"]."'" : "NULL";
		$from2 = isset($_POST["from2"]) ? "'".$_POST["from2"]."'" : "NULL";
		$from3 = isset($_POST["from3"]) ? "'".$_POST["from3"]."'" : "NULL";
//		if (isset($_POST["from0"])) {
//			echo "0 = " . $_POST["from0"] . "\n";
//			$fromQuery = "CALL insertChildren('$id', '" . $_POST["from0"] . "'";
//			if (isset($_POST["from1"])) {
//				echo "1 = " . $_POST["from1"] . "\n";
//				$fromQuery .= ", '". $_POST["from1"] ."'";
//				if (isset($_POST["from2"])) {
//					echo "2 = " . $_POST["from2"] . "\n";
//					$fromQuery .= ", '". $_POST["from2"] ."'";
//					if (isset($_POST["from3"])) {
//						echo "3 = " . $_POST["from3"] . "\n";
//						$fromQuery .= ", '". $_POST["from3"] ."'";
//					}
//				}
//			}
//			$fromQuery .= ");";
		if (isset($_POST["from0"])) {
			$fromQuery = "CALL insertChildren('$id', $from0, $from1, $from2, $from3);";
			fwrite($itemFile, "$fromQuery\n");
		}
//		}
		fclose($itemFile);
	}

	function deleteFile() {
		global $matchupFileUrl;
		echo "DELETED $matchupFileUrl";
		unlink($matchupFileUrl);
	}

?>