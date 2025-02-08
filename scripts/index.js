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
      localStorage.setItem("historyText", "&nbsp;");
      localStorage.setItem("outputText", "0");
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
    //по умолчанию на экране 0, он не стирается
    if (screenText === "0") return;

    //предотвращение случая, когда в конце строки останется точка или запятая
    screenText = /[\-\.]/.test(screenText.slice(-2, -1))
      ? screenText.slice(0, -2)
      : screenText.slice(0, -1);

    if (screenText.length === 0) {
      screenText = "0";
    }

    outputScreen.textContent = screenText;
    localStorage.setItem("outputText", screenText);
  }

  function displayResult() {
    //предотвращение попадания изначального 0 или текстовой ошибки в историю
    if (screenText === "0" || screenText.match(/[a-zA-Z]+/)) return;

    //если в вырвжении одно число - перенести его целиком
    if (/^[0-9]&/.test(screenText)) {
      updateHistory(screenText, screenText);
      return;
    }

    //обеспечение того, что конец выражения будет цифрой, а не открытым оператором
    if (!/\d$/.test(screenText)) screenText = screenText.slice(0, -1);

    console.log(screenText); //DON't FORGET TO DELETE
    updateHistory(
      screenText,
      Math.round(calculateResult(screenText) * 100000) / 100000
    );
  }

  function updateHistory(expression, textToAdd) {
    const historyText = `${expression}=`;
    outputScreenHistory.innerHTML = historyText;
    outputScreen.textContent = textToAdd;

    // загрузка в память
    localStorage.setItem("historyText", historyText);
    localStorage.setItem("outputText", textToAdd);
  }

  function appendToOutput(char) {
    if (!screenText && isOperator(char)) return;

    const lastChar = screenText.slice(-1);
    const secondLastChar = screenText.slice(-2, -1);

    // предотвращение добавления нескольких нулей после оператора
    if (lastChar === "0" && isOperator(secondLastChar) && !isOperator(char)) {
      if (char === "0" || char === "00") return;
      screenText = screenText.slice(0, -1) + char;
    }

    // сокращение 00 до 0 в случае добавления 00 после оператора
    else if (
      (isOperator(lastChar) || screenText.match(/[a-zA-Z]+/)) &&
      char === "00"
    )
      screenText += "0";
    // обеспечение того, что в конце будет только один оператор
    else if (isOperator(char) && isOperator(lastChar))
      screenText = screenText.slice(0, -1) + char;
    // предотвращение возможности использования отрицательного числа в дальнейших выражениях
    else if (screenText.startsWith("-")) {
      alertbox.render({
        alertIcon: "warning",
        title: "Drawback here!",
        message: "Negative numbers support will be added later",
        btnTitle: "Ok...",
        themeColor: "#E69229",
        border: false,
      });
      screenText = "sorry";
    }

    // предотвращение добавления нулей при пустой строке, установка в ноль при получении текстовых значений
    else if (char === "00" && screenText === "0") {
      screenText = "0";
    }

    // обработка первого нуля и текстовых ошибок
    else if (screenText === "0" || /[a-zA-Z]/.test(screenText)) {
      if (isOperator(char)) return;
      screenText = char;
      outputScreenHistory.innerHTML = "&nbsp;";
    }

    // все остальные случаи
    else {
      screenText += char;
    }

    outputScreen.textContent = screenText || "&nbsp;";
    localStorage.setItem("outputText", screenText);
  }
});

// вычисление постфиксной нотации
function calculateResult(expression) {
  let outputStack = [];
  let firstNumber;
  let secondNumber;

  for (const char of turnToPostfixNotation(expression)) {
    if (!isOperator(char)) {
      // если символ - не оператор: добавить в стек
      outputStack.push(parseFloat(char));
    } else {
      // иначе достать последние два числа из стека и совершить над ними операцию
      secondNumber = outputStack.pop();
      firstNumber = outputStack.pop();
      if (secondNumber == "0" && char === "÷") return "ERROR";
      outputStack.push(operators[char](firstNumber, secondNumber));
    }
  }
  return outputStack.pop();
}

// составление постфиксной нотации для выражения
function turnToPostfixNotation(expression) {
  let operatorsStack = [];
  let outputQueue = [];
  let numTemp = ""; //для обработки двух и более -значных чисел

  for (const char of expression) {
    if (!isOperator(char)) {
      numTemp += char;
    } else {
      if (numTemp) {
        //помещение числа целиком в очередь
        outputQueue.push(numTemp);
        numTemp = "";
      }
      while (
        //операторы помещаются в очередь в соответствии с приоритетом
        operatorsStack.length > 0 &&
        getPrecedence(operatorsStack[operatorsStack.length - 1]) >=
          getPrecedence(char)
      ) {
        outputQueue.push(operatorsStack.pop());
      }
      operatorsStack.push(char);
    }
  }
  if (numTemp) outputQueue.push(numTemp);
  while (operatorsStack.length > 0) outputQueue.push(operatorsStack.pop());
  return outputQueue;
}

function isOperator(char) {
  return /[+\-×÷^]/.test(char);
}

function getPrecedence(operator) {
  return precedence[operator] || 0;
}

// загрузка из памяти
function loadHistory() {
  outputScreenHistory.innerHTML =
    localStorage.getItem("historyText") || "&nbsp;";
  outputScreen.textContent = localStorage.getItem("outputText") || "0";
}

loadHistory();
