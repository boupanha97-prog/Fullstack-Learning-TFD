const todoList = document.getElementById('todo-list');
const addBtn = document.getElementById('add-btn');
const input = document.getElementById('task-input');

// 1. Create a new element programmatically (runs on load)
const initialTask = document.createElement('li');
initialTask.textContent = 'Practice DOM Manipulation (Added via JS)';
todoList.appendChild(initialTask);

// 2. Add task on button click
addBtn.addEventListener('click', () => {
    const taskText = input.value;
    
    // Only add if input is not empty
    if (taskText.trim() !== '') {
        // Create new li element
        const li = document.createElement('li');
        li.textContent = taskText;
        
        // Append to the list
        todoList.appendChild(li);
        
        // Clear input field
        input.value = '';
    }
});