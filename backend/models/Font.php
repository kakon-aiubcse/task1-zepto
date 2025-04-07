<?php

require_once __DIR__ . '/../config/db.php';

class Font {
    private static $db;

    private static function initConnection() {
        if (self::$db === null) {
            self::$db = DB::connect();
        }
    }

    
    public static function saveFonts($fonts) {
        self::initConnection();

        try {
            foreach ($fonts as $font) {
                $originalName = $font['originalName'];
                $relativePath = $font['relativePath'];

                //file existence checking
                $stmt = self::$db->prepare("SELECT * FROM fonts WHERE name = :name");
                $stmt->bindParam(':name', $originalName, PDO::PARAM_STR);
                $stmt->execute();
                $existingFont = $stmt->fetch(PDO::FETCH_ASSOC);

                if ($existingFont) {
                    throw new Exception('Font ' . $originalName . ' already exists in the database');
                }

                // insertation
                $stmt = self::$db->prepare("INSERT INTO fonts (name, file_path) VALUES (:name, :file_path)");
                $stmt->bindParam(':name', $originalName, PDO::PARAM_STR);
                $stmt->bindParam(':file_path', $relativePath, PDO::PARAM_STR);
                $stmt->execute();
            }
        } catch (Exception $e) {
            throw new Exception('Failed to save fonts: ' . $e->getMessage());
        }
    }

    public static function getAllFonts() {
        self::initConnection();

        try {
            $stmt = self::$db->query("SELECT * FROM fonts");
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            throw new Exception('Failed to retrieve fonts: ' . $e->getMessage());
        }
    }
}
