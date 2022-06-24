//Bugs:
//1. Pressing / then * or + produces unexpected results
//2. When you press a key try making the button on the UI be pressed

const MAX_DIGITS = 10;

const arrayOfOperations = [
  "+",
  "-",
  String.fromCharCode(215),
  String.fromCharCode(247),
  "%",
  "!",
  "^",
];

main();

function main() {
  let offOnButton = document.querySelector(".Off");
  offOnButton.addEventListener("click", turnOffOrOn);
  initiateNumberKeys();
  initiateOperators();
  initializeDecimalPoint();
  initializeDelete();
  clearDisplay();
}

//Function that controls the the On/Off button, turning the calculator on and off
function turnOffOrOn() {
  let offOnButton =
    document.querySelector(".Off") || document.querySelector(".On");

  let currentState = offOnButton.className;
  let numberDisplayed = document.getElementById("numberDisplayed");
  let operationsPreformed = document.getElementById("operationPreformed");

  if (currentState == "Off") {
    //add event listeners to each of the buttons
    offOnButton.textContent = "OFF";
    numberDisplayed.textContent = "0";
    offOnButton.className = "On";
  } else {
    //turn off event listeners for each number
    offOnButton.textContent = "ON";
    numberDisplayed.textContent = "";
    operationsPreformed.textContent = "";
    offOnButton.className = "Off";
  }
}

//Helper function to check if calculator is on or off
function checkIfCalcOn() {
  let offOnButton =
    document.querySelector(".Off") || document.querySelector(".On");
  let currentState = offOnButton.className;
  if (currentState == "On") {
    return true;
  } else {
    return false;
  }
}

//Function that sets up the UI numberpads and keyboard numberpads
function initiateNumberKeys() {
  addEventListenersToEachKeyPad();
  initiateNumberPad();
}

//Function to allow for number pad input from keyboard
function initiateNumberPad() {
  document.addEventListener("keydown", function (event) {
    let digit = removeStringFromKeyCode(event.code);

    if (digit !== "Unknown") {
      if (
        digit == 0 ||
        digit == 1 ||
        digit == 2 ||
        digit == 3 ||
        digit == 4 ||
        digit == 5 ||
        digit == 6 ||
        digit == 7 ||
        digit == 8 ||
        digit == 9
      )
        numbersEnteredLogic(digit);
    }
  });
}

//Helper function for removing the string from the keyboard code, event
function removeStringFromKeyCode(keyCode) {
  if (keyCode.includes("Digit")) {
    return parseInt(keyCode.charAt(5));
  } else if (keyCode.includes("Numpad")) {
    return parseInt(keyCode.charAt(6));
  } else {
    return "Unknown";
  }
}

//Function to add event listeners to each of the keypads in the UI
function addEventListenersToEachKeyPad() {
  let numPads = document.querySelectorAll(".number");
  numPads = Array.from(numPads);

  numPads.forEach((num) => {
    num.addEventListener("click", () => {
      let number = num.textContent;
      numbersEnteredLogic(number);
    });
  });
}

//Function that handles the logic of entering numbers into the display through UI and keyboard
function numbersEnteredLogic(num) {
  let numberDisplayed = document.getElementById("numberDisplayed");
  let operations = document.getElementById("operationPreformed");
  if (checkIfCalcOn() && numberDisplayed.textContent != "Error") {
    if (numberDisplayed.textContent == "0") {
      numberDisplayed.textContent = "";
      clearExpression();
    }

    if (
      operations.textContent.includes("=") == true &&
      operations.textContent.includes("Ans") == false
    ) {
      operations.textContent = "Ans = " + numberDisplayed.textContent;
      numberDisplayed.textContent = num;
    } else if (!(numberDisplayed.textContent.length == MAX_DIGITS)) {
      numberDisplayed.textContent += num;
    }
  }
}

