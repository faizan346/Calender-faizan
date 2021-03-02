const setCalender = (year, month) => {
    let dateElements = document.querySelectorAll('td');
    let dateStart = new Date(year,month,1);
    let dateEnd = new Date(year,month+1,0);
    let date = 1;
    for(let i = 0 ; i < 35; i++) {
        if(i >= dateStart.getDay() && date <= dateEnd.getDate()) {
            dateElements[i].addEventListener('click', function(e){
                this.style.backgroundColor= "#f7d9d9";
                console.dir(this)
            })
            dateElements[i].innerText = date++;
        }
        else {
            dateElements[i].innerText = "X"
        }
    }
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