$(document).ready(function() {
    // Load notifications on page load
    loadNotifications();
    loadUnreadMessageCount();
    
    // Refresh notifications every 30 seconds
    setInterval(function() {
        loadNotifications();
        loadUnreadMessageCount();
    }, 30000);
    
    // Like button functionality
    $(document).on('click', '.btn-like', function() {
        const userId = $(this).data('user-id');
        const button = $(this);
        
        $.ajax({
            url: 'ajax/like_user.php',
            method: 'POST',
            data: { user_id: userId },
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    button.removeClass('btn-outline-danger').addClass('btn-danger');
                    button.find('i').removeClass('far').addClass('fas');
                    
                    if (response.is_match) {
                        showMatchModal(response.matched_user);
                    }
                    
                    showToast('Profile liked!', 'success');
                } else {
                    showToast(response.message, 'error');
                }
            }
        });
    });
    
    // Favorite button functionality
    $(document).on('click', '.btn-favorite', function() {
        const userId = $(this).data('user-id');
        const button = $(this);
        
        $.ajax({
            url: 'ajax/favorite_user.php',
            method: 'POST',
            data: { user_id: userId },
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    if (response.action === 'added') {
                        button.removeClass('btn-outline-warning').addClass('btn-warning');
                        button.find('i').removeClass('far').addClass('fas');
                        showToast('Added to favorites!', 'success');
                    } else {
                        button.removeClass('btn-warning').addClass('btn-outline-warning');
                        button.find('i').removeClass('fas').addClass('far');
                        showToast('Removed from favorites!', 'info');
                    }
                }
            }
        });
    });
    
    // Chat functionality
    if ($('#chat-messages').length) {
        const conversationId = $('#chat-messages').data('conversation-id');
        loadMessages(conversationId);
        
        // Auto-refresh messages every 3 seconds
        setInterval(function() {
            loadMessages(conversationId);
        }, 3000);
        
        // Send message
        $('#send-message-form').on('submit', function(e) {
            e.preventDefault();
            const message = $('#message-input').val().trim();
            
            if (message) {
                $.ajax({
                    url: 'ajax/send_message.php',
                    method: 'POST',
                    data: {
                        conversation_id: conversationId,
                        message: message
                    },
                    dataType: 'json',
                    success: function(response) {
                        if (response.success) {
                            $('#message-input').val('');
                            loadMessages(conversationId);
                        }
                    }
                });
            }
        });
    }
});

function loadNotifications() {
    $.ajax({
        url: 'ajax/get_notifications.php',
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                updateNotificationDropdown(response.notifications);
                $('#notification-count').text(response.unread_count);
                
                if (response.unread_count > 0) {
                    $('#notification-count').show();
                } else {
                    $('#notification-count').hide();
                }
            }
        }
    });
}

function loadUnreadMessageCount() {
    $.ajax({
        url: 'ajax/get_unread_messages.php',
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                $('#unread-count').text(response.count);
                
                if (response.count > 0) {
                    $('#unread-count').show();
                } else {
                    $('#unread-count').hide();
                }
            }
        }
    });
}

function updateNotificationDropdown(notifications) {
    const dropdown = $('#notifications-list');
    dropdown.empty();
    
    dropdown.append('<li><h6 class="dropdown-header">Notifications</h6></li>');
    dropdown.append('<li><hr class="dropdown-divider"></li>');
    
    if (notifications.length === 0) {
        dropdown.append('<li><a class="dropdown-item text-muted" href="#">No new notifications</a></li>');
    } else {
        notifications.forEach(function(notification) {
            const item = `
                <li>
                    <a class="dropdown-item ${!notification.is_read ? 'fw-bold' : ''}" href="#" 
                       onclick="markNotificationRead(${notification.id})">
                        <i class="fas fa-${getNotificationIcon(notification.type)} me-2"></i>
                        ${notification.message}
                        <small class="text-muted d-block">${notification.created_at}</small>
                    </a>
                </li>
            `;
            dropdown.append(item);
        });
    }
    
    dropdown.append('<li><hr class="dropdown-divider"></li>');
    dropdown.append('<li><a class="dropdown-item text-center" href="notifications.php">View All</a></li>');
}

function getNotificationIcon(type) {
    switch (type) {
        case 'like': return 'heart';
        case 'match': return 'users';
        case 'message': return 'comment';
        case 'favorite': return 'star';
        default: return 'bell';
    }
}

function markNotificationRead(notificationId) {
    $.ajax({
        url: 'ajax/mark_notification_read.php',
        method: 'POST',
        data: { notification_id: notificationId },
        success: function() {
            loadNotifications();
        }
    });
}

function loadMessages(conversationId) {
    $.ajax({
        url: 'ajax/get_messages.php',
        method: 'GET',
        data: { conversation_id: conversationId },
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                updateChatMessages(response.messages);
            }
        }
    });
}

function updateChatMessages(messages) {
    const container = $('#chat-messages');
    const currentUserId = container.data('current-user-id');
    
    container.empty();
    
    messages.forEach(function(message) {
        const messageClass = message.sender_id == currentUserId ? 'sent' : 'received';
        const messageHtml = `
            <div class="message ${messageClass}">
                <div class="message-bubble">
                    ${message.message}
                    <div class="message-time">${message.created_at}</div>
                </div>
            </div>
        `;
        container.append(messageHtml);
    });
    
    // Scroll to bottom
    container.scrollTop(container[0].scrollHeight);
}

function showMatchModal(user) {
    const modal = `
        <div class="modal fade" id="matchModal" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-body text-center p-5">
                        <h2 class="text-primary mb-4">🎉 It's a Match! 🎉</h2>
                        <div class="row align-items-center">
                            <div class="col-5">
                                <img src="assets/images/${user.profile_image}" class="img-fluid rounded-circle" alt="Your photo">
                            </div>
                            <div class="col-2">
                                <i class="fas fa-heart text-danger fa-3x"></i>
                            </div>
                            <div class="col-5">
                                <img src="assets/images/${user.profile_image}" class="img-fluid rounded-circle" alt="${user.first_name}">
                            </div>
                        </div>
                        <h4 class="mt-4">You and ${user.first_name} liked each other!</h4>
                        <p class="text-muted">Start a conversation now</p>
                        <div class="mt-4">
                            <a href="chat.php?user=${user.id}" class="btn btn-primary me-2">Send Message</a>
                            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Keep Browsing</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    $('body').append(modal);
    $('#matchModal').modal('show');
    
    $('#matchModal').on('hidden.bs.modal', function() {
        $(this).remove();
    });
}

function showToast(message, type) {
    const toastHtml = `
        <div class="toast align-items-center text-white bg-${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'info'} border-0" role="alert">
            <div class="d-flex">
                <div class="toast-body">${message}</div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
    `;
    
    if (!$('#toast-container').length) {
        $('body').append('<div id="toast-container" class="toast-container position-fixed bottom-0 end-0 p-3"></div>');
    }
    
    $('#toast-container').append(toastHtml);
    $('.toast').last().toast('show');
}