//Function to create the expression object, which is what the calculator should parse and then output
function createExpressionObject() {
  let expressionDisplay = document.getElementById("operationPreformed");
  let expression = {
    num1: NaN,
    num2: NaN,
    operation: NaN,
  };

  let expressionString = expressionDisplay.textContent;
  //get rid of extra spaces at the end of the expression
  expressionString = expressionString.slice(0, expressionString.indexOf(" "));

  //find the operation
  for (let i = 0; i < arrayOfOperations.length; i++) {
    let index = expressionString.indexOf(arrayOfOperations[i]);
    if (index != -1 && index != 0) {
      expression.operation = arrayOfOperations[i];
      expressionString = expressionString.replace(expression.operation, " ");
    }
  }

  //first int
  expression.num1 = parseFloat(
    expressionString.slice(0, expressionString.indexOf(" "))
  );

  //second int
  if (expression.operation != "!") {
    expression.num2 = parseFloat(
      expressionString.slice(expressionString.indexOf(" ") + 1)
    );
  }
  return expression;
}

//Helper function that checks what type of operation was executed
function checkForOperation(expression) {
  let operator = -1;
  for (let i = 0; i < arrayOfOperations.length; i++) {
    let index = expression.indexOf(arrayOfOperations[i]);
    if (index != -1) {
      operator = arrayOfOperations[i];
      return operator;
    }
  }
  return operator;
}

//Function to clear the expression that is shown on the top left of the calculators display when an operation is evaluated
function clearExpression() {
  let operationsPreformed = document.getElementById("operationPreformed");
  if (operationsPreformed.textContent.includes("=")) {
    operationsPreformed.textContent = "";
  }
}

//Function that sets up the operator options on the keyboard
function initiateOperators() {
  initiateOperatorKeys();
  addEventListenersToOperations();
}

//Function that sets up the event listeners for the keyboard operators
function initiateOperatorKeys() {
  document.addEventListener("keydown", function (event) {
    let operatorId = removeStringFromOperatorCode(event);
    let operatorText = "";

    if (operatorId !== "Unknown") {
      if (operatorId == "add") {
        operatorText = arrayOfOperations[0];
      } else if (operatorId == "subtract") {
        operatorText = arrayOfOperations[1];
      } else if (operatorId == "multiplication") {
        operatorText = arrayOfOperations[2];
      } else if (operatorId == "divison") {
        operatorText = arrayOfOperations[3];
      } else if (operatorId == "mod") {
        operatorText = arrayOfOperations[4];
      } else if (operatorId == "factorial") {
        operatorText = arrayOfOperations[5];
      } else if (operatorId == "exponential") {
        operatorText = arrayOfOperations[6];
      } else if (operatorId == "equals") {
        operatorText = "=";
      }

      operatorsFunctionality(operatorId, operatorText);
    }
  });
}

//Function that parses the event from the keyboard to see what was pressed
function removeStringFromOperatorCode(event) {
  let operator = "Unknown";
  if (event.code.includes("Digit")) {
    let digit = parseInt(event.code.charAt(5));
    if (event.shiftKey == true) {
      if (digit == 1) {
        operator = "factorial";
      } else if (digit == 5) {
        operator = "mod";
      } else if (digit == 6) {
        operator = "exponential";
      }
    }
  } else if (event.code.includes("Numpad")) {
    operator = event.code.slice(6);
    if (operator == "Add" || operator == "Subtract") {
      operator = operator.toLowerCase();
    } else if (operator == "Multiply") {
      operator = "multiplication";
    } else if (operator == "Divide") {
      operator = "divison";
    } else if (operator == "Enter") {
      operator = "equals";
    } else {
      operator = "Unknown";
    }
  } else if (event.code == "Equal" || event.code == "Enter") {
    if (event.shiftKey && event.code == "Equal") {
      operator = "add";
    } else {
      operator = "equals";
    }
  } else if (event.code == "Minus") {
    operator = "subtraction";
  }
  return operator;
}

//Function to add event listeners to the operators UI
function addEventListenersToOperations() {
  let operationPads = document.querySelectorAll(".operations");
  operationPads = Array.from(operationPads);

  operationPads.forEach((operation) => {
    operation.addEventListener("click", () => {
      let operationId = operation.id;
      let operationText = operation.textContent;
      operatorsFunctionality(operationId, operationText);
    });
  });
}

