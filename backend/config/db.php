<?php
$host = 'localhost';
$db   = 'font_system';
$user = 'postgres'; 
$pass = '8988';
$dsn = "pgsql:host=$host;port=5432;dbname=$db";

try {
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
} catch (PDOException $e) {
    die("DB connection failed: " . $e->getMessage());
}
?>
