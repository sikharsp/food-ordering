<?php
// ===== CORS Headers =====
header('Access-Control-Allow-Origin: http://localhost:5173'); // React dev server
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

include 'config.php'; // Make sure $pdo is set

// Get JSON body
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(['success' => false, 'message' => 'Invalid JSON']);
    exit;
}

// Required fields
$id = $data['id'] ?? null;
$name = trim($data['name'] ?? '');
$foodPreference = trim($data['foodPreference'] ?? '');

if (!$id || $name === '' || $foodPreference === '') {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

try {
    // Update user
    $stmt = $pdo->prepare("UPDATE users SET name = ?, food_preference = ? WHERE id = ?");
    $stmt->execute([$name, $foodPreference, $id]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => true, 'message' => 'Profile updated successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'No changes made or invalid user ID']);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
