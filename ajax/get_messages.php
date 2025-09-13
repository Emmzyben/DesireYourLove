<?php
session_start();
require_once '../config/database.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id']) || !isset($_GET['conversation_id'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid request']);
    exit();
}

$database = new Database();
$db = $database->getConnection();
$user_id = $_SESSION['user_id'];
$conversation_id = (int)$_GET['conversation_id'];

// Verify user is part of this conversation
$query = "SELECT id FROM conversations WHERE id = ? AND (user1_id = ? OR user2_id = ?)";
$stmt = $db->prepare($query);
$stmt->execute([$conversation_id, $user_id, $user_id]);

if (!$stmt->fetch()) {
    echo json_encode(['success' => false, 'message' => 'Access denied']);
    exit();
}

// Get messages
$query = "SELECT m.*, u.first_name 
          FROM messages m
          JOIN users u ON u.id = m.sender_id
          WHERE m.conversation_id = ?
          ORDER BY m.created_at ASC";

$stmt = $db->prepare($query);
$stmt->execute([$conversation_id]);
$messages = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Format timestamps
foreach ($messages as &$message) {
    $message['created_at'] = date('g:i A', strtotime($message['created_at']));
}

echo json_encode([
    'success' => true,
    'messages' => $messages
]);
?>