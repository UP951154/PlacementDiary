
function pageLoaded() {
  console.log('js ready');
}

var today = new Date();
var currentMonth = today.getMonth();
var currentYear = today.getFullYear();

var calendar = document.getElementById("calendar");
var diaryEntryElement = document.getElementById("diaryEntry");
var button = document.getElementById('button');

displayCalendar(currentMonth, currentYear);


calendar.addEventListener("click", function (event) {
  if (event.target.classList.contains("day")) {
    var day = event.target.innerHTML;
    var month = currentMonth;
    var year = currentYear;

    // Remove selected class from previously selected day
    var selectedDay = document.querySelector(".selected");
    if (selectedDay) {
      selectedDay.classList.remove("selected");
    }

    // Add selected class to selected day
    event.target.classList.add("selected");

    // Update diary entry for selected date
    var date = new Date(year, month, day);

    displayDiaryEntry(date);

  }
});

function displayCalendar(month, year) {
  var daysInMonth = getDaysInMonth(month, year);

  // Set calendar header
  var header = document.createElement("h2");
  header.innerHTML = getMonthName(month) + " " + year;
  calendar.appendChild(header);

  // Create table for calendar
  var table = document.createElement("table");
  calendar.appendChild(table);

  // Create table header with weekday names
  var row = document.createElement("tr");
  table.appendChild(row);
  var weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  for (var i = 0; i < weekdays.length; i++) {
    var cell = document.createElement("td");
    cell.innerHTML = weekdays[i];
    row.appendChild(cell);
  }

  // Fill table with days of month
  var dayOfMonth = 1;
  for (var i = 0; i < 6; i++) {
    var rowElement = document.createElement("tr");
    for (var j = 0; j < 7; j++) {
      var cell = document.createElement("td");
      cell.classList.add("day");
      if ((i === 0 && j < new Date(year, month, 1).getDay()) || dayOfMonth > daysInMonth) {
        // Display empty cell for days before first day of month or after last day of month
        cell.classList.add("disabled");
      } else {
        cell.innerHTML = dayOfMonth;
        if (dayOfMonth === today.getDate() && month === currentMonth && year === currentYear) {
          // Add today class to today's cell
          cell.classList.add("today");
        }
        dayOfMonth++;
      }
      rowElement.appendChild(cell);
    }
    table.appendChild(rowElement);
  }


}

function getDaysInMonth(month, year) {
  return new Date(year, month + 1, 0).getDate();
}

function getMonthName(month) {
  var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return monthNames[month];
}

function displayDiaryEntry(date) {
  diaryEntryElement.innerHTML = "";
  var day = date.getDate();

  // Date
  var header = document.createElement("h2");
  header.innerHTML = date.toDateString();
  diaryEntryElement.appendChild(header);

  // Input 
  create_input('input_one', get(day), 'Work carried out');
  create_input('input_two', get(day), 'Skills developed');


  // Button Submit
  create_button('submitbtn', 'Save', function () {
    give(day, input_one.value)
  });

  // Button Remove
  create_button('removebtn', 'Remove', remove, day);

  // Button Clear
  create_button('clearbtn', 'Reset', clear);

}

// Utility functions

function create_button(id, content, onclick_func, onclick_params) {
  const btn = document.createElement('button');
  btn.id = id;
  btn.textContent = content;
  btn.onclick = function () {
    if (Array.isArray(onclick_params)) {
      onclick_func(...onclick_params);
    } else {
      onclick_func(onclick_params);
    }
  }
  diaryEntryElement.appendChild(btn);
}
function create_input(id, content, placeholder) {
  const input = document.createElement('textarea');
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