// Lista de palabras secretas disponibles
const secretWords = ["RETO", "CLAVE", "CODIGO", "JUEGO", "DATOS"];

// Función para obtener una palabra secreta aleatoria
function generateSecretWord() {
    return secretWords[Math.floor(Math.random() * secretWords.length)];
}

// Función para convertir letras en números (A=1, B=2, ..., Z=26)
function letterToNumber(letter) {
    return letter.charCodeAt(0) - 64;
}

// Función para generar operaciones matemáticas que den los valores correctos
function generateMathProblem(targetNumber) {
    let num1 = Math.floor(Math.random() * (targetNumber - 1)) + 1;
    let num2 = targetNumber - num1;
    return {
        problem: `${num1} + ${num2}`,
        answer: targetNumber
    };
}

// Variables del juego
let secretWord, secretNumbers, challenges, currentChallenge, progressRemaining;

// Elementos del DOM
const mathProblem = document.getElementById('math-problem');
const userAnswer = document.getElementById('user-answer');
const binaryConversion = document.getElementById('binary-conversion');
const decimalNumber = document.getElementById('decimal-number');
const binaryAnswer = document.getElementById('binary-answer');
const secretWordProgress = document.getElementById('secret-word-progress');
const secretCodeContainer = document.getElementById('secret-code-input');
const secretCodeInput = document.getElementById('secret-code-input-field');
const codeVerificationResult = document.getElementById('code-verification-result');

// Inicializar el juego
function initializeGame() {
    secretWord = generateSecretWord();
    secretNumbers = secretWord.split("").map(letterToNumber);
    challenges = secretNumbers.map(generateMathProblem);
    currentChallenge = 0;
    progressRemaining = secretWord.length;

    console.log("Palabra secreta:", secretWord);
    console.log("Operaciones generadas:", challenges);

    mathProblem.innerText = challenges[currentChallenge].problem; // Mostrar la primera operación
    userAnswer.value = "";
    binaryAnswer.value = "";
    secretWordProgress.textContent = "_ ".repeat(secretWord.length).trim();
    secretCodeContainer.classList.add("hidden"); // Ocultar input del código secreto
    binaryConversion.classList.add("hidden");
}

// Verificar la respuesta matemática
function checkAnswer() {
    const correctAnswer = challenges[currentChallenge].answer;
    const userDecimal = parseInt(userAnswer.value);

    if (userDecimal === correctAnswer) {
        decimalNumber.textContent = correctAnswer;
        binaryConversion.classList.remove("hidden"); // Mostrar conversión a binario
        addNumberToList(userDecimal);
        userAnswer.value = "";
    } else {
        alert("Incorrecto, intenta de nuevo.");
    }
}

// Agregar el número a la lista visual
function addNumberToList(number) {
    const userAnswerList = document.getElementById("user-answer-list");
    const listItem = document.createElement("li");
    listItem.textContent = number;
    userAnswerList.appendChild(listItem);
}

// Verificar la conversión binaria y actualizar progreso
function checkBinaryAnswer() {
    const decimal = parseInt(decimalNumber.textContent);
    const userBinary = binaryAnswer.value.trim();
    const correctBinary = decimal.toString(2);

    if (userBinary === correctBinary) {
        removeProgressUnderscore(); // Eliminar un `_` del progreso
        binaryAnswer.value = "";
        binaryConversion.classList.add("hidden");

        currentChallenge++;

        // Si quedan más operaciones, actualizar el problema
        if (currentChallenge < challenges.length) {
            mathProblem.textContent = challenges[currentChallenge].problem;
        }

        // Si ya no hay más "_", mostrar el input del código secreto
        if (!secretWordProgress.textContent.includes("_")) {
            secretCodeContainer.classList.remove("hidden");
        }
    } else {
        alert("Código binario incorrecto. Intenta de nuevo.");
    }
}

// Quitar un `_` del progreso en vez de sobrescribir todo
function removeProgressUnderscore() {
    let progressText = secretWordProgress.textContent.split(" ");
    let index = progressText.indexOf("_");
    if (index !== -1) {
        progressText.splice(index, 1); // Elimina el primer "_"
    }
    secretWordProgress.textContent = progressText.join(" ");
}

// Verificar el código secreto ingresado
function checkSecretCode() {
    const enteredCode = secretCodeInput.value.toUpperCase();

    if (enteredCode === secretWord) {
        codeVerificationResult.textContent = "¡Código Correcto!";
        codeVerificationResult.style.color = "green";
    } else {
        codeVerificationResult.textContent = "Código Incorrecto.";
        codeVerificationResult.style.color = "red";
    }
}

window.onload = initializeGame;
