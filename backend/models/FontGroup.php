<?php

require_once __DIR__ . '../../config/db.php';

class FontGroup
{
    private static $db;

    private static function initConnection()
    {
        if (self::$db === null) {
            try {
                self::$db = DB::connect(); 
            } catch (PDOException $e) {
                throw new Exception('Database connection failed: ' . $e->getMessage());
            }
        }
    }

    // Create a new font group
    public static function createGroup($groupName, $fontIds = [])
    {
        self::initConnection();

        try {
            $stmt = self::$db->prepare("SELECT COUNT(*) FROM font_groups WHERE group_name = :group_name");
            $stmt->bindParam(':group_name', $groupName, PDO::PARAM_STR);
            $stmt->execute();

            if ($stmt->fetchColumn() > 0) {
                throw new Exception("Font group with name '{$groupName}' already exists");
            }

           
            $stmt = self::$db->prepare("INSERT INTO font_groups (group_name) VALUES (:group_name) RETURNING id");
            $stmt->bindParam(':group_name', $groupName, PDO::PARAM_STR);
            $stmt->execute();

         
            $groupId = $stmt->fetch(PDO::FETCH_ASSOC)['id'];

            foreach ($fontIds as $fontId) {
                $stmt = self::$db->prepare("SELECT COUNT(*) FROM fonts WHERE id = :font_id");
                $stmt->bindParam(':font_id', $fontId, PDO::PARAM_INT);
                $stmt->execute();

                if ($stmt->fetchColumn() == 0) {
                    throw new Exception("Font with ID {$fontId} does not exist");
                }

             
                $stmt = self::$db->prepare("SELECT COUNT(*) FROM font_group_files WHERE group_id = :group_id AND font_id = :font_id");
                $stmt->bindParam(':group_id', $groupId, PDO::PARAM_INT);
                $stmt->bindParam(':font_id', $fontId, PDO::PARAM_INT);
                $stmt->execute();

                if ($stmt->fetchColumn() > 0) {
                    throw new Exception("Font ID {$fontId} is already assigned to this font group");
                }
            }

            
            foreach ($fontIds as $fontId) {
                $stmt = self::$db->prepare("INSERT INTO font_group_files (group_id, font_id) VALUES (:group_id, :font_id)");
                $stmt->bindParam(':group_id', $groupId, PDO::PARAM_INT);
                $stmt->bindParam(':font_id', $fontId, PDO::PARAM_INT);
                $stmt->execute();
            }
        } catch (PDOException $e) {
            throw new Exception('Failed to create font group: ' . $e->getMessage());
        }
    }


