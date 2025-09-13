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

$liker_id = $_SESSION['user_id'];
$liked_id = (int)$_POST['user_id'];

// Check if already liked
$query = "SELECT id FROM likes WHERE liker_id = ? AND liked_id = ?";
$stmt = $db->prepare($query);
$stmt->execute([$liker_id, $liked_id]);

if ($stmt->fetch()) {
    echo json_encode(['success' => false, 'message' => 'Already liked']);
    exit();
}

// Add like
$query = "INSERT INTO likes (liker_id, liked_id) VALUES (?, ?)";
$stmt = $db->prepare($query);
$stmt->execute([$liker_id, $liked_id]);

// Check if it's a mutual like (match)
$query = "SELECT id FROM likes WHERE liker_id = ? AND liked_id = ?";
$stmt = $db->prepare($query);
$stmt->execute([$liked_id, $liker_id]);

$is_match = false;
$matched_user = null;

if ($stmt->fetch()) {
    // It's a match! Create match record
    $query = "INSERT IGNORE INTO matches (user1_id, user2_id) VALUES (?, ?)";
    $stmt = $db->prepare($query);
    $stmt->execute([min($liker_id, $liked_id), max($liker_id, $liked_id)]);
    
    // Get matched user info
    $query = "SELECT id, first_name, profile_image FROM users WHERE id = ?";
    $stmt = $db->prepare($query);
    $stmt->execute([$liked_id]);
    $matched_user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    $is_match = true;
    
    // Create notifications for both users
    $query = "INSERT INTO notifications (user_id, type, from_user_id, message) VALUES (?, 'match', ?, 'You have a new match!')";
    $stmt = $db->prepare($query);
    $stmt->execute([$liked_id, $liker_id]);
    $stmt->execute([$liker_id, $liked_id]);
    
    // Send email notifications if enabled
    // Email notification code would go here
}

// Create like notification
$query = "INSERT INTO notifications (user_id, type, from_user_id, message) VALUES (?, 'like', ?, 'Someone liked your profile!')";
$stmt = $db->prepare($query);
$stmt->execute([$liked_id, $liker_id]);

echo json_encode([
    'success' => true,
    'is_match' => $is_match,
    'matched_user' => $matched_user
]);
?>