//Function that controls the logic of operations entered through UI and keyboard
function operatorsFunctionality(operationId, operationText) {
  if (checkIfCalcOn() && numberDisplayed.textContent != "Error") {
    let numberDisplayed = document.getElementById("numberDisplayed");
    let operationsPreformed = document.getElementById("operationPreformed");

    if (operationsPreformed.textContent.includes("Ans")) {
      if (operationId == "factorial") {
        operationsPreformed.textContent =
          numberDisplayed.textContent + "!" + "=";
        numberDisplayed.textContent = operate();
      } else if (operationId == "exponential") {
        operationsPreformed.textContent = numberDisplayed.textContent + "^";
      } else {
        operationsPreformed.textContent =
          numberDisplayed.textContent + operationText;
        numberDisplayed.textContent = "0";
      }
    } else if (operationId == "equals") {
      if (
        checkForOperation(operationsPreformed.textContent) == -1 ||
        operationsPreformed.textContent == ""
      ) {
        operationsPreformed.textContent = "";
      } else if (operationsPreformed.textContent.includes("=") == false) {
        operationsPreformed.textContent +=
          numberDisplayed.textContent + operationText;
        numberDisplayed.textContent = operate();
      }
    } else if (checkForOperation(operationsPreformed.textContent) != -1) {
      operationsPreformed.textContent += numberDisplayed.textContent + "=";

      if (operationId == "exponential") {
        operationsPreformed.textContent = operate() + "^";
        numberDisplayed.textContent = "0";
      } else if (operationId == "factorial") {
        operationsPreformed.textContent = operate() + "!" + "=";
        numberDisplayed.textContent = operate();
      } else if (
        operationsPreformed.textContent.includes(arrayOfOperations[3]) && 
        numberDisplayed.textContent == "0"
      ) 
      
      {
        operationsPreformed.textContent = "";
        numberDisplayed.textContent = "Error";
      } else {
        operationsPreformed.textContent = operate() + operationText;
        numberDisplayed.textContent = "0";
      }
    } else if (operationId == "factorial") {
      operationsPreformed.textContent = numberDisplayed.textContent + "!" + "=";
      numberDisplayed.textContent = operate();
    } else if (operationId == "exponential") {
      operationsPreformed.textContent = numberDisplayed.textContent + "^";
      numberDisplayed.textContent = "0";
    } else {
      operationsPreformed.textContent +=
        numberDisplayed.textContent + operationText;
      numberDisplayed.textContent = "0";
    }
  }
}

//Function that calls the functions to set up the decimal point operator on the keyboard and UI
function initializeDecimalPoint() {
  setUpKeyboardDecimal();
  addEventListenerToDot();
}

//Function to set up the decimal point key on the keyboard
function setUpKeyboardDecimal() {
  document.addEventListener("keydown", function (event) {
    if (event.code == "NumpadDecimal" || event.code == "Period") {
      decimalPointLogic();
    }
  });
}

//Function to set up the decimal point key on the UI
function addEventListenerToDot() {
  let decimalPoint = document.querySelector(".dot");
  decimalPoint.addEventListener("click", decimalPointLogic);
}

//Function for the logic to handle the decimal point
function decimalPointLogic() {
  let numberDisplayed = document.getElementById("numberDisplayed");
  if (
    checkIfCalcOn() &&
    !checkIfDecimalPointPresent() &&
    numberDisplayed.textContent != "Error"
  ) {
    let operationsPreformed = document.getElementById("operationPreformed");

    if (operationsPreformed.textContent.includes("Ans") == true) {
      numberDisplayed.textContent += ".";
    } else if (operationsPreformed.textContent.includes("=") == true) {
      operationsPreformed.textContent = "Ans = " + numberDisplayed.textContent;
      numberDisplayed.textContent = "0.";
    } else {
      numberDisplayed.textContent += ".";
    }
  }
}

//Helper function to see if a decimal point is already present
function checkIfDecimalPointPresent() {
  let numberDisplayed = document.getElementById("numberDisplayed");
  numberDisplayed = numberDisplayed.textContent;
  return numberDisplayed.includes(".");
}

