<?php
	$champFileUrl = "SQL/championQueries.sql";
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
	} else if (!(isset($_POST["id"]) && isset($_POST["name"]) && isset($_POST["title"]) && isset($_POST["primaryRole"]) && isset($_POST["secondaryRole"]) && isset($_POST["imageURL"]))) {
		header("HTTP/1.1 400 Invalid Request");
		die("ERROR 400: Invalid request - request requires params 'id', 'name', 'title', 'primaryRole', 'secondaryRole', 'imageURL'");
	} else {
		$champFile = fopen($champFileUrl, "a") or die("ERROR 503: Server could not open the file"); // a for append, w for write

		$id = $_POST["id"];
		$name = htmlspecialchars($_POST["name"], ENT_QUOTES);
		$title = htmlspecialchars($_POST["title"], ENT_QUOTES);
		$primaryRole = htmlspecialchars($_POST["primaryRole"], ENT_QUOTES);
		$secondaryRole = htmlspecialchars($_POST["secondaryRole"], ENT_QUOTES);
		$imageURL = htmlspecialchars($_POST["imageURL"], ENT_QUOTES);
		//	echo "name = $name, id = $id, title = $title, primary role = $primaryRole, secondary role = $secondaryRole, imageURL = $imageURL <br/>";
		// id name title role1 role2
		$query = "CALL insertChampion('$id', '$name', '$title', '$imageURL', '$primaryRole', '$secondaryRole');";
//		echo $query;
		fwrite($champFile, "$query\n");
		fclose($champFile);
	}

	function deleteFile() {
		global $champFileUrl;
//		echo "DELETED $champFileUrl";
		unlink($champFileUrl);
	}

	// champ1, cs1, kills1, assits1
?>