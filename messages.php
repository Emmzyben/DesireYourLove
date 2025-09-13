<?php
session_start();
require_once 'config/database.php';

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit();
}

$database = new Database();
$db = $database->getConnection();
$user_id = $_SESSION['user_id'];

// Get all conversations for the current user
$query = "SELECT c.*, 
                 CASE 
                     WHEN c.user1_id = ? THEN u2.first_name 
                     ELSE u1.first_name 
                 END as other_user_name,
                 CASE 
                     WHEN c.user1_id = ? THEN u2.last_name 
                     ELSE u1.last_name 
                 END as other_user_lastname,
                 CASE 
                     WHEN c.user1_id = ? THEN u2.id 
                     ELSE u1.id 
                 END as other_user_id,
                 CASE 
                     WHEN c.user1_id = ? THEN u2.profile_image 
                     ELSE u1.profile_image 
                 END as other_user_image,
                 (SELECT message FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message,
                 (SELECT created_at FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message_time,
                 (SELECT COUNT(*) FROM messages WHERE conversation_id = c.id AND sender_id != ? AND is_read = 0) as unread_count
          FROM conversations c
          JOIN users u1 ON u1.id = c.user1_id
          JOIN users u2 ON u2.id = c.user2_id
          WHERE c.user1_id = ? OR c.user2_id = ?
          ORDER BY c.last_message_at DESC";

$stmt = $db->prepare($query);
$stmt->execute([$user_id, $user_id, $user_id, $user_id, $user_id, $user_id, $user_id]);
$conversations = $stmt->fetchAll(PDO::FETCH_ASSOC);

$page_title = 'Messages';
include 'includes/header.php';
?>

<div class="container mt-4">
    <div class="row">
        <div class="col-12">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h1 class="h3 fw-bold text-primary">
                    <i class="fas fa-comments me-2"></i>Messages
                </h1>
                <a href="matches.php" class="btn btn-outline-primary">
                    <i class="fas fa-users me-1"></i>View Matches
                </a>
            </div>
        </div>
    </div>
    
    <?php if (empty($conversations)): ?>
        <div class="row">
            <div class="col-12">
                <div class="card text-center py-5">
                    <div class="card-body">
                        <i class="fas fa-comments fa-4x text-muted mb-4"></i>
                        <h3>No conversations yet</h3>
                        <p class="text-muted mb-4">Start chatting with your matches to begin conversations!</p>
                        <a href="matches.php" class="btn btn-primary btn-lg">
                            <i class="fas fa-users me-2"></i>View Your Matches
                        </a>
                    </div>
                </div>
            </div>
        </div>
    <?php else: ?>
        <div class="row">
            <div class="col-12">
                <div class="card shadow-sm border-0">
                    <div class="card-body p-0">
                        <?php foreach ($conversations as $index => $conversation): ?>
                            <div class="conversation-item p-4 border-bottom <?php echo $conversation['unread_count'] > 0 ? 'bg-light' : ''; ?>" 
                                 style="cursor: pointer;" onclick="location.href='chat.php?user=<?php echo $conversation['other_user_id']; ?>'">
                                <div class="d-flex align-items-center">
                                    <div class="position-relative me-3">
                                        <img src="https://images.pexels.com/photos/<?php echo rand(1000000, 9999999); ?>/pexels-photo-<?php echo rand(1000000, 9999999); ?>.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" 
                                             class="rounded-circle" width="60" height="60" alt="<?php echo htmlspecialchars($conversation['other_user_name']); ?>">
                                        <?php if ($conversation['unread_count'] > 0): ?>
                                            <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                                <?php echo $conversation['unread_count']; ?>
                                            </span>
                                        <?php endif; ?>
                                    </div>
                                    
                                    <div class="flex-grow-1">
                                        <div class="d-flex justify-content-between align-items-start">
                                            <h6 class="mb-1 fw-bold">
                                                <?php echo htmlspecialchars($conversation['other_user_name'] . ' ' . substr($conversation['other_user_lastname'], 0, 1) . '.'); ?>
                                            </h6>
                                            <small class="text-muted">
                                                <?php 
                                                if ($conversation['last_message_time']) {
                                                    $time_diff = time() - strtotime($conversation['last_message_time']);
                                                    if ($time_diff < 60) {
                                                        echo 'Just now';
                                                    } elseif ($time_diff < 3600) {
                                                        echo floor($time_diff / 60) . 'm ago';
                                                    } elseif ($time_diff < 86400) {
                                                        echo floor($time_diff / 3600) . 'h ago';
                                                    } else {
                                                        echo date('M j', strtotime($conversation['last_message_time']));
                                                    }
                                                }
                                                ?>
                                            </small>
                                        </div>
                                        
                                        <p class="mb-0 text-muted small">
                                            <?php 
                                            if ($conversation['last_message']) {
                                                echo htmlspecialchars(substr($conversation['last_message'], 0, 60)) . (strlen($conversation['last_message']) > 60 ? '...' : '');
                                            } else {
                                                echo 'Start a conversation...';
                                            }
                                            ?>
                                        </p>
                                    </div>
                                    
                                    <div class="ms-3">
                                        <i class="fas fa-chevron-right text-muted"></i>
                                    </div>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>
            </div>
        </div>
    <?php endif; ?>
</div>

<style>
.conversation-item:hover {
    background-color: #f8f9fa !important;
    transition: background-color 0.2s ease;
}
</style>

<?php include 'includes/footer.php'; ?>