<?php
require_once 'simple_html_dom.php'; //Imclede library with the parsing

function AddItemsToArray ($url) {
	$array=array();
	$html = new simple_html_dom(); 	//make new object
	$html = file_get_html($url); 	//loading the data by url
	foreach ($html -> find('#catalogue > ul.catalog > li > .info') as $name)
	{	
		if ($name->children(0) != $name->find('.action', 0))
		{
			$lvl1=$name->children(0);	
			$catArray=strval($lvl1->plaintext);
		} else {
			$lvl1=$name->children(1);
			$catArray=strval($lvl1->plaintext);
		}
		$link = $name -> find('a');
		$toLink=$link[0]->href;
		$startURL = 'http://hotline.ua';
		$linkOfLink = $startURL.$toLink;
		$linkOfLink=mb_convert_encoding($linkOfLink, 'Windows-1251', 'utf-8');
		$array[] = array('nameOfProd'=>trim($catArray), 'link'=>$linkOfLink);
	
	}	
	$html->clear(); // подчищаем за собой
	unset($html);	
	return $array;
	
}

function searchLastPage ($url) {
	
	$html = new simple_html_dom(); //make new object
	$html = file_get_html($url); //loading the data by url
	
	foreach ($html -> find('h2.selected_filters_tit') as $name)
	{	
		$name1= split (":", $name);
		$countOfPages = (int)$name1[1];
	}
	$html->clear(); // подчищаем за собой
	unset($html);
	return $countOfPages;
}


function touchBootStrap()
{
	//Latest compiled and minified CSS -->
	echo "<link rel='stylesheet' href='//netdna.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css'>";

	//Optional theme -->
	echo "<link rel='stylesheet' href='//netdna.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap-theme.min.css'>";

	//Latest compiled and minified JavaScript -->
	echo "<script src='//netdna.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js'></script>";
}

function printCatalog($array)
{
	foreach($array as $keyOfCat1=>$valueOfCat1)
	{
		
    	echo "<h3>$keyOfCat1</h3>";
		echo "<ul>";
		foreach ($valueOfCat1 as $keyOfCat2 => $valueOfCat2)
		{
        	echo "<li>$keyOfCat2</li>";
			echo "<ul>";
			foreach ($valueOfCat2 as $keyOfCat3=>$valueOfCat3)
			{
				//echo "<li>".$valueOfCat3["nameOfCat"]." (".$valueOfCat3["linkOfCat"].")</li>";
				echo "<li>".$valueOfCat3["nameOfCat"]."</li>";
				
				//echo $valueOfCat3[1];	
			}
			echo "</ul>";	
    	}
		echo "</ul>";
	}
}

function printCatalogTable($array)
{
	$i=0;
	echo "<div class='panel panel-default'>";
	echo "<div class='panel-heading'>Верхнеуровневый список категорий</div>";
	echo "<table class='table'>";
	echo "<thead><tr>";
		//echo "<th>"."Верхнеуровневый список категорий"."</th>";
		//echo "<th>"."test2"."</th>";
		//echo "<th>"."test3"."</th>";
	echo "</tr></thead>";
	echo "<tbody>";
		foreach($array as $keyOfCat1=>$valOfCat1)
		{	
			echo "<tr>";
			echo "<td>".$i."</td>";
			echo "<td>".$keyOfCat1."</td>";
			//echo "<td>".$valOfCat1."</td>";
			echo "</tr>";
			$i++;
    	}
	echo "</tbody>";
    echo("</table>");
    echo("</div>");
}

function GetGoods($url, $nameProduct,$moveNameOfCat) {
	//echo($url."<br>");
	$html = new simple_html_dom(); //make new object
	$html = file_get_html($url); //loading the data by url
	$characteristicsOfProduct = array();
	$toURL = 'http://hotline.ua';
	$link = $html -> find('.g-img-box .block-img-gall a.link-on-gallery');
	$toLink=$link[0]->href;
	if ($toLink == $toURL.$toLink){
		$linkOfLink = $toLink;
	} else {
		$linkOfLink = $toURL.$toLink;
	}
	$option = $html -> find(".description p.full-desc");
	$description = $option[0]->plaintext;
	$description = trim(mb_convert_encoding($description, 'utf-8', 'Windows-1251')); 



	$characteristicsOfProduct += array("Link to image"=>$linkOfLink);
	$characteristicsOfProduct += array("Description"=>trim($description));
		
	foreach ($html -> find('#full-props-list tbody tr') as $name)
	{	
		$lvl1=$name->children(0)->children(0)->plaintext;
		$catArray=strval($lvl1);	
		$catArray=mb_convert_encoding($catArray, 'utf-8', 'Windows-1251'); 

		foreach ($name->find('td') as $key=>$options)
		{	
			$name1=strval($options->plaintext);
			$name1 = mb_convert_encoding($name1, 'utf-8', 'Windows-1251'); 
			$characteristicsOfProduct += array(trim($catArray)=>$name1);
		}	
	}

	echo "<table border='1px'>";
	foreach ($characteristicsOfProduct as $key => $value1)
	{	
		echo "<tr>";
		//echo "<table border='1px' width='100%'>"."<tr>";
		echo "<th width='30%'>$key</th>";
		echo "<th> $value1</th>";

	    echo "</tr>";
	} // С?Р°С?Р°РєС?Р?С?РёС?С?РёРєРё С?Р°Р?Р?
	echo("</table>");
	echo("<br>");
	
//print_r($characteristicsOfProduct);
//echo $nameProduct."<br>";
	//echo($moveNameOfCat."<br>");
	$json = json_encode($characteristicsOfProduct);
	if (!is_dir("jsondata/".$moveNameOfCat."/")){
		mkdir("jsondata/".$moveNameOfCat."/");
	}
	file_put_contents("jsondata/".$moveNameOfCat."/".$nameProduct.".json", $json);
	$html->clear(); // подчищаем за собой
	unset($html);		
	
}


?>