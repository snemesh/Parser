<?php
header('Content-Type: text/html; charset=utf-8');
require_once 'simple_html_dom.php'; //Imclede library with the parsing
require_once 'snlib.php'; //Imclede library with the parsing



$url = "src.html";
$html = new simple_html_dom(); //make new object
$html = file_get_html($url); //loading the data by url
$param1='.c-box .block';
$cat=array();
$toURL = 'http://hotline.ua';

$html1=$html->find($param1);

foreach ($html1 as $level1)
{
	$level1->children(0)->children(0)->innertext = '';
	$lvl1=$level1->children(0)->plaintext;
	$nameofcat=strval($lvl1);
	$nameofcat=mb_convert_encoding($nameofcat, 'utf-8','Windows-1251');	
    
	foreach ($level1->children(1)->children() as $key=>$val)
	{
		$nameofcat1=$val->find('span');
		$nameofcat1=strval($nameofcat1[0]->plaintext);
		$nameofcat1=trim($nameofcat1);
		$nameofcat1=mb_convert_encoding($nameofcat1, 'utf-8','Windows-1251');
		
		foreach($val->children(1)->children() as $key1=>$val2)
		{
			$link = $val2 -> find('a');
			$toLink=$link[0]->href;
			if (stristr($toLink, 'http://hotline.ua') != FALSE) {
				$linkOfLink = $toLink;
			} else {
				$linkOfLink = $toURL.$toLink;
			}
			$nameofcat2=strval($val2->plaintext);
			$nameofcat2=mb_convert_encoding($nameofcat2, 'utf-8','Windows-1251');
			$linkOfLink=mb_convert_encoding($linkOfLink, 'utf-8','Windows-1251');
			//$cat[$nameofcat][$nameofcat1]=array($nameofcat2, $linkOfLink);
			$nameofcat2=ereg_replace("&nbsp;","",$nameofcat2);
			$nameofcat2=ereg_replace("NEW","",$nameofcat2);
			$sbct[]=array("nameOfCat"=>$nameofcat2,"linkOfCat"=>$linkOfLink);
			
		}
		$cat[$nameofcat][$nameofcat1]=$sbct;
		$sbct=array();
	}
}


/*
$json = json_encode($cat);
file_put_contents('catalog.json', $json);
*/
//print_r($cat);

$html->clear(); // подчищаем за собой
unset($html);


?>



<!DOCTYPE HTML>
<html>
	<head>
		<meta charset='utf-8'>
		<title>My first button</title>
		<link type='text/css' rel='stylesheet' href='css2.css'>
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">
		<meta http-equiv='content-type' content='text/html; charset=WINDOWS-1251' /> 
		<script type='text/javascript' src='jquery-2.1.4.min.js'></script>
	</head>
	<body>
		<div id='select-block'>
<!-- _________________________________________________________________________________________________________ -->


				<form role="form" class="form row" action="" method='GET' name="myform">
					<div class="col-md-1"></div>
					<div class="text-center col-md-4">
						<select class='form-control' name='select1' id='select1'>
							<option>Open catalog</option>
							<?php foreach ($cat as $key1 => $value1) {
					        	echo "<option>$key1</option>"; 
					        	if ($_GET[select1] == $key1) {
						        	echo '<option selected>'.$_GET[select1].'</option>';
					        	} } ?>
	  					</select>
						<input type="submit" value="Go!"  class="btn btn-success btn-block">
						<?php $first = $_GET[select1];	?>
					</div>
					<div class="col-md-2">
						
					</div>
<!-- _________________________________________________________________________________________________________ -->

				   <div class="text-center col-md-4">
					    <select class="form-control" name="select2">
					        <option selected="selected">Open catalog</option>
					        
	
					        <?php foreach ($cat[$first] as $key2 => $value2){
					        	echo "<option>$key2</option>"; 
					        	if ($_GET[select2] == $key2) {
						        	echo '<option selected>'.$_GET[select2].'</option>';
					        	} }?>
						</select>
						<input type="submit" value="Send"  class="btn btn-success btn-block">
						<?php $param2 = ($_GET[select2]); ?>
				   </div>
				   <div class="col-md-1"></div>

				</form>
				<br>
<!-- _________________________________________________________________________________________________________ -->
	
					<?php 
						if (!empty($param2)&&!empty($first)&&isset($cat[$first][$param2])):
					?>
					<table class="table table-striped table-bordered"> 
				    <?php
						foreach ($cat[$first][$param2] as $key3=>$LinkToCatalog)
						{
							echo "<tr>";
							echo "<td> ".$LinkToCatalog['nameOfCat']."</td> ";	?>
							<td><a href="perfome.php?paramLinc=<?php echo $LinkToCatalog['linkOfCat']?>&&nameOfCatalog=<?php echo $LinkToCatalog['nameOfCat']?>">BUTTON</a></td></tr>
							<?php
						} 
					?>
					</table> 				    
					<?php endif;?>	
					
						<?php echo $param5 = ($_GET[paramLinc]); ?>						
						
		</div>
	</body>
</html>