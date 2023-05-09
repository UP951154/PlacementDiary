
function pageLoaded() {
  console.log('js ready');
  var shareButton = document.getElementById("share-btn");
  shareButton.addEventListener("click", function () {
    var readOnlyLink = window.location.origin + "/read_only.html";
    alert("Share this link with others to view your diary: \n\n" + readOnlyLink);
  });
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
  var calendar = document.getElementById("calendar");

  // Clear calendar
  calendar.innerHTML = "";

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
        if (dayOfMonth === new Date().getDate() && month === currentMonth && year === currentYear) {
          // Add today class to today's cell
          cell.classList.add("today");
        }
        dayOfMonth++;
      }
      rowElement.appendChild(cell);
    }
    table.appendChild(rowElement);
  }

  // Add buttons to change month
  var nextMonth = document.createElement("button");
  nextMonth.innerHTML = '<i class="fa fa-chevron-right"></i>';
  nextMonth.classList.add("calendar-btn");
  nextMonth.id = 'nextMonth';
  nextMonth.addEventListener("click", function () {
    if (month === 11) {
      displayCalendar(0, year + 1);
    } else {
      displayCalendar(month + 1, year);
    }
  });
  header.appendChild(nextMonth);

  var prevMonth = document.createElement("button");
  prevMonth.id = 'prevMonth';
  prevMonth.innerHTML = '<i class="fa fa-chevron-left"></i>';
  prevMonth.classList.add("calendar-btn");
  prevMonth.addEventListener("click", function () {
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
  var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return monthNames[month];
}

function displayDiaryEntry(date) {
  diaryEntryElement.innerHTML = "";
  var day = date.getDate();


  // Date
  var header = document.createElement("h2");
  header.id = 'diary_header';
  header.innerHTML = date.toDateString();
  diaryEntryElement.appendChild(header);

  // Input 
  var inputOneValue = '';
  var inputTwoValue = '';
  var inputThreeValue = '';

  create_input('input_one', inputOneValue, 'Work carried out');
  create_input('input_two', inputTwoValue, 'Skills developed');
  create_input('input_three', inputThreeValue, 'Competency');
  input_one.classList.add('input');
  input_two.classList.add('input');
  input_three.classList.add('input');

  // Button Submit
  create_button('submitbtn', '<i class="fa fa-check"></i>', function () {
    var inputOneValue = document.getElementById('input_one').value;
    var inputTwoValue = document.getElementById('input_two').value;
    var inputThreeValue = document.getElementById('input_three').value;
    var arr = [inputOneValue, inputTwoValue, inputThreeValue];
    give(day, JSON.stringify(arr));

  });


  // Button Remove
  create_button('removebtn', '<i class="fa fa-trash"></i>', remove, day);

  // Button Clear
  create_button('clearbtn', '<i class="fa fa-times"></i>', clear);

  submitbtn.classList.add('functions');
  removebtn.classList.add('functions');
  clearbtn.classList.add('functions');
  // Get stored values and set input values
  var storedArr = JSON.parse(get(day));
  if (storedArr && storedArr.length === 3) {
    document.getElementById('input_one').value = storedArr[0];
    document.getElementById('input_two').value = storedArr[1];
    document.getElementById('input_three').value = storedArr[2];
  }


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

/* Set the width of the side navigation to 250px */
function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
}

/* Set the width of the side navigation to 0 */
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}
pageLoaded();