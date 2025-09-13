<?php
session_start();
require_once '../config/database.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id']) || !isset($_POST['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid request']);
    exit();
}

$database = new Database();
$db = $database->getConnection();

$user_id = $_SESSION['user_id'];
$favorite_user_id = (int)$_POST['user_id'];

// Check if already favorited
$query = "SELECT id FROM favorites WHERE user_id = ? AND favorite_user_id = ?";
$stmt = $db->prepare($query);
$stmt->execute([$user_id, $favorite_user_id]);

if ($stmt->fetch()) {
    // Remove from favorites
    $query = "DELETE FROM favorites WHERE user_id = ? AND favorite_user_id = ?";
    $stmt = $db->prepare($query);
    $stmt->execute([$user_id, $favorite_user_id]);
    
    echo json_encode(['success' => true, 'action' => 'removed']);
} else {
    // Add to favorites
    $query = "INSERT INTO favorites (user_id, favorite_user_id) VALUES (?, ?)";
    $stmt = $db->prepare($query);
    $stmt->execute([$user_id, $favorite_user_id]);
    
    // Create notification
    $query = "INSERT INTO notifications (user_id, type, from_user_id, message) VALUES (?, 'favorite', ?, 'Someone added you to their favorites!')";
    $stmt = $db->prepare($query);
    $stmt->execute([$favorite_user_id, $user_id]);
    
    echo json_encode(['success' => true, 'action' => 'added']);
}
?>