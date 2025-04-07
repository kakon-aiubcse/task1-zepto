<?php
class DB {
    public static function connect() {
        $host = 'localhost';
        $db   = 'fontsystem';
        $user = 'postgres';
        $pass = '1234';
        $dsn = "pgsql:host=$host;port=5432;dbname=$db";

        try {
            return new PDO($dsn, $user, $pass, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
            ]);
        } catch (PDOException $e) {
            die("DB connection failed: " . $e->getMessage());
        }
    }
}
