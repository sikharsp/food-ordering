<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include '../config.php';

$time = $_GET['time'] ?? 'daily'; // daily, weekly, monthly, yearly

try {
    $query = "SELECT SUM(oi.subtotal) AS total
              FROM orders o
              JOIN order_items oi ON o.id = oi.order_id
              WHERE o.status='approved'";

    if ($time === 'daily') {
        $query .= " AND DATE(o.created_at) = CURDATE()";
    } elseif ($time === 'weekly') {
        $query .= " AND DATEDIFF(CURDATE(), o.created_at) >= 7 AND DATEDIFF(CURDATE(), o.created_at) < 30";
    } elseif ($time === 'monthly') {
        $query .= " AND DATEDIFF(CURDATE(), o.created_at) >= 30 AND DATEDIFF(CURDATE(), o.created_at) < 365";
    } elseif ($time === 'yearly') {
        $query .= " AND DATEDIFF(CURDATE(), o.created_at) >= 365";
    }

    $stmt = $pdo->query($query);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "total" => $result['total'] ?? 0
    ]);
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
?>
