// script.js

const sampleTextArray = [
    "The quick brown fox jumps over the lazy dog.",
    "Pack my box with five dozen liquor jugs.",
    "How razorback-jumping frogs can level six piqued gymnasts!",
    "The five boxing wizards jump quickly.",
    "Bright vixens jump; dozy fowl quack.",
];

const textContainer = document.getElementById('text-container');
const startTestBtn = document.getElementById('start-test');
const stopTestBtn = document.getElementById('stop-test');
const timerDisplay = document.getElementById('timer');
const results = document.getElementById('results');

let currentText = "";
let typedText = "";
let timerStarted = false;
let timerInterval;
let startTime;

function startTest() {
    typedText = "";
    results.textContent = '';
    textContainer.innerHTML = '';
    timerDisplay.textContent = "60";
    timerStarted = true;

    // Initialize with fresh text
    currentText = "";
    loadText();

    // Start the timer
    startTimer(3);

    // Focus the text container for direct typing
    document.addEventListener('keydown', handleTyping);
}

function startTimer(duration) {
    startTime = new Date();
    let timeRemaining = duration;

    timerInterval = setInterval(() => {
        timeRemaining--;
        timerDisplay.textContent = timeRemaining;

        if (timeRemaining <= 0 && timerStarted) {
            clearInterval(timerInterval);
            endTest();
        }
    }, 1000);
}

function loadText() {
    while (currentText.length < typedText.length + 100) { // Ensure enough text is available
        const newText = sampleTextArray[Math.floor(Math.random() * sampleTextArray.length)];
        currentText += " " + newText;
    }
    renderText();
}

function renderText() {
    // Highlight correct and incorrect characters
    let displayText = "";
    for (let i = 0; i < currentText.length; i++) {
        if (i < typedText.length) {
            displayText += `<span class="${currentText[i] === typedText[i] ? 'text-green-500' : 'text-red-500'}">${currentText[i]}</span>`;
        } else {
            displayText += currentText[i];
        }
    }
    textContainer.innerHTML = displayText;
}

function handleTyping(e) {
    if (!timerStarted) return;

    if (e.key.length === 1) { // Normal character input
        typedText += e.key;
    } else if (e.key === "Backspace") {
        typedText = typedText.slice(0, -1);
    } else if (e.key === "Tab" || e.key === "Enter") {
        e.preventDefault(); // Prevent tab and enter from moving focus or adding lines
    } else if (e.key === " ") {
        // Allow space to only add if the last character is not already a space
        if (typedText[typedText.length - 1] !== " ") {
            typedText += " ";
        }
        e.preventDefault(); // Prevent default space behavior
    }

    renderText();

    // Load more text if needed
    if (typedText.length === currentText.length) {
        loadText();
    }
}

function endTest() {
    const endTime = new Date();
    const timeTaken = (endTime - startTime) / 1000; // Time in seconds
    const wordCount = typedText.trim().split(/\s+/).length;
    const wpm = Math.round((wordCount / timeTaken) * 60);

    results.textContent = `Time's up! Your typing speed is ${wpm} WPM.`;

    timerStarted = false;
    document.removeEventListener('keydown', handleTyping); // Stop further input
}

startTestBtn.addEventListener('click', startTest);
stopTestBtn.addEventListener('click', endTest);
