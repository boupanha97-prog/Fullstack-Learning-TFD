/**
 * Formats a number as USD currency
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

/**
 * Formats a date string (YYYY-MM-DD) to a readable format
 */
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

/**
 * Generates a unique ID based on timestamp
 */
function generateID() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}