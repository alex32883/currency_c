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
            result = prev % current;
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

