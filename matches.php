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

// Get mutual matches
$query = "SELECT u.*, m.created_at as match_date
          FROM matches m
          JOIN users u ON (u.id = m.user1_id OR u.id = m.user2_id)
          WHERE (m.user1_id = ? OR m.user2_id = ?) AND u.id != ?
          ORDER BY m.created_at DESC";

$stmt = $db->prepare($query);
$stmt->execute([$user_id, $user_id, $user_id]);
$matches = $stmt->fetchAll(PDO::FETCH_ASSOC);

$page_title = 'Your Matches';
include 'includes/header.php';
?>

<div class="container mt-4">
    <div class="row">
        <div class="col-12">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h1 class="h3 fw-bold text-primary">
                    <i class="fas fa-users me-2"></i>Your Matches
                    <span class="badge bg-primary ms-2"><?php echo count($matches); ?></span>
                </h1>
                <a href="dashboard.php" class="btn btn-outline-primary">
                    <i class="fas fa-search me-1"></i>Discover More
                </a>
            </div>
        </div>
    </div>
    
    <?php if (empty($matches)): ?>
        <div class="row">
            <div class="col-12">
                <div class="card text-center py-5">
                    <div class="card-body">
                        <i class="fas fa-users fa-4x text-muted mb-4"></i>
                        <h3>No matches yet</h3>
                        <p class="text-muted mb-4">Start liking profiles to find your perfect matches!</p>
                        <a href="dashboard.php" class="btn btn-primary btn-lg">
                            <i class="fas fa-search me-2"></i>Start Browsing
                        </a>
                    </div>
                </div>
            </div>
        </div>
    <?php else: ?>
        <div class="row g-4">
            <?php foreach ($matches as $match): ?>
                <div class="col-lg-4 col-md-6">
                    <div class="card h-100 shadow-sm border-0">
                        <div class="position-relative">
                            <img src="https://images.pexels.com/photos/<?php echo rand(1000000, 9999999); ?>/pexels-photo-<?php echo rand(1000000, 9999999); ?>.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" 
                                 class="card-img-top" style="height: 250px; object-fit: cover;" alt="<?php echo htmlspecialchars($match['first_name']); ?>">
                            <div class="position-absolute top-0 end-0 m-3">
                                <span class="badge bg-success">
                                    <i class="fas fa-heart me-1"></i>Match!
                                </span>
                            </div>
                        </div>
                        
                        <div class="card-body">
                            <h5 class="card-title d-flex justify-content-between align-items-center">
                                <?php echo htmlspecialchars($match['first_name'] . ' ' . substr($match['last_name'], 0, 1) . '.'); ?>
                                <small class="text-muted"><?php echo $match['age']; ?></small>
                            </h5>
                            
                            <?php if ($match['location']): ?>
                                <p class="text-muted small mb-2">
                                    <i class="fas fa-map-marker-alt me-1"></i><?php echo htmlspecialchars($match['location']); ?>
                                </p>
                            <?php endif; ?>
                            
                            <?php if ($match['bio']): ?>
                                <p class="card-text text-muted small">
                                    <?php echo htmlspecialchars(substr($match['bio'], 0, 100)) . (strlen($match['bio']) > 100 ? '...' : ''); ?>
                                </p>
                            <?php endif; ?>
                            
                            <small class="text-muted">
                                <i class="fas fa-clock me-1"></i>Matched <?php echo date('M j, Y', strtotime($match['match_date'])); ?>
                            </small>
                        </div>
                        
                        <div class="card-footer bg-transparent border-0 pt-0">
                            <div class="d-grid gap-2">
                                <a href="chat.php?user=<?php echo $match['id']; ?>" class="btn btn-primary">
                                    <i class="fas fa-comments me-2"></i>Send Message
                                </a>
                                <div class="btn-group" role="group">
                                    <a href="profile.php?id=<?php echo $match['id']; ?>" class="btn btn-outline-secondary">
                                        <i class="fas fa-user me-1"></i>View Profile
                                    </a>
                                    <button class="btn btn-outline-warning btn-favorite" data-user-id="<?php echo $match['id']; ?>">
                                        <i class="far fa-star"></i>
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