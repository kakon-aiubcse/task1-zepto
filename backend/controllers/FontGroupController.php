<?php
require_once __DIR__ . '../../models/FontGroup.php';

class FontGroupController
{
    //create groups section
    public function create()
    {
        $data = json_decode(file_get_contents("php://input"), true);

        if (!isset($data['group_name']) || !isset($data['font_ids'])) {
            echo json_encode(['error' => 'Group name and font IDs are required']);
            return;
        }

        $groupName = $data['group_name'];
        $fontIds = $data['font_ids'];

        if (count($fontIds) < 2) {
            echo json_encode(['error' => 'You must provide at least two font IDs']);
            return;
        }

        try {
            FontGroup::createGroup($groupName, $fontIds);
            echo json_encode(['message' => 'Font group created successfully']);
        } catch (Exception $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    // Get groups section
    public function getAll()
    {
        $groups = FontGroup::getAllGroups();
        echo json_encode(['font_groups' => $groups]);
    }

    // Edit a font group section
    public function edit($id)
    {
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
                FontGroup::updateGroupName($id, $groupName);
            }


            if (count($fontIdsToAdd) > 0) {
                FontGroup::addFontsToGroup($id, $fontIdsToAdd);
            }


            if (count($fontIdsToRemove) > 0) {
                FontGroup::removeFontsFromGroup($id, $fontIdsToRemove);
            }

            echo json_encode(['message' => 'Font group updated successfully']);
        } catch (Exception $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
    }



    // Delete a font group section
    public function delete($id)
    {
        try {
            FontGroup::deleteGroup($id);
            echo json_encode(['message' => 'Font group deleted successfully']);
        } catch (Exception $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}
