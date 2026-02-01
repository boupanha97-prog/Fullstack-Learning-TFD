// 1. Highlight paragraph traversal
const highlight = document.querySelector('.highlight');

// Get parent
const parent = highlight.parentElement;
console.log('Parent:', parent);

// Get previous sibling
const prevSibling = highlight.previousElementSibling;
console.log('Previous sibling:', prevSibling.textContent);

// Get next sibling
const nextSibling = highlight.nextElementSibling;
console.log('Next sibling:', nextSibling); // Should be null

// 2. Products section
const productsSection = document.querySelector('.products');

// Get all children
const children = productsSection.children;
console.log('Total children:', children.length);

// First product's h3
const firstChild = productsSection.firstElementChild;
const nextChild = firstChild.nextElementSibling; // First product-card
const firstProductH3 = nextChild.querySelector('h3');
console.log('First product:', firstProductH3.textContent);

// Last product's price
const lastCard = productsSection.lastElementChild;
const lastPrice = lastCard.querySelector('.price');
console.log('Last price:', lastPrice.textContent);

// 3. Navigate from nav-item to parent nav
const navItem = document.querySelector('.nav-item');
const ul = navItem.parentElement; // ul.nav-list
const nav = ul.parentElement; // nav element

// Get all nav items from nav
const allNavItems = nav.querySelectorAll('.nav-item');
console.log('Found', allNavItems.length, 'nav items from nav element');