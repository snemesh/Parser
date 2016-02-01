<?php
	require_once 'simple_html_dom.php'; //Imclede library with the parsing
	require_once 'ParsButTeh.php';
?>

<!DOCTYPE HTML>
<html>
	<head>
		<meta charset='utf-8'>
		<title>My first button</title>
		<link type='text/css' rel='stylesheet' href='css2.css'>
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">
		<meta http-equiv='content-type' content='text/html; charset=utf-8' /> 
		<script type='text/javascript' src='jquery-2.1.4.min.js'></script>
	</head>
	<body class = 'catalogOfCatalog'>
		<div id='wraper'>
			<div class=".col-md-1 new_table">
			
				<?php

				$urlOfpage = "$_GET[paramLinc]?p=0";
				$numberPages=searchLastPage($urlOfpage); //162
				$summOfPages=ceil($numberPages/24); //6,75

				for ($i=0; $i<=$summOfPages; $i++) {
					$urlOfpage = "$_GET[paramLinc]?p=$i";
					AddItemsToArray ($urlOfpage);
					
					foreach ($array as $key=>$value){
					echo "<p>";
					echo($value['nameOfProd']);
					echo "</p>";
					
					//haracterTovara($value['link'], $value['nameOfProd']);
					haracterTovara("src1.html", $value['nameOfProd']);
					
					}
					//sleep (rand(1, 5));
				}
				?>

			</div>
		</div>
	</body>
</html>