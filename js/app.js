//Variables and selectors
const form = document.querySelector("#agregar-gasto")
const expenditureList = document.querySelector("#gastos ul")

//Events
eventListener()

function eventListener() {
    document.addEventListener("DOMContentLoaded", askAboutBudget) 
}


//Classes


//Functions
function askAboutBudget() {
    const userBudget = prompt("What is your budget?")
    console.log(Number(userBudget))

    if(userBudget === "" || userBudget === null || isNaN(userBudget) || userBudget <= 0) {
        window.location.reload()
    }
}