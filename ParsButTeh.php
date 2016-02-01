<?php
require_once 'simple_html_dom.php'; //Imclede library with the parsing
require_once 'listOfProducts.php';

function AddItemsToArray ($url) {
	$html = new simple_html_dom(); //make new object
	$html = file_get_html($url); //loading the data by url
	global $array;
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
		//$array[trim($catArray)]=$linkOfLink;
		$array[] = array('nameOfProd'=>trim($catArray), 'link'=>$linkOfLink);
		/*
		foreach ($name->find('.tech-char') as $key=>$options)
		{	
			$catArray1 = strval($options->plaintext);
			$options1 = explode("&bull;", $catArray1);
			for ($i=0; $i<count ($options1); $i++)
			{
				$options3[$i]= trim($options1[$i]);
			}		
			$array[trim($catArray)]=$options3;
		}	*/	
	}
	
/*
	echo "<table class='table-next table-striped table-bordered'>";
	foreach ($array as $key => $value1)
	{
		echo "<tr>";
		echo "<td>$key</td>";
		echo "<td>$value1</td>";		
		echo "</tr>";
	}
	echo "</table>";
*/


	$html->clear(); // подчищаем за собой
	unset($html);
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






?>
