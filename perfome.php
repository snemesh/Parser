<?php
	require_once 'snlib.php';			//Inclede myLibrary
	$myarray=array();
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
				$numberPages=searchLastPage($urlOfpage); 	
				$summOfPages=ceil($numberPages/24); 		

				$moveNameOfCat = "$_GET[nameOfCatalog]";
				//echo $moveNameOfCat."<br>";
				

				for ($i=0; $i<=$summOfPages; $i++) {
				//for ($i=0; $i<1; $i++) {
					$urlOfpage = "$_GET[paramLinc]?p=$i";
					
					$myarray=AddItemsToArray($urlOfpage);
					foreach ($myarray as $key=>$value){
						
						//echo "<p>";
						//echo($value['nameOfProd']); //выводим название товара
						//echo "</p>";
						GetGoods($value['link'], $value['nameOfProd'],$moveNameOfCat);
						//sleep (rand(3, 7));
					
					}
					
				}
				
				?>

			</div>
		</div>
	</body>
</html>