    // Get all font groups 
    public static function getAllGroups()
    {
        self::initConnection();

        try {
            $stmt = self::$db->prepare("
                SELECT fg.id, fg.group_name, fg.created_at, 
                       json_agg(f.name) AS font_names
                FROM font_groups fg
                LEFT JOIN font_group_files fgf ON fg.id = fgf.group_id
                LEFT JOIN fonts f ON fgf.font_id = f.id
                GROUP BY fg.id
            ");
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            throw new Exception('Failed to retrieve font groups: ' . $e->getMessage());
        }
    }

    // Edit a font group
    public function edit($id) {
        $data = json_decode(file_get_contents("php://input"), true);
    
        if (!isset($data['group_name']) && !isset($data['fontIdsToAdd']) && !isset($data['fontIdsToRemove'])) {
            echo json_encode(['error' => 'No changes provided. At least one operation is required.']);
            return;
        }
    
      
    
        $groupName = isset($data['group_name']) ? $data['group_name'] : null;
        $fontIdsToAdd = isset($data['fontIdsToAdd']) ? $data['fontIdsToAdd'] : [];
        $fontIdsToRemove = isset($data['fontIdsToRemove']) ? $data['fontIdsToRemove'] : [];
    
        try {
            if ($groupName) {
                self::updateGroupName($id, $groupName);
            }
    
            if (count($fontIdsToAdd) > 0) {
                self::addFontsToGroup($id, $fontIdsToAdd);
            }
    
            if (count($fontIdsToRemove) > 0) {
                self::removeFontsFromGroup($id, $fontIdsToRemove);
            }
    
            echo json_encode(['message' => 'Font group updated successfully']);
        } catch (Exception $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
    //group name updating
    public static function updateGroupName($id, $groupName) {
        self::initConnection();
        
        $stmt = self::$db->prepare("UPDATE font_groups SET group_name = :group_name WHERE id = :id");
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->bindParam(':group_name', $groupName, PDO::PARAM_STR);
        $stmt->execute();
    }
    //adding fonts into group
    
    public static function addFontsToGroup($id, $fontIds) {
        self::initConnection();
        
        foreach ($fontIds as $fontId) {
            $stmt = self::$db->prepare("SELECT COUNT(*) FROM fonts WHERE id = :font_id");
            $stmt->bindParam(':font_id', $fontId, PDO::PARAM_INT);
            $stmt->execute();
        
            if ($stmt->fetchColumn() == 0) {
                throw new Exception("Font with ID {$fontId} does not exist");
            }
    
            $stmt = self::$db->prepare("SELECT COUNT(*) FROM font_group_files WHERE group_id = :group_id AND font_id = :font_id");
            $stmt->bindParam(':group_id', $id, PDO::PARAM_INT);
            $stmt->bindParam(':font_id', $fontId, PDO::PARAM_INT);
            $stmt->execute();
    
            if ($stmt->fetchColumn() > 0) {
                continue;
            }
        
            $stmt = self::$db->prepare("INSERT INTO font_group_files (group_id, font_id) VALUES (:group_id, :font_id)");
            $stmt->bindParam(':group_id', $id, PDO::PARAM_INT);
            $stmt->bindParam(':font_id', $fontId, PDO::PARAM_INT);
            $stmt->execute();
        }
    }
    //removing fonts from a group 
    
    public static function removeFontsFromGroup($id, $fontIds) {
        self::initConnection();
        
        foreach ($fontIds as $fontId) {
            $stmt = self::$db->prepare("DELETE FROM font_group_files WHERE group_id = :group_id AND font_id = :font_id");
            $stmt->bindParam(':group_id', $id, PDO::PARAM_INT);
            $stmt->bindParam(':font_id', $fontId, PDO::PARAM_INT);
            $stmt->execute();
        }
    }
    
    
    //deleting group with id
    public static function deleteGroup($id)
    {
        self::initConnection();


        if (!filter_var($id, FILTER_VALIDATE_INT) || $id <= 0) {
            throw new Exception('Invalid group ID format');
        }

        try {

            $stmt = self::$db->prepare("SELECT * FROM font_groups WHERE id = :id");
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            $fontGroup = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$fontGroup) {
                throw new Exception('Font group not found');
            }


            $groupName = isset($fontGroup['group_name']) ? $fontGroup['group_name'] : 'Unknown Group';
            $stmt = self::$db->prepare("SELECT * FROM font_group_files WHERE group_id = :group_id");
            $stmt->bindParam(':group_id', $id, PDO::PARAM_INT);
            $stmt->execute();
            $filesToDelete = $stmt->fetchAll(PDO::FETCH_ASSOC);


            $deletedFiles = [];
            foreach ($filesToDelete as $file) {
                if (isset($file['font_id'])) {
                    $deletedFiles[] = $file['font_id'];
                }
            }


            $stmt = self::$db->prepare("DELETE FROM font_group_files WHERE group_id = :group_id");
            $stmt->bindParam(':group_id', $id, PDO::PARAM_INT);
            $stmt->execute();


            $stmt = self::$db->prepare("DELETE FROM font_groups WHERE id = :id");
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();


            if (count($deletedFiles) > 0) {
                return 'Font group "' . $groupName . '" (ID: ' . $id . ') deleted successfully. Deleted fonts: ' . implode(', ', $deletedFiles);
            } else {
                return 'Font group "' . $groupName . '" (ID: ' . $id . ') deleted successfully. No fonts were associated with this group.';
            }
        } catch (PDOException $e) {
            throw new Exception('Failed to delete font group: ' . $e->getMessage());
        }
    }
}
