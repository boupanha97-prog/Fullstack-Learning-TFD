// 1. Change title text
const title = document.getElementById('title');
title.textContent = 'New Title';

// 2. Change description with HTML
const description = document.querySelector('.description');
description.innerHTML = 'This is <strong>bold text</strong> in description';

// 3. Change image attributes
const image = document.getElementById('image');
image.src = 'https://via.placeholder.com/200/4CAF50';
image.alt = 'Updated Image';

// 4. Change link href and add target
const link = document.getElementById('link');
link.href = 'https://example.com';
link.setAttribute('target', '_blank');
// Or: link.target = '_blank';

// 5. Add data attribute
const content = document.querySelector('.content');
content.dataset.updated = 'true';
// Or: content.setAttribute('data-updated', 'true');

console.log('All elements updated!');