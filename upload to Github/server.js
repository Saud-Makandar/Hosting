// Emergency Alert System - Backend Server with Twilio SMS and WebSocket
const express = require('express');
const cors = require('cors');
const twilio = require('twilio');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
const PORT = process.env.PORT || 3000;

// Twilio Configuration - UPDATED WITH CORRECT CREDENTIALS
const TWILIO_ACCOUNT_SID = 'ACa23188300e6a0b81873288d349b04ffc';
const TWILIO_AUTH_TOKEN = '60390fdf0f64d1a1a57b56adb7b0835e';
const TWILIO_PHONE_NUMBER = '+16415416100';
const YOUR_PHONE_NUMBER = '+919987798702'; // Your verified number

console.log('🔧 Initializing Twilio with credentials:');
console.log('  Account SID:', TWILIO_ACCOUNT_SID);
console.log('  Auth Token:', TWILIO_AUTH_TOKEN.substring(0, 8) + '...');
console.log('  From Number:', TWILIO_PHONE_NUMBER);
console.log('  To Number:', YOUR_PHONE_NUMBER);

// Initialize Twilio client
const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// Test Twilio connection on startup
twilioClient.api.accounts(TWILIO_ACCOUNT_SID)
    .fetch()
    .then(account => {
        console.log('✅ Twilio account verified:', account.friendlyName);
        console.log('   Status:', account.status);
    })
    .catch(error => {
        console.error('❌ Twilio authentication failed:', error.message);
    });

// Middleware
app.use(cors());
app.use(express.json());

// Serve Socket.IO client library explicitly (fix for Socket.IO 4.x)
app.get('/socket.io/socket.io.js', (req, res) => {
    const socketIOPath = path.join(__dirname, 'node_modules', 'socket.io', 'client-dist', 'socket.io.js');
    res.sendFile(socketIOPath);
});

app.get('/socket.io/socket.io.js.map', (req, res) => {
    const socketIOMapPath = path.join(__dirname, 'node_modules', 'socket.io', 'client-dist', 'socket.io.js.map');
    res.sendFile(socketIOMapPath);
});

app.use(express.static('public')); // Serve public folder
app.use(express.static('.')); // Serve root folder for site1/site2

// Root route - serve index page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// WebSocket connection handling
io.on('connection', (socket) => {
    console.log('');
    console.log('🔌 New client connected:', socket.id);
    
    // Listen for hospital registration
    socket.on('register-hospital', (hospitalId) => {
        socket.join(hospitalId);
        console.log(`🏥 ${hospitalId} registered and joined room`);
        socket.emit('registration-confirmed', { hospitalId, status: 'connected' });
    });
    
    // Listen for car driver registration
    socket.on('register-driver', () => {
        socket.join('car-driver');
        console.log('🚗 Car driver registered');
        socket.emit('registration-confirmed', { role: 'driver', status: 'connected' });
    });
    
    // Listen for emergency alerts from car driver
    socket.on('emergency-alert', (data) => {
        console.log('');
        console.log('🚨 EMERGENCY ALERT RECEIVED');
        console.log('  Reason:', data.reason);
        console.log('  Selected Hospital:', data.selectedHospital);
        console.log('  Timestamp:', data.timestamp);
        
        // Broadcast to the selected hospital ONLY
        io.to(data.selectedHospital).emit('emergency-notification', {
            reason: data.reason,
            timestamp: data.timestamp,
            selectedHospital: data.selectedHospital
        });
        
        console.log(`  ✅ Alert sent to ${data.selectedHospital} room`);
        console.log('');
    });
    
    // Listen for emergency cancellation
    socket.on('cancel-emergency', () => {
        console.log('');
        console.log('✅ Emergency cancelled by driver');
        // Broadcast to all hospitals
        io.emit('emergency-cancelled');
        console.log('  ✅ Cancellation broadcast to all hospitals');
        console.log('');
    });
    
    socket.on('disconnect', () => {
        console.log('🔌 Client disconnected:', socket.id);
    });
});


