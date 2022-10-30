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
        
        this.calculateRemainder()
    }

    calculateRemainder() {
        //Getting how much money we have spent
        let initialMoneySpent = 0
        const moneySpent = this.expenses.reduce((total, expenditure) => total + expenditure.expenditureQuantity, initialMoneySpent)
        
        this.remainder = this.budget - moneySpent
    }

    deleteExpenditure(idElementToDelete) {
        this.expenses = this.expenses.filter(expenditure => expenditure.id !== idElementToDelete)

        
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

    showExpenditures(expenses) {

        //This is to call the cleanHTML method through expenses(it is part of the budget object)
        this.cleanHTML()
        
        //Iterate over expenditure
        expenses.forEach(expenditure => {
            
            const { expenditureName, expenditureQuantity, id } = expenditure

            //To create a LI
            const newExpenditure = document.createElement("li")
            newExpenditure.className = "list-group-item d-flex justify-content-between align-items-center"
            //This two codes to do the same, the only difference is that set attribute is oldest
            // newExpenditure.setAttribute("data-id", id)
            newExpenditure.dataset.id = id

            //Add the expenditure HTML
            newExpenditure.innerHTML = `<span class="font-weight-bold text-capitalize">${expenditureName}</span> <span class="badge badge-primary badge-pill"> $ ${expenditureQuantity} </span>`

            //Buttom to delete the expenditure
            const btnDelete = document.createElement("button")
            btnDelete.classList.add("btn", "btn-danger", "borrar-gasto")
            btnDelete.onclick = () => {
                deleteExpenditure(id)
            }
            btnDelete.innerHTML = "Delete &times"

            newExpenditure.appendChild(btnDelete)

            //Add the HTML
            expenditureList.appendChild(newExpenditure)
        });
    }

    // We have to create a function to clean HTML, because otherwise the append child will repeat the expenses
    cleanHTML() {
        // While expenditure list have something remove his content
        while( expenditureList.firstChild ) {
            expenditureList.removeChild(expenditureList.firstChild)
        }
    }

    updateRemainder(remainder) {
        document.querySelector("#restante").textContent = remainder
    }

    checkBudget(budgetObj) {
        const { budget, remainder } = budgetObj

        const remainderDiv = document.querySelector(".restante")

        // Check 25%
        if((budget / 4) > remainder) {
            remainderDiv.classList.remove("alert-success", "alert-warning")
            remainderDiv.classList.add("alert-danger")
        } else if((budget / 2) > remainder) {
            remainderDiv.classList.remove("alert-success")
            remainderDiv.classList.add("alert-warning")
        }

        // If the budget is 0 or lower
        if(remainder <= 0) {
            ui.printAlert("You have not budget :(", "error")
            form.querySelector('button[type="submit"]').disabled = true
        }
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

    //Print the expenditure
    const { expenses, remainder } = budget

    ui.showExpenditures(expenses)

    ui.updateRemainder(remainder)

    ui.checkBudget(budget)

    form.reset()
}

function deleteExpenditure(idElementToDelete) {
    // Delete the expenses from the class or better said from the object
    budget.deleteExpenditure(idElementToDelete)

    // Delete the expenses from HTML through filter
    const { expenses } = budget
    ui.showExpenditures(expenses)
}

