// Defining variables
let flashcards = [];
let stages = [1, 3, 7, 14];
let date = new Date(); // From W3Schools

// Loading flashcards from local storage
function loadFlashcards() {
    let savedFlashcards = localStorage.getItem('flashcards');
    if (savedFlashcards) {
        flashcards = JSON.parse(savedFlashcards);
    }
    resetReviewedToday();
    displayFlashcards();
}

// Reset reviewedToday at the start of a new day
function resetReviewedToday() {
    let currentDay = getCurrentDay();

    // Reset the reviewedToday if it's a new day
    for (let index = 0; index < flashcards.length; index++) {
        let flashcard = flashcards[index]
        if (flashcard.reviewedToday && flashcard.nextReview <= currentDay) {
            flashcard.reviewedToday = false;  // reset only if the card is past its review date & if you had reviewed it previously
        }
    }

    localStorage.setItem('flashcards', JSON.stringify(flashcards));
}

// Toggle visibility of the flashcard form using display
function toggleFlashcardForm() {
    let form = document.getElementById('flashcard-form');

    // Toggle between showing and hiding the form
    if (form.style.display === "none") {
        form.style.display = "block";
        button.innerHTML = 'Hide Form';
    } else {
        form.style.display = "none";
        button.innerHTML = 'Show Form';
    }
}


// Display flashcards
function displayFlashcards() {
    let flashcardList = document.getElementById('flashcard-list');
    flashcardList.innerHTML = ''; // Clears out what is currently on screen

    for (let index = 0; index < flashcards.length; index++) {
        let flashcard = flashcards[index];

        if (flashcard.reviewedToday) {
            continue;
        }

        let daysRemaining = flashcard.nextReview - getCurrentDay();
        let reviewText = daysRemaining <= 0 ? "Today" : `${daysRemaining} days`;

        flashcardList.innerHTML += `
        <li>
            <div>
                <strong>Question: </strong> 
                <p class="question-text"> ${flashcard.question}</p>
                <div class="flashcard-answer" id="answer-${index}">
                    <p>Answer:</p> ${flashcard.answer}
                </div>
                <br>
                <button class="show-answer-btn" onclick="toggleAnswer(${index})">Show Answer</button>
                <p>Next Review in:</p> <span class="next-review">${reviewText}</span>
            </div>
            <div class="button-container">
                <button onclick="deleteFlashcard(${index})">Delete</button>
                <button class="edit-btn" onclick="editFlashcard(${index})">Edit</button>
            </div>
            <div class="difficulty-buttons">
                <button class="easy" onclick="setDifficulty(${index}, 'easy')">Easy</button>
                <button class="medium" onclick="setDifficulty(${index}, 'medium')">Medium</button>
                <button class="hard" onclick="setDifficulty(${index}, 'hard')">Hard</button>
            </div>
        </li>
        `;
    }
}


// Get current date (days since 1st of January 1970 (unix time) in milliseconds)
function getCurrentDay() {
    return Math.floor(date.getTime() / (1000 * 60 * 60 * 24)); // W3Schools
}

// Add a new flashcard
function addFlashcard() {
    let question = document.getElementById('question').value;
    let answer = document.getElementById('answer').value;

    if (question && answer) {
        let newFlashcard = {
            question,
            answer,
            stage: 1,
            nextReview: getCurrentDay(),
            reviewedToday: false
        };
        flashcards.push(newFlashcard);

        localStorage.setItem('flashcards', JSON.stringify(flashcards));
        document.getElementById('question').value = ''; // Resetting input for user
        document.getElementById('answer').value = ''; // Resetting input for user
        displayFlashcards();
    } else {
        alert('Please enter both a question and an answer.');
    }
}

// Delete a flashcard
function deleteFlashcard(index) {
    flashcards.splice(index, 1); // At the index remove 1 element (MDN)
    localStorage.setItem('flashcards', JSON.stringify(flashcards));
    displayFlashcards();
}

// Edit a flashcard
function editFlashcard(index) {
    toggleFlashcardForm()
    let flashcard = flashcards[index];

    document.getElementById('question').value = flashcard.question;
    document.getElementById('answer').value = flashcard.answer;

    deleteFlashcard(index);
}

// Set difficulty based on button clicked
function setDifficulty(index, difficulty) {
    let flashcard = flashcards[index];
    let currentDay = getCurrentDay()

    if (flashcard.reviewedToday) {
        return ""; // If reviewed return nothing (OpenAI)
    }

    // Mark as reviewed today
    flashcard.reviewedToday = true;

    // Space repition Algorithm (OpenAI)
    if (difficulty === "easy") {
        if (flashcard.stage < 4) {
            flashcard.stage += 1;  // Move to the next stage
        }
    } else if (difficulty === "medium") {
        if (flashcard.stage < 3) {
            flashcard.stage += 1; // Move up, but not past stage 3
        }
    } // If it is hard stay at the same stage (do nothing)

    // Update next review date based on new stage
    flashcard.nextReview = currentDay + stages[flashcard.stage - 1];

    // Save updated flashcards to local storage
    localStorage.setItem('flashcards', JSON.stringify(flashcards));
    displayFlashcards();
}

// Toggle visibility of the answer
function toggleAnswer(index) {
    let answerElement = document.getElementById(`answer-${index}`);
    let showAnswerButton = document.querySelectorAll(".show-answer-btn")[index - 1];

    if (answerElement.style.display === "none") {
        answerElement.style.display = "block";
        showAnswerButton.innerHTML = "Hide Answer";
    } else {
        answerElement.style.display = "none";
        showAnswerButton.innerHTML = "Show Answer";
    }
}

// Load flashcards when page loads
loadFlashcards();
