<?php
require_once __DIR__ . '/../controllers/FontController.php';
require_once __DIR__ . '/../controllers/FontGroupController.php';

header('Content-Type: application/json');

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

// uploading fonts 
if ($uri === '/api/upload-font' && $method === 'POST') {
    $controller = new FontController();
    $controller->upload();
}

// fetching all fonts
elseif ($uri === '/api/fonts' && $method === 'GET') {
    $controller = new FontController();
    $controller->getAll();
}

// creating a font group
elseif ($uri === '/api/create-group' && $method === 'POST') {
    $controller = new FontGroupController();
    $controller->create();
}

// fetching all font groups data
elseif ($uri === '/api/font-groups' && $method === 'GET') {
    $controller = new FontGroupController();
    $controller->getAll();
}

// editing a font group with specific group id
elseif (preg_match('/^\/api\/edit-group\/(\d+)$/', $uri, $matches) && $method === 'PUT') {
    $controller = new FontGroupController();
    $controller->edit($matches[1]);
}

// deleting a font group with specific group id
elseif (preg_match('/^\/api\/delete-group\/(\d+)$/', $uri, $matches) && $method === 'DELETE') {
    $controller = new FontGroupController();
    $controller->delete($matches[1]);
}

// Fallback: route not found
else {
    http_response_code(404);
    echo json_encode(['error' => 'Route not found']);
}
