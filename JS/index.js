// Generación de operaciones matemáticas aleatorias
function generateMathProblem() {
    const operators = ['+', '-', '*', '÷'];
    const operator = operators[Math.floor(Math.random() * operators.length)];
    let num1, num2, result;

    switch(operator) {
        case '+':
            num1 = Math.floor(Math.random() * 20) + 1;
            num2 = Math.floor(Math.random() * 20) + 1;
            result = num1 + num2;
            return { problem: `${num1} + ${num2}`, answer: result };
        case '-':
            num1 = Math.floor(Math.random() * 30) + 10;
            num2 = Math.floor(Math.random() * 10) + 1;
            result = num1 - num2;
            return { problem: `${num1} - ${num2}`, answer: result };
        case '*':
            num1 = Math.floor(Math.random() * 10) + 1;
            num2 = Math.floor(Math.random() * 10) + 1;
            result = num1 * num2;
            return { problem: `${num1} × ${num2}`, answer: result };
        case '÷':
            num2 = Math.floor(Math.random() * 10) + 1;
            num1 = num2 * (Math.floor(Math.random() * 10) + 1);
            result = num1 / num2;
            return { problem: `${num1} ÷ ${num2}`, answer: result };
    }
}

// Generar palabra secreta aleatoria
function generateSecretWord() {
    const words = ['RETO', 'CLAVE', 'CODIGO', 'JUEGO', 'DATOS'];
    return words[Math.floor(Math.random() * words.length)];
}

// Generar mapeo de binario a letras dinámicamente
function generateBinaryToLetterMap(secretWord) {
    const map = {};
    secretWord.split('').forEach((letter, index) => {
        // Generar un número decimal único para cada letra
        const decimalValue = 16 + (index * 4);
        const binaryValue = decimalValue.toString(2).padStart(5, '0');
        map[binaryValue] = letter;
    });
    return map;
}

// Configuración del juego
let challenges = [];
let secretWord = generateSecretWord();
let binaryToLetterMap = generateBinaryToLetterMap(secretWord);

let currentChallenge = 0;
let decodedLetters = [];

// Elementos del DOM
const mathProblem = document.getElementById('math-problem');
const userAnswer = document.getElementById('user-answer');
const binaryConversion = document.getElementById('binary-conversion');
const decimalNumber = document.getElementById('decimal-number');
const binaryAnswer = document.getElementById('binary-answer');
const decodedLetterElement = document.getElementById('decoded-letter');
const secretWordProgress = document.getElementById('secret-word-progress');
const finalResult = document.getElementById('final-result');
const finalSecretWord = document.getElementById('final-secret-word');

function initializeGame() {
    // Generar 4 desafíos matemáticos aleatorios
    challenges = [
        generateMathProblem(),
        generateMathProblem(),
        generateMathProblem(),
        generateMathProblem()
    ];

    // Regenerar palabra secreta y mapeo
    secretWord = generateSecretWord();
    binaryToLetterMap = generateBinaryToLetterMap(secretWord);

    // Reiniciar variables de juego
    currentChallenge = 0;
    decodedLetters = [];

    // Actualizar interfaz
    mathProblem.textContent = challenges[currentChallenge].problem;
    userAnswer.value = '';
    binaryConversion.classList.add('hidden');
    decodedLetterElement.textContent = '';
    secretWordProgress.textContent = '_'.repeat(secretWord.length);
    finalResult.classList.add('hidden');
}

function checkAnswer(event) {
    // Permitir envío con Enter
    if (event && event.key && event.key !== 'Enter') return;

    const correctAnswer = challenges[currentChallenge].answer;
    const userDecimal = parseInt(userAnswer.value);

    if (userDecimal === correctAnswer) {
        decimalNumber.textContent = correctAnswer;
        binaryConversion.classList.remove('hidden');
        userAnswer.value = ''; // Limpiar input
    } else {
        alert('Respuesta incorrecta. Intenta de nuevo.');
    }
}