// API endpoint to send SMS
app.post('/api/send-emergency-sms', async (req, res) => {
    try {
        const { reason, selectedHospital, timestamp } = req.body;
        
        console.log('');
        console.log('='.repeat(60));
        console.log('📱 NEW SMS REQUEST');
        console.log('='.repeat(60));
        console.log('Request Details:');
        console.log('  Reason:', reason);
        console.log('  Selected Hospital:', selectedHospital);
        console.log('  Timestamp:', timestamp);
        console.log('');
        console.log('Twilio Configuration:');
        console.log('  From:', TWILIO_PHONE_NUMBER);
        console.log('  To:', YOUR_PHONE_NUMBER);
        console.log('');
        
        // Format the SMS message - Keep it simple and short
        const message = `🚨 EMERGENCY ALERT\n\nAccident detected!\nHospital: ${selectedHospital.toUpperCase()}\nTime: ${new Date(timestamp).toLocaleTimeString()}\n\nHelp required!`;
        
        console.log('Message Content:');
        console.log('---');
        console.log(message);
        console.log('---');
        console.log('');
        
        // Send SMS via Twilio
        console.log('🌐 Sending SMS via Twilio API...');
        const smsResponse = await twilioClient.messages.create({
            body: message,
            from: TWILIO_PHONE_NUMBER,
            to: YOUR_PHONE_NUMBER
        });
        
        console.log('');
        console.log('✅ SMS SENT SUCCESSFULLY!');
        console.log('='.repeat(60));
        console.log('Response Details:');
        console.log('  Message SID:', smsResponse.sid);
        console.log('  Status:', smsResponse.status);
        console.log('  To:', smsResponse.to);
        console.log('  From:', smsResponse.from);
        console.log('  Date Created:', smsResponse.dateCreated);
        console.log('  Price:', smsResponse.price || 'Calculating...');
        console.log('  Error Code:', smsResponse.errorCode || 'None');
        console.log('  Error Message:', smsResponse.errorMessage || 'None');
        console.log('');
        console.log('🔍 Track delivery status at:');
        console.log(`   https://console.twilio.com/us1/monitor/logs/sms/${smsResponse.sid}`);
        console.log('='.repeat(60));
        console.log('');
        
        res.json({
            success: true,
            message: 'SMS sent successfully',
            messageSid: smsResponse.sid,
            status: smsResponse.status,
            to: smsResponse.to,
            from: smsResponse.from,
            trackingUrl: `https://console.twilio.com/us1/monitor/logs/sms/${smsResponse.sid}`
        });
        
    } catch (error) {
        console.log('');
        console.log('❌ SMS SENDING FAILED!');
        console.log('='.repeat(60));
        console.error('Error Details:');
        console.error('  Message:', error.message);
        console.error('  Code:', error.code);
        console.error('  Status:', error.status);
        console.error('  More Info:', error.moreInfo);
        console.log('='.repeat(60));
        console.log('');
        
        res.status(500).json({
            success: false,
            message: 'Failed to send SMS',
            error: error.message,
            errorCode: error.code,
            moreInfo: error.moreInfo
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Emergency Alert System Server is running',
        twilioConfigured: true,
        twilioAccountSid: TWILIO_ACCOUNT_SID,
        twilioPhoneNumber: TWILIO_PHONE_NUMBER,
        targetPhoneNumber: YOUR_PHONE_NUMBER
    });
});

// Test SMS endpoint (for manual testing)
app.get('/api/test-sms', async (req, res) => {
    try {
        console.log('🧪 TEST SMS REQUEST');
        const message = 'Test message from Emergency Alert System. If you receive this, SMS is working!';
        
        const smsResponse = await twilioClient.messages.create({
            body: message,
            from: TWILIO_PHONE_NUMBER,
            to: YOUR_PHONE_NUMBER
        });
        
        console.log('✅ Test SMS sent:', smsResponse.sid);
        
        res.json({
            success: true,
            message: 'Test SMS sent',
            sid: smsResponse.sid
        });
    } catch (error) {
        console.error('❌ Test SMS failed:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get local IP address
function getLocalIPAddress() {
    const os = require('os');
    const interfaces = os.networkInterfaces();
    
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            // Skip internal and non-IPv4 addresses
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
}

// Start server - Listen on all network interfaces (0.0.0.0)
server.listen(PORT, '0.0.0.0', () => {
    const localIP = getLocalIPAddress();
    
    console.log('');
    console.log('='.repeat(60));
    console.log('🚨 EMERGENCY ALERT SYSTEM SERVER');
    console.log('='.repeat(60));
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`🌐 Network access: http://${localIP}:${PORT}`);
    console.log(`🔌 WebSocket server ready for real-time communication`);
    console.log(`📱 Twilio SMS configured and ready`);
    console.log(`📞 SMS will be sent to: ${YOUR_PHONE_NUMBER}`);
    console.log('');
    console.log('📱 MULTI-DEVICE ACCESS:');
    console.log('='.repeat(60));
    console.log('Use these URLs on OTHER devices (phones, tablets, PCs):');
    console.log('');
    console.log(`  🚗 Car Driver:    http://${localIP}:${PORT}/public/carDriver.html`);
    console.log(`  🏥 Hospital 1:    http://${localIP}:${PORT}/public/hospital1.html`);
    console.log(`  🏥 Hospital 2:    http://${localIP}:${PORT}/public/hospital2.html`);
    console.log(`  🏥 Hospital 3:    http://${localIP}:${PORT}/public/hospital3.html`);
    console.log('');
    console.log('💻 LOCAL ACCESS (this PC only):');
    console.log('='.repeat(60));
    console.log(`  🚗 Car Driver:    http://localhost:${PORT}/public/carDriver.html`);
    console.log(`  🏥 Hospital 1:    http://localhost:${PORT}/public/hospital1.html`);
    console.log(`  🏥 Hospital 2:    http://localhost:${PORT}/public/hospital2.html`);
    console.log(`  🏥 Hospital 3:    http://localhost:${PORT}/public/hospital3.html`);
    console.log(`  📊 Site 1:        http://localhost:${PORT}/site1.html`);
    console.log(`  📊 Site 2:        http://localhost:${PORT}/site2.html`);
    console.log('');
    console.log('🔧 Test Endpoints:');
    console.log('='.repeat(60));
    console.log(`  🔍 Health Check:  http://${localIP}:${PORT}/api/health`);
    console.log(`  🧪 Test SMS:      http://${localIP}:${PORT}/api/test-sms`);
    console.log('='.repeat(60));
    console.log('');
    console.log('💡 QUICK START:');
    console.log('  1. Copy the network URLs above');
    console.log('  2. Open them on different devices (must be on same WiFi)');
    console.log('  3. Click YES on car driver → Selected hospital gets alert!');
    console.log('');
    console.log('⚠️  Make sure all devices are on the same WiFi network');
    console.log('⚠️  If firewall blocks connections, allow port 3000');
    console.log('');
});
