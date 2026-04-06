# Emergency Alert System - Public Folder

Complete accident detection and hospital notification system with localStorage communication.

## 📁 Files

- `index.html` - Home page with links to all interfaces
- `carDriver.html` - Car driver interface (detects accidents)
- `carDriver.js` - Driver logic with 10-second delay
- `hospital1.html` - Hospital 1 monitoring interface
- `hospital2.html` - Hospital 2 monitoring interface
- `hospital3.html` - Hospital 3 monitoring interface
- `hospital.js` - Shared hospital monitoring logic
- `styles.css` - All styling for the system

## 🚀 How to Use

### Step 1: Open Hospital Pages First
1. Open `hospital1.html` in one browser tab
2. Open `hospital2.html` in another tab
3. Open `hospital3.html` in another tab
4. All should show "🔍 Waiting for emergency alerts..."

### Step 2: Open Car Driver Page
1. Open `carDriver.html` in a new tab
2. You'll see "System ready - Monitoring system active"
3. Wait 10 seconds (popup will appear automatically)
4. OR click "Simulate Accident" button to trigger immediately

### Step 3: Respond to Emergency
Choose one:
- Click "YES - I NEED HELP" button
- Press Y key on keyboard
- Wait 60 seconds (timer expires)
- Click "NO - I'M FINE" to cancel

### Step 4: Check Hospital Pages
1. Switch to hospital tabs
2. **ONLY ONE randomly selected hospital** will show the emergency alert!
3. Other hospitals will continue showing "Waiting for alerts..."
4. Check console to see which hospital was selected

## 🔄 How It Works

1. **Car Driver** waits 10 seconds, then shows accident detection popup
2. User has 60 seconds to respond YES/NO
3. If YES or timer expires:
   - Generates random number (1, 2, or 3)
   - Maps to hospital: 1→hospital1, 2→hospital2, 3→hospital3
   - Sets localStorage with emergency data + selected hospital ID
4. **All Hospitals** monitor localStorage every 500ms
5. **Only the selected hospital** shows the alert
6. Other hospitals continue monitoring (no alert shown)

## ✅ Features

### Car Driver (carDriver.html):
- 10-second delay before popup appears
- 60-second countdown timer
- YES/NO buttons
- Keyboard shortcuts (Y/N keys)
- Test button for immediate trigger
- Auto-trigger on timer expiration
- Clears previous emergencies on page load

### Hospitals (hospital1/2/3.html):
- Real-time monitoring (checks every 500ms)
- Checks if THIS hospital is the selected one
- Only shows alert if selected (not all hospitals)
- Automatic alert display when selected
- Shows emergency time
- Prevents page close/refresh during alert
- Returns to monitoring mode if emergency is cleared
- Other hospitals continue monitoring without showing alert

## 🧪 Testing

### Quick Test:
1. Open all 3 hospital pages → see "Waiting for alerts..."
2. Open carDriver.html → see main dashboard
3. Wait 10 seconds → popup appears
4. Click YES → emergency triggered
5. Check all hospital tabs → **ONLY ONE will show red alert screen**
6. Check console logs to see which hospital was randomly selected

### Immediate Test:
1. Open hospital pages
2. Open carDriver.html
3. Click "Simulate Accident" button → popup appears immediately
4. Click YES
5. Check hospitals → alerts appear

### Reset Test:
1. Refresh carDriver.html → clears emergency
2. All hospitals return to monitoring mode
3. Test again

## 🐛 Troubleshooting

### Hospitals don't show alert?

1. **Check Console (F12)**
   - carDriver should show: "✅ localStorage updated"
   - Hospitals should show: "🚨🚨🚨 EMERGENCY DETECTED!"

2. **Check localStorage**
   - Open console and type: `localStorage.getItem('emergencyActive')`
   - Should return: `"true"` after clicking YES

3. **Same Browser**
   - All pages must be open in the same browser
   - localStorage is browser-specific

4. **Hard Refresh**
   - Press Ctrl+Shift+R (or Cmd+Shift+R on Mac)
   - Clears browser cache

### Manual Test:
Open console on any hospital page and run:
```javascript
localStorage.setItem('emergencyActive', 'true');
localStorage.setItem('emergencyTime', new Date().toISOString());
```
Alert should appear immediately on all hospital pages!

## 🎨 Design Features

- Modern gradient backgrounds
- Smooth animations
- Responsive design (mobile-friendly)
- Clear visual hierarchy
- Pulsing indicators
- Color-coded states:
  - Red = Emergency
  - Green = OK/Cancelled
  - Purple = Monitoring

## 📝 Key Differences from Root Files

### carDriver.html vs site1.html:
- Same 10-second delay functionality
- Same 60-second timer
- Same YES/NO logic
- Uses localStorage (no socket.io)
- Notifies ALL hospitals (not just one)

### hospital.html vs site2.html:
- Same monitoring logic (checks every 500ms)
- Same localStorage detection
- Same alert display
- Multiple hospitals can run simultaneously
- All receive alerts at the same time

## 🔧 Technical Details

- Pure HTML, CSS, JavaScript (no frameworks)
- Uses localStorage for cross-tab communication
- Polling interval: 500ms
- Popup delay: 10 seconds
- Timer duration: 60 seconds
- No server required (runs locally)
- No socket.io dependency

## 🌐 Running the System

### Option 1: Direct File Opening
- Simply open HTML files in your browser
- All files must be in the same folder
- Works with file:// protocol

### Option 2: Local Server
If you have Node.js installed:
```bash
# From parent directory
node serve.js
```
Then visit:
- http://localhost:3000/public/index.html
- http://localhost:3000/public/carDriver.html
- http://localhost:3000/public/hospital1.html
- etc.

## 📊 System Flow

```
1. User opens carDriver.html
   ↓
2. Wait 10 seconds (or click test button)
   ↓
3. Popup appears: "Do you need help?"
   ↓
4. User clicks YES (or timer expires after 60s)
   ↓
5. Generate random number (1, 2, or 3)
   ↓
6. Map to hospital: 1→hospital1, 2→hospital2, 3→hospital3
   ↓
7. localStorage.emergencyActive = 'true'
   localStorage.selectedHospital = 'hospital1' (or 2 or 3)
   ↓
8. All hospital pages check localStorage (within 500ms)
   ↓
9. ONLY the selected hospital shows emergency alert
   ↓
10. Other hospitals continue monitoring (no alert)
   ↓
11. Refresh carDriver to clear and start over
```

## 🎯 Use Cases

- **Testing**: Simulate accident detection without hardware
- **Demo**: Show emergency response system to stakeholders
- **Development**: Test multi-client notification system
- **Training**: Train hospital staff on emergency procedures

---

**Updated:** Complete rewrite with localStorage communication
**Browser Support:** Chrome, Firefox, Edge, Safari (any modern browser)
**Dependencies:** None (pure vanilla JavaScript)