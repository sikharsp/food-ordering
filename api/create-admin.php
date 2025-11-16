<?php
$password = 'Admin123!'; // Replace with your desired admin password
$hashed = password_hash($password, PASSWORD_DEFAULT);
echo $hashed;
?>
