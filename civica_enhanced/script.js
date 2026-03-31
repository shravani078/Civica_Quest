// CivicaQuest Main JavaScript File
// Contains common functions used across all pages

// Save progress to localStorage
function saveProgress(game, score) {
    // Get existing progress
    let progress = JSON.parse(localStorage.getItem('civicaProgress') || '{}');
    
    // Update the specific game score
    progress[game] = score;
    
    // Save back to localStorage
    localStorage.setItem('civicaProgress', JSON.stringify(progress));
    
    // Update last played timestamp
    localStorage.setItem('lastPlayed', new Date().toISOString());
    
    // Show success message
    showToast(`Progress saved! ${game}: ${score}/100`);
    
    // Log for debugging (remove in production)
    console.log('Progress saved:', progress);
}

// Show a toast notification
function showToast(message, type = 'success') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-bg-${type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2"></i>
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    // Add to page
    const toastContainer = document.getElementById('toastContainer') || createToastContainer();
    toastContainer.appendChild(toast);
    
    // Initialize and show toast
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    // Remove after hiding
    toast.addEventListener('hidden.bs.toast', () => {
        toast.remove();
    });
}

// Create toast container if it doesn't exist
function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    container.style.zIndex = '1050';
    document.body.appendChild(container);
    return container;
}

// Get user's total score
function getTotalScore() {
    const progress = JSON.parse(localStorage.getItem('civicaProgress') || '{}');
    return (progress.budgetScore || 0) + (progress.quizScore || 0);
}

// Get user's rank based on total score
function getUserRank() {
    const totalScore = getTotalScore();
    
    // Simple rank calculation (in real app, this would compare with other users)
    if (totalScore >= 180) return 1; // Top 1%
    if (totalScore >= 160) return 2; // Top 10%
    if (totalScore >= 140) return 3; // Top 25%
    if (totalScore >= 100) return 4; // Top 50%
    if (totalScore >= 50) return 5;  // Top 75%
    return 6; // Beginner
}

// Export progress data (for sharing or backup)
function exportProgress() {
    const progress = JSON.parse(localStorage.getItem('civicaProgress') || '{}');
    const dataStr = JSON.stringify(progress, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'civicaquest-progress.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showToast('Progress exported successfully!');
}

// Import progress data
function importProgress(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const progress = JSON.parse(e.target.result);
            localStorage.setItem('civicaProgress', JSON.stringify(progress));
            showToast('Progress imported successfully!');
            
            // Reload page to show updated progress
            setTimeout(() => location.reload(), 1000);
        } catch (error) {
            showToast('Error importing progress file', 'danger');
            console.error('Import error:', error);
        }
    };
    reader.readAsText(file);
}

// Reset all progress
function resetAllProgress() {
    if (confirm('Are you sure you want to reset ALL progress? This cannot be undone!')) {
        localStorage.removeItem('civicaProgress');
        localStorage.removeItem('lastPlayed');
        showToast('All progress has been reset', 'warning');
        
        // Reload page after a delay
        setTimeout(() => location.reload(), 1500);
    }
}

// Check if user is playing for the first time
function isFirstTimeUser() {
    return !localStorage.getItem('civicaProgress');
}

// Show welcome tutorial for first-time users
function showWelcomeTutorial() {
    if (isFirstTimeUser()) {
        // Create tutorial modal
        const tutorialHTML = `
            <div class="modal fade" id="welcomeModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title">Welcome to CivicaQuest!</h5>
                        </div>
                        <div class="modal-body">
                            <h4>Learn Civic Education Through Games</h4>
                            <p>CivicaQuest makes learning about government, rights, and civic duties fun and engaging.</p>
                            
                            <div class="row mt-4">
                                <div class="col-md-6">
                                    <div class="card">
                                        <div class="card-body text-center">
                                            <i class="fas fa-money-bill-wave fa-2x text-success mb-2"></i>
                                            <h6>Budget Game</h6>
                                            <p>Play as Mayor and allocate city budget to solve problems</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="card">
                                        <div class="card-body text-center">
                                            <i class="fas fa-gavel fa-2x text-warning mb-2"></i>
                                            <h6>Constitution Quiz</h6>
                                            <p>Test your knowledge of rights, duties, and the Constitution</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="alert alert-info mt-4">
                                <h6><i class="fas fa-info-circle"></i> Your Progress is Saved Locally</h6>
                                <p>All your game progress is saved in your browser. No login required!</p>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">
                                Start Playing!
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add modal to page
        document.body.insertAdjacentHTML('beforeend', tutorialHTML);
        
        // Show modal
        const welcomeModal = new bootstrap.Modal(document.getElementById('welcomeModal'));
        welcomeModal.show();
        
        // Mark as shown
        localStorage.setItem('tutorialShown', 'true');
    }
}

// Track game analytics (simple version)
function trackGameEvent(eventName, eventData = {}) {
    // In a real app, this would send to Google Analytics or similar
    // For now, just log to console
    console.log(`Game Event: ${eventName}`, eventData);
    
    // Save to localStorage for simple analytics
    const analytics = JSON.parse(localStorage.getItem('civicaAnalytics') || '{"events": [], "playCount": 0}');
    analytics.events.push({
        timestamp: new Date().toISOString(),
        event: eventName,
        data: eventData
    });
    
    if (eventName === 'game_started') {
        analytics.playCount = (analytics.playCount || 0) + 1;
    }
    
    localStorage.setItem('civicaAnalytics', JSON.stringify(analytics));
}

// Get play statistics
function getPlayStats() {
    const analytics = JSON.parse(localStorage.getItem('civicaAnalytics') || '{"events": [], "playCount": 0}');
    const progress = JSON.parse(localStorage.getItem('civicaProgress') || '{}');
    
    return {
        totalPlays: analytics.playCount || 0,
        budgetHighScore: progress.budgetScore || 0,
        quizHighScore: progress.quizScore || 0,
        totalScore: (progress.budgetScore || 0) + (progress.quizScore || 0),
        lastPlayed: localStorage.getItem('lastPlayed')
    };
}

// Check for new features or updates
function checkForUpdates() {
    const lastUpdateCheck = localStorage.getItem('lastUpdateCheck');
    const now = new Date();
    
    // Check once per day
    if (!lastUpdateCheck || (now - new Date(lastUpdateCheck)) > (24 * 60 * 60 * 1000)) {
        // In a real app, this would check an API
        // For now, just update the timestamp
        localStorage.setItem('lastUpdateCheck', now.toISOString());
        
        // Show update notification if new features are available
        const currentVersion = localStorage.getItem('appVersion') || '1.0';
        const latestVersion = '1.0'; // In real app, this would come from server
        
        if (currentVersion !== latestVersion) {
            showToast('New features available! Refresh the page.', 'info');
        }
    }
}

// Initialize the app
function initApp() {
    // Check for updates
    checkForUpdates();
    
    // Show welcome tutorial for first-time users
    if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
        setTimeout(showWelcomeTutorial, 1000);
    }
    
    // Track page view
    trackGameEvent('page_view', {
        page: document.title,
        url: window.location.pathname
    });
    
    console.log('CivicaQuest initialized successfully!');
}

// Run initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);