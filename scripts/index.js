const calculatorBody = document.querySelector(".calc");
const inputButton = document.querySelectorAll(".calc-input__element");
const outputScreen = document.querySelector(".calc-output__input");
const outputScreenHistory = document.querySelector(".calc-output__equation");

calculatorBody.addEventListener("click", (evt) => {
  if (evt.target.classList.contains("calc-input__element")) {
    let buttonText = evt.target.textContent; //ADD 'ADD TO STACK'
    let screenText = outputScreen.textContent;
    let screenHistoryText = outputScreenHistory.innerHTML;
    

    if (buttonText == "AC") {
      screenText = "";
      screenHistoryText = "&nbsp;";
    } else if (buttonText == "C") {
      screenText = "";
    } else if (buttonText == "=") {
      if (/\d$/.test(screenText)) {
        screenHistoryText = screenText;
      } else {
        screenHistoryText = screenText.slice(0, -1);
      }
      screenText = ""; //ADD FUNCTION OF COMPUTATION
    } else {
      screenText += buttonText;
    }

    if (!screenHistoryText.trim()) {
      screenHistoryText = "&nbsp;";
    }

    outputScreen.textContent = screenText;
    outputScreenHistory.innerHTML = screenHistoryText;
  }
});
