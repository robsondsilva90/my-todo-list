// Seleção de Elementos

const todoForm = document.querySelector("#form-todo");
const inputTodo = document.querySelector("#todo-input");
const listTodo = document.querySelector("#todo-list-all");
const formTodoEdit = document.querySelector("#edit-todo-form");
const inputTodoEdit = document.querySelector("#edit-todo-input");
const btnEditCancel = document.querySelector("#cancel-todo-edt-btn");
const inputSearch = document.querySelector("#search");
const btnErase = document.querySelector("#erase-todo-button");
const btnFilter = document.querySelector("#filter-todo-select");

let oldInputValue;

//Funções

    const todoSave = (text, done = 0, save = 1) => {
    const todo = document.createElement("div");
    todo.classList.add("todo");

    const titleTodo = document.createElement("h3");
    titleTodo.innerText = text
    todo.appendChild(titleTodo);

    const Btndone = document.createElement("button");
    Btndone.classList.add("finish-todo");
    Btndone.innerHTML = '<i class="fa-solid fa-check"></i>'
    todo.appendChild(Btndone);

    const todoEdit = document.createElement("button");
    todoEdit.classList.add("edit-todo");
    todoEdit.innerHTML = '<i class="fa-solid fa-pen"></i>'
    todo.appendChild(todoEdit);

    const todoDelete = document.createElement("button");
    todoDelete.classList.add("delete-todo");
    todoDelete.innerHTML = '<i class="fa-solid fa-xmark"></i>'
    todo.appendChild(todoDelete);

    // Utilizando dados da localstorage

    if (done) {
        todo.classList.add("done")
    }

    if (save) {
        saveTodoLocalStorage({text, done})
    }

    listTodo.appendChild(todo);
    inputTodo.value = "";
    inputTodo.focus();
};
    const toggleForms = () => {
    formTodoEdit.classList.toggle("hide");
    todoForm.classList.toggle("hide");
    listTodo.classList.toggle("hide");
};

    const updateTodo = (text) => {

        const todos = document.querySelectorAll(".todo")

        todos.forEach((todo) => {

            let titleTodo = todo.querySelector("h3")

            if (titleTodo.innerText === oldInputValue) {
                titleTodo.innerText = text

                updateTodoLocalStorage(oldInputValue, text);
            }
        })
    };

    const getSearchTodos = (search) => {
        
        const todos = document.querySelectorAll(".todo")

        todos.forEach((todo) => {

            let titleTodo = todo.querySelector("h3").innerText.toLowerCase();

            const searchNormalized = search.toLowerCase();

            todo.style.display = "flex"

            if (!titleTodo.includes(searchNormalized)) {
                todo.style.display = "none"
            }

        })
    }

    const filterTodos = (filterValue) => {
        const todos = document.querySelectorAll(".todo");

        switch (filterValue) {
            case "all":
            todos.forEach((todo) => (todo.style.display = "flex"));
                break;

            case "done":
            todos.forEach((todo) => 
                todo.classList.contains("done")
                ? (todo.style.display = "flex") 
                : (todo.style.display = "none")
            );
                break;

            case "todo":
                todos.forEach((todo) => 
                    !todo.classList.contains("done")
                    ? (todo.style.display = "flex") 
                    : (todo.style.display = "none")
                );
                break;

            default:
                break;
        }
    };

//Eventos

    todoForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const inputValue = inputTodo.value
    if (inputValue) {
        todoSave(inputValue)
    }
});

    document.addEventListener("click", (e) => {

    const targetEl = e.target
    const parentEl = targetEl.closest("div");
    let titleTodo;

    if (parentEl && parentEl.querySelector("h3")) {
        titleTodo = parentEl.querySelector("h3").innerText;
    }

    if (targetEl.classList.contains("finish-todo")) {
        parentEl.classList.toggle("done");

        updateStatusLocalStorage(titleTodo);
    }

    if (targetEl.classList.contains("edit-todo")) {
        toggleForms()

        inputTodoEdit.value = titleTodo
        oldInputValue = titleTodo
    }

    if (targetEl.classList.contains("delete-todo")) {
        parentEl.remove();

        removeTodoLocalStorage(titleTodo);
    }
});

    btnEditCancel.addEventListener("click", (e) => {
    e.preventDefault();
    toggleForms()
});

formTodoEdit.addEventListener("submit" , (e) => {
    e.preventDefault()
    const editInputValue = inputTodoEdit.value

    if (editInputValue) {
        updateTodo(editInputValue)
    }

    toggleForms();
});

inputSearch.addEventListener("keyup", (e) => {
    const search = e.target.value;

    getSearchTodos(search);
});

btnErase.addEventListener("click", (e) => {
    e.preventDefault()
    inputSearch.value = "";

    btnErase.dispatchEvent(new Event("keyup"));
})

btnFilter.addEventListener("change", (e) => {
    const filterValue = e.target.value;

    filterTodos(filterValue);
})

// Local Storage

const getTodosLocalStorage = () => {
    const todos = JSON.parse(localStorage.getItem("todos")) || [];

    return todos;
};

const loadTodos = () => {
    const todos = getTodosLocalStorage();

    todos.forEach((todo) => {
        todoSave(todo.text, todo.done, 0);
    })
}

const saveTodoLocalStorage = (todo) => {
    const todos = getTodosLocalStorage();

    todos.push(todo);

    localStorage.setItem("todos", JSON.stringify(todos));
};

const removeTodoLocalStorage = (todoText) => {
    const todos = getTodosLocalStorage();

    const filteredTodos = todos.filter((todo) => todo.text !== todoText)

    localStorage.setItem("todos", JSON.stringify(filteredTodos));
}

const updateStatusLocalStorage = (todoText) => {
    const todos = getTodosLocalStorage();

    todos.map((todo) => 
        todo.text === todoText ? (todo.done = !todo.done) : null
);

    localStorage.setItem("todos", JSON.stringify(todos));
    
}

const updateTodoLocalStorage = (todoOldText, todoNewText) => {
    const todos = getTodosLocalStorage();

    todos.map((todo) => 
        todo.text === todoOldText ? (todo.text = todoNewText) : null
);

    localStorage.setItem("todos", JSON.stringify(todos));
    
}

loadTodos()

