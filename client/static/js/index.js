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
    temp_year = year;
    temp_month = month;
    if (month === 11) {
      displayCalendar(0, year + 1);
      temp_year = year + 1;
      
    } else {
      displayCalendar(month + 1, year);
      temp_month = month + 1;
    }
    const date = new Date(temp_year, temp_month, 1);
    displayDiaryEntry(date);
  });
  header.appendChild(nextMonth);

  const prevMonth = document.createElement('button');
  prevMonth.id = 'prevMonth';
  prevMonth.innerHTML = '<i class="fa fa-chevron-left"></i>';
  prevMonth.classList.add('calendar-btn');
  prevMonth.addEventListener('click', function () {
    temp_year = year;
    temp_month = month;
    if (month === 0) {
      displayCalendar(11, year - 1);
      temp_year = year - 1
    } else {
      displayCalendar(month - 1, year);
      temp_month = month - 1
    }
    const date = new Date(temp_year, temp_month, 1);
    displayDiaryEntry(date);
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
  // header.innerHTML = formattedDate;
  header.innerHTML = date.toDateString();
  
  diaryEntryElement.appendChild(header);

  // Input
  createInput('work_description', '', 'Work carried out');
  createInput('experience_description', '', 'Experience gained and skills developed');
  createInput('competency', '', 'Competency');

  // Buttons
  createButton('submitbtn', '<i class="fa fa-check"></i>', function () {
    sendDataToFlask(formattedDate);
  });
  createButton('removebtn', '<i class="fa fa-trash"></i>',function () {
    deleteData(formattedDate);
  });
  createButton('clearbtn', '<i class="fa fa-times"></i>', function(){
    clearCalendar();
  });

  retrieveData(formattedDate)
  
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

// APIS

function sendDataToFlask(date) {
  const data = {
    page_title: document.getElementById('page_heading').innerHTML,
    date: date,
    work_description: document.getElementById('work_description').value,
    experience_description: document.getElementById('experience_description').value,
    competency: document.getElementById('competency').value,
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
    .then(result => {
      // Handle the result if needed
    })
    .catch(error => {
      console.error('Error:', error.message); // Log the error message
    });
}

function retrieveData(date){
  date = date
  fetch('/retrieve_data', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
          'date': date,  // Replace with the actual date or get it dynamically
      }),
  })
  .then(response => {
      // Check if the response is not empty
      if (response.ok && response.headers.get('content-length') !== '0') {
        return response.json();
      } else {
        return '';  // Return an empty string if the response is empty
      }
    })
  .then(data => {
      // Handle the retrieved data here
      if (data.length >= 3) {
        document.getElementById('work_description').value = data[0];
        document.getElementById('experience_description').value = data[1];
        document.getElementById('competency').value = data[2];
      } else {
        document.getElementById('work_description').value = '';
        document.getElementById('experience_description').value = '';
        document.getElementById('competency').value = '';
      }

  })
  .catch(error => {
      console.error('Error:', error);
  });
}

function deleteData(date){
      
  const data = {

    date: date,

  };

  fetch('/delete_data', {
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
  .then(data => {   
  })
}

function clearCalendar() {
  // Assuming you have a Flask route to handle the clear_calendar function
  fetch('/clear_calendar')
      .then(response => {
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json(); // assuming server returns JSON
      })
      .then(data => {
          console.log(data);
          location.reload(true); // log the response from the server
      })
      .catch(error => {
          console.error('Error:', error);
      });
}


pageLoaded();
