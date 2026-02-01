# Personal Finance Tracker 💰

A comprehensive web application to track income and expenses, built as the final project for Module 1: Web Fundamentals.

## Features

### Core Functionality
- **Dashboard**: Real-time view of Total Balance, Income, and Expenses.
- **Transactions**: Add, Edit, and Delete income or expense records.
- **Filtering**: Filter by Type (Income/Expense) and Search by description/category.
- **Sorting**: Sort by Date (Newest/Oldest) and Amount (High/Low).
- **Persistence**: All data is saved automatically to Local Storage.

### Bonus Features
- **Dark Mode**: Toggle between light and dark themes (preference saved).
- **Export Data**: Download all transactions as a JSON file for backup.
- **Responsive Design**: Fully optimized for Mobile, Tablet, and Desktop.
- **Form Validation**: Real-time feedback for invalid inputs.

## Tech Stack
- **HTML5**: Semantic structure.
- **TailwindCSS**: Utility-first styling for responsive design.
- **JavaScript (ES6+)**: DOM manipulation, logic, and state management.
- **LocalStorage**: Client-side data persistence.

## How to Run
1. Open the folder containing these files.
2. Double-click `index.html` to open it in your web browser.
3. Start tracking your finances!

## File Structure
- `index.html`: Main application structure.
- `css/styles.css`: Custom animations and scrollbar styles.
- `js/app.js`: Main application logic and event listeners.
- `js/storage.js`: LocalStorage wrapper and export functionality.
- `js/validation.js`: Form validation logic.
- `js/utils.js`: Helper functions for formatting.

## Known Issues
- The export feature downloads a JSON file; an import feature is planned for future updates.
- Chart visualization is currently text-based (colors and numbers).