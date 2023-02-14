<?php
	header('Access-Control-Allow-Origin: *');
	session_start();
	ini_set('display_errors',1);
	ini_set('display_startup_errors',1);
	require("../data/regClass.html");
	
	$version=phpversion();
	$vres=strcmp($version,"4.4.9");
	$jdb=new JDB("mnemosynesolutions.co.kr","root","2ssibalnoma!","dbjhlee2603");
	
	//ip address
	$ip=$_SERVER["REMOTE_ADDR"];
	
	if($vres==1) date_default_timezone_set('Asia/Seoul');
	$time=date('Y').date('m').date('d').date('H').date('i').date('s').date('w');
	
	$obj=isset($_POST["param"])?$_POST["param"]:"";
	$obj=stripslashes($obj);
	$param=json_decode($obj);
	
	$name=$param->name;
	$password=$param->password;
	$type=$param->type;
	$phone=$param->phone;
	$others=$param->others;
	
	$others=addslashes($others);
	
	$jdb->insert(
		"developers",
		
		"'$name',".
		"$type,".
		"'$phone',".
		"'$time',".
		"'$ip',".
		"'$others',".
		"'$password'"
	);
?>