function checkBinaryAnswer() {
    const decimal = parseInt(decimalNumber.textContent);
    const userBinary = binaryAnswer.value.trim();

    // Convertir decimal a binario para verificación
    const correctBinary = decimal.toString(2).padStart(5, '0');

    if (userBinary === correctBinary) {
        const letter = binaryToLetterMap[userBinary];
        decodedLetterElement.textContent = `Letra descifrada: ${letter}`;
        decodedLetters.push(letter);
        
        updateSecretWordProgress();
        
        // Limpiar input de binario
        binaryAnswer.value = '';
        
        currentChallenge++;
        
        if (currentChallenge < challenges.length) {
            setTimeout(() => {
                mathProblem.textContent = challenges[currentChallenge].problem;
                binaryConversion.classList.add('hidden');
                decimalNumber.textContent = '';
                decodedLetterElement.textContent = '';
            }, 2000);
        } else {
            completeGame();
        }
    } else {
        alert('Código binario incorrecto. Revisa tu conversión.');
    }
}

function updateSecretWordProgress() {
    const progressDisplay = decodedLetters.concat(
        Array(secretWord.length - decodedLetters.length).fill('_')
    );
    secretWordProgress.textContent = progressDisplay.join(' ');
    
    if (decodedLetters.length === secretWord.length) {
        completeGame();
    }
}

function completeGame() {
    if (decodedLetters.join('') === secretWord) {
        finalSecretWord.textContent = `¡Felicidades! La palabra secreta es: ${secretWord}`;
        finalResult.classList.remove('hidden');
    }
}

// Añadir eventos
userAnswer.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        checkAnswer(event);
    }
});

// Iniciar el juego
window.onload = initializeGame;

function createSecretCodeInputs() {
    const codeInputContainer = document.getElementById('code-input-container');
    const secretCodeInput = document.getElementById('secret-code-input');
    
    // Limpiar contenedor anterior
    codeInputContainer.innerHTML = '';
    
    // Crear un input para cada letra de la palabra secreta
    for (let i = 0; i < secretWord.length; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.maxLength = 1;
        input.placeholder = `Letra ${i + 1}`;
        input.classList.add('secret-code-letter-input');
        codeInputContainer.appendChild(input);
    }
    
    // Mostrar sección de entrada de código secreto
    secretCodeInput.classList.remove('hidden');
}

function checkSecretCode() {
    const inputs = document.querySelectorAll('.secret-code-letter-input');
    const enteredCode = Array.from(inputs).map(input => input.value.toUpperCase()).join('');
    const codeVerificationResult = document.getElementById('code-verification-result');

    if (enteredCode === secretWord) {
        codeVerificationResult.textContent = '¡Código Secreto Correcto! 🎊';
        codeVerificationResult.style.color = 'green';
        finalSecretWord.textContent = `¡Felicidades! La palabra secreta es: ${secretWord}`;
        finalResult.classList.remove('hidden');
    } else {
        codeVerificationResult.textContent = 'Código Secreto Incorrecto. Sigue intentando. 🕵️‍♀️';
        codeVerificationResult.style.color = 'red';
    }
}

function completeGame() {
    if (decodedLetters.join('') === secretWord) {
        createSecretCodeInputs();
    }
}

function checkSecretCode() {
    const secretCodeInput = document.getElementById('secret-code-input-field');
    const enteredCode = secretCodeInput.value.toUpperCase();
    const codeVerificationResult = document.getElementById('code-verification-result');

    if (enteredCode === secretWord) {
        codeVerificationResult.textContent = '¡Código Secreto Correcto! 🎊';
        codeVerificationResult.style.color = 'green';
        finalSecretWord.textContent = `¡Felicidades! La palabra secreta es: ${secretWord}`;
        finalResult.classList.remove('hidden');
    } else {
        codeVerificationResult.textContent = 'Código Secreto Incorrecto. Sigue intentando. 🕵️‍♀️';
        codeVerificationResult.style.color = 'red';
    }
}

function createSecretCodeInput() {
    const secretCodeInput = document.getElementById('secret-code-input');
    const secretCodeInputField = document.getElementById('secret-code-input-field');
    
    // Limpiar input anterior
    secretCodeInputField.value = '';
    
    // Mostrar sección de entrada de código secreto
    secretCodeInput.classList.remove('hidden');
}

function completeGame() {
    if (decodedLetters.join('') === secretWord) {
        createSecretCodeInput();
    }
}
