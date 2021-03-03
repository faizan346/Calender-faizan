let selectedDate;
let dateClickHandler = function(e){
    selectedDate && selectedDate.classList.toggle("color-date")
    this.classList.toggle("color-date");
    selectedDate = this;
}
const setCalender = (year, month) => {
    let dateElements = document.querySelectorAll('td');
    let dateStart = new Date(year,month,1);
    let dateEnd = new Date(year,month+1,0);
    let date = 1;
    dateStart = dateStart.getDay();
    for(let i = 0 ; i < 35; i++) {
        if(i >= dateStart && date <= dateEnd.getDate()) {
            dateElements[i].addEventListener('click', dateClickHandler)
            dateElements[i].innerText = date++;
        }
        else {
            dateElements[i].removeEventListener('click', dateClickHandler)
            dateElements[i].innerText = "X"
        }
    }
    dateElements[dateStart].click();
}
const todayDate = new Date();
let year = todayDate.getFullYear()
let month = todayDate.getMonth()
setCalender(year, month);


const monthSelect = document.querySelector('#month-option')
const yearSelect = document.querySelector('#year-option')
monthSelect.value = month;
yearSelect.value = year;
monthSelect.addEventListener('change', function(e){
    month = this.value;
    setCalender(parseInt(year), parseInt(month));
})
yearSelect.addEventListener('change', function(e){
    year = this.value;
    setCalender(parseInt(year), parseInt(month));
})