// 1. Product Data Array
const products = [
    { id: 1, name: 'Laptop', price: 999, image: 'https://via.placeholder.com/200' },
    { id: 2, name: 'Phone', price: 699, image: 'https://via.placeholder.com/200' },
    { id: 3, name: 'Tablet', price: 499, image: 'https://via.placeholder.com/200' },
    { id: 4, name: 'Watch', price: 299, image: 'https://via.placeholder.com/200' },
    { id: 5, name: 'Headphones', price: 199, image: 'https://via.placeholder.com/200' }
];

const container = document.getElementById('products-container');
const productCount = document.getElementById('product-count');
const addProductBtn = document.getElementById('add-product');
const searchInput = document.getElementById('search-input');
const sortNameBtn = document.getElementById('sort-name');
const sortPriceAscBtn = document.getElementById('sort-price-asc');
const sortPriceDescBtn = document.getElementById('sort-price-desc');

// 2. Function to update the product counter
function updateCounter() {
    const count = document.querySelectorAll('.product-card').length;
    productCount.textContent = `Total Products: ${count}`;
}

// 3. Function to create a product card
function createProductCard(product) {
    // Create card container
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.id = product.id;
    
    // Create Image
    const img = document.createElement('img');
    img.src = product.image;
    img.alt = product.name;
    
    // Create Name
    const name = document.createElement('h3');
    name.textContent = product.name;
    
    // Bonus: Edit Product Name (Double-click)
    name.title = "Double-click to edit";
    name.addEventListener('dblclick', () => {
        const input = document.createElement('input');
        input.type = 'text';
        input.value = name.textContent;
        input.style.fontSize = '1.17em';
        input.style.fontWeight = 'bold';
        input.style.textAlign = 'center';
        
        const save = () => {
            if(input.value.trim()) {
                product.name = input.value.trim();
                name.textContent = product.name;
            }
            input.replaceWith(name);
        };
        
        input.addEventListener('blur', save);
        input.addEventListener('keydown', (e) => { if(e.key === 'Enter') save(); });
        name.replaceWith(input);
        input.focus();
    });
    
    // Create Price
    const price = document.createElement('p');
    price.className = 'price';
    price.textContent = `$${product.price}`;
    
    // Create View Details Button
    const viewBtn = document.createElement('button');
    viewBtn.textContent = 'View Details';
    viewBtn.className = 'btn-view';
    viewBtn.addEventListener('click', () => {
        alert(`Viewing details for: ${product.name}\nPrice: $${product.price}`);
    });
    
    // Create Remove Button
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.className = 'btn-remove';
    
    // Add event listener for remove
    removeBtn.addEventListener('click', () => {
        // Confirm before deleting (optional UX improvement)
        if(confirm(`Are you sure you want to remove ${product.name}?`)) {
            const index = products.findIndex(p => p.id === product.id);
            if (index > -1) products.splice(index, 1);
            renderProducts();
        }
    });
    
    // Append all elements to card
    card.appendChild(img);
    card.appendChild(name);
    card.appendChild(price);
    card.appendChild(viewBtn);
    card.appendChild(removeBtn);
    
    return card;
}

// 4. Render Function (Handles Display, Sort, Filter)
function renderProducts() {
    container.innerHTML = '';
    const term = searchInput.value.toLowerCase();
    const filtered = products.filter(p => p.name.toLowerCase().includes(term));
    
    filtered.forEach(product => {
        container.appendChild(createProductCard(product));
    });
    updateCounter();
}

// Initial Render
renderProducts();

// Event Listeners for Sort/Search
searchInput.addEventListener('input', renderProducts);

sortNameBtn.addEventListener('click', () => {
    products.sort((a, b) => a.name.localeCompare(b.name));
    renderProducts();
});

sortPriceAscBtn.addEventListener('click', () => {
    products.sort((a, b) => a.price - b.price);
    renderProducts();
});

sortPriceDescBtn.addEventListener('click', () => {
    products.sort((a, b) => b.price - a.price);
    renderProducts();
});

// 5. Add Product Feature (Bonus)
addProductBtn.addEventListener('click', () => {
    const name = prompt('Enter product name:');
    const priceInput = prompt('Enter product price:');
    
    // Clean price input to handle "$100" or "100 USD"
    // This removes non-numeric characters except dots
    const cleanPrice = priceInput ? parseFloat(priceInput.replace(/[^0-9.]/g, '')) : NaN;
    
    // Validation
    if (name && !isNaN(cleanPrice)) {
        const newProduct = {
            id: Date.now(), // Generate unique ID based on timestamp
            name: name,
            price: cleanPrice,
            image: 'https://via.placeholder.com/200' // Default image
        };
        
        products.push(newProduct);
        renderProducts();
    } else if (name || priceInput) {
        alert('Please enter a valid name and numeric price (e.g., 199 or $199).');
    }
});