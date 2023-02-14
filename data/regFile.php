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
	
	//$time=date('Y').date('m').date('d').date('H').date('i').date('s').date('w');
	
	/*
		UPLOAD_ERR_OK
		값: 0; 오류 없이 파일 업로드가 성공했습니다.
		UPLOAD_ERR_INI_SIZE
		값: 1; 업로드한 파일이 php.ini upload_max_filesize 지시어보다 큽니다.
		UPLOAD_ERR_FORM_SIZE
		값: 2; 업로드한 파일이 HTML 폼에서 지정한 MAX_FILE_SIZE 지시어보다 큽니다.
		UPLOAD_ERR_PARTIAL
		값: 3; 파일이 일부분만 전송되었습니다.
		UPLOAD_ERR_NO_FILE
		값: 4; 파일이 전송되지 않았습니다.
		UPLOAD_ERR_NO_TMP_DIR
		값: 6; 임시 폴더가 없습니다. PHP 4.3.10과 PHP 5.0.3에서 추가.
		UPLOAD_ERR_CANT_WRITE
		값: 7; 디스크에 파일 쓰기를 실패했습니다. PHP 5.1.0에서 추가.
		UPLOAD_ERR_EXTENSION
		값: 8; 확장에 의해 파일 업로드가 중지되었습니다. PHP 5.2.0에서 추가.
	*/
	
	//var_dump($_FILES["aaa"]);
	//echo($_FILES["aaa"]["error"]);
	//echo($_POST["bbb"]);
	
	$uploaddir='/tmp/uploads/jBoard/';
	mkdir($uploaddir,0777);
	$pid=$_POST['pid'];
	$stamp=$_POST['stamp'];
	$uploadfile=$uploaddir.$stamp."_".basename($_FILES['attach']['name']);
	
	mysql_query("insert into attaches(pid,name,stamp)values(".$pid.",'".$uploadfile."','".$stamp."');");
	$result=mysql_query("select last_insert_id();");
	$row=mysql_fetch_array($result);
	$file_id=$row[0];
	
	if(is_uploaded_file($_FILES['attach']['tmp_name'])){
		$tmp_file=$_FILES['attach']['tmp_name'];
		if(move_uploaded_file($tmp_file,"/home".$uploadfile)){
			//echo "파일이 유효하고, 성공적으로 업로드 되었습니다.\n";
		}else{
			echo "FALSE";
		}
	}
	
	echo($file_id);
	
?>