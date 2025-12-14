// Calculator functionality
let display = document.getElementById('display');
let currentInput = '0';
let previousInput = '';
let operator = '';
let shouldResetDisplay = false;

// Exchange rates (base: USD)
// These rates are approximate and should be updated with real-time data
const exchangeRates = {
    USD: 1.0,
    CAD: 1.35,    // 1 USD = 1.35 CAD
    RUB: 92.0,    // 1 USD = 92 RUB
    UAH: 37.0     // 1 USD = 37 UAH
};

function updateDisplay() {
    display.value = currentInput;
}

function appendNumber(number) {
    if (shouldResetDisplay) {
        currentInput = '0';
        shouldResetDisplay = false;
    }
    
    if (currentInput === '0' && number !== '.') {
        currentInput = number;
    } else {
        currentInput += number;
    }
    updateDisplay();
}

function appendDecimal() {
    if (shouldResetDisplay) {
        currentInput = '0';
        shouldResetDisplay = false;
    }
    
    if (!currentInput.includes('.')) {
        currentInput += '.';
        updateDisplay();
    }
}

function appendOperator(op) {
    if (previousInput !== '' && operator !== '') {
        calculate();
    }
    
    previousInput = currentInput;
    operator = op;
    shouldResetDisplay = true;
}

function calculate() {
    if (previousInput === '' || operator === '') {
        return;
    }
    
    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    
    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                alert('Cannot divide by zero!');
                clearDisplay();
                return;
            }
            result = prev / current;
            break;
        case '%':
            result = (prev * current) / 100;
            break;
        default:
            return;
    }
    
    // Round to avoid floating point precision issues
    result = Math.round(result * 100000000) / 100000000;
    
    currentInput = result.toString();
    previousInput = '';
    operator = '';
    shouldResetDisplay = true;
    updateDisplay();
}

function clearDisplay() {
    currentInput = '0';
    previousInput = '';
    operator = '';
    shouldResetDisplay = false;
    updateDisplay();
}

function clearEntry() {
    currentInput = '0';
    shouldResetDisplay = false;
    updateDisplay();
}

// Currency conversion functionality
function convertCurrency() {
    const amount = parseFloat(document.getElementById('amount').value);
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;
    const resultInput = document.getElementById('result');
    
    if (isNaN(amount) || amount < 0) {
        alert('Please enter a valid amount');
        return;
    }
    
    if (fromCurrency === toCurrency) {
        resultInput.value = amount.toFixed(2);
        return;
    }
    
    // Convert to USD first, then to target currency
    const amountInUSD = amount / exchangeRates[fromCurrency];
    const convertedAmount = amountInUSD * exchangeRates[toCurrency];
    
    // Round to 2 decimal places
    resultInput.value = convertedAmount.toFixed(2);
}

// Auto-convert when amount or currency changes
document.getElementById('amount').addEventListener('input', convertCurrency);
document.getElementById('fromCurrency').addEventListener('change', convertCurrency);
document.getElementById('toCurrency').addEventListener('change', convertCurrency);

// Initialize currency conversion on page load
window.addEventListener('load', convertCurrency);

// Keyboard support for calculator
document.addEventListener('keydown', function(event) {
    // Only handle calculator keys if not in a text input/textarea
    const target = event.target;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
    }
    
    const key = event.key;
    
    if (key >= '0' && key <= '9') {
        appendNumber(key);
    } else if (key === '.') {
        appendDecimal();
    } else if (key === '+') {
        appendOperator('+');
    } else if (key === '-') {
        appendOperator('-');
    } else if (key === '*') {
        appendOperator('*');
    } else if (key === '/') {
        event.preventDefault();
        appendOperator('/');
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculate();
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
        clearDisplay();
    } else if (key === 'Backspace') {
        if (currentInput.length > 1) {
            currentInput = currentInput.slice(0, -1);
        } else {
            currentInput = '0';
        }
        updateDisplay();
    }
});

// ==================== Clock Functionality ====================
function updateClock() {
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour12: false });
    const date = now.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    const timeElement = document.getElementById('time');
    const dateElement = document.getElementById('date');
    
    if (timeElement) timeElement.textContent = time;
    if (dateElement) dateElement.textContent = date;
}

// Update clock every second
setInterval(updateClock, 1000);
updateClock();

// ==================== Calendar Functionality ====================
// Store notes data in localStorage
const STORAGE_KEY = 'dateNotes';

function getDateNotes() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
}

function saveDateNotes(notes) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

let dateNotes = getDateNotes();
let currentSelectedDate = null;

// Format date as YYYY-MM-DD
function formatDate(year, month, day) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

// Calendar functionality
function generateCalendar() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December'];
    
    const calendarHeader = document.getElementById('calendarHeader');
    if (calendarHeader) {
        calendarHeader.textContent = `${monthNames[month]} ${year}`;
    }
    
    const calendarGrid = document.getElementById('calendarGrid');
    if (!calendarGrid) return;
    
    calendarGrid.innerHTML = '';
    
    // Day headers
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayHeaders.forEach(day => {
        const header = document.createElement('div');
        header.className = 'calendar-day-header';
        header.textContent = day;
        calendarGrid.appendChild(header);
    });
    
    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day other-month';
        calendarGrid.appendChild(emptyDay);
    }
    
    // Days of the month
    const today = now.getDate();
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;
        
        const dateKey = formatDate(year, month, day);
        
        if (day === today) {
            dayElement.classList.add('today');
        }
        
        // Check if date has a note
        if (dateNotes[dateKey]) {
            dayElement.classList.add('has-note');
        }
        
        // Add click handler
        dayElement.addEventListener('click', () => openNoteModal(dateKey, year, month, day));
        
        calendarGrid.appendChild(dayElement);
    }
}

