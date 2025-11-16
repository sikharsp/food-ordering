<?php
// ✅ Allow cross-origin requests
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// ✅ Handle preflight (CORS) requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ✅ Set response type
header("Content-Type: application/json");

include("../config.php");

// ✅ Validate order_id parameter
if (!isset($_GET['order_id'])) {
    echo json_encode(["success" => false, "message" => "Missing order_id"]);
    exit;
}

$order_id = $_GET['order_id'];

try {
    // ✅ Fetch order items joined with menu details
    $query = $pdo->prepare("
        SELECT 
            oi.menu_item_id, 
            oi.quantity, 
            oi.price, 
            oi.subtotal, 
            m.name, 
            m.image
        FROM order_items oi
        JOIN menu_items m ON oi.menu_item_id = m.id
        WHERE oi.order_id = ?
    ");
    $query->execute([$order_id]);
    $items = $query->fetchAll(PDO::FETCH_ASSOC);

    if ($items && count($items) > 0) {
        echo json_encode(["success" => true, "items" => $items]);
    } else {
        echo json_encode(["success" => false, "message" => "No items found"]);
    }
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>
