<?php
	$server = 'localhost';
	$user = 'root';
	$password = '';
	$db = 'cloth';
	$con = mysqli_connect($server, $user, $password) or die(mysqli_error());
	mysqli_select_db($con, $db) or die(mysqli_error());

	$baseUrl = "https://global.api.pvp.net/api/lol/";
	$apiKey = "api_key=f5c821d7-fc96-47f3-914d-7026a8525eee";


	echo '<div id="header">
    <nav>
        <li class="fork"><a href="index.php">Go Back to Index</a></li>
        <li class="fork"><a href="https://github.com/baseballlover723/LeagueMatchups">View On GitHub</a></li>
        <li class="downloads"><a href="https://github.com/baseballlover723/LeagueMatchups/zipball/master">ZIP</a></li>
        <li class="downloads"><a href="https://github.com/baseballlover723/LeagueMatchups/tarball/master">TAR</a></li>
        <li class="title">DOWNLOADS</li>
    </nav>
</div>
<!-- end header -->';

?>