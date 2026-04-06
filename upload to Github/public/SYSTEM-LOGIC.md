# Emergency Alert System - Logic Flow

## 🎲 Random Hospital Selection Logic

### 1. Driver Response Logic

When the driver clicks YES or timer expires (60 seconds):

```javascript
// Generate random number (1, 2, or 3)
const randomNumber = Math.floor(Math.random() * 3) + 1;

// Map number to hospital
const selectedHospital = `hospital${randomNumber}`;
// Result: 'hospital1' OR 'hospital2' OR 'hospital3'

// Store in localStorage
localStorage.setItem('selectedHospital', selectedHospital);
```

### 2. Hospital Monitoring Logic

Each hospital checks localStorage every 500ms:

```javascript
// Get values from localStorage
const emergencyActive = localStorage.getItem('emergencyActive');
const selectedHospital = localStorage.getItem('selectedHospital');

// Check if THIS hospital is selected
if (emergencyActive === 'true' && selectedHospital === window.HOSPITAL_ID) {
    // SHOW ALERT - This hospital was selected!
    showEmergencyAlert();
} else {
    // CONTINUE MONITORING - Not selected
    // Keep showing "Waiting for alerts..."
}
```

### 3. Hospital ID Mapping

Each hospital page has a unique ID:

- **hospital1.html** → `window.HOSPITAL_ID = 'hospital1'`
- **hospital2.html** → `window.HOSPITAL_ID = 'hospital2'`
- **hospital3.html** → `window.HOSPITAL_ID = 'hospital3'`

## 📋 Complete Flow Example

### Scenario: Random number generates 2

1. **Driver clicks YES**
   ```
   randomNumber = 2
   selectedHospital = 'hospital2'
   ```

2. **localStorage updated**
   ```
   emergencyActive: 'true'
   selectedHospital: 'hospital2'
   emergencyTime: '2024-01-15T10:30:00.000Z'
   ```

3. **Hospital 1 checks** (every 500ms)
   ```
   emergencyActive = 'true' ✓
   selectedHospital = 'hospital2'
   window.HOSPITAL_ID = 'hospital1'
   'hospital2' !== 'hospital1' ✗
   → CONTINUE MONITORING (no alert)
   ```

4. **Hospital 2 checks** (every 500ms)
   ```
   emergencyActive = 'true' ✓
   selectedHospital = 'hospital2'
   window.HOSPITAL_ID = 'hospital2'
   'hospital2' === 'hospital2' ✓
   → SHOW ALERT! 🚨
   ```

5. **Hospital 3 checks** (every 500ms)
   ```
   emergencyActive = 'true' ✓
   selectedHospital = 'hospital2'
   window.HOSPITAL_ID = 'hospital3'
   'hospital2' !== 'hospital3' ✗
   → CONTINUE MONITORING (no alert)
   ```

## 🔢 Random Number Distribution

The system uses `Math.floor(Math.random() * 3) + 1`:

- `Math.random()` generates: 0.0 to 0.999...
- Multiply by 3: 0.0 to 2.999...
- `Math.floor()`: 0, 1, or 2
- Add 1: **1, 2, or 3**

Each hospital has equal probability: **33.33%**

## 🧪 Testing Different Hospitals

To test all hospitals, run multiple tests:

### Test 1:
1. Open all 3 hospital pages
2. Open carDriver.html
3. Click YES
4. Result: Maybe Hospital 1 gets alert

### Test 2:
1. Refresh carDriver.html (clears previous emergency)
2. Wait 10 seconds
3. Click YES
4. Result: Maybe Hospital 3 gets alert

### Test 3:
1. Refresh carDriver.html
2. Wait 10 seconds
3. Click YES
4. Result: Maybe Hospital 2 gets alert

## 📊 localStorage Data Structure

```javascript
{
  emergencyActive: 'true',           // Boolean as string
  emergencyTime: '2024-01-15T...',   // ISO timestamp
  emergencyReason: 'User clicked YES', // String description
  selectedHospital: 'hospital2'      // 'hospital1', 'hospital2', or 'hospital3'
}
```

## 🔄 Reset Logic

When carDriver.html loads or user clicks NO:

```javascript
localStorage.removeItem('emergencyActive');
localStorage.removeItem('emergencyTime');
localStorage.removeItem('emergencyReason');
localStorage.removeItem('selectedHospital'); // Clear selection
```

All hospitals return to monitoring mode.

## 🎯 Key Points

1. ✅ Only ONE hospital receives alert per emergency
2. ✅ Selection is random (equal probability)
3. ✅ Other hospitals continue monitoring
4. ✅ Selection happens at driver side (when YES clicked)
5. ✅ Hospitals check if they match the selection
6. ✅ No backend server needed (pure localStorage)

## 🔍 Debugging

### Check which hospital was selected:
```javascript
// In browser console
console.log(localStorage.getItem('selectedHospital'));
// Output: 'hospital1' or 'hospital2' or 'hospital3'
```

### Manually trigger for specific hospital:
```javascript
// Test Hospital 2 specifically
localStorage.setItem('emergencyActive', 'true');
localStorage.setItem('selectedHospital', 'hospital2');
localStorage.setItem('emergencyTime', new Date().toISOString());
```

### Check all localStorage values:
```javascript
console.log('Emergency Active:', localStorage.getItem('emergencyActive'));
console.log('Selected Hospital:', localStorage.getItem('selectedHospital'));
console.log('Emergency Time:', localStorage.getItem('emergencyTime'));
```

---

**Implementation:** Pure JavaScript with localStorage
**No Backend Required:** All logic runs in browser
**Random Selection:** Math.random() for fair distribution