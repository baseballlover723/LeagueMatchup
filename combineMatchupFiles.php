<?php
	if (!isset($_SERVER["REQUEST_METHOD"]) || $_SERVER["REQUEST_METHOD"] != "GET") {
		header("HTTP/1.1 400 Invalid Request");
		die("ERROR 400: Invalid request - This service accepts only POST requests.");
	}

	$files = glob("SQL/tempSQL/matchups*.sql");
	$matchupFilePath = "SQL/matchups.sql";
	$combinedFile = fopen($matchupFilePath, "w");

	foreach ($files as $filePath) {
		echo "filepath = $filePath\n";
		$file = fopen($filePath, "r");
		while ($line = fgets($file)) {
			if (substr($line, 0, 4)) {
				fwrite($combinedFile, $line);
			}
		}
		fclose($file);
	}
	fclose($combinedFile);

?>