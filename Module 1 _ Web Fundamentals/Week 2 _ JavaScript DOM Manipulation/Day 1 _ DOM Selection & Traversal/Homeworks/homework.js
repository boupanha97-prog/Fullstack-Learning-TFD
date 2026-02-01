// 1. Select and log all headings (h1, h2, h3)
console.log('--- Task 1: All Headings ---');
const headings = document.querySelectorAll('h1, h2, h3');
headings.forEach(heading => {
    console.log(`${heading.tagName}: ${heading.textContent}`);
});

// 2. Find all elements with specific classes (highlight)
console.log('\n--- Task 2: Highlight Class ---');
const highlights = document.querySelectorAll('.highlight');
console.log(`Found ${highlights.length} elements with class "highlight"`);

// 3. Navigate from deepest nested element to root
console.log('\n--- Task 3: Deepest Node Traversal ---');
let currentElement = document.getElementById('deepest-item');
console.log('Starting from:', currentElement.textContent);

while (currentElement && currentElement !== document.body) {
    currentElement = currentElement.parentElement;
    console.log(`Parent: ${currentElement.tagName}${currentElement.id ? '#' + currentElement.id : ''}`);
}

// 4. Select all list items and log hierarchy level
console.log('\n--- Task 4: List Item Hierarchy ---');
const allListItems = document.querySelectorAll('li');

function getDepth(element) {
    let depth = 0;
    let parent = element.parentElement;
    while (parent) {
        depth++;
        parent = parent.parentElement;
    }
    return depth;
}

allListItems.forEach(li => {
    // Get text content of the node itself (avoiding nested text if possible)
    const text = li.firstChild.textContent.trim(); 
    const depth = getDepth(li);
    console.log(`Item: ${text} - Level: ${depth}`);
});

// 5. Find all paragraphs in a specific section
console.log('\n--- Task 5: Paragraphs in #features ---');
const featureSection = document.getElementById('features');
if (featureSection) {
    const featureParagraphs = featureSection.querySelectorAll('p');
    featureParagraphs.forEach(p => console.log(p.textContent));
}

// 6. Get all children of a specific parent
console.log('\n--- Task 6: Children of #introduction ---');
const introSection = document.getElementById('introduction');
if (introSection) {
    const children = introSection.children;
    Array.from(children).forEach(child => {
        console.log(`Type: ${child.tagName}, Content: ${child.textContent.substring(0, 20)}...`);
    });
}

// 🚀 Bonus Challenge: getAncestors function
console.log('\n--- Bonus: getAncestors Function ---');

function getAncestors(element) {
    const ancestors = [];
    let current = element.parentElement;
    
    while (current && current !== document.documentElement) {
        const ancestorInfo = {
            tag: current.tagName,
            id: current.id,
            classes: Array.from(current.classList)
        };
        ancestors.push(ancestorInfo);
        
        if (current === document.body) break;
        current = current.parentElement;
    }
    
    return ancestors;
}

const deepest = document.getElementById('deepest-item');
const ancestorsList = getAncestors(deepest);
console.log(ancestorsList);