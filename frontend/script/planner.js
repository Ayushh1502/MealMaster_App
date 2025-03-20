// DOM Elements
const addMealBtns = document.querySelectorAll('.add-meal');
const modal = document.getElementById('addMealModal');
const modalClose = document.querySelectorAll('.modal-close');
const saveMealBtn = document.getElementById('save-meal');
const weekPrev = document.querySelector('.week-prev');
const weekNext = document.querySelector('.week-next');
const currentWeek = document.querySelector('.current-week');

// Constants
const CATEGORIES = ['breakfast', 'lunch', 'dinner', 'snack'];
const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

// State variables
let currentDate = new Date();
let activeMealItemForEdit = null;

// Initialize the current week start date (Monday of the current week)
function initializeDate() {
    // Get Monday of current week
    currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1);
    
    // Try to restore saved date from localStorage
    const savedWeek = localStorage.getItem('currentPlannerWeek');
    if (savedWeek) {
        try {
            currentDate = new Date(savedWeek);
        } catch (e) {
            console.error('Failed to parse saved date', e);
        }
    }
}

// Event Listeners
function setupEventListeners() {
    // Add meal buttons
    addMealBtns.forEach(btn => {
        btn.addEventListener('click', openModal);
    });
    
    // Modal close buttons
    modalClose.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    // Save meal button
    saveMealBtn.addEventListener('click', saveMeal);
    
    // Week navigation
    weekPrev.addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() - 7);
        updateWeekDisplay();
        loadMealsForCurrentWeek(); // Add this function to load saved meals
    });
    
    weekNext.addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() + 7);
        updateWeekDisplay();
        loadMealsForCurrentWeek(); // Add this function to load saved meals
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });
}

// Functions
function openModal(event) {
    modal.classList.add('active');
    activeMealItemForEdit = null; // Reset edit state
    
    // Get the meal grid item that was clicked
    const mealItem = this.closest('.meal-grid-item');
    
    // Determine meal category
    let mealCategory = '';
    for (const category of CATEGORIES) {
        if (mealItem.classList.contains(category)) {
            mealCategory = category;
            break;
        }
    }
    
    // Set the default category in the dropdown
    document.getElementById('meal-category').value = mealCategory;
    
    // FIX: Reliably determine which day column was clicked
    // Find the direct parent row
    const parentRow = mealItem.parentElement;
    
    // Get all grid items in the row
    const rowItems = Array.from(parentRow.children);
    
    // Find position of this cell in the row
    const colPosition = rowItems.indexOf(mealItem);
    
    // Day index is position - 1 (to account for the label column)
    // First column (index 0) is the category label, so columns 1-7 are Monday-Sunday
    const dayIndex = colPosition - 1;
    
    console.log('Day detection:', {
        colPosition,
        dayIndex,
        day: DAYS[dayIndex]
    });
    
    if (dayIndex >= 0 && dayIndex < DAYS.length) {
        document.getElementById('meal-day').value = DAYS[dayIndex];
    }
    
    // Clear form
    document.getElementById('meal-name').value = '';
    document.getElementById('meal-calories').value = '';
    document.getElementById('meal-protein').value = '';
    document.getElementById('meal-notes').value = '';
}

function closeModal() {
    modal.classList.remove('active');
    activeMealItemForEdit = null;
}

