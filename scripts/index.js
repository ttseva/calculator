const precedence = {
  "^": 3,
  "×": 2,
  "÷": 2,
  "-": 1,
  "+": 1,
};

const operators = {
  "^": (a, b) => Math.pow(a, b),
  "×": (a, b) => a * b,
  "÷": (a, b) => a / b,
  "-": (a, b) => a - b,
  "+": (a, b) => a + b,
};



const calculatorBody = document.querySelector(".calc");
const inputButton = document.querySelectorAll(".calc-input__element");
const outputScreen = document.querySelector(".calc-output__input");
const outputScreenHistory = document.querySelector(".calc-output__equation");

calculatorBody.addEventListener("click", (evt) => {
  const target = evt.target;
  if (!target.classList.contains("calc-input__element")) return;

  let buttonText = target.textContent;
  let screenText = outputScreen.textContent;

  switch (buttonText) {
    case "AC":
      outputScreen.textContent = "0";
      outputScreenHistory.innerHTML = "&nbsp;";
      break;
    case "CE":
      clearLastEntry();
      break;
    case "=":
      displayResult();
      break;
    case "POW":
      appendToOutput("^");
      break;
    default:
      appendToOutput(buttonText);
  }

  function clearLastEntry() {
    if (screenText === "0") return;
    screenText = screenText.slice(0, -1);
    if (!screenText) screenText = "0";

    outputScreen.textContent = screenText;
  }

  function displayResult() {
    if (screenText === "0") return;
    if (!/\d$/.test(screenText)) screenText = screenText.slice(0, -1);

    outputScreenHistory.innerHTML = screenText + "=";
    outputScreen.textContent = calculateResult(screenText);
  }

  function appendToOutput(char) {
    if (!screenText && isOperator(char)) return;

    const lastChar = screenText.slice(-1);

    if (char === "0" || char === "00") {
      if (isOperator(lastChar)) return;
    }

    if (isOperator(char) && isOperator(lastChar)) {
      screenText = screenText.slice(0, -1) + char;
    } else if (char === "00" && (!screenText || screenText === "0")) {
      screenText = "0";
    } else if (screenText === "0" && !isOperator(char)) {
      screenText = char;
    } else {
      screenText += char;
    }

    outputScreen.textContent = screenText ? screenText : "&nbsp;";
  }
});


function calculateResult(expression) {
  let outputStack = [];
  let firstNumber;
  let secondNumber;

  for (const char of turnToPostfixNotation(expression)) {
    if (!isOperator(char)) {
      outputStack.push(parseFloat(char));
    } else {
      secondNumber = outputStack.pop();
      firstNumber = outputStack.pop();
      outputStack.push(operators[char](firstNumber, secondNumber));
      console.log(char);                              //DON't FORGET TO DELETE
    }
  }
  return outputStack.pop();
}

function turnToPostfixNotation(expression) {
  let operatorsStack = [];
  let outputQueue = [];

  for (const char of expression) {
    if (!isOperator(char)) {
      outputQueue.push(char);
    } else {
      while (
        operatorsStack.length > 0 &&
        getPrecedence(operatorsStack[operatorsStack.length - 1]) >=
          getPrecedence(char)
      ) {
        outputQueue.push(operatorsStack.pop());
      }
      operatorsStack.push(char);
    }
  }

  while (operatorsStack.length > 0) outputQueue.push(operatorsStack.pop());
  return outputQueue.join("");
}

function isOperator(char) {
  return /[+\-×÷^]/.test(char);
}

function getPrecedence(operator) {
  return precedence[operator] || 0;
}