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

// Get potential matches based on user preferences
$user_id = $_SESSION['user_id'];

// Get current user's preferences
$query = "SELECT gender, interested_in, age FROM users WHERE id = ?";
$stmt = $db->prepare($query);
$stmt->execute([$user_id]);
$current_user = $stmt->fetch(PDO::FETCH_ASSOC);

// Find potential matches
$query = "SELECT u.*, 
                 (SELECT COUNT(*) FROM likes WHERE liker_id = ? AND liked_id = u.id) as is_liked,
                 (SELECT COUNT(*) FROM favorites WHERE user_id = ? AND favorite_user_id = u.id) as is_favorited
          FROM users u 
          WHERE u.id != ? 
          AND u.gender = ? 
          AND u.interested_in IN (?, 'both')
          AND u.id NOT IN (SELECT liked_id FROM likes WHERE liker_id = ?)
          ORDER BY RAND() 
          LIMIT 12";

$stmt = $db->prepare($query);
$stmt->execute([
    $user_id, 
    $user_id, 
    $user_id, 
    $current_user['interested_in'], 
    $current_user['gender'], 
    $user_id
]);
$potential_matches = $stmt->fetchAll(PDO::FETCH_ASSOC);

$page_title = 'Discover Your Matches';
include 'includes/header.php';
?>

<div class="container mt-4">
    <div class="row">
        <div class="col-12">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h1 class="h3 fw-bold text-primary">
                    <i class="fas fa-search me-2"></i>Discover People
                </h1>
                <div class="btn-group" role="group">
                    <a href="matches.php" class="btn btn-outline-primary">
                        <i class="fas fa-users me-1"></i>My Matches
                    </a>
                    <a href="favorites.php" class="btn btn-outline-warning">
                        <i class="fas fa-star me-1"></i>Favorites
                    </a>
                </div>
            </div>
        </div>
    </div>
    
    <?php if (empty($potential_matches)): ?>
        <div class="row">
            <div class="col-12">
                <div class="card text-center py-5">
                    <div class="card-body">
                        <i class="fas fa-heart-broken fa-4x text-muted mb-4"></i>
                        <h3>No more profiles to show</h3>
                        <p class="text-muted">You've seen all available profiles. Check back later for new members!</p>
                        <a href="matches.php" class="btn btn-primary">
                            <i class="fas fa-users me-2"></i>View Your Matches
                        </a>
                    </div>
                </div>
            </div>
        </div>
    <?php else: ?>
        <div class="row g-4">
            <?php foreach ($potential_matches as $user): ?>
                <div class="col-lg-3 col-md-4 col-sm-6">
                    <div class="profile-card card fade-in-up">
                        <img src="https://images.pexels.com/photos/<?php echo rand(1000000, 9999999); ?>/pexels-photo-<?php echo rand(1000000, 9999999); ?>.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop" 
                             class="card-img-top" alt="<?php echo htmlspecialchars($user['first_name']); ?>">
                        
                        <div class="card-body">
                            <h5 class="card-title mb-1">
                                <?php echo htmlspecialchars($user['first_name'] . ' ' . substr($user['last_name'], 0, 1) . '.'); ?>
                            </h5>
                            <p class="text-muted small mb-2">
                                <i class="fas fa-birthday-cake me-1"></i><?php echo $user['age']; ?> years old
                                <?php if ($user['location']): ?>
                                    <br><i class="fas fa-map-marker-alt me-1"></i><?php echo htmlspecialchars($user['location']); ?>
                                <?php endif; ?>
                            </p>
                            <?php if ($user['bio']): ?>
                                <p class="card-text small text-muted">
                                    <?php echo htmlspecialchars(substr($user['bio'], 0, 80)) . (strlen($user['bio']) > 80 ? '...' : ''); ?>
                                </p>
                            <?php endif; ?>
                        </div>
                        
                        <div class="profile-actions">
                            <button class="btn btn-heart btn-like <?php echo $user['is_liked'] ? 'btn-danger' : 'btn-outline-danger'; ?>" 
                                    data-user-id="<?php echo $user['id']; ?>" title="Like">
                                <i class="<?php echo $user['is_liked'] ? 'fas' : 'far'; ?> fa-heart"></i>
                            </button>
                            <button class="btn btn-star btn-favorite <?php echo $user['is_favorited'] ? 'btn-warning' : 'btn-outline-warning'; ?>" 
                                    data-user-id="<?php echo $user['id']; ?>" title="Add to Favorites">
                                <i class="<?php echo $user['is_favorited'] ? 'fas' : 'far'; ?> fa-star"></i>
                            </button>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
        
        <div class="text-center mt-5">
            <button class="btn btn-outline-primary btn-lg" onclick="location.reload()">
                <i class="fas fa-sync-alt me-2"></i>Load More Profiles
            </button>
        </div>
    <?php endif; ?>
</div>

<?php include 'includes/footer.php'; ?>