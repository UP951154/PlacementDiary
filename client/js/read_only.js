
function pageLoaded() {
    console.log('js ready');
}

const today = new Date();
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();

const calendar = document.getElementById('calendar');
const diaryEntryElement = document.getElementById('diaryEntry');
const button = document.getElementById('button');

displayCalendar(currentMonth, currentYear);


calendar.addEventListener('click', function (event) {
    if (event.target.classList.contains('day')) {
        const day = event.target.innerHTML;
        const month = currentMonth;
        const year = currentYear;

        // Remove selected class from previously selected day
        const selectedDay = document.querySelector('.selected');
        if (selectedDay) {
            selectedDay.classList.remove('selected');
        }

        // Add selected class to selected day
        event.target.classList.add('selected');

        // Update diary entry for selected date
        const date = new Date(year, month, day);

        displayDiaryEntry(date);
    }
});

function displayCalendar(month, year) {
    const daysInMonth = getDaysInMonth(month, year);
    const calendar = document.getElementById('calendar');

    // Clear calendar
    calendar.innerHTML = '';

    // Set calendar header
    const header = document.createElement('h2');

    header.innerHTML = getMonthName(month) + ' ' + year;
    calendar.appendChild(header);

    // Create table for calendar
    const table = document.createElement('table');
    calendar.appendChild(table);

    // Create table header with weekday names
    const row = document.createElement('tr');
    table.appendChild(row);
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (var i = 0; i < weekdays.length; i++) {
        var cell = document.createElement('td');
        cell.innerHTML = weekdays[i];
        row.appendChild(cell);
    }

    // Fill table with days of month
    let dayOfMonth = 1;
    for (var i = 0; i < 6; i++) {
        const rowElement = document.createElement('tr');
        for (let j = 0; j < 7; j++) {
            var cell = document.createElement('td');
            cell.classList.add('day');
            if ((i === 0 && j < new Date(year, month, 1).getDay()) || dayOfMonth > daysInMonth) {
                // Display empty cell for days before first day of month or after last day of month
                cell.classList.add('disabled');
            } else {
                cell.innerHTML = dayOfMonth;
                if (dayOfMonth === new Date().getDate() && month === currentMonth && year === currentYear) {
                    // Add today class to today's cell
                    cell.classList.add('today');
                }
                dayOfMonth++;
            }
            rowElement.appendChild(cell);
        }
        table.appendChild(rowElement);
    }

    // Add buttons to change month
    const nextMonth = document.createElement('button');
    nextMonth.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextMonth.classList.add('calendar-btn');
    nextMonth.id = 'nextMonth';
    nextMonth.addEventListener('click', function () {
        if (month === 11) {
            displayCalendar(0, year + 1);
        } else {
            displayCalendar(month + 1, year);
        }
    });
    header.appendChild(nextMonth);


    const prevMonth = document.createElement('button');
    prevMonth.id = 'prevMonth';
    prevMonth.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevMonth.classList.add('calendar-btn');
    prevMonth.addEventListener('click', function () {
        if (month === 0) {
            displayCalendar(11, year - 1);
        } else {
            displayCalendar(month - 1, year);
        }
    });
    header.appendChild(prevMonth);
}

function getDaysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
}

function getMonthName(month) {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return monthNames[month];
}

function displayDiaryEntry(date) {
    diaryEntryElement.innerHTML = '';
    const day = date.getDate();


    // Date
    const header = document.createElement('h2');
    header.id = 'diary_header';
    header.innerHTML = date.toDateString();
    diaryEntryElement.appendChild(header);

    // Input
    let inputOneValue = 'NO DATA';
    let inputTwoValue = '';
    let inputThreeValue = '';

    // Get stored values and set input values
    const storedArr = JSON.parse(get(day));
    if (storedArr && storedArr.length === 3) {
        inputOneValue = storedArr[0];
        inputTwoValue = storedArr[1];
        inputThreeValue = storedArr[2];
    }

    var para = document.createElement('p');
    para.innerHTML = inputOneValue;
    diaryEntryElement.appendChild(para);
    var para = document.createElement('p');
    para.innerHTML = inputTwoValue;
    diaryEntryElement.appendChild(para);
    var para = document.createElement('p');
    para.innerHTML = inputThreeValue;
    diaryEntryElement.appendChild(para);

    create_button('print', 'Print', popuponclick, [inputOneValue, inputTwoValue, inputThreeValue]);
}

function popuponclick(inputOneValue, inputTwoValue, inputThreeValue) {
    const myWindow = window.open(
        '',
        'mywindow',
        'status=1,width=350,height=150',
    );
    myWindow.document.write('<html><head><title>Print Me</title></head>');
    myWindow.document.write('<body onafterprint="self.close()">');
    myWindow.document.write('<p> Work carried out </p>');
    myWindow.document.write('<p>' + inputOneValue + '</p>');
    myWindow.document.write('<p> Knowledge/Experience gained or applied. (Please relate to technical and soft skills developed) </p>');
    myWindow.document.write('<p>' + inputTwoValue + '</p>');
    myWindow.document.write('<p> Competency </p>');
    myWindow.document.write('<p>' + inputThreeValue + '</p>');
    myWindow.document.write('</body></html>');
}


// Utility functions

function create_button(id, content, onclick_func, onclick_params) {
    const btn = document.createElement('button');
    btn.id = id;
    btn.innerHTML = content;
    btn.addEventListener('click', function () {
        if (Array.isArray(onclick_params)) {
            onclick_func(...onclick_params);
        } else {
            onclick_func(onclick_params);
        }
    });
    diaryEntryElement.appendChild(btn);
}

function create_heading(id, content, placeholder) {
    const input = document.createElement('h4');
    input.id = id;
    input.textContent = content;
    input.placeholder = placeholder;
    diaryEntryElement.appendChild(input);
}

// Local Storage Functions


function give(key, value) {
    localStorage.setItem(key, value);
}
function get(day) {
    return localStorage.getItem(day);
}
function remove(day) {
    localStorage.removeItem(day);
}
function clear() {
    localStorage.clear();
}
// deprecated in favour of using defer in the script tag
// window.addEventListener('load', pageLoaded);
pageLoaded();
