<?php
	header("Access-Control-Allow-Origin:*");
	ini_set('display_errors',1);
	ini_set('display_startup_errors',1);
	require("../data/regClass.html");
		
	$jdb=new JDB("mnemosynesolutions.co.kr","root","2ssibalnoma!","dbjhlee2603"); 
	
	//ip address
	$ip=$_SERVER["REMOTE_ADDR"];
	//date_default_timezone_set('Asia/Seoul');
	$time=date('Y').date('m').date('d').date('H').date('i').date('s').date('w');
	
	$obj=isset($_POST["param"])?$_POST["param"]:"";
	$obj=stripslashes($obj);
	$param=json_decode($obj);
	
	$id=$param->key;
	$name=$param->name;
	$kind=$param->kind;
	$title=$param->title;
	
	$result=mysql_query("update boardtree set name='$name', kind='$kind', title='$title' where id=$id;");
	echo($result);
?>