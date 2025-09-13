<?php
session_start();
require_once '../config/database.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Not logged in']);
    exit();
}

$database = new Database();
$db = $database->getConnection();
$user_id = $_SESSION['user_id'];

// Get recent notifications
$query = "SELECT n.*, u.first_name, u.last_name 
          FROM notifications n
          JOIN users u ON u.id = n.from_user_id
          WHERE n.user_id = ?
          ORDER BY n.created_at DESC
          LIMIT 10";

$stmt = $db->prepare($query);
$stmt->execute([$user_id]);
$notifications = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Get unread count
$query = "SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0";
$stmt = $db->prepare($query);
$stmt->execute([$user_id]);
$unread_count = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

// Format notifications
foreach ($notifications as &$notification) {
    $time_diff = time() - strtotime($notification['created_at']);
    if ($time_diff < 60) {
        $notification['created_at'] = 'Just now';
    } elseif ($time_diff < 3600) {
        $notification['created_at'] = floor($time_diff / 60) . 'm ago';
    } elseif ($time_diff < 86400) {
        $notification['created_at'] = floor($time_diff / 3600) . 'h ago';
    } else {
        $notification['created_at'] = date('M j', strtotime($notification['created_at']));
    }
}

echo json_encode([
    'success' => true,
    'notifications' => $notifications,
    'unread_count' => $unread_count
]);
?>