let taskYear = [{
    date: 24,
    year: 2020,
    month: 3,
    time: 235235252,
    task: "sjdalfjsafls"
},{
    date: 24,
    year: 2020,
    month: 3,
    time: 235235252,
    task: "sjdalfjsafls"
},{
    date: 24,
    year: 2020,
    month: 3,
    id: 235235252,
    task: "sjdalfjsafls"
}];
const todayDate = new Date();
let year = todayDate.getFullYear()
let month = todayDate.getMonth()
let dateToday = todayDate.getDate()
let selectedDate;
const ul = document.querySelector("ul");
const button = document.querySelector('button')
const formData = document.forms["submitForm"];
const monthSelect = document.querySelector('#month-option')
const yearSelect = document.querySelector('#year-option')
monthSelect.value = month;
yearSelect.value = year;

let dateClickHandler = function(e){
    selectedDate && selectedDate.classList.toggle("color-date")
    this.classList.toggle("color-date");
    selectedDate = this;
    console.log(this.value);
    h1 = document.querySelector('h1');
    h1.innerText = `${this.value.year}/${this.value.month}/${this.value.date}`
    let taskToday = taskYear.filter(task => task.date == this.value.date && task.month == this.value.month);
    console.log(taskToday)
    for(task in taskToday) {
        const li = document.createElement("li");
        li.innerText = taskToday[task].task;
        ul.append(li);
    } 
}
function yearMonthDateToString(y,m,d){
     y = y.toString();
     m = ('0'+m).slice(-2);
     d = ('0'+d).slice(-2);
     return {year:y,month:m,date:d}
}
const setCalender = (year, month, dateToday) => {
    let dateElements = document.querySelectorAll('td');
    let dateStart = new Date(year,month,1);
    let dateEnd = new Date(year,month+1,0);
    let date = 1;
    dateStart = dateStart.getDay();
    for(let i = 0 ; i < 42; i++) {
        if(i >= dateStart && date <= dateEnd.getDate()) {
            dateElements[i].addEventListener('click', dateClickHandler)
            dateElements[i].value = yearMonthDateToString(year,month,date);
            dateElements[i].innerText = date.toString();
            date++;
        }
        else {
            dateElements[i].removeEventListener('click', dateClickHandler)
            dateElements[i].innerText = ""
        }
    }
    if(dateToday) dateElements[dateToday].click();
    else dateElements[dateStart].click();
}

setCalender(year, month, dateToday); //during landing on calender

monthSelect.addEventListener('change', function(e){
    month = this.value;
    setCalender(parseInt(year), parseInt(month));
})
yearSelect.addEventListener('change', function(e){
    year = this.value;
    setCalender(parseInt(year), parseInt(month));
})




function validateForm() {
    let time = document.forms["submitForm"]["time"].value;
    let task = document.forms["submitForm"]["task"].value;
    if (time == "" || task == "") {
      alert("task must be filled out with time");
      return false;
    }
    return true;
  }
async function postTask(timer, task) {
    const taskObj = {
        task,
        time: {
            ...selectedDate.value,
            hour: timer.split(":")[0],
            minute: timer.split(":")[1]
        },
        status: true
    }
    let res = await axios.post(`${postTaskPath}/task`,taskObj);
    console.log(res);
    return res;
}

function buttonAddTask(e) {
    e.preventDefault();
    if(!validateForm()) return ;
    let timer = formData["time"].value;
    let task = formData["task"].value;
    postTask(timer, task).then(() => {
        const li = document.createElement('li')
        li.innerText = task +"--"+ timer;
        console.dir(li)
        ul.append(li);
    })

}
button.addEventListener('click', buttonAddTask);