function saveMeal() {
    // Get form values
    const mealName = document.getElementById('meal-name').value.trim();
    const mealCategory = document.getElementById('meal-category').value;
    const mealDay = document.getElementById('meal-day').value;
    const mealCalories = document.getElementById('meal-calories').value.trim();
    const mealProtein = document.getElementById('meal-protein').value.trim();
    const mealNotes = document.getElementById('meal-notes').value.trim();
    
    // Validate form
    if (!mealName) {
        alert('Please enter a meal name');
        return;
    }
    
    if (mealCalories && isNaN(Number(mealCalories))) {
        alert('Please enter valid calories');
        return;
    }
    
    if (mealProtein && isNaN(Number(mealProtein))) {
        alert('Please enter valid protein amount');
        return;
    }
    
    // FIX: Find the correct cell for this meal
    // If we're editing an existing meal, use that cell
    let targetGridItem;
    
    if (activeMealItemForEdit) {
        targetGridItem = activeMealItemForEdit;
    } else {
        // Find target grid item by traversing the DOM structure
        // Find the row for this category
        const categoryRows = document.querySelectorAll('.meal-grid-row');
        let categoryRowIndex = -1;
        
        for (let i = 0; i < categoryRows.length; i++) {
            const firstCell = categoryRows[i].querySelector('.meal-grid-item');
            if (firstCell && firstCell.classList.contains(mealCategory)) {
                categoryRowIndex = i;
                break;
            }
        }
        
        if (categoryRowIndex === -1) {
            alert('Error: Could not find the row for this meal category');
            return;
        }
        
        // Get the row
        const targetRow = categoryRows[categoryRowIndex];
        
        // Find the column for this day
        // Remember that column 0 is the label, so days start at index 1
        const dayIndex = DAYS.indexOf(mealDay.toLowerCase());
        if (dayIndex === -1) {
            alert('Error: Invalid day selected');
            return;
        }
        
        // Get all cells in this row
        const cells = targetRow.querySelectorAll('.meal-grid-item');
        
        // Target cell is at dayIndex + 1 (to account for label column)
        targetGridItem = cells[dayIndex + 1];
        
        if (!targetGridItem) {
            alert('Error: Could not find the grid cell for this meal');
            console.error('Failed to find grid cell', {
                category: mealCategory,
                day: mealDay,
                dayIndex,
                targetColumn: dayIndex + 1,
                rowCellCount: cells.length
            });
            return;
        }
    }
    
    console.log('Target cell found:', targetGridItem);
    
    // Create new meal element
    const newMeal = document.createElement('div');
    newMeal.className = 'meal-item';
    newMeal.innerHTML = `
        <div class="meal-item-title">${mealName}</div>
        <div class="meal-item-info">
            <span>${mealCalories} cal</span>
            <span>${mealProtein}g protein</span>
        </div>
        ${mealNotes ? `<div class="meal-item-notes">${mealNotes}</div>` : ''}
    `;
    
    // Add meal actions
    const actions = document.createElement('div');
    actions.className = 'meal-item-actions';
    actions.innerHTML = `
        <button class="meal-action-btn edit-meal"><i class="fas fa-pencil-alt"></i></button>
        <button class="meal-action-btn delete-meal"><i class="fas fa-trash-alt"></i></button>
    `;
    
    // Clear existing content
    targetGridItem.innerHTML = '';
    
    // Add the new meal content
    targetGridItem.appendChild(newMeal);
    targetGridItem.appendChild(actions);
    
    // Add event listeners to the new action buttons
    const editBtn = actions.querySelector('.edit-meal');
    const deleteBtn = actions.querySelector('.delete-meal');
    
    editBtn.addEventListener('click', editMeal);
    deleteBtn.addEventListener('click', deleteMeal);
    
    // Save to localStorage
    saveMealToStorage(mealCategory, mealDay, {
        name: mealName,
        calories: mealCalories,
        protein: mealProtein,
        notes: mealNotes
    });
    
    // Close the modal
    closeModal();
}

function editMeal(event) {
    event.stopPropagation(); // Prevent event bubbling
    
    const mealItem = this.closest('.meal-grid-item');
    const mealTitle = mealItem.querySelector('.meal-item-title').textContent;
    const mealInfo = mealItem.querySelector('.meal-item-info').textContent;
    const mealNotes = mealItem.querySelector('.meal-item-notes')?.textContent || '';
    
    // Extract calorie and protein information
    const calorieMatch = mealInfo.match(/(\d+) cal/);
    const proteinMatch = mealInfo.match(/(\d+)g protein/);
    
    const calories = calorieMatch ? calorieMatch[1] : '';
    const protein = proteinMatch ? proteinMatch[1] : '';
    
    // Determine meal category
    let mealCategory = '';
    for (const category of CATEGORIES) {
        if (mealItem.classList.contains(category)) {
            mealCategory = category;
            break;
        }
    }
    
    // FIX: Determine day based on column position in row
    const parentRow = mealItem.parentElement;
    const rowItems = Array.from(parentRow.children);
    const colPosition = rowItems.indexOf(mealItem);
    const dayIndex = colPosition - 1;
    
    const mealDay = DAYS[dayIndex] || '';
    
    // Pre-fill the modal form
    document.getElementById('meal-name').value = mealTitle;
    document.getElementById('meal-calories').value = calories;
    document.getElementById('meal-protein').value = protein;
    document.getElementById('meal-notes').value = mealNotes;
    document.getElementById('meal-category').value = mealCategory;
    document.getElementById('meal-day').value = mealDay;
    
    // Store reference to this meal item for updating
    activeMealItemForEdit = mealItem;
    
    // Open the modal
    modal.classList.add('active');
}

