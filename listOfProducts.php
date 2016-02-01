<?php

function GetGoods ($url, $nameProduct) {
	//$url="src1.html";
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
	
	$option = $html -> find('.description p.full-desc');
	$description = $option[0];
	//$optionOf=mb_convert_encoding($optionOf,'utf-8', 'Windows-1251');
	//$optionOf->style="";
	//$description=strval($optionOf->plaintext);
	//$description = str_replace ( "&nbsp;", "", $description);
	

	
	//$description=$optionOf->innertext='';
	//$description=$description->plaintext;
	echo "r11es: ".$description."<br>";
	
	//$characteristicsOfProduct += array(mb_convert_encoding("Ссылка на картинку товара",'utf-8', 'Windows-1251')=>$linkOfLink);
	//$characteristicsOfProduct += array(mb_convert_encoding("Описание",'utf-8', 'Windows-1251')=>trim($description));

/*
	$characteristicsOfProduct += array("Link to image"=>$linkOfLink);
	$characteristicsOfProduct += array("Description"=>trim($description));
		
	foreach ($html -> find('#full-props-list tbody tr') as $name)
	{	
		$lvl1=$name->children(0)->children(0)->plaintext;
		$catArray=strval($lvl1);	
		
		foreach ($name->find('td') as $key=>$options)
		{	
			$name1=strval($options->plaintext);
			$characteristicsOfProduct += array(trim($catArray)=>$name1);
		}	
	}
*/

/*
	echo "<table border='1px'>";
	foreach ($characteristicsOfProduct as $key => $value1)
	{	
		echo "<tr>";
		//echo "<table border='1px' width='100%'>"."<tr>";
		echo "<th width='30%'>$key</th>";
		echo "<th> $value1</th>";

	    echo "</tr>";
	}// С?Р°С?Р°РєС?Р?С?РёС?С?РёРєРё С?Р°Р?Р?
	echo("</table>");
	echo("<br>");
*/
//print_r($characteristicsOfProduct);
//echo $nameProduct."<br>";
//$json = json_encode($characteristicsOfProduct);
//file_put_contents("jsondata/".$nameProduct.".json", $json);
	
	

}
?>
