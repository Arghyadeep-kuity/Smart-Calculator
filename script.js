document.addEventListener("DOMContentLoaded", () => {

    const expressionDisplay = document.getElementById("expression");
    const historyDisplay = document.getElementById("history");

    let currentExpression = "";
    let isResultDisplayed = false;

    // Update Display
    function updateDisplay() {
        expressionDisplay.textContent = currentExpression || "0";
    }

    // Append Value
    function appendValue(value) {

        // Start new expression after result
        if (isResultDisplayed) {
            if (!["+", "-", "*", "/", "%", "^"].includes(value)) {
                currentExpression = "";
            }
            isResultDisplayed = false;
        }

        const operators = ["+", "-", "*", "/", ".", "^", "%"];
        const lastChar = currentExpression.slice(-1);

        // Prevent two operators together
        if (operators.includes(value) && operators.includes(lastChar)) {
            currentExpression =
                currentExpression.slice(0, -1) + value;
        } else {
            currentExpression += value;
        }

        updateDisplay();
    }

    // Clear
    function clearAll() {
        currentExpression = "";
        historyDisplay.textContent = "";
        isResultDisplayed = false;
        updateDisplay();
    }

    // Delete
    function deleteLast() {

        if (isResultDisplayed) {
            historyDisplay.textContent = "";
            isResultDisplayed = false;
        }

        currentExpression = currentExpression.slice(0, -1);
        updateDisplay();
    }

    // Calculate
    function calculateResult() {

        if (currentExpression === "") return;

        try {

            historyDisplay.textContent = currentExpression + " =";

            let result = math.evaluate(currentExpression);

            result = math.format(result, {
                precision: 14
            });

            currentExpression = result.toString();

            isResultDisplayed = true;

            updateDisplay();

        } catch (err) {

            historyDisplay.textContent = "Error";

            expressionDisplay.textContent = "Invalid Expression";

            currentExpression = "";

            isResultDisplayed = true;

            setTimeout(() => {
                updateDisplay();
                historyDisplay.textContent = "";
            }, 1500);
        }
    }

    // Button Events
    document.querySelectorAll(".btn").forEach(btn => {

        btn.addEventListener("click", () => {

            btn.classList.add("clicked");

            setTimeout(() => {
                btn.classList.remove("clicked");
            }, 100);

            if (btn.id === "clear") {

                clearAll();

            } else if (btn.id === "delete") {

                deleteLast();

            } else if (btn.id === "equals") {

                calculateResult();

            } else {

                const value = btn.dataset.val;

                if (value) appendValue(value);

            }

        });

    });

    // Keyboard Support
    document.addEventListener("keydown", (e) => {

        const key = e.key;

        if (/^[0-9]$/.test(key)) {

            appendValue(key);

        } else if (["+", "-", "*", "/", ".", "%", "^", "(", ")"].includes(key)) {

            appendValue(key);

        } else if (key === "Enter" || key === "=") {

            e.preventDefault();
            calculateResult();

        } else if (key === "Backspace") {

            deleteLast();

        } else if (key === "Escape") {

            clearAll();

        } else if (key.toLowerCase() === "e") {

            appendValue("e");

        } else if (key.toLowerCase() === "p") {

            appendValue("pi");

        }

    });

    updateDisplay();

});