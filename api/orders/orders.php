<?php
// --- Dynamic CORS setup ---
$allowed_origins = [
    'http://localhost:5173', // local React dev
    'https://food-ordering-beta-taupe.vercel.app' // live site
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
}

header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include_once("../config.php");
header("Content-Type: application/json");

// ✅ POST Requests (Place Order / Update Status)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // --- Admin Update Order Status ---
    if (isset($_POST['action']) && $_POST['action'] === 'update_status') {
        $id = $_POST['id'] ?? 0;
        $status = $_POST['status'] ?? 'Order Placed';

        try {
            $stmt = $pdo->prepare("UPDATE orders SET status = ? WHERE id = ?");
            $stmt->execute([$status, $id]);
            echo json_encode(["success" => true, "message" => "Order status updated"]);
        } catch (PDOException $e) {
            echo json_encode(["success" => false, "message" => $e->getMessage()]);
        }
        exit;
    }

    // --- User Places Order ---
    $user_id = $_POST['user_id'] ?? 0;
    $location = $_POST['location'] ?? "";
    $address = $_POST['address'] ?? "";
    $cart = json_decode($_POST['cart'] ?? "[]", true);

    if (empty($cart)) {
        echo json_encode(["success" => false, "message" => "Cart is empty"]);
        exit;
    }

    try {
        $pdo->beginTransaction();

        // Insert into orders
        $stmt = $pdo->prepare("
            INSERT INTO orders (user_id, location, address, status)
            VALUES (?, ?, ?, 'Order Placed')
        ");
        $stmt->execute([$user_id, $location, $address]);
        $order_id = $pdo->lastInsertId();

        // Insert order items
        $stmtItem = $pdo->prepare("
            INSERT INTO order_items (order_id, menu_item_id, quantity, price, subtotal)
            VALUES (?, ?, ?, ?, ?)
        ");

        foreach ($cart as $item) {
            $stmtPrice = $pdo->prepare("SELECT price FROM menu_items WHERE id = ?");
            $stmtPrice->execute([$item['id']]);
            $menu = $stmtPrice->fetch(PDO::FETCH_ASSOC);

            $price = $menu['price'] ?? 0;
            $subtotal = $price * $item['quantity'];
            $stmtItem->execute([$order_id, $item['id'], $item['quantity'], $price, $subtotal]);
        }

        $pdo->commit();

        // --- Save last delivery address for user ---
        try {
            $stmtUser = $pdo->prepare("UPDATE users SET location = ?, address = ? WHERE id = ?");
            $stmtUser->execute([$location, $address, $user_id]);
        } catch (PDOException $e) {
            error_log("Failed to save address: " . $e->getMessage());
        }

        echo json_encode(["success" => true, "message" => "Order placed successfully"]);

    } catch (PDOException $e) {
        $pdo->rollBack();
        echo json_encode(["success" => false, "message" => $e->getMessage()]);
    }
}

// ✅ GET Orders
elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $user_id = $_GET['user_id'] ?? null; // get user_id from query params

    try {
        if ($user_id) {
            // Fetch only orders for this user
            $stmt = $pdo->prepare("
                SELECT o.*, u.name AS user_name
                FROM orders o
                LEFT JOIN users u ON o.user_id = u.id
                WHERE o.user_id = ?
                ORDER BY o.id DESC
            ");
            $stmt->execute([$user_id]);
        } else {
            // Admin fetches all orders
            $stmt = $pdo->query("
                SELECT o.*, u.name AS user_name
                FROM orders o
                LEFT JOIN users u ON o.user_id = u.id
                ORDER BY o.id DESC
            ");
        }

        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($orders as &$order) {
            // Fetch items with image and menu_item_id
            $stmtItems = $pdo->prepare("
                SELECT oi.quantity, m.id AS menu_item_id, m.name, m.price, m.image, (oi.quantity * m.price) AS subtotal
                FROM order_items oi
                LEFT JOIN menu_items m ON oi.menu_item_id = m.id
                WHERE oi.order_id = ?
            ");
            $stmtItems->execute([$order['id']]);
            $items = $stmtItems->fetchAll(PDO::FETCH_ASSOC);
            $order['items'] = $items;

            // Total
            $order['total'] = array_reduce($items, fn($sum, $i) => $sum + $i['subtotal'], 0);

            // Can cancel within 5 minutes
            $order_time = strtotime($order['created_at']);
            $order['can_cancel'] = (time() - $order_time) <= 300;
        }

        echo json_encode($orders);

    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => $e->getMessage()]);
    }
}

// ❌ Invalid method
else {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
}
?>
