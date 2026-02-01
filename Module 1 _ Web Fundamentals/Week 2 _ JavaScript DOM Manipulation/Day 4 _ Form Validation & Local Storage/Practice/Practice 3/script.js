const themeSelect = document.getElementById('theme');
const fontSizeSelect = document.getElementById('font-size');
const notificationsCheckbox = document.getElementById('notifications');
const saveBtn = document.getElementById('save-settings');
const resetBtn = document.getElementById('reset-settings');

// 1. Apply settings to the DOM
function applySettings(settings) {
    // Apply Theme
    if (settings.theme === 'dark') {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }

    // Apply Font Size
    document.body.classList.remove('font-small', 'font-medium', 'font-large');
    if (settings.fontSize) {
        document.body.classList.add(`font-${settings.fontSize}`);
    }
}

// 2. Load settings from Local Storage
function loadSettings() {
    const savedSettings = localStorage.getItem('userPreferences');
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        
        // Update UI inputs
        themeSelect.value = settings.theme || 'light';
        fontSizeSelect.value = settings.fontSize || 'medium';
        notificationsCheckbox.checked = settings.notifications || false;
        
        // Apply visual changes
        applySettings(settings);
    }
}

// 3. Save settings
saveBtn.addEventListener('click', () => {
    const settings = {
        theme: themeSelect.value,
        fontSize: fontSizeSelect.value,
        notifications: notificationsCheckbox.checked
    };
    
    localStorage.setItem('userPreferences', JSON.stringify(settings));
    applySettings(settings);
    alert('Settings saved!');
});

// 4. Reset settings
resetBtn.addEventListener('click', () => {
    localStorage.removeItem('userPreferences');
    
    // Reset UI inputs to defaults
    themeSelect.value = 'light';
    fontSizeSelect.value = 'medium';
    notificationsCheckbox.checked = false;
    
    // Apply default styles
    applySettings({ theme: 'light', fontSize: 'medium' });
    alert('Settings reset to defaults.');
});

// Initialize on page load
loadSettings();