<?php
$host = 'sql103.infinityfree.com';  // 🔹 Replace with your actual MySQL Hostname
$dbname = 'if0_40357893_food';      // 🔹 Your database name
$username = 'if0_40357893';         // 🔹 Your MySQL username
$password = 'YOUR_DATABASE_PASSWORD'; // 🔹 Your MySQL password

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}
?>
