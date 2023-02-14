<?php
	header('Access-Control-Allow-Origin: *');
	session_start();
	ini_set('display_errors',1);
	ini_set('display_startup_errors',1);
	require("../data/regClass.html");
	
	$jdb=new JDB("mnemosynesolutions.co.kr","root","2ssibalnoma!","dbjhlee2603");
	//$id=$_SESSION["id"];
	$id=2;
	$jdb->enJson("*","developers","where id=$id");
?>