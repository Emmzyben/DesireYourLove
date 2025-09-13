<?php
session_start();
require_once 'config/database.php';

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit();
}

$user_id = $_SESSION['user_id'];
$other_user_id = isset($_GET['user']) ? (int)$_GET['user'] : 0;

if (!$other_user_id) {
    header('Location: messages.php');
    exit();
}

$database = new Database();
$db = $database->getConnection();

// Get other user's info
$query = "SELECT * FROM users WHERE id = ?";
$stmt = $db->prepare($query);
$stmt->execute([$other_user_id]);
$other_user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$other_user) {
    header('Location: messages.php');
    exit();
}

// Check if users are matched
$query = "SELECT id FROM matches WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)";
$stmt = $db->prepare($query);
$stmt->execute([$user_id, $other_user_id, $other_user_id, $user_id]);
$is_matched = $stmt->fetch();

if (!$is_matched) {
    header('Location: matches.php');
    exit();
}

// Get or create conversation
$query = "SELECT id FROM conversations WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)";
$stmt = $db->prepare($query);
$stmt->execute([$user_id, $other_user_id, $other_user_id, $user_id]);
$conversation = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$conversation) {
    // Create new conversation
    $query = "INSERT INTO conversations (user1_id, user2_id) VALUES (?, ?)";
    $stmt = $db->prepare($query);
    $stmt->execute([$user_id, $other_user_id]);
    $conversation_id = $db->lastInsertId();
} else {
    $conversation_id = $conversation['id'];
}

// Mark messages as read
$query = "UPDATE messages SET is_read = 1 WHERE conversation_id = ? AND sender_id = ?";
$stmt = $db->prepare($query);
$stmt->execute([$conversation_id, $other_user_id]);

$page_title = 'Chat with ' . $other_user['first_name'];
include 'includes/header.php';
?>

<div class="container mt-4">
    <div class="row justify-content-center">
        <div class="col-lg-8">
            <!-- Chat Header -->
            <div class="card shadow-sm border-0 mb-3">
                <div class="card-body py-3">
                    <div class="d-flex align-items-center">
                        <a href="messages.php" class="btn btn-outline-secondary btn-sm me-3">
                            <i class="fas fa-arrow-left"></i>
                        </a>
                        <img src="https://images.pexels.com/photos/<?php echo rand(1000000, 9999999); ?>/pexels-photo-<?php echo rand(1000000, 9999999); ?>.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" 
                             class="rounded-circle me-3" width="50" height="50" alt="<?php echo htmlspecialchars($other_user['first_name']); ?>">
                        <div class="flex-grow-1">
                            <h5 class="mb-0"><?php echo htmlspecialchars($other_user['first_name'] . ' ' . substr($other_user['last_name'], 0, 1) . '.'); ?></h5>
                            <small class="text-muted">
                                <i class="fas fa-circle text-success me-1" style="font-size: 8px;"></i>Online
                            </small>
                        </div>
                        <div class="dropdown">
                            <button class="btn btn-outline-secondary btn-sm" type="button" data-bs-toggle="dropdown">
                                <i class="fas fa-ellipsis-v"></i>
                            </button>
                            <ul class="dropdown-menu dropdown-menu-end">
                                <li><a class="dropdown-item" href="profile.php?id=<?php echo $other_user['id']; ?>">
                                    <i class="fas fa-user me-2"></i>View Profile
                                </a></li>
                                <li><a class="dropdown-item" href="#" onclick="reportUser(<?php echo $other_user['id']; ?>)">
                                    <i class="fas fa-flag me-2"></i>Report User
                                </a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Chat Messages -->
            <div class="card shadow-sm border-0">
                <div class="card-body p-0">
                    <div class="chat-container" id="chat-messages" 
                         data-conversation-id="<?php echo $conversation_id; ?>" 
                         data-current-user-id="<?php echo $user_id; ?>">
                        <!-- Messages will be loaded here via AJAX -->
                    </div>
                </div>
                
                <!-- Message Input -->
                <div class="card-footer bg-light border-0">
                    <form id="send-message-form" class="d-flex gap-2">
                        <input type="text" class="form-control" id="message-input" 
                               placeholder="Type your message..." required>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
function reportUser(userId) {
    if (confirm('Are you sure you want to report this user?')) {
        // Handle user reporting
        alert('User reported. Thank you for helping keep our community safe.');
    }
}
</script>

<?php include 'includes/footer.php'; ?>