const Validation = {
    validateTransaction: (data) => {
        const errors = {};

        // Description
        if (!data.description || data.description.trim() === '') {
            errors.description = 'Description is required';
        } else if (data.description.length > 100) {
            errors.description = 'Description must be less than 100 characters';
        }

        // Amount
        if (!data.amount || isNaN(data.amount)) {
            errors.amount = 'Valid amount is required';
        } else if (parseFloat(data.amount) <= 0) {
            errors.amount = 'Amount must be positive';
        }

        // Category
        if (!data.category) {
            errors.category = 'Please select a category';
        }

        // Date
        if (!data.date) {
            errors.date = 'Date is required';
        } else {
            const selectedDate = new Date(data.date);
            const today = new Date();
            today.setHours(23, 59, 59, 999); // End of today
            
            if (selectedDate > today) {
                errors.date = 'Date cannot be in the future';
            }
        }

        return errors;
    },

    showError: (elementId, message) => {
        const errorEl = document.getElementById(elementId);
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.remove('hidden');
            document.getElementById(elementId.replace('-error', '')).classList.add('border-red-500');
        }
    },

    clearErrors: () => {
        document.querySelectorAll('[id$="-error"]').forEach(el => el.classList.add('hidden'));
        document.querySelectorAll('input, select').forEach(el => el.classList.remove('border-red-500'));
    }
};