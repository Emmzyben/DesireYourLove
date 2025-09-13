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

// Get unread message count
$query = "SELECT COUNT(*) as count 
          FROM messages m
          JOIN conversations c ON c.id = m.conversation_id
          WHERE (c.user1_id = ? OR c.user2_id = ?) 
          AND m.sender_id != ? 
          AND m.is_read = 0";

$stmt = $db->prepare($query);
$stmt->execute([$user_id, $user_id, $user_id]);
$result = $stmt->fetch(PDO::FETCH_ASSOC);

echo json_encode([
    'success' => true,
    'count' => $result['count']
]);
?>