<?php
	$server = 'localhost';
	$user = 'root';
	$password = '';
	$db = 'leaguematchups';
	$con = mysqli_connect($server, $user, $password) or die(mysqli_error());
	mysqli_select_db($con, $db) or die(mysqli_error());

	function reconnect() {
		global $con;
		global $server;
		global $user;
		global $password;
		global $db;
		mysqli_close($con);
		$con = mysqli_connect($server, $user, $password) or die(mysqli_error());
		mysqli_select_db($con, $db) or die(mysqli_error());
	}

	function closeDb() {
		global $con;
		mysqli_close($con);
	}

?>