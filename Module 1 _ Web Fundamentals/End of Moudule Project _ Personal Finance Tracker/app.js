// State
let transactions = [];
let isEditing = false;
let editingId = null;

// DOM Elements
const form = document.getElementById('transaction-form');
const transactionsList = document.getElementById('transactions-list');
const emptyState = document.getElementById('empty-state');
const balanceDisplay = document.getElementById('balance-display');
const incomeDisplay = document.getElementById('income-display');
const expenseDisplay = document.getElementById('expense-display');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const formTitle = document.getElementById('form-title');

// Filters
const searchInput = document.getElementById('search-input');
const filterType = document.getElementById('filter-type');
const sortBy = document.getElementById('sort-by');

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    transactions = Storage.getTransactions();
    initTheme();
    renderApp();
    
    // Set default date to today
    document.getElementById('date').valueAsDate = new Date();
});

// --- Core Logic ---

function renderApp() {
    updateDashboard();
    renderTransactions();
}

function updateDashboard() {
    const income = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    const expenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    const balance = income - expenses;

    incomeDisplay.textContent = formatCurrency(income);
    expenseDisplay.textContent = formatCurrency(expenses);
    balanceDisplay.textContent = formatCurrency(balance);

    // Visual indicator for balance
    balanceDisplay.className = `text-3xl font-bold mt-2 ${balance >= 0 ? 'text-gray-900 dark:text-white' : 'text-red-600'}`;
}

function getFilteredTransactions() {
    let filtered = [...transactions];

    // Search
    const term = searchInput.value.toLowerCase();
    if (term) {
        filtered = filtered.filter(t => 
            t.description.toLowerCase().includes(term) || 
            t.category.toLowerCase().includes(term)
        );
    }

    // Filter Type
    if (filterType.value !== 'all') {
        filtered = filtered.filter(t => t.type === filterType.value);
    }

    // Sort
    filtered.sort((a, b) => {
        switch(sortBy.value) {
            case 'date-desc': return new Date(b.date) - new Date(a.date);
            case 'date-asc': return new Date(a.date) - new Date(b.date);
            case 'amount-desc': return b.amount - a.amount;
            case 'amount-asc': return a.amount - b.amount;
            default: return 0;
        }
    });

    return filtered;
}

function renderTransactions() {
    const filtered = getFilteredTransactions();
    transactionsList.innerHTML = '';

    if (filtered.length === 0) {
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');

    filtered.forEach(t => {
        const el = document.createElement('div');
        el.className = `bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border-l-4 ${t.type === 'income' ? 'border-green-500' : 'border-red-500'} flex justify-between items-center animate-fade-in group`;
        
        el.innerHTML = `
            <div class="flex-1">
                <div class="flex items-center gap-2">
                    <h3 class="font-bold text-gray-800 dark:text-gray-200">${t.description}</h3>
                    <span class="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">${t.category}</span>
                </div>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">${formatDate(t.date)}</p>
            </div>
            <div class="flex items-center gap-4">
                <span class="font-bold text-lg ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}">
                    ${t.type === 'income' ? '+' : '-'}${formatCurrency(t.amount)}
                </span>
                <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onclick="editTransaction('${t.id}')" class="p-1 text-blue-600 hover:bg-blue-50 rounded" title="Edit">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                    </button>
                    <button onclick="deleteTransaction('${t.id}')" class="p-1 text-red-600 hover:bg-red-50 rounded" title="Delete">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                </div>
            </div>
        `;
        transactionsList.appendChild(el);
    });
}

// --- Actions ---

form.addEventListener('submit', (e) => {
    e.preventDefault();
    Validation.clearErrors();

    const formData = {
        type: document.querySelector('input[name="type"]:checked').value,
        description: document.getElementById('description').value.trim(),
        amount: parseFloat(document.getElementById('amount').value),
        category: document.getElementById('category').value,
        date: document.getElementById('date').value
    };

    const errors = Validation.validateTransaction(formData);
    
    if (Object.keys(errors).length > 0) {
        Object.keys(errors).forEach(key => Validation.showError(`${key}-error`, errors[key]));
        return;
    }

    if (isEditing) {
        const index = transactions.findIndex(t => t.id === editingId);
        if (index !== -1) {
            transactions[index] = { ...transactions[index], ...formData };
        }
        resetForm();
    } else {
        const newTransaction = {
            id: generateID(),
            ...formData,
            createdAt: new Date().toISOString()
        };
        transactions.unshift(newTransaction);
    }

    Storage.saveTransactions(transactions);
    renderApp();
    if (!isEditing) form.reset();
    // Reset date to today after add
    if (!isEditing) document.getElementById('date').valueAsDate = new Date();
});

window.deleteTransaction = (id) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
        transactions = transactions.filter(t => t.id !== id);
        Storage.saveTransactions(transactions);
        renderApp();
        
        if (isEditing && editingId === id) resetForm();
    }
};