//Function to clear the display
function clearDisplay() {
  let clearButton = document.getElementById("AC");
  let numberDisplayed = document.getElementById("numberDisplayed");
  clearButton.addEventListener("click", () => {
    if (checkIfCalcOn()) {
      let operationsPreformed = document.getElementById("operationPreformed");
      operationsPreformed.textContent = "";
      numberDisplayed.textContent = "0";
    }
  });
}

//Function that calls the helper functions that handle UI and keyboard deleting
function initializeDelete() {
  setUpKeyboardDelete();
  deleteLogic();
}

//Function that sets up the logic to keyboard deleting/backspacing
function setUpKeyboardDelete() {
  document.addEventListener("keydown", (event) => {
    event.code == "Backspace" ? deleteLogic() : false;
  });
}

//Function that sets up the logic to UI deleting/backspacing
function setUpUIDelete() {
  let deleteButton = document.getElementById("Delete");
  deleteButton.addEventListener("click", deleteLogic);
}

//Function that controls the logic of how deleting happens
function deleteLogic() {
  let numberDisplayed = document.getElementById("numberDisplayed");
  if (checkIfCalcOn() && numberDisplayed.textContent != "Error") {
    let deletedDigitInput = numberDisplayed.textContent.slice(
      0,
      numberDisplayed.textContent.length - 1
    );
    if (deletedDigitInput == "") {
      numberDisplayed.textContent = "0";
    } else {
      numberDisplayed.textContent = deletedDigitInput;
    }
  }
}

//Function that checks if a value is greater than 10 digits (since the max display is 10 digits)
function checkIfGreaterThan10Digits(value) {
  value *= 1000;
  value = Math.round(value);
  value /= 1000;
  if (value.toString().length > 10) {
    return "Error";
  } else {
    return value;
  }
}

//Logic of adding two numbers
function add(expression) {
  return checkIfGreaterThan10Digits(expression.num1 + expression.num2);
}

//Logic of subtracting two numbers
function subtract(expression) {
  return checkIfGreaterThan10Digits(expression.num1 - expression.num2);
}

//Logic of multiplying two numbers
function multiply(expression) {
  return checkIfGreaterThan10Digits(expression.num1 * expression.num2);
}

//Logic of dividing two numbers
function divide(expression) {
  if (expression.num2 == 0) {
    return "Error";
  } else {
    return checkIfGreaterThan10Digits(expression.num1 / expression.num2);
  }
}

//Logic of finding the remainder of two numbers
function mod(expression) {
  if (expression.num2 == 0) {
    return "Error";
  } else {
    return checkIfGreaterThan10Digits(expression.num1 % expression.num2);
  }
}

//Logic of finding the factorial of a number
function factorial(expression) {
  if (expression.num1 == 0) {
    return 1;
  } else if (expression.num1 != Math.round(expression.num1)) {
    return "Error";
  } else {
    for (let i = expression.num1 - 1; i > 0; i--) {
      expression.num1 *= i;
    }
  }
  return checkIfGreaterThan10Digits(expression.num1);
}

//Logic of finding the exponent of a number raised to another
function exponent(expression) {
  let base = expression.num1;
  if (expression.num2 == 0) {
    return 1;
  } else {
    for (let i = 1; i < expression.num2; i++) {
      expression.num1 *= base;
    }
  }
  return checkIfGreaterThan10Digits(expression.num1);
}

//Function to control what operation to execute
function operate() {
  let expression = createExpressionObject();
  let result;
  if (expression.operation == arrayOfOperations[0]) {
    result = add(expression);
  } else if (expression.operation == arrayOfOperations[1]) {
    result = subtract(expression);
  } else if (expression.operation == arrayOfOperations[2]) {
    result = multiply(expression);
  } else if (expression.operation == arrayOfOperations[3]) {
    result = divide(expression);
  } else if (expression.operation == arrayOfOperations[4]) {
    result = mod(expression);
  } else if (expression.operation == arrayOfOperations[5]) {
    result = factorial(expression);
  } else if (expression.operation == arrayOfOperations[6]) {
    result = exponent(expression);
  }
  return result;
}
