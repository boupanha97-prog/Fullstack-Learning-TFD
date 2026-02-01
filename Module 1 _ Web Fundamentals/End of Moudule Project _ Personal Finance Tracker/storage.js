const STORAGE_KEY = 'finance_tracker_transactions';
const THEME_KEY = 'finance_tracker_theme';

const Storage = {
    getTransactions: () => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error('Error loading transactions:', e);
            return [];
        }
    },

    saveTransactions: (transactions) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    },

    getTheme: () => {
        return localStorage.getItem(THEME_KEY) || 'light';
    },

    saveTheme: (theme) => {
        localStorage.setItem(THEME_KEY, theme);
    },

    exportData: (transactions) => {
        const dataStr = JSON.stringify(transactions, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `finance_backup_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
    }
};