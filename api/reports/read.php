<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include '../config.php';

// Helper to calculate date ranges
$today = new DateTime();
$weekAgo = (new DateTime())->modify('-7 days')->format('Y-m-d');
$monthAgo = (new DateTime())->modify('-30 days')->format('Y-m-d');
$yearAgo = (new DateTime())->modify('-365 days')->format('Y-m-d');

try {
    $report = [];

    // ===============================
    // 1️⃣ TOTAL REVENUE (Approved Orders)
    // ===============================
    $stmt = $pdo->prepare("SELECT SUM(price) AS totalRevenue FROM orders 
        JOIN menu_items ON orders.user_id = menu_items.id 
        WHERE status = 'approved'");
    $stmt->execute();
    $report['totalRevenue'] = (float) ($stmt->fetch()['totalRevenue'] ?? 0);

    // ===============================
    // 2️⃣ WEEKLY REVENUE
    // ===============================
    $stmt = $pdo->prepare("SELECT SUM(price) AS weeklyRevenue FROM orders 
        JOIN menu_items ON orders.user_id = menu_items.id 
        WHERE status = 'approved' AND DATE(created_at) >= ?");
    $stmt->execute([$weekAgo]);
    $report['weeklyRevenue'] = (float) ($stmt->fetch()['weeklyRevenue'] ?? 0);

    // ===============================
    // 3️⃣ MONTHLY REVENUE
    // ===============================
    $stmt = $pdo->prepare("SELECT SUM(price) AS monthlyRevenue FROM orders 
        JOIN menu_items ON orders.user_id = menu_items.id 
        WHERE status = 'approved' AND DATE(created_at) >= ?");
    $stmt->execute([$monthAgo]);
    $report['monthlyRevenue'] = (float) ($stmt->fetch()['monthlyRevenue'] ?? 0);

    // ===============================
    // 4️⃣ YEARLY REVENUE
    // ===============================
    $stmt = $pdo->prepare("SELECT SUM(price) AS yearlyRevenue FROM orders 
        JOIN menu_items ON orders.user_id = menu_items.id 
        WHERE status = 'approved' AND DATE(created_at) >= ?");
    $stmt->execute([$yearAgo]);
    $report['yearlyRevenue'] = (float) ($stmt->fetch()['yearlyRevenue'] ?? 0);

    // ===============================
    // 5️⃣ TOP 2 SELLING ITEMS
    // ===============================
    $stmt = $pdo->query("
        SELECT m.id, m.name, m.image, COUNT(o.id) AS total_sold
        FROM orders o
        JOIN menu_items m ON o.user_id = m.id
        WHERE o.status = 'approved'
        GROUP BY m.id
        ORDER BY total_sold DESC
        LIMIT 2
    ");
    $report['topSelling'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // ===============================
    // 6️⃣ USER COUNTS (Total/Weekly/Monthly/Yearly)
    // ===============================
    // Total Users
    $stmt = $pdo->query("SELECT COUNT(*) AS totalUsers FROM users");
    $report['totalUsers'] = (int) $stmt->fetch()['totalUsers'];

    // Weekly Users (registered in last 30 days)
    $stmt = $pdo->prepare("SELECT COUNT(*) AS weeklyUsers FROM users WHERE DATE(created_at) >= ?");
    $stmt->execute([$monthAgo]);
    $report['weeklyUsers'] = (int) $stmt->fetch()['weeklyUsers'];

    // Monthly Users (registered 30–365 days ago)
    $stmt = $pdo->prepare("SELECT COUNT(*) AS monthlyUsers FROM users WHERE DATE(created_at) < ? AND DATE(created_at) >= ?");
    $stmt->execute([$monthAgo, $yearAgo]);
    $report['monthlyUsers'] = (int) $stmt->fetch()['monthlyUsers'];

    // Yearly Users (registered more than 1 year ago)
    $stmt = $pdo->prepare("SELECT COUNT(*) AS yearlyUsers FROM users WHERE DATE(created_at) < ?");
    $stmt->execute([$yearAgo]);
    $report['yearlyUsers'] = (int) $stmt->fetch()['yearlyUsers'];

    // ===============================
    // 7️⃣ USER LIST
    // ===============================
    $stmt = $pdo->query("SELECT id, name, email, created_at FROM users ORDER BY id DESC");
    $report['users'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($report);

} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>
