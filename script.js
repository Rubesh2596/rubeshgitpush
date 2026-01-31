class Calculator {
    constructor() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;
        
        this.previousOperandElement = document.querySelector('.previous-operand');
        this.currentOperandElement = document.querySelector('.current-operand');
        
        this.setupEventListeners();
    }
    //event listeners
    setupEventListeners() {
        document.querySelectorAll('[data-number]').forEach(button => {
            button.addEventListener('click', () => this.appendNumber(button.innerText));
        });
        //querry selector
        document.querySelectorAll('[data-action="operator"]').forEach(button => {
            button.addEventListener('click', () => this.chooseOperation(button.innerText));
        });
        
        document.querySelector('[data-action="equals"]').addEventListener('click', () => this.compute());
        document.querySelector('[data-action="clear"]').addEventListener('click', () => this.clear());
        document.querySelector('[data-action="delete"]').addEventListener('click', () => this.delete());
        document.querySelector('[data-action="decimal"]').addEventListener('click', () => this.appendDecimal());
        
        // Keyboard support
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }
    
    handleKeyboard(e) {
        if (e.key >= '0' && e.key <= '9') this.appendNumber(e.key);
        if (e.key === '.') this.appendDecimal();
        if (e.key === 'Escape') this.clear();
        if (e.key === 'Backspace') this.delete();
        if (e.key === 'Enter' || e.key === '=') this.compute();
        if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
            const operatorMap = {
                '+': '+',
                '-': '−',
                '*': '×',
                '/': '÷'
            };
            this.chooseOperation(operatorMap[e.key]);
        }
    }
    
    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;
        this.updateDisplay();
    }
    
    delete() {
        if (this.currentOperand === '0') return;
        
        if (this.currentOperand.length === 1) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.slice(0, -1);
        }
        
        this.updateDisplay();
    }
    
    appendNumber(number) {
        if (this.shouldResetScreen) {
            this.currentOperand = '';
            this.shouldResetScreen = false;
        }
        
        if (this.currentOperand === '0' && number !== '0') {
            this.currentOperand = number;
        } else if (this.currentOperand !== '0') {
            this.currentOperand += number;
        }
        
        this.updateDisplay();
    }
    
    appendDecimal() {
        if (this.shouldResetScreen) {
            this.currentOperand = '0';
            this.shouldResetScreen = false;
        }
        
        if (this.currentOperand.includes('.')) return;
        
        this.currentOperand += '.';
        this.updateDisplay();
    }
    
    chooseOperation(operator) {
        if (this.currentOperand === '') return;
        
        if (this.previousOperand !== '') {
            this.compute();
        }
        
        this.operation = operator;
        this.previousOperand = this.currentOperand;
        this.shouldResetScreen = true;
        this.updateDisplay();
    }
    
    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '−':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    this.currentOperand = 'Error';
                    this.updateDisplay();
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }
        
        this.currentOperand = this.formatNumber(computation);
        this.operation = undefined;
        this.previousOperand = '';
        this.shouldResetScreen = true;
        this.updateDisplay();
    }
    
    formatNumber(number) {
        // Handle very large or very small numbers
        if (Math.abs(number) > 999999999 || (Math.abs(number) < 0.000001 && number !== 0)) {
            return number.toExponential(6);
        }
        
        // Round to avoid floating point precision issues
        const roundedNumber = Math.round(number * 100000000) / 100000000;
        
        // Convert to string and remove trailing zeros
        let stringNumber = roundedNumber.toString();
        if (stringNumber.includes('.')) {
            stringNumber = stringNumber.replace(/\.?0+$/, '');
        }
        
        return stringNumber;
    }
    
    updateDisplay() {
        this.currentOperandElement.innerText = this.currentOperand;
        
        if (this.operation != null) {
            this.previousOperandElement.innerText = `${this.previousOperand} ${this.operation}`;
        } else {
            this.previousOperandElement.innerText = '';
        }
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});
