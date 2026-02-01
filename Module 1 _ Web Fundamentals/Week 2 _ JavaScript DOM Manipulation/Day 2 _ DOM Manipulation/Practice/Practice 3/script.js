function addTodo(text) {
    // Create li
    const li = document.createElement('li');
    li.textContent = text;
    
    // Create delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn');
    
    // Add click event to remove the list item
    deleteBtn.addEventListener('click', () => {
        li.remove();
    });
    
    // Append button to li
    li.appendChild(deleteBtn);
    
    // Append li to ul
    const todoList = document.getElementById('todo-list');
    todoList.appendChild(li);
}

// Add sample todos
addTodo('Learn DOM manipulation');
addTodo('Build a project');
addTodo('Practice coding');

// Optional: Wire up the add button to use the function
const addBtn = document.getElementById('add-btn');
const todoInput = document.getElementById('todo-input');

addBtn.addEventListener('click', () => {
    if (todoInput.value.trim() !== '') {
        addTodo(todoInput.value);
        todoInput.value = '';
    }
});