// Hospital - Client Side Script with WebSocket (Shared by all hospitals)
console.log('=== HOSPITAL SYSTEM STARTING ===');
console.log('Hospital ID:', window.HOSPITAL_ID);
console.log('Hospital Name:', window.HOSPITAL_NAME);

// Verify HOSPITAL_ID is set
if (!window.HOSPITAL_ID) {
    console.error('❌ ERROR: window.HOSPITAL_ID is not set!');
    alert('ERROR: Hospital ID not configured properly!');
}

console.log(`🏥 ${window.HOSPITAL_NAME} System Initialized`);

// Initialize Socket.IO connection
const socket = io();

// Get elements
const connectionStatus = document.getElementById('connection-status');
const waitingScreen = document.getElementById('waiting-screen');
const alertScreen = document.getElementById('alert-screen');
const alertTimestamp = document.getElementById('alert-timestamp');

// Track if alert is already shown
let isAlertShown = false;

// WebSocket connection events
socket.on('connect', () => {
    console.log('✅ Connected to server via WebSocket');
    console.log('Socket ID:', socket.id);
    
    // Register this hospital with the server
    socket.emit('register-hospital', window.HOSPITAL_ID);
    
    connectionStatus.textContent = 'Connected to Server';
    connectionStatus.style.color = '#4caf50';
});

socket.on('disconnect', () => {
    console.log('❌ Disconnected from server');
    connectionStatus.textContent = 'Disconnected';
    connectionStatus.style.color = '#d32f2f';
});

socket.on('registration-confirmed', (data) => {
    console.log('✅ Registration confirmed:', data);
    connectionStatus.textContent = 'Monitoring Active';
    connectionStatus.style.color = '#4caf50';
});

// Listen for emergency notifications
socket.on('emergency-notification', (data) => {
    console.log('');
    console.log('🚨🚨🚨 EMERGENCY ALERT RECEIVED! 🚨🚨🚨');
    console.log('Emergency Time:', data.timestamp);
    console.log('Emergency Reason:', data.reason);
    console.log('Selected Hospital:', data.selectedHospital);
    console.log('This Hospital ID:', window.HOSPITAL_ID);
    console.log('✅ This hospital was selected!');
    console.log('');
    
    showEmergencyAlert(data.timestamp, data.reason);
});

// Listen for emergency cancellation
socket.on('emergency-cancelled', () => {
    console.log('');
    console.log('✅ Emergency cancelled by driver');
    console.log('');
    
    if (isAlertShown) {
        hideEmergencyAlert();
    }
});

function showEmergencyAlert(emergencyTime, reason) {
    isAlertShown = true;
    
    // Hide waiting screen
    waitingScreen.style.display = 'none';
    
    // Show alert screen
    alertScreen.classList.add('show');
    
    // Format time
    const time = new Date(emergencyTime);
    alertTimestamp.textContent = time.toLocaleString();
    
    console.log('✅ Emergency alert displayed on screen');
    console.log('Alert cannot be closed by user');
    
    // Play alert sound (optional)
    playAlertSound();
    
    // Prevent page close/refresh
    window.addEventListener('beforeunload', preventClose);
    
    // Prevent keyboard shortcuts
    document.addEventListener('keydown', preventKeyboard);
}

function hideEmergencyAlert() {
    isAlertShown = false;
    
    // Show waiting screen
    waitingScreen.style.display = 'flex';
    
    // Hide alert screen
    alertScreen.classList.remove('show');
    
    connectionStatus.textContent = 'Monitoring Active';
    
    // Remove event listeners
    window.removeEventListener('beforeunload', preventClose);
    document.removeEventListener('keydown', preventKeyboard);
}

function preventClose(event) {
    event.preventDefault();
    event.returnValue = '';
    return '🚨 Emergency alert is active!';
}

function preventKeyboard(event) {
    // Prevent F5, Ctrl+R, Ctrl+W, Escape
    if (event.key === 'F5' || 
        event.key === 'Escape' || 
        (event.ctrlKey && (event.key === 'r' || event.key === 'w' || event.key === 'R' || event.key === 'W'))) {
        event.preventDefault();
        console.log('⚠️ User tried to close/refresh - prevented');
        alert('🚨 EMERGENCY ALERT ACTIVE\nThis page cannot be closed or refreshed!');
    }
}

// Optional: Play alert sound
function playAlertSound() {
    console.log('🔊 Alert sound would play here');
    // You can add an audio element or use Web Audio API
}

console.log(`${window.HOSPITAL_NAME} monitoring started successfully`);
console.log('');
console.log('📋 INSTRUCTIONS:');
console.log('1. Keep this tab open');
console.log('2. Open carDriver.html on another device/PC');
console.log('3. Both devices must connect to the same server');
console.log('4. When emergency is triggered, this hospital will receive alert if selected');
console.log('');
