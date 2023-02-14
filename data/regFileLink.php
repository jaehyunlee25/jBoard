<?php
	header('Access-Control-Allow-Origin: *');
	session_start();
	ini_set('display_errors',1);
	ini_set('display_startup_errors',1);
	require("../data/regClass.html");
	
	$version=phpversion();
	$vres=strcmp($version,"4.4.9");
	
	//$jdb=new JDB("jaehyunlee.co.kr","root","2ssibalnoma!","dbjhlee2603");
	$con=mysql_connect("mnemosynesolutions.co.kr","root","2ssibalnoma!");
	mysql_select_db("dbjhlee2603",$con);
	mysql_query("set names utf8");
	
	//ip address
	$ip=$_SERVER["REMOTE_ADDR"];
	
	if($vres==1) date_default_timezone_set('Asia/Seoul');
	
	$pid=$_POST['pid'];
	$name=$_POST['name'];
	$stamp=$_POST['stamp'];
	
	mysql_query("insert into attaches(pid,name,stamp,realYn)values(".$pid.",'".$name."','".$stamp."','N');");
	$result=mysql_query("select last_insert_id();");
	$row=mysql_fetch_array($result);
	$file_id=$row[0];
	
	echo($file_id);
	
?>