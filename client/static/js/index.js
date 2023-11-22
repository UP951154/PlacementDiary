function pageLoaded() {
  console.log('js ready');
  const shareButton = document.getElementById('share-btn');
  shareButton.addEventListener('click', function () {
    const readOnlyLink = window.location.origin + '/read_only.html';
    alert('Share this link with others to view your diary: \n\n' + readOnlyLink);
  });
  document.getElementById('icon').addEventListener('click', openNav);
  document.getElementById('closeBtn').addEventListener('click', closeNav);
}

const today = new Date();
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();
const diaryEntryElement = document.getElementById('diaryEntry');

displayCalendar(currentMonth, currentYear);

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
  for (let i = 0; i < weekdays.length; i++) {
    const cell = document.createElement('td');
    cell.innerHTML = weekdays[i];
    row.appendChild(cell);
  }

  // Fill table with days of month
  let dayOfMonth = 1;
  for (let i = 0; i < 6; i++) {
    const rowElement = document.createElement('tr');
    for (let j = 0; j < 7; j++) {
      const cell = document.createElement('td');
      cell.classList.add('currentDay');
      if ((i === 0 && j < new Date(year, month, 1).getDay()) || dayOfMonth > daysInMonth) {
        // Display empty cell for days before first currentDay of month or after last currentDay of month
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

  addEventListener('click', function (event) {
    if (event.target.classList.contains('currentDay')) {
      const currentDay = event.target.innerHTML;
      const month = currentMonth;
      const year = currentYear;

      // Remove selected class from previously selected currentDay
      const selectedDay = document.querySelector('.selected');
      if (selectedDay) {
        selectedDay.classList.remove('selected');
      }

      // Add selected class to selected currentDay
      event.target.classList.add('selected');

      // Update diary entry for selected date
      const date = new Date(year, month, currentDay);

      displayDiaryEntry(date);
    }
  });

  // Add buttons to change month
  const nextMonth = document.createElement('button');
  nextMonth.innerHTML = '<i class="fa fa-chevron-right"></i>';
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
  prevMonth.innerHTML = '<i class="fa fa-chevron-left"></i>';
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
  const currentDay = date.getDate();

  // Format date
  var year = date.getFullYear().toString(); // Get the last two digits of the year
  var month = ('0' + (date.getMonth() + 1)).slice(-2); // Add leading zero if needed
  var day = ('0' + date.getDate()).slice(-2); // Add leading zero if needed
  var formattedDate = year + '-' + month + '-' + day;
  
  // Date
  const header = document.createElement('h2');
  header.id = 'diary_header';
  header.innerHTML = formattedDate;
  
  diaryEntryElement.appendChild(header);

  // Input
  const work_description_content = '';
  const experience_description_content = '';
  const competency_content = '';

  createInput('work_description', work_description_content, 'Work carried out');
  createInput('experience_description', experience_description_content, 'Experience gained and skills developed');
  createInput('competency', competency_content, 'Competency');

  // These inputs are defined with the createInput() function.
  work_description.classList.add('input');
  experience_description.classList.add('input');
  competency.classList.add('input');

  // Button Submit
  createButton('submitbtn', '<i class="fa fa-check"></i>', function () {
    const work_description_content = document.getElementById('work_description').value;
    const experience_description_content = document.getElementById('experience_description').value;
    const competency_content = document.getElementById('competency').value;
    const arr = [work_description_content, experience_description_content, competency_content];
    give(currentDay, JSON.stringify(arr));
  });

  submitbtn.classList.add('functions');
  submitbtn.title = 'Click here to save your data'; 
  // Button Remove
  createButton('removebtn', '<i class="fa fa-trash"></i>', remove, currentDay);

  removebtn.classList.add('functions');
  removebtn.title = 'Click here to erase the data for this currentDay'; 

  // Button Clear
  createButton('clearbtn', '<i class="fa fa-times"></i>', clear);

  clearbtn.classList.add('functions'); // These buttons are defined with the createButton() function.
  clearbtn.title = 'Click here to ERASE ALL YOUR DATA! ';

  // Get stored values and set input values
  const storedArr = JSON.parse(get(currentDay));
  if (storedArr && storedArr.length === 3) {
    document.getElementById('work_description').value = storedArr[0];
    document.getElementById('experience_description').value = storedArr[1];
    document.getElementById('competency').value = storedArr[2];
  }

  sendDataToFlask();
}

// Utility functions

function createButton(id, content, onclickFunc, onclickParams) {
  const btn = document.createElement('button');
  btn.id = id;
  btn.innerHTML = content;
  btn.addEventListener('click', function () {
    if (Array.isArray(onclickParams)) {
      onclickFunc(...onclickParams);
    } else {
      onclickFunc(onclickParams);
    }
  });
  diaryEntryElement.appendChild(btn);
}

function createInput(id, content, placeholder) {
  const input = document.createElement('textarea');
  input.id = id;
  input.textContent = content;
  input.placeholder = placeholder;
  diaryEntryElement.appendChild(input);
}

function openNav() {
  document.getElementById('mySidenav').style.width = '250px';
}

function closeNav() {
  document.getElementById('mySidenav').style.width = '0';
}

// Local Storage Functions

function give(key, value) {
  localStorage.setItem(key, value);
}
function get(currentDay) {
  return localStorage.getItem(currentDay);
}
function remove(currentDay) {
  localStorage.removeItem(currentDay);
}
function clear() {
  localStorage.clear();
}
function sendDataToFlask(){
  const data = {
    page_title: document.getElementById('page_heading').innerHTML,
    date: document.getElementById('diary_header').innerHTML,
    work_description: document.getElementById('work_description').value,
    experience_description: document.getElementById('experience_description').value,
    competency: document.getElementById('competency').value

};

  fetch('/process_data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(result => {})
  .catch(error => console.error('Error:', error));
}

pageLoaded();