// Open note modal
function openNoteModal(dateKey, year, month, day) {
    currentSelectedDate = dateKey;
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December'];
    
    const modalDateTitle = document.getElementById('modalDateTitle');
    if (modalDateTitle) {
        modalDateTitle.textContent = `Note for ${monthNames[month]} ${day}, ${year}`;
    }
    
    // Load existing note
    const dateNoteInput = document.getElementById('dateNoteInput');
    if (dateNoteInput) {
        dateNoteInput.value = dateNotes[dateKey] || '';
    }
    
    // Show modal
    const noteModal = document.getElementById('noteModal');
    if (noteModal) {
        noteModal.classList.add('show');
        if (dateNoteInput) dateNoteInput.focus();
    }
}

// Close note modal
function closeNoteModal() {
    const noteModal = document.getElementById('noteModal');
    if (noteModal) {
        noteModal.classList.remove('show');
    }
    currentSelectedDate = null;
}

// Save date note
function saveDateNote() {
    if (!currentSelectedDate) return;
    
    const dateNoteInput = document.getElementById('dateNoteInput');
    if (!dateNoteInput) return;
    
    const note = dateNoteInput.value;
    
    // Update notes
    if (note && note.trim()) {
        dateNotes[currentSelectedDate] = note.trim();
    } else {
        delete dateNotes[currentSelectedDate];
    }
    
    // Save to localStorage
    saveDateNotes(dateNotes);
    
    // Regenerate calendar to update visual markers
    generateCalendar();
    closeNoteModal();
}

// Modal event listeners
document.addEventListener('DOMContentLoaded', function() {
    const closeModal = document.getElementById('closeModal');
    const cancelNote = document.getElementById('cancelNote');
    const saveDateNoteBtn = document.getElementById('saveDateNote');
    const noteModal = document.getElementById('noteModal');
    
    if (closeModal) {
        closeModal.addEventListener('click', closeNoteModal);
    }
    
    if (cancelNote) {
        cancelNote.addEventListener('click', closeNoteModal);
    }
    
    if (saveDateNoteBtn) {
        saveDateNoteBtn.addEventListener('click', saveDateNote);
    }
    
    // Close modal when clicking outside
    if (noteModal) {
        noteModal.addEventListener('click', (e) => {
            if (e.target.id === 'noteModal') {
                closeNoteModal();
            }
        });
    }
    
    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && noteModal && noteModal.classList.contains('show')) {
            closeNoteModal();
        }
    });
    
    // Initialize calendar
    generateCalendar();
});

// ==================== Notepad Functionality ====================
function saveNotepadFile() {
    const text = document.getElementById('textInput').value;
    const filename = document.getElementById('filenameInput').value;
    const saveButton = document.getElementById('saveButton');
    const message = document.getElementById('message');
    
    if (!text.trim()) {
        if (message) {
            message.textContent = 'Please enter some text before saving.';
            message.className = 'message error';
            message.style.display = 'block';
        }
        return;
    }
    
    if (saveButton) {
        saveButton.disabled = true;
        saveButton.textContent = 'Saving...';
    }
    
    if (message) {
        message.style.display = 'none';
    }
    
    try {
        // Create filename
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        let safeFilename = '';
        
        if (filename && filename.trim()) {
            // Remove invalid filename characters and trim
            safeFilename = filename.trim().replace(/[<>:"/\\|?*]/g, '').replace(/\s+/g, '-');
            safeFilename = `${safeFilename}-notepad-${timestamp}.txt`;
        } else {
            safeFilename = `notepad-${timestamp}.txt`;
        }
        
        // Create blob and download
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = safeFilename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Show success message
        if (message) {
            message.textContent = `File saved successfully: ${safeFilename}`;
            message.className = 'message success';
            message.style.display = 'block';
        }
        
        // Clear the textarea and filename input after successful save
        const textInput = document.getElementById('textInput');
        const filenameInput = document.getElementById('filenameInput');
        if (textInput) textInput.value = '';
        if (filenameInput) filenameInput.value = '';
        
    } catch (error) {
        if (message) {
            message.textContent = `Error: ${error.message}`;
            message.className = 'message error';
            message.style.display = 'block';
        }
    } finally {
        if (saveButton) {
            saveButton.disabled = false;
            saveButton.textContent = '💾 Save Text';
        }
    }
}

// Clear notepad functionality
function clearNotepad() {
    const textInput = document.getElementById('textInput');
    const filenameInput = document.getElementById('filenameInput');
    const message = document.getElementById('message');
    
    if (textInput) textInput.value = '';
    if (filenameInput) filenameInput.value = '';
    if (message) message.style.display = 'none';
}

// Initialize notepad event listeners
document.addEventListener('DOMContentLoaded', function() {
    const saveButton = document.getElementById('saveButton');
    const clearButton = document.getElementById('clearButton');
    
    if (saveButton) {
        saveButton.addEventListener('click', saveNotepadFile);
    }
    
    if (clearButton) {
        clearButton.addEventListener('click', clearNotepad);
    }
});

