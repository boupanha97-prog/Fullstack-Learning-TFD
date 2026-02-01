// 1. Select main header by ID
const header = document.getElementById('main-header');
console.log(header.textContent); // Gets all text including nested

// Or get just the h1 text:
const title = document.querySelector('#main-header .title');
console.log(title.textContent);

// 2. Select title by class
const titleElement = document.querySelector('.title');
console.log(titleElement);

// 3. Select all paragraphs and count
const paragraphs = document.querySelectorAll('p');
console.log('Total paragraphs:', paragraphs.length);

// 4. Select all nav items and log each text
const navItems = document.querySelectorAll('.nav-item');
navItems.forEach(item => {
    console.log(item.textContent);
});

// 5. Select first product card and get h3 text
const firstProduct = document.querySelector('.product-card');
const productTitle = firstProduct.querySelector('h3');
console.log(productTitle.textContent);

// 6. Select all product cards and log prices
const productCards = document.querySelectorAll('.product-card');
productCards.forEach(card => {
    const price = card.querySelector('.price');
    console.log(price.textContent);
});
