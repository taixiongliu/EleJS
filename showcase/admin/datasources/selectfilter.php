<?php 
	$value = $_POST['keyvalue'];
?>
{
	"resCode":1000,
	"data":[
		{"text":"智推1","value":1,"filter":"@p;#<?php echo $value?>;@s"},
		{"text":"智推2","value":2,"filter":"@p2;#<?php echo $value?>;@s2"},
		{"text":"智推3","value":3,"filter":"@p3;#<?php echo $value?>;@s3"}
	]
}