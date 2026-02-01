// 1. Select all rows in tbody
const rows = document.querySelectorAll('#student-table tbody tr');

// 2. Log each student's name and grade
console.log('// Student list');
rows.forEach(row => {
    const cells = row.querySelectorAll('td');
    const name = cells[0].textContent;
    const grade = cells[2].textContent;
    console.log(`${name} - Grade: ${grade}`);
});

// 3. Find students with grade "A"
console.log('\n// A students only');
console.log('A Students:');
rows.forEach(row => {
    const cells = row.querySelectorAll('td');
    const name = cells[0].textContent;
    const grade = cells[2].textContent;
    
    if (grade === 'A') {
        console.log(`- ${name}`);
    }
});

// 4. Count total students
console.log('\n// Total count');
console.log('Total students:', rows.length);

// 🚀 Bonus Challenge: Calculate the average age of all students!
console.log('\n// Bonus: Average Age');
let totalAge = 0;

rows.forEach(row => {
    const cells = row.querySelectorAll('td');
    const age = parseInt(cells[1].textContent); // Age is in the second column (index 1)
    totalAge += age;
});

const averageAge = totalAge / rows.length;
console.log('Average Age:', averageAge.toFixed(1));