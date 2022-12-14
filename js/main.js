/*function that takes in two numbers, the chosen calculator operation, performs that
calculation and returns the results */

let operate = (x,y,operator) => {
    switch(operator){

        case "+":
            return x + y

        case "-":
            return x - y

        case "x":
            return x * y

        case "÷":
            return x/y

    }
}


/*Variables for dom nodes and logic applied in later functions*/
let display = document.querySelector("#calcDisplay")
let numbers = document.querySelectorAll(".num");
let operators = document.querySelectorAll(".op");
let equals = document.querySelector("#equals");
let clear = document.querySelector("#clear");
let buttons = document.querySelectorAll("button");
let currentNum;
let currentDisplay;
let currentOp;
let lastItemIsOperation = false;
let calculations = [];
let result;
let displayArray;
let equalsRanLast = false;


/*-------------------------------------------------------------------------------------*/
/*The following code will result in a calculations array with the order of operations
ie. [3, add, 2, sub, 1]*/
/*-------------------------------------------------------------------------------------*/


/*Detect when any number is clicked, add it to the display, concatonate extra numbers to the
 current. ie. 5, followed by 5, results in the number 55 both on the display and stored as a
 variable*/
for (let num of numbers){
    
    num.addEventListener("click", () => {
        

        //Wipe the display text for a new number after using an operator
        if (lastItemIsOperation){
            display.textContent = "";
        }

        lastItemIsOperation = false;
        
    
        /*if this is the first number entered, or we've just finished an equation, followed 
        by pressing a number, reset the number to whatever one we just pressed*/
        if (currentNum == undefined || equalsRanLast){
            currentNum = num.id;

            if (equalsRanLast){
            display.textContent = currentNum;
            equalsRanLast = false;
            }
            
        } else {

            //if the current number is more than 10 digits long, don't allow a larger number, just return
            if (currentNum.toString().length >= 10){
                return
            }
            currentNum += num.id;
        }

    display.textContent += num.id;
    })
}



/*When any operator is clicked, see if theres been a number clicked prior, and add it to the 
calculations array, followed by the operator chosen*/
for (let op of operators){

    
    op.addEventListener("click", () => {
        equalsRanLast = false;
        lastItemIsOperation = true;
        display.textContent += ` ${op.id} `;

        if (currentNum !== undefined){
                calculations.push(parseFloat(currentNum));
        }
            
        /*if there is no current number & there is an operator already selected, this means
        that an operator has been selected after another operator with no number input
        in between. Remove previous operation from array and replace it with the new one
        ie. if sub operator is clicked and then add operator is clicked [5, add, 3, sub] 
        becomes [5, add, 3, add] */

        if (currentNum == undefined && currentOp !== undefined){
            currentOp = op.id;
            calculations.splice(calculations.length - 1);
            
            //split display text into array, remove the last operator, replace with the new
            displayArray = display.textContent.split(" ");
            displayArray.splice(displayArray.length - 4, 2);
            displayString = displayArray.join(" ");
            display.textContent = displayString;
        }

        //push the operator to calculations
        currentOp = op.id;
        calculations.push(currentOp);
        
        //wipe current number and display
        currentNum = undefined;
    })
}


/*-------------------------------------------------------------------------------------*/
/*The following code will run through and complete the order of operations in the 
calculations array in the order they've been submitted and return a result*/
/*-------------------------------------------------------------------------------------*/


/* When the equals button has been clicked, push the current number to the array, and then 
use the reduce function on the array which contains logic to complete the operations in the
 order entered*/
equals.addEventListener("click", () => {

    
        //if theres a current number, push it to the array before calculating
        if (currentNum !== undefined){
            calculations.push(parseFloat(currentNum));
        }

        //if the last thing clicked was an operator, remove it, reset the boolean
        if (lastItemIsOperation == true){
            calculations.splice(calculations.length -1);
            lastItemIsOperation = false;
        }

        //if the array is empty, end the function here
        if (calculations.length == 0){
            return;
        }

        result = calculations.reduce((previousValue, currentValue) => {

            /*if the previous array item -or the first item when we start iterating 
            through- is a number, and the following is not, store the previous array item
            as the first number and return the current array item which will be the operation*/
            if (!isNaN(previousValue) && isNaN(currentValue)){
                firstNum = previousValue;
                return currentValue;
            }

            /*since we returned the current array item, which was the operator chosen, on 
            this following iteration, it becomes the previous array item, and the current 
            array item will now be the following number. Run the operate function with
            the first and current number, and the previous array item, which is the
            operator inbetween them, then return the result. This result becomes our new 
            first number, or if we are at the end ofthe array, becomes our final result*/
            return operate(firstNum, currentValue, previousValue); 
            
        })
        
        //display result and empty variables
        calculations = [];
        currentDisplay = result.toString();

        //if the result number is over 10 digits long, convert the number to be displayed to scientific notation. Actual full value is still stored.
        if (currentDisplay.length > 10){
            currentDisplay = currentDisplay.slice(0,10) + `e${currentDisplay.length - 10}`;
        }
        currentNum = result; 

        display.textContent = currentDisplay;

        /*set equalsRanLast so that if we click a number after, the current number is reset
        to whatever is clicked, instead of concatonated to it*/
        equalsRanLast = true;      
    
})


//Clear button logic for clearing all values and the display.
clear.addEventListener("click", () => {
    display.textContent = "";
    currentNum = undefined;
    currentOp = undefined;
    calculations = [];
    equalsRanLast = false;
    lastItemIsOperation = false;
})






for (button of buttons){
    button.addEventListener("mousedown", function(){
        this.style.boxShadow = "0 0 0 0";
        console.log(this);
    })

    button.addEventListener("mouseup", function(){
        this.style.boxShadow = "2px 2px 1px 1px black";
    })

    button.addEventListener("touchstart", function(){
        this.style.boxShadow = "0 0 0 0";
        console.log(this);
    })

    button.addEventListener("touchend", function(){
        this.style.boxShadow = "2px 2px 1px 1px black";
    })
}
