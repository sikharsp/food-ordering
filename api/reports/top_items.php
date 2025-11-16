<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include '../config.php';

try {
    // Optional: filter by preference
    $preference = $_GET['preference'] ?? ''; // veg, nonveg, both, or empty

    // Join orders, order_items, and menu_items
    $sql = "
        SELECT m.id, m.name, m.preference, SUM(oi.quantity) AS total_quantity, SUM(oi.subtotal) AS total_sales
        FROM order_items oi
        INNER JOIN orders o ON oi.order_id = o.id
        INNER JOIN menu_items m ON oi.menu_item_id = m.id
        WHERE o.status = 'approved'
    ";

    // Add preference filter if set
    if ($preference === 'veg' || $preference === 'nonveg') {
        $sql .= " AND m.preference = :pref";
        $stmt = $pdo->prepare($sql . " GROUP BY m.id ORDER BY total_quantity DESC LIMIT 5");
        $stmt->execute(['pref' => $preference]);
    } else {
        $stmt = $pdo->prepare($sql . " GROUP BY m.id ORDER BY total_quantity DESC LIMIT 5");
        $stmt->execute();
    }

    $topItems = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($topItems);

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
