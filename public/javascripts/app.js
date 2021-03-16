
let taskYear = [];
const todayDate = new Date();
let year = todayDate.getFullYear()
let month = todayDate.getMonth()
let dateToday = todayDate.getDate()
let selectedDate;
const ul = document.querySelector("ul");
const button = document.querySelector('form button')
const formData = document.forms["submitForm"];
const monthSelect = document.querySelector('#month-option')
const yearSelect = document.querySelector('#year-option')
monthSelect.value = month;
yearSelect.value = year;

function sortedTask(month, date) {
    let taskSelectedDate = taskYear.filter((task) => (task.time.month == month && task.time.date == date))
    taskSelectedDate.sort((a, b) => {
        if (a.time.hour < b.time.hour) return -1
        else if (a.time.hour == b.time.hour && a.time.minute < b.time.minute) return -1
        else return 1;
    })
    return taskSelectedDate;
}

function emptyTaskList() {
    const lists = document.querySelectorAll('li');
    for (li of lists) {
        li.remove();
    }
}

function setOneListItem(task) {
    const li = document.createElement('li')
    const cross = document.createElement('span');
    const time = document.createElement('b');
    time.innerText = `${task.time.hour}:${task.time.minute} |`
    li.innerText = ` ${task.task}`;
    li.id = task._id;
    cross.innerText = '✕';
    cross.id = task._id;
    li.prepend(time);
    li.prepend(cross);
    if (!task.status) {
        li.style.textDecoration = "line-through"
        li.style.opacity = "0.5"
    }
    ul.append(li);
}

function setTransitionForList() {
    ul.style.visibility = "hidden"
    ul.style.opacity = "0"
    setTimeout(() => {
        ul.style.visibility = "visible"
        ul.style.opacity = "1";
    }, 400)
}

function setListOfTask(month, date) {
    emptyTaskList();
    for (task of sortedTask(month, date)) {
        setOneListItem(task);
    }
    setTransitionForList();
}
async function getTasksThisYear(year) {
    const res = await axios.get(`${window.location.pathname}/task?year=${year}`);
    taskYear = res.data;
}

let dateClickHandler = function (e) {
    selectedDate && selectedDate.classList.toggle("color-date")
    this.classList.toggle("color-date");
    selectedDate = this;
    h1 = document.querySelector('.h1-date');
    h1.innerText = `${this.value.year}/${this.value.month}/${this.value.date}`
    setListOfTask(selectedDate.value.month, selectedDate.value.date);
}
function yearMonthDateToString(y, m, d) {
    y = y.toString();
    m = ('0' + m).slice(-2);
    d = ('0' + d).slice(-2);
    return { year: y, month: m, date: d }
}
function toggleCircle(dateValue) {
    let taskMonth = taskYear.filter(task => task.time.month == dateValue.month)
    let status = taskMonth.some(task => task.time.date == dateValue.date && task.status);
    let dateElement = document.querySelector(".D" + dateValue.year + dateValue.month + dateValue.date);
    if (!status) {
        dateElement.lastElementChild && dateElement.lastElementChild.remove();
        return;
    }
    else if (!dateElement.lastElementChild) {
        let circleIcon = document.createElement('sup')
        circleIcon.classList.add('fa', 'fa-circle');
        dateElement.append(circleIcon);
    }
}
const setCalender = (year, month, dateToday) => {
    let dateElements = document.querySelectorAll('td');
    let dateStart = new Date(year, month, 1);
    let dateEnd = new Date(year, month + 1, 0);
    let date = 1;
    dateStart = dateStart.getDay();

    for (let i = 0; i < 42; i++) {
        if (i >= dateStart && date <= dateEnd.getDate()) {
            let dateElement = dateElements[i];
            dateElement.addEventListener('click', dateClickHandler)
            dateElement.value = yearMonthDateToString(year, month, date);
            dateElement.classList.add("D" + dateElement.value.year + dateElement.value.month + dateElement.value.date);
            dateElement.innerText = date.toString();
            toggleCircle(dateElement.value);
            date++;
        }
        else {
            dateElements[i].removeEventListener('click', dateClickHandler)
            dateElements[i].innerText = ""
        }
    }
    if (dateToday) dateElements[dateToday].click();
    else dateElements[dateStart].click();
}

getTasksThisYear(year).then(() => {
    setCalender(year, month, dateToday); //during landing on calender 
})
.catch((e) => console.log("we messed", e))


monthSelect.addEventListener('change', function (e) {
    month = this.value;
    setCalender(parseInt(year), parseInt(month));
})
yearSelect.addEventListener('change', function (e) {
    year = this.value;
    getTasksThisYear(year).then(() => {
        setCalender(parseInt(year), parseInt(month));
    })
    .catch((e) => console.log("we messed", e))
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
    let res = await axios.post(`${window.location.pathname}/task`, taskObj);
    return res.data;
}

function buttonAddTask(e) {
    e.preventDefault();
    if (!validateForm()) return;
    let timer = formData["time"].value;
    let task = formData["task"].value;
    postTask(timer, task).then((resTask) => {
        setOneListItem(resTask)
        taskYear.push(resTask);
        toggleCircle(selectedDate.value)
    })
    formData["time"].value = "";
    formData["task"].value = "";
}
button.addEventListener('click', buttonAddTask);

const updateTask = async (li) => {
    let task = taskYear.find((task) => task._id === li.id)
    let resTask = await axios.put(`${window.location.pathname}/task/${task._id}`, { status: !task.status })
    task.status = !task.status;
    if (!task.status) {
        li.style.textDecoration = "line-through"
        li.style.opacity = "0.5"
    }
    else {
        li.style.textDecoration = "none"
        li.style.opacity = "1"
    }
}

const deleteTask = async (span) => {
    let res = await axios.delete(`${window.location.pathname}/task/${span.id}`)
    span.parentElement.remove();
    taskYear = taskYear.filter((task) => task._id !== span.id);
}

const updateOrDeleteListItem = async (e) => {
    if (e.target.nodeName === 'LI') {
        await updateTask(e.target).catch(e => console.log("updateError", e));
    }
    else if (e.target.nodeName === 'SPAN') {
        await deleteTask(e.target).catch(e => console.log("deletionError", e))
    }
    toggleCircle(selectedDate.value)
}

ul.addEventListener('click', updateOrDeleteListItem)

function myTimer() {
  const d = new Date();
  const currTime = d.toLocaleTimeString();
  document.querySelector(".h1-time").innerHTML = currTime;
}

let clockId = setInterval(myTimer, 1000);

