//Variables and selectors
const form = document.querySelector("#agregar-gasto")
const expenditureList = document.querySelector("#gastos ul")

//Events
eventListener()

function eventListener() {
    document.addEventListener("DOMContentLoaded", askAboutBudget) 

    form.addEventListener("submit", addExpenditure)
}


//Classes
class Budget {
    constructor(budget) {
        this.budget = Number(budget)
        this.remainder = Number(budget)
        this.expenses = []
    }

    addExpenses(expenditure) {
        this.expenses = [...this.expenses, expenditure]
        console.log("I am the expenses object", this.expenses)
    }
}

class UI {
    insertBudget(quantity) {
        //The first step is add the value
        const { budget, remainder} = quantity

        //The second step is add the value to the HTML
        document.querySelector("#total").textContent = budget
        document.querySelector("#restante").textContent = remainder
    }

    printAlert(message, typeOfMessage) {
        //To create the div
        const divMessage = document.createElement("div")
        divMessage.classList.add("text-center", "alert") //Bootstrap classes
        
        if(typeOfMessage === "error") {
            divMessage.classList.add("alert-danger")
        } else {
            divMessage.classList.add("alert-success")
        }

        //Error message
        divMessage.textContent = message

        //Insert in the HTML
        document.querySelector(".primario").insertBefore(divMessage, form)

        //Take out from HTML
        setTimeout(() => {
            divMessage.remove()
        }, 3000)
    }
}

//Instance
const ui = new UI()

let budget


//Functions
function askAboutBudget() {
    const userBudget = prompt("What is your budget?")
    console.log(Number(userBudget))

    if(userBudget === "" || userBudget === null || isNaN(userBudget) || userBudget <= 0) {
        window.location.reload()
    }

    budget = new Budget(userBudget)
    
    ui.insertBudget(budget)
}

//Adding expenses
function addExpenditure(e) {
    e.preventDefault()

    //Read the form datas
    const expenditureName = document.querySelector("#gasto").value
    const expenditureQuantity = Number(document.querySelector("#cantidad").value)

    //Validate
    if(expenditureName === "" || expenditureQuantity === "") {
        ui.printAlert("Both fields are mandatory", "error")

        return

    } else if (expenditureQuantity <= 0 || isNaN(expenditureQuantity)) {
        ui.printAlert("Quantity is not valid", "error")

        return

    }

    //To create an object with the expenditure
    const expenditure = {expenditureName, expenditureQuantity, id: Date.now()}
    
    budget.addExpenses(expenditure)

    ui.printAlert("Expenditure added correctly")

    form.reset()
}