function deleteMeal(event) {
    event.stopPropagation(); // Prevent event bubbling
    
    if (!confirm('Are you sure you want to delete this meal?')) {
        return;
    }
    
    const mealItem = this.closest('.meal-grid-item');
    
    // Determine meal category
    let mealCategory = '';
    for (const category of CATEGORIES) {
        if (mealItem.classList.contains(category)) {
            // Format the category name for display (capitalize first letter)
            mealCategory = category.charAt(0).toUpperCase() + category.slice(1);
            break;
        }
    }
    
    // FIX: Calculate day based on column position in row
    const parentRow = mealItem.parentElement;
    const rowItems = Array.from(parentRow.children);
    const colPosition = rowItems.indexOf(mealItem);
    const dayIndex = colPosition - 1;
    
    const mealDay = DAYS[dayIndex] || '';
    
    // Remove from localStorage
    if (mealDay) {
        removeMealFromStorage(mealCategory.toLowerCase(), mealDay);
    }
    
    // Replace with "Add Meal" button
    mealItem.innerHTML = `
        <div class="add-meal">
            <i class="fas fa-plus"></i> Add ${mealCategory}
        </div>
    `;
    
    // Add event listener to the new "Add Meal" button
    mealItem.querySelector('.add-meal').addEventListener('click', openModal);
}

function formatDate(date) {
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function updateWeekDisplay() {
    const startOfWeek = new Date(currentDate);
    const endOfWeek = new Date(currentDate);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    const formattedStart = formatDate(startOfWeek);
    const formattedEnd = formatDate(endOfWeek);
    
    currentWeek.textContent = `${formattedStart} - ${formattedEnd}`;
    
    // Save current week to localStorage
    localStorage.setItem('currentPlannerWeek', currentDate.toISOString());
}

// LocalStorage functions for data persistence
function getStorageKey(category, day) {
    const weekStart = new Date(currentDate);
    return `mealPlanner_${weekStart.toISOString().slice(0, 10)}_${category}_${day}`;
}

function saveMealToStorage(category, day, mealData) {
    const key = getStorageKey(category, day);
    localStorage.setItem(key, JSON.stringify(mealData));
}

function getMealFromStorage(category, day) {
    const key = getStorageKey(category, day);
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

function removeMealFromStorage(category, day) {
    const key = getStorageKey(category, day);
    localStorage.removeItem(key);
}

function loadMealsForCurrentWeek() {
    // Get all category rows
    const categoryRows = document.querySelectorAll('.meal-grid-row');
    
    // For each category
    for (let i = 0; i < CATEGORIES.length; i++) {
        const category = CATEGORIES[i];
        
        // Skip if row doesn't exist
        if (i >= categoryRows.length) continue;
        
        const row = categoryRows[i];
        const cells = row.querySelectorAll('.meal-grid-item');
        
        // For each day cell (skip the first label cell)
        for (let j = 1; j < cells.length; j++) {
            // Skip if this is not a day cell
            if (j - 1 >= DAYS.length) continue;
            
            const day = DAYS[j - 1];
            const cell = cells[j];
            
            // Get meal data from storage
            const mealData = getMealFromStorage(category, day);
            
            if (mealData) {
                // We have a saved meal, display it
                const displayCategory = category.charAt(0).toUpperCase() + category.slice(1);
                
                // Create meal element
                const newMeal = document.createElement('div');
                newMeal.className = 'meal-item';
                newMeal.innerHTML = `
                    <div class="meal-item-title">${mealData.name}</div>
                    <div class="meal-item-info">
                        <span>${mealData.calories} cal</span>
                        <span>${mealData.protein}g protein</span>
                    </div>
                    ${mealData.notes ? `<div class="meal-item-notes">${mealData.notes}</div>` : ''}
                `;
                
                // Add meal actions
                const actions = document.createElement('div');
                actions.className = 'meal-item-actions';
                actions.innerHTML = `
                    <button class="meal-action-btn edit-meal"><i class="fas fa-pencil-alt"></i></button>
                    <button class="meal-action-btn delete-meal"><i class="fas fa-trash-alt"></i></button>
                `;
                
                // Clear existing content
                cell.innerHTML = '';
                
                // Add the new meal content
                cell.appendChild(newMeal);
                cell.appendChild(actions);
                
                // Add event listeners
                const editBtn = actions.querySelector('.edit-meal');
                const deleteBtn = actions.querySelector('.delete-meal');
                
                editBtn.addEventListener('click', editMeal);
                deleteBtn.addEventListener('click', deleteMeal);
            } else {
                // No saved meal, show "Add Meal" button
                const displayCategory = category.charAt(0).toUpperCase() + category.slice(1);
                cell.innerHTML = `
                    <div class="add-meal">
                        <i class="fas fa-plus"></i> Add ${displayCategory}
                    </div>
                `;
                
                // Add event listener
                cell.querySelector('.add-meal').addEventListener('click', openModal);
            }
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeDate();
    setupEventListeners();
    updateWeekDisplay();
    loadMealsForCurrentWeek();
});