const box = document.querySelector('.box');
const colorBtn = document.getElementById('color-btn');
const hideBtn = document.getElementById('hide-btn');
const sizeBtn = document.getElementById('size-btn');

// 1. Change color to random color
colorBtn.addEventListener('click', () => {
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
    box.style.backgroundColor = randomColor;
});

// 2. Toggle visibility
hideBtn.addEventListener('click', () => {
    if (box.style.display === 'none') {
        box.style.display = 'block';
    } else {
        box.style.display = 'none';
    }
});

// 3. Increase size
let currentSize = 200;
sizeBtn.addEventListener('click', () => {
    currentSize += 20;
    box.style.width = currentSize + 'px';
    box.style.height = currentSize + 'px';
});