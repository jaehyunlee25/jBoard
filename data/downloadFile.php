<?php
	//header('Access-Control-Allow-Origin: *');
	session_start();
	ini_set('display_errors',1);
	ini_set('display_startup_errors',1);
	require("../data/regClass.html");
	
	$version=phpversion();
	$vres=strcmp($version,"4.4.9");
	
	$filepath=$_GET['name'];
	$filetype=$_GET['type'];
	
	$filesize=filesize($filepath);
	$path_parts=pathinfo($filepath);
	$filename_arr=explode("_",$path_parts['basename']);
	$filename=$filename_arr[1];
	$extension=$path_parts['extension'];

	/* header("Pragma: public");
	header("Expires: 0");
	header("Content-Type: application/octet-stream");
	header("Content-Disposition: attachment; filename=\"$filename\"");
	header("Content-Transfer-Encoding: binary");
	header("Content-Length: $filesize"); */

	//ob_clean();
	//flush();
	if($filetype){
		readfile("/home".$filepath);
	}else{
		resizeImage("/home".$filepath,300,300);
	}
	//imagejpeg($img);
	
	function resizeImage($filename, $max_width, $max_height){
		list($orig_width, $orig_height,$mime)=getimagesize($filename);

		$width=$orig_width;
		$height=$orig_height;

		# taller
		if ($height>$max_height){
			$width=($max_height/$height)*$width;
			$height=$max_height;
		}

		# wider
		if ($width>$max_width){
			$height=($max_width/$width)*$height;
			$width=$max_width;
		}

		$image_p=imagecreatetruecolor($width,$height);
		$image=imagecreatefromjpeg($filename);
		imagecopyresampled($image_p,$image,0,0,0,0,$width,$height,$orig_width,$orig_height);
		
		
		switch ($mime) { 
			case "image/gif": 
				imagegif($image_p);
				break; 
			case 2: 
				imagejpeg($image_p);
				break; 
			case "image/png": 
				imagepng($image_p);
				break; 
			case "image/bmp": 
				imagebmp($image_p);
				break; 
		} 
		
		//return $image_p;
	}
	
	
	
?>