
let taskYear = [];
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

function sortedTask(month, date) {
    let taskSelectedDate = taskYear.filter((task) => (task.time.month == month && task.time.date == date))
    taskSelectedDate.sort((a,b) => {
        if(a.time.hour < b.time.hour) return -1
        else if(a.time.hour == b.time.hour && a.time.minute < b.time.minute)  return -1
        else return 1;
    })
    return taskSelectedDate;
}
function setListOfTask(month, date) {
    for(task of sortedTask(month, date)) {
        const li = document.createElement('li')
        li.value = task._id;
        li.innerText = `${task.time.hour}:${task.time.minute} -${task.task}`;
        ul.append(li);
    }
}
async function getTasksThisYear(year) {
    const res = await axios.get(`${calenderPath}/task?year=${year}`);
    taskYear = res.data;
    console.log(taskYear);
}


let dateClickHandler = function(e){
    selectedDate && selectedDate.classList.toggle("color-date")
    this.classList.toggle("color-date");
    selectedDate = this;
    h1 = document.querySelector('h1');
    h1.innerText = `${this.value.year}/${this.value.month}/${this.value.date}`
    setListOfTask(selectedDate.value.month, selectedDate.value.date);
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

getTasksThisYear(year).then(() => {
    setCalender(year, month, dateToday); //during landing on calender
})
.catch((e) => console.log("we messed", e))


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
    let res = await axios.post(`${calenderPath}/task`,taskObj);
    console.log(res.data);
    return res.data;
}

function buttonAddTask(e) {
    e.preventDefault();
    if(!validateForm()) return ;
    let timer = formData["time"].value;
    let task = formData["task"].value;
    postTask(timer, task).then((restask) => {
        const li = document.createElement('li')
        li.innerText = task +"--"+ timer;
        console.dir(li)
        ul.append(li);
    })

}
button.addEventListener('click', buttonAddTask);

