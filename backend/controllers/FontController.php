<?php
require_once __DIR__ . '../../models/Font.php';

class FontController
{
    public function upload()
    {
        if (!isset($_FILES['font'])) {
            echo json_encode(['error' => 'No font file(s) provided']);
            return;
        }

        $uploadDir = 'uploads/';
        $targetPath = __DIR__ . '/../../' . $uploadDir;
        if (!is_dir($targetPath)) {
            mkdir($targetPath, 0755, true);
        }

        $files = $_FILES['font'];
        $results = [];

        
        $fileCount = is_array($files['name']) ? count($files['name']) : 1;

        $fonts = [];
        // Handle single and multiple files
        for ($i = 0; $i < $fileCount; $i++) {

            $originalName = is_array($files['name']) ? $files['name'][$i] : $files['name'];
            $tmpName = is_array($files['tmp_name']) ? $files['tmp_name'][$i] : $files['tmp_name'];
            $error = is_array($files['error']) ? $files['error'][$i] : $files['error'];

            if ($error !== UPLOAD_ERR_OK) {
                $results[] = ['file' => $originalName, 'error' => 'Upload error'];
                continue;
            }

            $ext = pathinfo($originalName, PATHINFO_EXTENSION);
            if (strtolower($ext) !== 'ttf') {
                $results[] = ['file' => $originalName, 'error' => 'Only .ttf files allowed'];
                continue;
            }

            $generatedName = uniqid() . '.ttf';
            $relativePath = $uploadDir . $generatedName;
            $fullPath = $targetPath . $generatedName;

            if (move_uploaded_file($tmpName, $fullPath)) {

                $fonts[] = [
                    'originalName' => $originalName,
                    'relativePath' => $relativePath
                ];
                $results[] = ['file' => $originalName, 'status' => 'Uploaded'];
            } else {
                $results[] = ['file' => $originalName, 'error' => 'Failed to move file'];
            }
        }


        try {
            if (!empty($fonts)) {
                Font::saveFonts($fonts);
            }
        } catch (Exception $e) {

            foreach ($fonts as $font) {
                $fullPath = $targetPath . basename($font['relativePath']);
                if (file_exists($fullPath)) {
                    unlink($fullPath);
                }
            }
            $results[] = ['error' => 'Failed to save fonts to the database: ' . $e->getMessage()];
        }

        echo json_encode($results);
    }

    
    //getting font data

    public function getAll()
    {
        try {
            $fonts = Font::getAllFonts();
            echo json_encode(['fonts' => $fonts]);
        } catch (Exception $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}
