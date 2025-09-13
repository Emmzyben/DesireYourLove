<?php
session_start();
require_once '../config/database.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id']) || !isset($_POST['conversation_id']) || !isset($_POST['message'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid request']);
    exit();
}

$database = new Database();
$db = $database->getConnection();
$user_id = $_SESSION['user_id'];
$conversation_id = (int)$_POST['conversation_id'];
$message = trim($_POST['message']);

if (empty($message)) {
    echo json_encode(['success' => false, 'message' => 'Message cannot be empty']);
    exit();
}

// Verify user is part of this conversation
$query = "SELECT user1_id, user2_id FROM conversations WHERE id = ? AND (user1_id = ? OR user2_id = ?)";
$stmt = $db->prepare($query);
$stmt->execute([$conversation_id, $user_id, $user_id]);
$conversation = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$conversation) {
    echo json_encode(['success' => false, 'message' => 'Access denied']);
    exit();
}

// Insert message
$query = "INSERT INTO messages (conversation_id, sender_id, message) VALUES (?, ?, ?)";
$stmt = $db->prepare($query);
$stmt->execute([$conversation_id, $user_id, $message]);

// Update conversation last message time
$query = "UPDATE conversations SET last_message_at = NOW() WHERE id = ?";
$stmt = $db->prepare($query);
$stmt->execute([$conversation_id]);

// Get recipient ID
$recipient_id = ($conversation['user1_id'] == $user_id) ? $conversation['user2_id'] : $conversation['user1_id'];

// Create notification
$query = "INSERT INTO notifications (user_id, type, from_user_id, message) VALUES (?, 'message', ?, 'You have a new message!')";
$stmt = $db->prepare($query);
$stmt->execute([$recipient_id, $user_id]);

// Send email notification if enabled
// Email notification code would go here

echo json_encode(['success' => true]);
?>