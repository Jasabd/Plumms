<?php
error_reporting(E_ERROR | E_WARNING | E_PARSE | E_NOTICE);
require_once($_SERVER['DOCUMENT_ROOT']."/plumms/utils/functions.php");
if(isset($_GET["emailPass"])) {
	if(!empty($_POST)){
		$user_email = prepare_input($_POST['email']);
		$qry =  "SELECT password from user WHERE email='$user_email'";
		if(!$stmt = $dbcon->prepare($qry)){
		    die('Prepare Error : ('. $dbcon->errno .') '. $dbcon->error);
		}
		if(!$stmt->execute()){
		    die('Error : ('. $dbcon->errno .') '. $dbcon->error);
		}
		$stmt->store_result();
		$stmt->bind_result($a);
		while ($stmt->fetch()) {
			$from = "admin@plumms.com";
		    $to = $user_email;
		    $subject = "Fitoori Login information";
		    $message = "Your password is ".$a;
		    $headers = "From:" . $from;
		    mail($to,$subject,$message, $headers);
		}
		$stmt->close();
		echo "SUCCESS";
	}
	exit();
}
if(isset($_GET["address"])) {
	if(!empty($_POST)){
		$user_id=$_SESSION['userid'];
		$addr1 = prepare_input($_POST['address1']);
		$addr2 = prepare_input($_POST['address2']);
		$city = prepare_input($_POST['city']);
		$state = prepare_input($_POST['state']);
		$postal = prepare_input($_POST['postalcode']);

		$updQuery1 =  "UPDATE user  SET `address1`=?, `address2` =?, `city` =?, `state` = ?, `postalcode` = ? WHERE userid=$user_id";
    	 	$stmt = $dbcon->prepare($updQuery1);

		$stmt->bind_param('sssss', $addr1, $addr2, $city, $state, $postalcode);

		if(!$stmt->execute()){
		    die('Error : ('. $dbcon->errno .') '. $dbcon->error);
		}
		$stmt->close();
		echo "SUCCESS";
	}
	exit();
}
else if(isset($_GET["changePass"])) {
		if(!empty($_POST)){
		$user_id=$_SESSION['userid'];
		$pass = prepare_input($_POST['cpass']);

		$updQuery1 =  "UPDATE user  SET `password`=? WHERE userid=$user_id";
    	 	$stmt = $dbcon->prepare($updQuery1);

		$stmt->bind_param('s', $pass);

		if(!$stmt->execute()){
		    die('Error : ('. $dbcon->errno .') '. $dbcon->error);
		}
		$stmt->close();
		echo "SUCCESS";
	}
	exit();
}
else if(isset($_GET["profile"])) {
	if(!empty($_POST)){
		$user_id=$_SESSION['userid'];
		$fname = prepare_input($_POST['fname']);
		$lname = prepare_input($_POST['lname']);
		$email = prepare_input($_POST['email']);
		$phone = prepare_input($_POST['phone']);
		$gender = prepare_input($_POST['gender']);

		$updQuery1 =  "UPDATE user  SET `firstname`=?, `lastname` =?, `email` =?, `phone` = ?, `gender` = ? WHERE userid=$user_id";
    	 	$stmt = $dbcon->prepare($updQuery1);

		$stmt->bind_param('sssss', $fname, $lname, $email, $phone, $gender);

		if(!$stmt->execute()){
		    die('Error : ('. $dbcon->errno .') '. $dbcon->error);
		}
		$stmt->close();
		echo "SUCCESS";
	}
	exit();
}
else {
	$user_id=$_SESSION['userid'];
	$curr_user =[];

	$qry = "SELECT  userid, firstname, lastname, email, phone, gender, address1, address2, city, state, postalcode  from user WHERE userid=$user_id";
 	if(!$stmt = $dbcon->prepare($qry)){
	    die('Prepare Error : ('. $dbcon->errno .') '. $dbcon->error);
	}

	if(!$stmt->execute()){
	    die('Error : ('. $dbcon->errno .') '. $dbcon->error);
	}

	$stmt->store_result();
	$stmt->bind_result($a,$b,$c,$d, $e, $f, $g, $h, $i, $j, $k);
	while ($stmt->fetch()) {
		$curr_user = ['userid' => $a, 'firstname' => $b, 'lastname' => $c, 'email' => $d, 'phone' => $e, 'gender' => $f, 'address1' => $g, 'address2' => $h, 'city' => $i, 'state' => $j, 'postalcode' => $k];
	}
	$stmt->close();
}



?>