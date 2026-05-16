
// ======================
// VARIABLES
// ======================
let habits = [];
let streak = 0;
let streakUpdated = false;
let habitChart;

const addBtn = document.getElementById("addBtn");
const habitInput = document.getElementById("habitInput");
const habitList = document.getElementById("habitList");

const total = document.getElementById("total");
const completed = document.getElementById("completed");
const progressBar = document.getElementById("progressBar");

const streakText = document.getElementById("streak");

const darkToggle = document.getElementById("darkToggle");

const categorySelect = document.getElementById("categorySelect");

const studyCount = document.getElementById("studyCount");
const healthCount = document.getElementById("healthCount");
const workCount = document.getElementById("workCount");
const selfCount = document.getElementById("selfCount");

const chartCanvas = document.getElementById("habitChart");


// ======================
// SAVE DATA
// ======================
function saveHabits() {
    localStorage.setItem("habits", JSON.stringify(habits));
}


// ======================
// CATEGORY COLOR
// ======================
function getCategoryColor(category) {

    if (category === "Study") return "#8b5cf6";
    if (category === "Health") return "#22c55e";
    if (category === "Work") return "#3b82f6";
    if (category === "Self") return "#f97316";

    return "gray";
}


// ======================
// UPDATE STATS
// ======================
function updateStats() {

    total.textContent = habits.length;

    const completedHabits = habits.filter(h => h.completed).length;

    completed.textContent = completedHabits;

    const progress = habits.length > 0
        ? (completedHabits / habits.length) * 100
        : 0;

    progressBar.style.width = progress + "%";
}


// ======================
// UPDATE STREAK
// ======================
function updateStreak() {

    const completedHabits = habits.filter(h => h.completed).length;

    if (
        habits.length > 0 &&
        completedHabits === habits.length &&
        streakUpdated === false
    ) {
        streak++;
        streakUpdated = true;
        localStorage.setItem("streak", streak);
    }

    if (completedHabits !== habits.length) {
        streakUpdated = false;
    }

    streakText.textContent = `🔥 Streak: ${streak}`;
}


// ======================
// UPDATE ANALYTICS
// ======================
function updateAnalytics() {

    let study = 0, health = 0, work = 0, self = 0;

    habits.forEach(habit => {

        if (habit.category === "Study") study++;
        else if (habit.category === "Health") health++;
        else if (habit.category === "Work") work++;
        else if (habit.category === "Self") self++;

    });

    studyCount.textContent = study;
    healthCount.textContent = health;
    workCount.textContent = work;
    selfCount.textContent = self;
}


// ======================
// RENDER CHART
// ======================
function renderChart() {

    let study = 0, health = 0, work = 0, self = 0;

    habits.forEach(habit => {

        if (habit.category === "Study") study++;
        else if (habit.category === "Health") health++;
        else if (habit.category === "Work") work++;
        else if (habit.category === "Self") self++;

    });

    if (habitChart) habitChart.destroy();

    habitChart = new Chart(chartCanvas, {
        type: "doughnut",
        data: {
            labels: ["Study", "Health", "Work", "Self Care"],
            datasets: [{
                data: [study, health, work, self],
                backgroundColor: [
                    "#8b5cf6",
                    "#22c55e",
                    "#3b82f6",
                    "#f97316"
                ]
            }]
        }
    });
}


// ======================
// CREATE HABIT ELEMENT
// ======================
function createHabitElement(habit) {

    const li = document.createElement("li");

    const span = document.createElement("span");

    const color = getCategoryColor(habit.category);

    span.innerHTML = `
        ${habit.text}
        <span class="category-tag" style="background:${color}">
            ${habit.category}
        </span>
    `;

    if (habit.completed) {
        span.classList.add("completed");
    }
	
	const editBtn = document.createElement("button");
editBtn.textContent = "Edit";

editBtn.addEventListener("click", function () {
    const newText = prompt("Edit habit:", habit.text);

    if (newText) {
        habit.text = newText;
        saveHabits();
        location.reload();
    }
});

    // DONE / UNDO BUTTON
    const completeBtn = document.createElement("button");
    completeBtn.textContent = habit.completed ? "↩ Undo" : "✔ Done";

    completeBtn.addEventListener("click", function () {

        habit.completed = !habit.completed;

        span.classList.toggle("completed");

        saveHabits();
        updateStats();
        updateAnalytics();
        updateStreak();
        renderChart();

        completeBtn.textContent = habit.completed ? "↩ Undo" : "✔ Done";
    });

    // DELETE BUTTON
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";

    deleteBtn.addEventListener("click", function () {

        habits = habits.filter(h => h !== habit);

        li.remove();

        saveHabits();
        updateStats();
        updateAnalytics();
        renderChart();
    });

    li.appendChild(span);
	li.appendChild(editBtn);
	
    li.appendChild(completeBtn);
	
    li.appendChild(deleteBtn);
	

    habitList.appendChild(li);
}


// ======================
// ADD HABIT
// ======================
addBtn.addEventListener("click", function () {

    const habitText = habitInput.value.trim();
    const category = categorySelect.value;

    if (habitText === "") {
        alert("Please enter a habit");
        return;
    }

    const habitObject = {
        text: habitText,
        category: category,
        completed: false
    };

    habits.push(habitObject);

    createHabitElement(habitObject);

    saveHabits();

    habitInput.value = "";

    updateStats();
    updateAnalytics();
    renderChart();
});


// ======================
// LOAD DATA
// ======================
window.addEventListener("load", function () {

    const stored = JSON.parse(localStorage.getItem("habits"));

    if (stored) {
        habits = stored;
        habits.forEach(createHabitElement);
    }

    const savedStreak = localStorage.getItem("streak");

    if (savedStreak) {
        streak = Number(savedStreak);
    }

    streakText.textContent = `🔥 Streak: ${streak}`;

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
        darkToggle.textContent = "☀️ Light Mode";
    }

    updateStats();
    updateAnalytics();
    renderChart();
});


// ======================
// DARK MODE
// ======================
darkToggle.addEventListener("click", function () {

    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        darkToggle.textContent = "☀️ Light Mode";
        localStorage.setItem("theme", "dark");
    } else {
        darkToggle.textContent = "🌙 Dark Mode";
        localStorage.setItem("theme", "light");
    }
});