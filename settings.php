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

// Get current user data
$query = "SELECT * FROM users WHERE id = ?";
$stmt = $db->prepare($query);
$stmt->execute([$user_id]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

$page_title = 'Settings';
include 'includes/header.php';
?>

<div class="container mt-4">
    <div class="row">
        <div class="col-lg-3">
            <!-- Settings Navigation -->
            <div class="card shadow-sm border-0 mb-4">
                <div class="card-header bg-gradient-primary text-white">
                    <h5 class="mb-0"><i class="fas fa-cog me-2"></i>Settings</h5>
                </div>
                <div class="list-group list-group-flush">
                    <a href="#profile" class="list-group-item list-group-item-action active" data-bs-toggle="pill">
                        <i class="fas fa-user me-2"></i>Profile Settings
                    </a>
                    <a href="#notifications" class="list-group-item list-group-item-action" data-bs-toggle="pill">
                        <i class="fas fa-bell me-2"></i>Notifications
                    </a>
                    <a href="#privacy" class="list-group-item list-group-item-action" data-bs-toggle="pill">
                        <i class="fas fa-shield-alt me-2"></i>Privacy & Safety
                    </a>
                    <a href="#subscription" class="list-group-item list-group-item-action" data-bs-toggle="pill">
                        <i class="fas fa-crown me-2"></i>Subscription
                    </a>
                    <a href="#support" class="list-group-item list-group-item-action" data-bs-toggle="pill">
                        <i class="fas fa-life-ring me-2"></i>Support
                    </a>
                </div>
            </div>
        </div>
        
        <div class="col-lg-9">
            <div class="tab-content">
                <!-- Profile Settings -->
                <div class="tab-pane fade show active" id="profile">
                    <div class="card shadow-sm border-0">
                        <div class="card-header">
                            <h5 class="mb-0">Profile Settings</h5>
                        </div>
                        <div class="card-body">
                            <form method="POST" action="ajax/update_profile.php">
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label for="first_name" class="form-label">First Name</label>
                                        <input type="text" class="form-control" id="first_name" name="first_name" 
                                               value="<?php echo htmlspecialchars($user['first_name']); ?>" required>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label for="last_name" class="form-label">Last Name</label>
                                        <input type="text" class="form-control" id="last_name" name="last_name" 
                                               value="<?php echo htmlspecialchars($user['last_name']); ?>" required>
                                    </div>
                                </div>
                                
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label for="email" class="form-label">Email</label>
                                        <input type="email" class="form-control" id="email" name="email" 
                                               value="<?php echo htmlspecialchars($user['email']); ?>" required>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label for="age" class="form-label">Age</label>
                                        <input type="number" class="form-control" id="age" name="age" 
                                               value="<?php echo $user['age']; ?>" min="18" max="100" required>
                                    </div>
                                </div>
                                
                                <div class="mb-3">
                                    <label for="location" class="form-label">Location</label>
                                    <input type="text" class="form-control" id="location" name="location" 
                                           value="<?php echo htmlspecialchars($user['location']); ?>">
                                </div>
                                
                                <div class="mb-3">
                                    <label for="bio" class="form-label">About Me</label>
                                    <textarea class="form-control" id="bio" name="bio" rows="4"><?php echo htmlspecialchars($user['bio']); ?></textarea>
                                </div>
                                
                                <button type="submit" class="btn btn-primary">
                                    <i class="fas fa-save me-2"></i>Save Changes
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
                
                <!-- Notifications -->
                <div class="tab-pane fade" id="notifications">
                    <div class="card shadow-sm border-0">
                        <div class="card-header">
                            <h5 class="mb-0">Notification Preferences</h5>
                        </div>
                        <div class="card-body">
                            <form method="POST" action="ajax/update_notifications.php">
                                <div class="mb-4">
                                    <h6 class="fw-bold mb-3">Email Notifications</h6>
                                    <div class="form-check mb-2">
                                        <input class="form-check-input" type="checkbox" id="email_matches" name="email_matches" 
                                               <?php echo $user['email_notifications'] ? 'checked' : ''; ?>>
                                        <label class="form-check-label" for="email_matches">
                                            New matches
                                        </label>
                                    </div>
                                    <div class="form-check mb-2">
                                        <input class="form-check-input" type="checkbox" id="email_messages" name="email_messages" 
                                               <?php echo $user['email_notifications'] ? 'checked' : ''; ?>>
                                        <label class="form-check-label" for="email_messages">
                                            New messages
                                        </label>
                                    </div>
                                    <div class="form-check mb-2">
                                        <input class="form-check-input" type="checkbox" id="email_likes" name="email_likes" 
                                               <?php echo $user['email_notifications'] ? 'checked' : ''; ?>>
                                        <label class="form-check-label" for="email_likes">
                                            Profile likes
                                        </label>
                                    </div>
                                </div>
                                
                                <div class="mb-4">
                                    <h6 class="fw-bold mb-3">Push Notifications</h6>
                                    <div class="form-check mb-2">
                                        <input class="form-check-input" type="checkbox" id="push_matches" name="push_matches" 
                                               <?php echo $user['push_notifications'] ? 'checked' : ''; ?>>
                                        <label class="form-check-label" for="push_matches">
                                            New matches
                                        </label>
                                    </div>
                                    <div class="form-check mb-2">
                                        <input class="form-check-input" type="checkbox" id="push_messages" name="push_messages" 
                                               <?php echo $user['push_notifications'] ? 'checked' : ''; ?>>
                                        <label class="form-check-label" for="push_messages">
                                            New messages
                                        </label>
                                    </div>
                                </div>
                                
                                <button type="submit" class="btn btn-primary">
                                    <i class="fas fa-save me-2"></i>Save Preferences
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
                
                <!-- Privacy & Safety -->
                <div class="tab-pane fade" id="privacy">
                    <div class="card shadow-sm border-0">
                        <div class="card-header">
                            <h5 class="mb-0">Privacy & Safety</h5>
                        </div>
                        <div class="card-body">
                            <div class="mb-4">
                                <h6 class="fw-bold mb-3">Profile Visibility</h6>
                                <div class="form-check mb-2">
                                    <input class="form-check-input" type="radio" name="visibility" id="public" value="public" checked>
                                    <label class="form-check-label" for="public">
                                        <strong>Public</strong> - Your profile is visible to all users
                                    </label>
                                </div>
                                <div class="form-check mb-2">
                                    <input class="form-check-input" type="radio" name="visibility" id="matches_only" value="matches">
                                    <label class="form-check-label" for="matches_only">
                                        <strong>Matches Only</strong> - Only your matches can see your full profile
                                    </label>
                                </div>
                            </div>
                            
                            <div class="mb-4">
                                <h6 class="fw-bold mb-3">Blocked Users</h6>
                                <p class="text-muted">You haven't blocked any users yet.</p>
                                <button type="button" class="btn btn-outline-secondary">
                                    <i class="fas fa-ban me-2"></i>Manage Blocked Users
                                </button>
                            </div>
                            
                            <div class="mb-4">
                                <h6 class="fw-bold mb-3">Account Security</h6>
                                <button type="button" class="btn btn-outline-primary me-2" data-bs-toggle="modal" data-bs-target="#changePasswordModal">
                                    <i class="fas fa-key me-2"></i>Change Password
                                </button>
                                <button type="button" class="btn btn-outline-danger">
                                    <i class="fas fa-trash me-2"></i>Delete Account
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Subscription -->
                <div class="tab-pane fade" id="subscription">
                    <div class="card shadow-sm border-0">
                        <div class="card-header">
                            <h5 class="mb-0">Subscription Plans</h5>
                        </div>
                        <div class="card-body">
                            <div class="row g-4">
                                <div class="col-md-4">
                                    <div class="card border-2 border-light">
                                        <div class="card-body text-center">
                                            <h5 class="card-title">Basic</h5>
                                            <h2 class="text-primary">Free</h2>
                                            <ul class="list-unstyled">
                                                <li><i class="fas fa-check text-success me-2"></i>Browse profiles</li>
                                                <li><i class="fas fa-check text-success me-2"></i>Send likes</li>
                                                <li><i class="fas fa-check text-success me-2"></i>Basic matching</li>
                                                <li><i class="fas fa-times text-muted me-2"></i>Unlimited likes</li>
                                                <li><i class="fas fa-times text-muted me-2"></i>See who liked you</li>
                                            </ul>
                                            <button class="btn btn-outline-primary" disabled>Current Plan</button>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="col-md-4">
                                    <div class="card border-2 border-primary">
                                        <div class="card-body text-center">
                                            <div class="badge bg-primary mb-2">Most Popular</div>
                                            <h5 class="card-title">Premium</h5>
                                            <h2 class="text-primary">$9.99<small class="text-muted">/month</small></h2>
                                            <ul class="list-unstyled">
                                                <li><i class="fas fa-check text-success me-2"></i>Everything in Basic</li>
                                                <li><i class="fas fa-check text-success me-2"></i>Unlimited likes</li>
                                                <li><i class="fas fa-check text-success me-2"></i>See who liked you</li>
                                                <li><i class="fas fa-check text-success me-2"></i>Advanced filters</li>
                                                <li><i class="fas fa-check text-success me-2"></i>Read receipts</li>
                                            </ul>
                                            <button class="btn btn-primary">Upgrade Now</button>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="col-md-4">
                                    <div class="card border-2 border-warning">
                                        <div class="card-body text-center">
                                            <h5 class="card-title">VIP</h5>
                                            <h2 class="text-warning">$19.99<small class="text-muted">/month</small></h2>
                                            <ul class="list-unstyled">
                                                <li><i class="fas fa-check text-success me-2"></i>Everything in Premium</li>
                                                <li><i class="fas fa-check text-success me-2"></i>Priority support</li>
                                                <li><i class="fas fa-check text-success me-2"></i>Profile boost</li>
                                                <li><i class="fas fa-check text-success me-2"></i>Exclusive features</li>
                                                <li><i class="fas fa-check text-success me-2"></i>VIP badge</li>
                                            </ul>
                                            <button class="btn btn-warning">Upgrade Now</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Support -->
                <div class="tab-pane fade" id="support">
                    <div class="card shadow-sm border-0">
                        <div class="card-header">
                            <h5 class="mb-0">Support Center</h5>
                        </div>
                        <div class="card-body">
                            <div class="row g-4">
                                <div class="col-md-6">
                                    <h6 class="fw-bold mb-3">Frequently Asked Questions</h6>
                                    <div class="accordion" id="faqAccordion">
                                        <div class="accordion-item">
                                            <h2 class="accordion-header">
                                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
                                                    How do I delete my account?
                                                </button>
                                            </h2>
                                            <div id="faq1" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                                <div class="accordion-body">
                                                    You can delete your account from the Privacy & Safety section in settings.
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div class="accordion-item">
                                            <h2 class="accordion-header">
                                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">
                                                    How does the matching algorithm work?
                                                </button>
                                            </h2>
                                            <div id="faq2" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                                <div class="accordion-body">
                                                    Our algorithm considers your preferences, location, age, and interests to find compatible matches.
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="col-md-6">
                                    <h6 class="fw-bold mb-3">Contact Support</h6>
                                    <form method="POST" action="ajax/submit_support_ticket.php">
                                        <div class="mb-3">
                                            <label for="subject" class="form-label">Subject</label>
                                            <select class="form-select" id="subject" name="subject" required>
                                                <option value="">Select a topic...</option>
                                                <option value="account">Account Issues</option>
                                                <option value="billing">Billing & Subscription</option>
                                                <option value="technical">Technical Problems</option>
                                                <option value="safety">Safety & Privacy</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                        
                                        <div class="mb-3">
                                            <label for="message" class="form-label">Message</label>
                                            <textarea class="form-control" id="message" name="message" rows="4" 
                                                      placeholder="Describe your issue..." required></textarea>
                                        </div>
                                        
                                        <button type="submit" class="btn btn-primary">
                                            <i class="fas fa-paper-plane me-2"></i>Send Message
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Change Password Modal -->
<div class="modal fade" id="changePasswordModal" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Change Password</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form method="POST" action="ajax/change_password.php">
                <div class="modal-body">
                    <div class="mb-3">
                        <label for="current_password" class="form-label">Current Password</label>
                        <input type="password" class="form-control" id="current_password" name="current_password" required>
                    </div>
                    <div class="mb-3">
                        <label for="new_password" class="form-label">New Password</label>
                        <input type="password" class="form-control" id="new_password" name="new_password" required>
                    </div>
                    <div class="mb-3">
                        <label for="confirm_new_password" class="form-label">Confirm New Password</label>
                        <input type="password" class="form-control" id="confirm_new_password" name="confirm_new_password" required>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-primary">Change Password</button>
                </div>
            </form>
        </div>
    </div>
</div>

<?php include 'includes/footer.php'; ?>