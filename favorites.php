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

// Get user's favorites
$query = "SELECT u.*, f.created_at as favorited_date,
                 (SELECT COUNT(*) FROM likes WHERE liker_id = ? AND liked_id = u.id) as is_liked,
                 (SELECT COUNT(*) FROM matches WHERE (user1_id = ? AND user2_id = u.id) OR (user1_id = u.id AND user2_id = ?)) as is_match
          FROM favorites f
          JOIN users u ON u.id = f.favorite_user_id
          WHERE f.user_id = ?
          ORDER BY f.created_at DESC";

$stmt = $db->prepare($query);
$stmt->execute([$user_id, $user_id, $user_id, $user_id]);
$favorites = $stmt->fetchAll(PDO::FETCH_ASSOC);

$page_title = 'Your Favorites';
include 'includes/header.php';
?>

<div class="container mt-4">
    <div class="row">
        <div class="col-12">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h1 class="h3 fw-bold text-warning">
                    <i class="fas fa-star me-2"></i>Your Favorites
                    <span class="badge bg-warning text-dark ms-2"><?php echo count($favorites); ?></span>
                </h1>
                <a href="dashboard.php" class="btn btn-outline-primary">
                    <i class="fas fa-search me-1"></i>Discover More
                </a>
            </div>
        </div>
    </div>
    
    <?php if (empty($favorites)): ?>
        <div class="row">
            <div class="col-12">
                <div class="card text-center py-5">
                    <div class="card-body">
                        <i class="fas fa-star fa-4x text-muted mb-4"></i>
                        <h3>No favorites yet</h3>
                        <p class="text-muted mb-4">Add profiles to your favorites to keep track of people you're interested in!</p>
                        <a href="dashboard.php" class="btn btn-warning btn-lg">
                            <i class="fas fa-search me-2"></i>Start Browsing
                        </a>
                    </div>
                </div>
            </div>
        </div>
    <?php else: ?>
        <div class="row g-4">
            <?php foreach ($favorites as $favorite): ?>
                <div class="col-lg-4 col-md-6">
                    <div class="card h-100 shadow-sm border-0">
                        <div class="position-relative">
                            <img src="https://images.pexels.com/photos/<?php echo rand(1000000, 9999999); ?>/pexels-photo-<?php echo rand(1000000, 9999999); ?>.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" 
                                 class="card-img-top" style="height: 250px; object-fit: cover;" alt="<?php echo htmlspecialchars($favorite['first_name']); ?>">
                            <div class="position-absolute top-0 end-0 m-3">
                                <span class="badge bg-warning text-dark">
                                    <i class="fas fa-star me-1"></i>Favorite
                                </span>
                                <?php if ($favorite['is_match']): ?>
                                    <span class="badge bg-success ms-1">
                                        <i class="fas fa-heart me-1"></i>Match!
                                    </span>
                                <?php endif; ?>
                            </div>
                        </div>
                        
                        <div class="card-body">
                            <h5 class="card-title d-flex justify-content-between align-items-center">
                                <?php echo htmlspecialchars($favorite['first_name'] . ' ' . substr($favorite['last_name'], 0, 1) . '.'); ?>
                                <small class="text-muted"><?php echo $favorite['age']; ?></small>
                            </h5>
                            
                            <?php if ($favorite['location']): ?>
                                <p class="text-muted small mb-2">
                                    <i class="fas fa-map-marker-alt me-1"></i><?php echo htmlspecialchars($favorite['location']); ?>
                                </p>
                            <?php endif; ?>
                            
                            <?php if ($favorite['bio']): ?>
                                <p class="card-text text-muted small">
                                    <?php echo htmlspecialchars(substr($favorite['bio'], 0, 100)) . (strlen($favorite['bio']) > 100 ? '...' : ''); ?>
                                </p>
                            <?php endif; ?>
                            
                            <small class="text-muted">
                                <i class="fas fa-clock me-1"></i>Added <?php echo date('M j, Y', strtotime($favorite['favorited_date'])); ?>
                            </small>
                        </div>
                        
                        <div class="card-footer bg-transparent border-0 pt-0">
                            <div class="d-grid gap-2">
                                <?php if ($favorite['is_match']): ?>
                                    <a href="chat.php?user=<?php echo $favorite['id']; ?>" class="btn btn-success">
                                        <i class="fas fa-comments me-2"></i>Send Message
                                    </a>
                                <?php endif; ?>
                                
                                <div class="btn-group" role="group">
                                    <button class="btn btn-heart btn-like <?php echo $favorite['is_liked'] ? 'btn-danger' : 'btn-outline-danger'; ?>" 
                                            data-user-id="<?php echo $favorite['id']; ?>">
                                        <i class="<?php echo $favorite['is_liked'] ? 'fas' : 'far'; ?> fa-heart"></i>
                                    </button>
                                    <a href="profile.php?id=<?php echo $favorite['id']; ?>" class="btn btn-outline-secondary">
                                        <i class="fas fa-user me-1"></i>View Profile
                                    </a>
                                    <button class="btn btn-warning btn-favorite" data-user-id="<?php echo $favorite['id']; ?>">
                                        <i class="fas fa-star"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>
</div>

<?php include 'includes/footer.php'; ?>