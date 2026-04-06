// Car Driver - Client Side Script with WebSocket
console.log('🚗 Car Driver System Initialized');

// Clear any previous emergency on page load
localStorage.removeItem('emergencyActive');
localStorage.removeItem('emergencyTime');
localStorage.removeItem('emergencyReason');
localStorage.removeItem('selectedHospital');
console.log('Previous emergency data cleared');

// Get elements first
const connectionStatus = document.getElementById('connection-status');
const statusText = document.getElementById('status-text');
const timerInfo = document.getElementById('timer-info');
const questionPopup = document.getElementById('question-popup');
const emergencyConfirmed = document.getElementById('emergency-confirmed');
const yesButton = document.getElementById('yes-button');
const noButton = document.getElementById('no-button');
const closeEmergencyBtn = document.getElementById('close-emergency');
const countdownElement = document.getElementById('countdown');
const hospitalInfo = document.getElementById('hospital-info');

// Initialize Socket.IO connection
const socket = io();

// Connection status
socket.on('connect', () => {
    console.log('✅ Connected to server via WebSocket');
    console.log('Socket ID:', socket.id);
    
    // Register as car driver
    socket.emit('register-driver');
    
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
});

// Timer variables
let timeLeft = 60;
let timerInterval;

// Hide popup initially
questionPopup.style.display = 'none';

// Show popup after 3 seconds delay
console.log('Waiting 3 seconds before showing popup...');
statusText.textContent = 'Monitoring...';
timerInfo.textContent = '';

setTimeout(() => {
    questionPopup.style.display = 'flex';
    console.log('Emergency question popup displayed');
    statusText.textContent = 'Accident detected! Waiting for response...';
    statusText.style.color = '#d32f2f';
    startCountdown();
}, 3000); // 3 seconds delay

// Start 60-second countdown
function startCountdown() {
    timeLeft = 60;
    countdownElement.textContent = timeLeft;
    countdownElement.style.color = '#856404';
    countdownElement.style.fontSize = '1.5em';
    
    console.log('⏱️ Countdown started: 60 seconds');
    
    timerInterval = setInterval(() => {
        timeLeft--;
        countdownElement.textContent = timeLeft;
        
        // Change color when time is low
        if (timeLeft <= 10) {
            countdownElement.style.color = '#d32f2f';
            countdownElement.style.fontSize = '2em';
            console.log(`⚠️ Warning: ${timeLeft} seconds remaining`);
        }
        
        // Timer expired - auto-confirm emergency
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            console.log('⏰ TIMER EXPIRED - No response received');
            console.log('🚨 Auto-confirming emergency...');
            confirmEmergency('Timer expired - No response');
        }
    }, 1000);
}

// Confirm emergency (YES or timeout)
function confirmEmergency(reason) {
    clearInterval(timerInterval);
    questionPopup.style.display = 'none';
    emergencyConfirmed.classList.add('show');
    
    console.log('🚨 TRIGGERING EMERGENCY 🚨');
    console.log('Reason:', reason);
    
    // Randomly select one hospital (1, 2, or 3)
    const randomNumber = Math.floor(Math.random() * 3) + 1;
    const selectedHospital = `hospital${randomNumber}`;
    
    console.log('🎲 Random number generated:', randomNumber);
    console.log('🏥 Selected hospital:', selectedHospital);
    
    const now = new Date();
    const timestamp = now.toISOString();
    
    // Emit emergency alert via WebSocket to selected hospital
    socket.emit('emergency-alert', {
        reason: reason,
        selectedHospital: selectedHospital,
        timestamp: timestamp
    });
    
    console.log('✅ Emergency alert sent via WebSocket');
    console.log(`🔔 ONLY ${selectedHospital.toUpperCase()} will receive this alert!`);
    
    statusText.textContent = `Emergency confirmed! Notifying ${selectedHospital}...`;
    statusText.style.color = '#d32f2f';
    hospitalInfo.textContent = `${selectedHospital.toUpperCase()} has been notified!`;
    
    // Send SMS via Twilio
    sendEmergencySMS(reason, selectedHospital, timestamp);
}

// Function to send SMS via backend API
async function sendEmergencySMS(reason, selectedHospital, timestamp) {
    console.log('📱 Attempting to send SMS notification...');
    
    try {
        console.log('🌐 Sending request to server...');
        const response = await fetch('/api/send-emergency-sms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                reason: reason,
                selectedHospital: selectedHospital,
                timestamp: timestamp
            })
        });
        
        console.log('📡 Response received:', response.status, response.statusText);
        
        const data = await response.json();
        console.log('📦 Response data:', data);
        
        if (data.success) {
            console.log('✅ SMS sent successfully!');
            console.log('  Message SID:', data.messageSid);
            console.log('  Status:', data.status);
            hospitalInfo.textContent += ' ✅ SMS sent!';
        } else {
            console.error('❌ Failed to send SMS:', data.message);
            hospitalInfo.textContent += ' ❌ SMS failed';
        }
    } catch (error) {
        console.error('❌ Error sending SMS:', error);
        hospitalInfo.textContent += ' ❌ SMS error';
    }
}

// Cancel emergency (NO)
function cancelEmergency() {
    clearInterval(timerInterval);
    questionPopup.style.display = 'none';
    
    console.log('✅ Emergency cancelled by user');
    
    // Emit cancellation via WebSocket
    socket.emit('cancel-emergency');
    
    statusText.textContent = 'Emergency cancelled - System ready';
    statusText.style.color = '#4caf50';
}

// Event Listeners
yesButton.addEventListener('click', () => {
    console.log('👤 User clicked YES button');
    confirmEmergency('User requested emergency assistance');
});

noButton.addEventListener('click', () => {
    console.log('👤 User clicked NO button');
    cancelEmergency();
});

closeEmergencyBtn.addEventListener('click', () => {
    emergencyConfirmed.classList.remove('show');
    statusText.textContent = 'System ready - Monitoring for accidents';
    statusText.style.color = '#333';
    console.log('ℹ️ Emergency screen closed');
});

// Keyboard shortcuts (Y for YES, N for NO)
document.addEventListener('keydown', (event) => {
    if (questionPopup.style.display === 'flex') {
        if (event.key === 'y' || event.key === 'Y') {
            console.log('⌨️ User pressed Y key');
            confirmEmergency('User pressed Y key for emergency');
        } else if (event.key === 'n' || event.key === 'N') {
            console.log('⌨️ User pressed N key');
            cancelEmergency();
        }
    }
});

console.log('✅ Car Driver system ready');
console.log('ℹ️ Popup will appear automatically in 3 seconds');