window.editTransaction = (id) => {
    const t = transactions.find(t => t.id === id);
    if (!t) return;

    isEditing = true;
    editingId = id;

    // Populate form
    document.querySelector(`input[name="type"][value="${t.type}"]`).checked = true;
    document.getElementById('description').value = t.description;
    document.getElementById('amount').value = t.amount;
    document.getElementById('category').value = t.category;
    document.getElementById('date').value = t.date;

    // UI Updates
    formTitle.innerHTML = '<span class="bg-yellow-100 text-yellow-600 p-2 rounded-lg text-sm">✏️</span> Edit Transaction';
    submitBtn.textContent = 'Update Transaction';
    submitBtn.classList.remove('bg-primary', 'hover:bg-blue-700');
    submitBtn.classList.add('bg-yellow-500', 'hover:bg-yellow-600');
    cancelBtn.classList.remove('hidden');

    // Scroll to form
    form.scrollIntoView({ behavior: 'smooth' });
};

function resetForm() {
    isEditing = false;
    editingId = null;
    form.reset();
    document.getElementById('date').valueAsDate = new Date();
    
    formTitle.innerHTML = '<span class="bg-blue-100 text-blue-600 p-2 rounded-lg text-sm">➕</span> Add Transaction';
    submitBtn.textContent = 'Add Transaction';
    submitBtn.classList.add('bg-primary', 'hover:bg-blue-700');
    submitBtn.classList.remove('bg-yellow-500', 'hover:bg-yellow-600');
    cancelBtn.classList.add('hidden');
    Validation.clearErrors();
}

cancelBtn.addEventListener('click', resetForm);

// --- Event Listeners for Filters ---
searchInput.addEventListener('input', renderTransactions);
filterType.addEventListener('change', renderTransactions);
sortBy.addEventListener('change', renderTransactions);

// --- Theme & Export ---
const themeToggle = document.getElementById('theme-toggle');
const sunIcon = document.getElementById('sun-icon');
const moonIcon = document.getElementById('moon-icon');

function initTheme() {
    const theme = Storage.getTheme();
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
    } else {
        document.documentElement.classList.remove('dark');
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
    }
}

themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    Storage.saveTheme(isDark ? 'dark' : 'light');
    
    if (isDark) {
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
    } else {
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
    }
});

document.getElementById('export-btn').addEventListener('click', () => {
    if (transactions.length === 0) {
        alert('No transactions to export!');
        return;
    }
    Storage.exportData(transactions);
});

document.getElementById('export-pdf-btn').addEventListener('click', () => {
    if (transactions.length === 0) {
        alert('No transactions to export!');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Header
    doc.setFontSize(18);
    doc.text('Personal Finance Report', 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    // Table Data
    const tableColumn = ["Date", "Description", "Category", "Type", "Amount"];
    const tableRows = transactions.map(t => [
        t.date,
        t.description,
        t.category,
        t.type.charAt(0).toUpperCase() + t.type.slice(1),
        (t.type === 'income' ? '+' : '-') + formatCurrency(t.amount)
    ]);

    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 40,
        theme: 'grid',
        styles: { fontSize: 10 },
        headStyles: { fillColor: [59, 130, 246] } // Primary blue color
    });

    doc.save(`finance_report_${new Date().toISOString().split('T')[0]}.pdf`);
});