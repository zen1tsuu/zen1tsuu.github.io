'use strict';

/**
 * Оголошуємо змінні з HTML елементами
 */
const taskInput = document.querySelector('.task-input');
const taskList = document.querySelector('.collection');
const clearBtn = document.querySelector('.clear-tasks');
const filter = document.querySelector('.filter-input');
const form = document.querySelector('.create-task-form');

/**
 * Створюємо слухачі на необхідні нам події
 */
document.addEventListener('DOMContentLoaded', renderTasks);
clearBtn.addEventListener('click', clearAllTasks);
taskList.addEventListener('click', handleTaskAction);
form.addEventListener('submit', createTask);

/**
 * Отримуємо дані з localStorage
 * @return {[String]} - масив з задачами, або пустий масив, якщо localStorage пустий
 */
function getTasksFromLocalStorage() {
    return localStorage.getItem('tasks') !== null ? JSON.parse(localStorage.getItem('tasks')) : [];
}

/**
 * Записуємо дані в localStorage
 * @param {Array} tasks - масив з задачами
 */
function setTasksToLocalStorage(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function generateUUID() {
    return Math.random().toString(36).substr(2, 9);
}

/**
 * Створюємо окрему задачу
 * @param {String} task - окрема задача
 * @param {String} taskId - унікальний ідентифікатор задачі
 */
function createSingleTaskElement(task, taskId) {
    // Створюємо HTML елемент li
    const li = document.createElement('li');
    // Додаємо елементу клас
    li.className = 'collection-item';
    li.dataset.taskId = taskId;
    // Кладемо в нього текстову ноду з задачею
//    li.appendChild(document.createTextNode(task));

    const taskText = document.createElement('span');
    taskText.textContent = task;
    li.appendChild(taskText);

    // Створюємо обгортку для іконки по кліку на яку буде видалена окрема задача
    const deleteElement = document.createElement('span');
    // Додаємо елементу клас
    deleteElement.className = 'delete-item';
    // Кладемо в нього іконку
    deleteElement.innerHTML = '<i class="fa fa-remove"></i>';
    // Додаємо елемент в елемент списку
    li.appendChild(deleteElement);

    const editElement = document.createElement('span');
    editElement.className = 'edit-item';
    editElement.innerHTML = '<i class="fa fa-edit"></i>';
    li.appendChild(editElement);
    
    // Додаємо елемент списку в список задач
    taskList.appendChild(li);
}

/**
 * Додаємо в DOM існуючі задачі
 */
function renderTasks() {
    // Отримуємо задачі з localStorage або пустий масив
    const tasks = getTasksFromLocalStorage();

    // Проходимо по масиву задач і додаємо кожну задачу в список, в DOM
    tasks.forEach((task) => {
        createSingleTaskElement(task.text, task.id);
    })
}

/**
 * Створюємо окрему задачу
 * @param {Event} event - The triggering event
 */
function createTask(event) {
    // Блокуємо дефолтний сабміт форми
    event.preventDefault();
    // Виходимо з функції якщо в полі немає тексту і видаляймо непотрібні пробіли до і після тексту
    if (taskInput.value.trim() === '') {
        return;
    }
    const taskId = generateUUID();
    // Створюємо нову задачу і додаємо в DOM
    createSingleTaskElement(taskInput.value, taskId);
    // Додаємо нову задачу в localStorage
    storeTaskInLocalStorage(taskInput.value, taskId);
    // Очищуємо поле після додавання нової задачі в список
    taskInput.value = '';
}

/**
 * Додаємо нову створену задачу в localStorage
 * @param {String} task - окрема задача
 * @param {String} taskId - унікальний ідентифікатор задачі
 */
function storeTaskInLocalStorage(task, taskId) {
    // Отримуємо поточні задачі з localStorage
    const tasks = getTasksFromLocalStorage();
    const taskObject = {
        id: taskId,
        text: task,
    };
    // Додаємо нову задачу в масив
    tasks.push(taskObject);
    // Записуємо оновлений масив в localStorage
    setTasksToLocalStorage(tasks);
}

/**
 * Видаляємо всі задачі з localStorage та з DOM
 */
function clearAllTasks() {
    // Показуємо користувачу модальне вікно для підтвердження видалення всіх задач
    if (confirm('Ви впевнені що хочете видалити всі задачі?')) {
        // Якщо користувач підтверджує, то видаємо всі задачі з localStorage та з DOM
        localStorage.clear();
        taskList.innerHTML = '';
    }
}

/**
 * Видаляємо окрему задачу з localStorage та з DOM
 * @param {Event} event - The triggering event
 
function clearSingleTask(event) {
    // Отримуємо батьківський елемент елементу на якому була подія кліку
    const iconContainer = event.target.parentElement;

    // Якщо батьківський елемент має відповідний клас
    if (iconContainer.classList.contains('delete-item')) {
        // Отримуємо підтвердження користувача
        if (confirm('Ви впевнені що хочете видалити цю задачу?')) {
            // Видаляємо елемент з DOM та з localStorage
            const taskItem = iconContainer.parentElement;
            const taskId = taskItem.dataset.taskId;
            taskItem.remove();
            removeTaskFromLocalStorage(taskId);
        }
    }
}
*/

/**
 * Обробник подій для видалення та редагування задачі
 * @param {Event} event - The triggering event
 */
function handleTaskAction(event) {
    const target = event.target;
    const taskItem = target.parentElement;
    const taskId = taskItem.dataset.taskId;
  
    if (target.classList.contains('delete-item')) {
      if (confirm('Ви впевнені що хочете видалити цю задачу?')) {
        taskItem.remove();
        removeTaskFromLocalStorage(taskId);
      }
    } else if (target.classList.contains('edit-item')) {
      const taskTextElement = taskItem.querySelector('span');
      const taskText = taskTextElement.textContent;  
      const newTaskText = prompt('Введіть новий текст для завдання', taskText);
      if (newTaskText !== null && newTaskText.trim() !== '') {
        taskTextElement.textContent = newTaskText;
        updateTaskInLocalStorage(taskId, newTaskText);
      }
    }
}

/**
 * Видаляємо окрему задачу з localStorage та з DOM
 * @param {String} taskId - унікальний ідентифікатор задачі
 */
function removeTaskFromLocalStorage(taskId) {
    // Отримуємо поточні задачі з localStorage
    const tasks = getTasksFromLocalStorage();
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasksToLocalStorage(updatedTasks);
/*
    // Проходимо по масиву задач і видаляємо необхідну
    tasks.forEach((task, index) => {
        if (taskToRemove.textContent === task) {
            tasks.splice(index, 1)
        }
    })

    // Записуємо оновлений масив в localStorage
    setTasksToLocalStorage(tasks);
*/
}

function updateTaskInLocalStorage(taskId, newText) {
    const tasks = getTasksFromLocalStorage();
    const updatedTasks = tasks.map(task => {
        if (task.id === task.id) {
            return {...task, text: newText};
        }
        return task;
    });
    setTasksToLocalStorage(updatedTasks);
}