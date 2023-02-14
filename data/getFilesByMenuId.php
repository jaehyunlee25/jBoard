<?php
	header('Access-Control-Allow-Origin: *');
	session_start();
	ini_set('display_errors',1);
	ini_set('display_startup_errors',1);
	require("../data/regClass.html");
	
	$version=phpversion();
	$vres=strcmp($version,"4.4.9");
	
	$con=mysql_connect("mnemosynesolutions.co.kr","root","2ssibalnoma!");
	mysql_select_db("dbjhlee2603",$con);
	mysql_query("set names utf8");
	
	$uploaddir='/tmp/uploads/jBoard/';
	$id=$_POST['id'];
	
	$sql=file_get_contents("getFilesByMenuId.sql",FILE_USE_INCLUDE_PATH);
	$sql=str_replace("?",$id,$sql);
	$result=mysql_query($sql);
	$rows = array();
	while($r = mysql_fetch_assoc($result)) {
	 $rows['result'][] = $r;
	}

	print json_encode($rows);
?>