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
  
    fetch('/insert_data', {
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
  