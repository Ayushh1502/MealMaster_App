
        // DOM Elements
        const addMealBtns = document.querySelectorAll('.add-meal');
        const modal = document.getElementById('addMealModal');
        const modalClose = document.querySelectorAll('.modal-close');
        const saveMealBtn = document.getElementById('save-meal');
        
        // Event Listeners
        addMealBtns.forEach(btn => {
            btn.addEventListener('click', openModal);
        });
        
        modalClose.forEach(btn => {
            btn.addEventListener('click', closeModal);
        });
        
        saveMealBtn.addEventListener('click', saveMeal);
        
        // Functions
        function openModal() {
            modal.classList.add('active');
            
            // Get meal category and day from the clicked element
            const mealItem = this.closest('.meal-grid-item');
            const mealCategory = mealItem.classList.contains('breakfast') ? 'breakfast' : 
                                mealItem.classList.contains('lunch') ? 'lunch' :
                                mealItem.classList.contains('dinner') ? 'dinner' : 'snack';
            
            // Set the default category in the dropdown
            document.getElementById('meal-category').value = mealCategory;
            
            // Calculate the day index (0-6) based on the column position
            const columnIndex = Array.from(mealItem.parentNode.children).indexOf(mealItem) - 1;
            const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
            if (columnIndex >= 0 && columnIndex < 7) {
                document.getElementById('meal-day').value = days[columnIndex];
            }
        }
        
        function closeModal() {
            modal.classList.remove('active');
        }
        
        function saveMeal() {
            // Get form values
            const mealName = document.getElementById('meal-name').value;
            const mealCategory = document.getElementById('meal-category').value;
            const mealDay = document.getElementById('meal-day').value;
            const mealCalories = document.getElementById('meal-calories').value;
            const mealProtein = document.getElementById('meal-protein').value;
            
            // Validate form
            if (!mealName) {
                alert('Please enter a meal name');
                return;
            }
            
            // Create new meal element
            const newMeal = document.createElement('div');
            newMeal.className = 'meal-item';
            newMeal.innerHTML = `
                <div class="meal-item-title">${mealName}</div>
                <div class="meal-item-info">
                    <span>${mealCalories} cal</span>
                    <span>${mealProtein}g protein</span>
                </div>
            `;
            
            // Add meal actions
            const actions = document.createElement('div');
            actions.className = 'meal-item-actions';
            actions.innerHTML = `
                <button class="meal-action-btn"><i class="fas fa-pencil-alt"></i></button>
                <button class="meal-action-btn"><i class="fas fa-trash-alt"></i></button>
            `;
            
            // Find the correct grid item to add the meal to
            const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
            const dayIndex = days.indexOf(mealDay);
            const categoryRows = {
                'breakfast': 0,
                'lunch': 1,
                'dinner': 2,
                'snack': 3
            };
            const rowIndex = categoryRows[mealCategory];
            
            // Calculate the position in the grid
            const gridPosition = 8 * (rowIndex + 1) + (dayIndex + 1);
            const gridItems = document.querySelectorAll('.meal-grid-item');
            
            if (gridPosition < gridItems.length) {
                const targetGridItem = gridItems[gridPosition];
                
                // Replace "Add Meal" with the new meal
                targetGridItem.innerHTML = '';
                targetGridItem.appendChild(newMeal);
                targetGridItem.appendChild(actions);
                
                // Add event listeners to the new action buttons
                const editBtn = actions.querySelector('.meal-action-btn:first-child');
                const deleteBtn = actions.querySelector('.meal-action-btn:last-child');
                
                editBtn.addEventListener('click', editMeal);
                deleteBtn.addEventListener('click', deleteMeal);
            }
            
            // Close the modal
            closeModal();
            
            // Reset form
            document.getElementById('meal-name').value = '';
            document.getElementById('meal-calories').value = '';
            document.getElementById('meal-protein').value = '';
            document.getElementById('meal-notes').value = '';
        }
        
        function editMeal() {
            // Get the meal item
            const mealItem = this.closest('.meal-grid-item');
            const mealTitle = mealItem.querySelector('.meal-item-title').textContent;
            const mealInfo = mealItem.querySelector('.meal-item-info').textContent;
            
            // Extract calorie and protein information
            const calorieMatch = mealInfo.match(/(\d+) cal/);
            const proteinMatch = mealInfo.match(/(\d+)g protein/);
            
            const calories = calorieMatch ? calorieMatch[1] : '';
            const protein = proteinMatch ? proteinMatch[1] : '';
            
            // Pre-fill the modal form
            document.getElementById('meal-name').value = mealTitle;
            document.getElementById('meal-calories').value = calories;
            document.getElementById('meal-protein').value = protein;
            
            // Open the modal
            modal.classList.add('active');
            
            // Store the reference to the meal item for updating
            saveMealBtn.dataset.editId = Array.from(document.querySelectorAll('.meal-grid-item')).indexOf(mealItem);
        }
        
        function deleteMeal() {
            // Get the meal item
            const mealItem = this.closest('.meal-grid-item');
            const mealCategory = mealItem.classList.contains('breakfast') ? 'breakfast' : 
                                mealItem.classList.contains('lunch') ? 'lunch' :
                                mealItem.classList.contains('dinner') ? 'dinner' : 'snack';
            
            // Replace with "Add Meal" button
            mealItem.innerHTML = `
                <div class="add-meal">
                    <i class="fas fa-plus"></i> Add ${mealCategory.charAt(0).toUpperCase() + mealCategory.slice(1)}
                </div>
            `;
            
            // Add event listener to the new "Add Meal" button
            mealItem.querySelector('.add-meal').addEventListener('click', openModal);
        }
        
        // Week navigation
        const weekPrev = document.querySelector('.week-prev');
        const weekNext = document.querySelector('.week-next');
        const currentWeek = document.querySelector('.current-week');
        
        // weekPrev.addEventListener('click', () => {
        //     // Update the week display (in a real app, this would navigate to the previous week)
        //     alert('Navigate to previous week');
        // });
        
        // weekNext.addEventListener('click', () => {
        //     // Update the week display (in a real app, this would navigate to the next week)
        //     alert('Navigate to next week');
        // });  