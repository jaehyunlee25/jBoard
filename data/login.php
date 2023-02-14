<?php
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
	
	$rs=$jdb->select("*","developers","where name='$name' and password='$password'");
	$lng=mysql_num_rows($rs);
	
	if($lng==1){
		$row=mysql_fetch_array($rs);
		$_SESSION["id"]=$row[0];
		$_SESSION["name"]=$row[1];
		$_SESSION["type"]=$row[2];
		$_SESSION["phone"]=$row[3];
		$_SESSION["date"]=$row[4];
		$_SESSION["ip"]=$row[5];
		$_SESSION["others"]=$row[6];
		$_SESSION["password"]=$row[7];
		echo(1);
	}else if($lng>1){
		$jdb->enJson("*","developers","where name='$name' and password='$password'");
	}else{
		echo(-1);
	}
	
?>