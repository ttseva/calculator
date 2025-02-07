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
      clearScreen(true);
      break;
    case "C":
      clearScreen(false);
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

  function clearScreen(clearAll) {
    outputScreen.textContent = "0";
    if (clearAll) outputScreenHistory.innerHTML = "&nbsp;";
  }

  function displayResult() {
    outputScreenHistory.innerHTML = /\d$/.test(screenText)
      ? screenText
      : screenText.slice(0, -1);
    outputScreen.textContent = "0";
  }

function appendToOutput(char) {
  if (!screenText && isOperator(char)) return; 
  
  const lastChar = screenText.slice(-1);

  if (char === "0" || char === "00"){
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

  function isOperator(char) {
    return /[+\-×÷^]/.test(char);
  }
});
