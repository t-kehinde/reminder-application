//==============[    START     ]==================

const UPDATE_DOM_TIMER = 1000;
const APP_ALERT_DURATION = 20000; 

// MAIN SCREEN COMPONENT
const mainScreen = document.querySelector(".main-screen");

// Button Components
const mainScreenButtons = document.querySelector(".set-alarm__btn-container");
// const addAlarmButton = document.querySelector(".set-alarm__btn-container");
const editAlarmsBtn = document.querySelector(".edit-alarm__button");
const cancelEditAlarmsBtn = document.querySelector(".edit-alarm__exit-button");
const setAlarmBtn = document.querySelector("#set-alarm-button");
const createAlarmSubmitBtn = document.querySelector(
    "#set-alarm__form-submit-btn"
);

// Alarm components
const alarmsContainer = document.querySelector(".alarms");
const noTaskDisplay = document.querySelector(".countdown-none");

// Countdown component
const countdownContainer = document.querySelector(".countdown__container");

const alarmTodoDisplay = document.getElementById("countdown-alarm-todo");
const alarmTodoDisplayNext = document.getElementById(
    "countdown-alarm-todo_next"
);
const countdownDisplayTaskBtn = document.querySelector("#countdown-todo__btn");
// const alarmTask = document.querySelector(".task-display");
const alarmDaysCounter = document.querySelector("#countdown-time__days");
const alarmSecondsCounter = document.querySelector("#countdown-time__secs");

//============================================================

// HOME SCREEN COMPONENT
const homeScreen = document.querySelector(".app-home-screen");

//==============================================================

// MODAL COMPONENT
const modalDisplay = document.querySelector("#set-alarm-modal");

// Form fields
const alarmDateEl = document.querySelector("#date-picker");
const alarmTimeEl = document.querySelector("#time-picker");
const alarmTaskEl = document.querySelector("#modal-todo__task");
const alarmNotesEl = document.querySelector("#modal-todo__textarea");

// Update button  component
const updateAlarmSubmitBtn = document.querySelector(
    "#update-alarm__form-submit-btn"
);

// Form validation component
const dueDateValidationMessage = document.querySelector(
    ".modal__labels__validation_message"
);

//========================================================

// CURRENT TIME COMPONENT
const currentTimeContainer = document.querySelector(".current-time__container");
const currentTime = document.querySelector("#current-time__hr_min");
const currentDate = document.querySelector("#current-time__date");

//===============================================================
// SPLASH SCREEN
const splashScreenContainer = document.querySelector(".start-up-screen");

//===============================================================
// DEFINE LOCAL STORAGE
const localStorageAlarms = JSON.parse(localStorage.getItem("alarms"));
let alarms = localStorage.getItem("alarms") !== null ? localStorageAlarms : [];

//==============================================================
// DEFINE VARIABLES
const MAX_ALARM = 3;
const SET_SPLASH_HOME_TRANSITION_TIME = 12000;

//===============================================================

// APP STATE STORAGE
/* When the app is initialized for the first time determined by the record in local storage, the appLoaded key is set to True. The splash screen will be displayed only when this value is False, i.e. when there is no app data stored on the user's system.
*
* Also, when the user clicks the Add button for the first time, the initial add is set to True. This prevents the splash screen from reloading when there is no alarm stored that is either removed or never added after the first click. */

// Set the appLoad data to local storage after splash screen loads
window.addEventListener('load', (event) => {
  setTimeout(function () {
    localStorage.setItem('appLoaded', 'True')
  }, 5000)
});

function appStart() {
  if (alarms.length < 1) {
    startupDisplay();
  } else {
    renderAlarmDOM()
  }
}

const appLoad = localStorage.getItem("appLoaded");

// Current time is not displayed on splash screen
if (!appLoad){
  currentTimeContainer.style.display = "none";
} else{
  currentTimeContainer.style.display = "block";
}

// Listen for initial ADD click event and store to local storage
setAlarmBtn.addEventListener("click", initialAddClick, { once: true });
function initialAddClick() {
  localStorage.setItem('initialAdd', 'True');
}

//===========================================================
// WELCOME SCREEN
// Display splash screen for first-time users
function startupDisplay() {
  alarmsContainer.style.display = "none";
  countdownContainer.style.display = "none";
  if (!appLoad) {
    showSplash();
  } else {
      homeScreenDisplay();
    }    
}

// Build the splash screen components
function showSplash() {
  splashScreenContainer.style.display = "flex";

  // No button displays on splash
  setAlarmBtn.style.display = "none";
  editAlarmsBtn.style.display = "none";
  cancelEditAlarmsBtn.style.display = "none";

  setTimeout(function () {
    homeScreenDisplay();
  }, SET_SPLASH_HOME_TRANSITION_TIME);
}

// Display the home screen
function homeScreenDisplay() {
  homeScreen.style.display = "flex";
  currentTimeContainer.style.display = "block";

  // Remove splash component
  splashScreenContainer.style.display  = "none";
  mainScreenButtonsRender();
}



/** -----------------------------------------------------------
                   SECTION 1: NAVBAR TIME COMPONENT
-------------------------------------------------------------*/
// CURRENT TIME
function updateCurrentTime() {
  const currentdate = new Date();
  const time =
    ("0" + currentdate.getHours()).slice(-2) + ":" +
    ("0" + currentdate.getMinutes()).slice(-2) + ":" +
    ("0" + currentdate.getSeconds()).slice(-2);
  const date =
    currentdate.getUTCFullYear() + "/" +
    ("0" + (currentdate.getMonth() + 1)).slice(-2) + "/" +
    ("0" + currentdate.getDate()).slice(-2) + " ";
  currentTime.textContent = time;
  currentDate.textContent = date;
}
setInterval(updateCurrentTime, 1000);

/** ---------------------------------------------------------
                  GENERAL COMPONENTS
-------------------------------------------------------------*/

// DISPLAY SET ALARM MODAL ON ADD REMINDER CLICK
setAlarmBtn.addEventListener("click", displaySettingsScreen);
function displaySettingsScreen(event) {
  event.preventDefault();
  clearAlertMessage();

  // Display the modal component
  modalDisplay.style.display = "block";
  mainScreen.style.display = "none";

  // Display UPDATE/CREATE button
  if (event.target === setAlarmBtn) {
    createAlarmSubmitBtn.style.display = "block";
    updateAlarmSubmitBtn.style.display = "none";
  } else {
    updateAlarmSubmitBtn.style.display = "block";
    createAlarmSubmitBtn.style.display = "none";
  }

  // Remove components - main, alarms, counter and inactive screen
  mainScreenButtons.style.display = "none";
  alarmsContainer.style.display = "none";
  countdownContainer.style.display = "none";
  noTaskDisplay.style.display = "none";
}

// BUTTON RENDERING CONDITIONS FOR MAIN SCREEN
function mainScreenButtonsRender() {
  /* Buttons are rendered based on the number of alarms .*/
  mainScreenButtons.style.display = "flex";
  const appLoad = localStorage.getItem("appLoaded");
  const userInt = localStorage.getItem("initialAdd");

  if (alarms.length < 1) {
    // Remove all buttons on splash screen
    if (!appLoad && (!userInt)){
      setAlarmBtn.style.display = "none";
      editAlarmsBtn.style.display = "none";
      cancelEditAlarmsBtn.style.display = "none";

    // Include add button on home screen first display
    } else if (appLoad && (!userInt)) {
      homeScreen.style.display = "flex";

      setAlarmBtn.style.display = "inline-block";
      editAlarmsBtn.style.display = "none";
      cancelEditAlarmsBtn.style.display = "none";
    } else {
      homeScreen.style.display = "flex";
      countdownContainer.style.display = "none";
      setAlarmBtn.style.display = "inline-block";
      editAlarmsBtn.style.display = "none";
      cancelEditAlarmsBtn.style.display = "none";
    }
  }
  else if (alarms.length > 0 && alarms.length < MAX_ALARM) {
    setAlarmBtn.style.display = "inline-block";
    editAlarmsBtn.style.display = "inline-block";
    cancelEditAlarmsBtn.style.display = "none";
  } else {
    setAlarmBtn.style.display = "none";
    editAlarmsBtn.style.display = "inline-block";
    cancelEditAlarmsBtn.style.display = "none";
  }
}

// CANCEL THE EDIT ALARMS OPERATION
cancelEditAlarmsBtn.addEventListener("click", cancelEditAlarms);
function cancelEditAlarms() {
  // Select the editor for the alarm cards
  const alarmsEditList = document.querySelectorAll(
    ".alarm-set__time_editor-group"
  );
  for (let i = 0; i < alarmsEditList.length; i++) {
    alarmsEditList[i].style.display = "none";
  }
  // Update buttons
  mainScreenButtonsRender();
}

/** -----------------------------------------------------------
                SECTION 2: ADD NEW ALARM COMPONENT
--------------------------------------------------------------*/
// SUBMIT NEW ALARM
createAlarmSubmitBtn.addEventListener("click", addNewAlarm);
function addNewAlarm(event) {
  event.preventDefault();
  // Change button to ADD button
  createAlarmSubmitBtn.style.display = "block";
  updateAlarmSubmitBtn.style.display = "none";
  editAlarmsBtn.style.display = "none";

  const alarmDate = updateFields()[0];
  const alarmTime = updateFields()[1];
  const alarmDueDaysCounter = updateFields()[2];
  const alarmTask = alarmTaskEl.value.trim();
  const alarmNotes = alarmNotesEl.value.trim();
  // Validate the form and create alarm
  if (
    alarmDate.trim() === "" ||
    alarmTime.trim() === "" ||
    alarmTask.trim() === ""
  ) {
    showAlert(alarmDateEl, alarmTimeEl, alarmTaskEl);
  } else {
    const alarm = {
      id: generateRandomID(),
      date: alarmDate,
      time: alarmTime,
      task: alarmTask,
      due: alarmDueDaysCounter,
      overdue: false,
      comment: alarmNotes,
      status: true,
    };
    alarms.push(alarm); // Add to alarms array
    saveAlarmsToLocalStorage(alarms); // Save to local storage
    closeAlarmSettings(event); // Close the alarm settings modal
    renderAlarmDOM();
  }
}

// GENERATE RANDOM VALUE (SUB-SUBMIT NEW ALARM)
function generateRandomID() {
  return Math.floor(Math.random() * 1000) + 1;
}

// UPDATE ALARM FORM FIELDS
function updateFields() {
  // Get the values from the fields
  const alarmDate = alarmDateEl.value;
  const alarmTime = alarmTimeEl.value;
  const alarmDueDaysCounter = alarmDueDaysCounterEl.value;
  return [alarmDate, alarmTime, alarmDueDaysCounter];
}

// UPDATE SELECTED DUE DISPLAY OPTION (Super: SUBMIT NEW ALARM; Sub: clearAllOptions)
const alarmDueDaysCounterEl = document.getElementById("reminder-time__select");

alarmDueDaysCounterEl.addEventListener("click", updateOptions);
function updateOptions() {
  clearAllOptions();
  // Get the values from the fields
  const alarmDate = alarmDateEl.value;
  const alarmTime = alarmTimeEl.value;

  // concatenate the date and time
  const alarmTimeString = alarmDate + " " + alarmTime + ":00";
  // convert to milliseconds
  const timeDiffMs = new Date(alarmTimeString).getTime() - new Date().getTime();
  const timeDiffDays = Math.floor(timeDiffMs / (1000 * 60 * 60 * 24));

  let output = "";
  // Render options with conditions:
  // (a) if due date is more than 24 hours
  if (timeDiffDays > 0) {
    dueDateValidationMessage.style.display = "none";
    document.querySelector("#reminder-time__options").disabled = false;
    const timeArray = Array.from({ length: timeDiffDays }, (_, i) => i + 1);
    // Add option to the options dropdown
    for (let i = 0; i < timeArray.length; i++) {
      output += `<option class = "reminder-time__option" value="${timeArray[i]
        } ${timeArray[i] <= 1 ? "day" : "days"}">  ${timeArray[i]} ${timeArray[i] <= 1 ? "day" : "days"
        } </option>`;
    }
  // (b) if less than 24 hours - disable select options
  } else {
    dueDateValidationMessage.style.display = "block";
    document
      .querySelector("#reminder-time__options")
      .insertAdjacentHTML(
        "beforeend",
        `<option class = "reminder-time__option" value="no-selection"> No selection </option>`
      );
    document.querySelector("#reminder-time__options").disabled = true;
  }
  document
    .querySelector("#reminder-time__options")
    .insertAdjacentHTML("beforeend", output);
}

alarmTimeEl.addEventListener("change", () => {
  clearAllOptions();
});
alarmDateEl.addEventListener("change", () => {
  clearAllOptions();
});

// REMOVE OPTIONS FROM DAYS TO DUE DATE SELECT (SUB-SUBMIT NEW ALARM: updateFields -> daysReminderOption)
function clearAllOptions() {
  const options = document.querySelectorAll(".reminder-time__option");
  for (let i = 0; i < options.length; i++) {
    options[i].remove();
  }
}

//  FORMAT THE DATE AND TIME ON TIME PICKER
function alarmTimeAndDateDisable() {
  //  Get the day, month and year
  let dd = new Date().getDate();
  let mm = new Date().getMonth() + 1;
  const yyyy = new Date().getFullYear();
  // Add 0 as the first digit for month and day less than 10
  dd = ("0" + dd).slice(-2);
  mm = ("0" + mm).slice(-2);

  // Set the date format and minimum value
  const todayDate = yyyy + "-" + mm + "-" + dd;
  alarmDateEl.setAttribute("min", todayDate);
  // Set the time format and minimum value
  const todayTime = new Date().getHours() + ":" + new Date().getMinutes();
  alarmTimeEl.setAttribute("min", todayTime);
}
alarmTimeAndDateDisable();

// CLEAR SETTINGS FORM FIELDS
function clearFormFields() {
  document.querySelector("#date-picker").value = "";
  document.querySelector("#time-picker").value = "";
  document.querySelector("#modal-todo__textarea").value = "";
  document.querySelector("#modal-todo__task").value = "";
}

// CLOSE SETTINGS USING CANCEL OR SUBMIT BUTTON (SUB:CLOSE SETTINGS)
const cancelSettingsBtn = document.querySelector("#alarm-modal-close");
cancelSettingsBtn.addEventListener("click", closeAlarmSettings);
function closeAlarmSettings(event) {
  event.preventDefault();

  // items to clear
  modalDisplay.style.display = "none"; // close settings screen
  dueDateValidationMessage.style.display = "none"; // remove date validate message
  clearAllOptions(); // clear options in due field
  clearFormFields(); // clear form fields
  clearAlertMessage(); // remove alert

  // items to display
  mainScreen.style.display = "block"; // display main screen
  alarmsContainer.style.display = "block"; // display alarms block
  mainScreenButtons.style.display = "flex"; // display main screen buttons
  noActiveTaskDisplay(alarms); // display countdown
  renderAlarmDOM(); // show the main screen
}

// SHOW FORM VALIDATION ALERT
function showAlert(date, time, task) {
  const alertMessage = document.getElementById("form-validate__message");
  alertMessage.style.display = "inline-block";

  const validateFieldArr = [date, time, task];
  validateFieldArr.forEach((field) => {
    if (field.value.trim() === "") {
      field.previousElementSibling.style.color = "red";
      field.style.borderColor = "red";
      field.style.backgroundColor = "#ffb1b14b";
    } else {
      field.previousElementSibling.style.color = "";
      field.style.borderColor = "";
      field.style.backgroundColor = "";
    }
  });
  // time the alert message
  setTimeout(function () {
    alertMessage.style.display = "none";
  }, 4000);
}

//  CLEAR ALERT MESSAGE
function clearAlertMessage() {
  // Clear amy alert message
  const alertMessage = document.getElementById("form-validate__message");
  alertMessage.style.display = "none";

  // Remove the error from each field
  const validateFieldArr = [alarmDateEl, alarmTimeEl, alarmTaskEl];
  validateFieldArr.forEach((field) => {
    field.previousElementSibling.style.color = "";
    field.style.borderColor = "";
    field.style.backgroundColor = "";
  });
}


/** -----------------------------------------------------------
                  SECTION 2B : RENDER ALARMS COMPONENT
--------------------------------------------------------------*/

// RENDER ALARM TO DOM
function renderAlarmDOM() {
  let output = "";
  alarms.forEach((alarm) => {
    output += `
      <div class= "alarm-set alarm-set__${alarm.id}" >
          <div class = 'alarm-header-group'>
              <div class= "active-alarm-blinker">
                  <div class="square square_1"></div>
                  <div class="square square_2"></div>
                  <div class="square square_3"></div>
                  <div class="square square_4"></div>
              </div>
              <div class = "alarm-set__time_editor-group">
                  <button class = "alarm-set__modify" id = ${alarm.id
      }><i class="bi bi-pen-fill"></i></button>
                  <button class = "alarm-set__delete" onClick="removeAlarm(${alarm.id
      })"><i class="bi bi-trash-fill"></i></button>
              </div>
          </div>

          <div class= "alarm__inner-container" >
              <div class="alarm-set__container" id = "alarm-set__container__${alarm.id
      }">
                  <h2 class="alarm-set-time">${alarm.time}</h2>     
                  <div class="alarm-date alarm-id__${alarm.id
      }" id="alarm-date-id__${alarm.id}"> ${alarm.date}
                  
                  </div> 
                  ${showOverdueTag(alarm)}
              
                  ${alarmDueDaysCounterRender(alarm)}
                  
                  <div class="task-display" id="task-id__${alarm.id}">
                      <span class = "alarm-todo todo_${alarm.id}">
                          ${commentRenderCount(alarm)}
                          ${alarm.task}
                      </span>
                  </div>
              </div>
              <div class="toggle-alarm__button-container" id = "toggle-alarm-button__alarm-${alarm.id
      }">
                  <label class = "toggle alarm-set__item" for="switch_${alarm.id
      }">
                      <input type="checkbox" class = "toggle__input" id="switch_${alarm.id
      }" ${alarm.status ? "checked" : null}/>
                      <div class="toggle__fill" id="toggle__fill-alarm-${alarm.id
      }"></div>
                  </label>
              </div> 
          </div>
      </div>`;
  });
  document.getElementById("alarm-cards").innerHTML = output;
  homeScreen.style.display = "none";

  mainScreenButtonsRender();
  toggleAlarmSwitch();
  displayTodo(alarms);
}

// COMMENT ICON (SUB: RENDER ALARM)
function commentRenderCount(alarm) {
  if (alarm.comment.length > 0) {
    return `<i class="bi bi-card-text"></i>`;
  } else {
    return "";
  }
}

// DISPLAY OVERDUE LABEL
function showOverdueTag(alarm) {
  // Check that the date has passed and alarm is inactive
  alarm.diffMs < 0 && alarm.status === false
    ? (alarm.overdue = true)
    : (alarm.overdue = false);

  if (alarm.overdue === true) {
    let output = "";
    output += `<div
            class="alarm-upcoming-time due-task"
            id="alarm-upcoming-time"
          >OVERDUE</div>`;
    return output;
  } else {
    return "";
  }
}

/** ---- Number of days left to due date ----- */

// DISPLAY DAYS TO DUE ON MAIN SCREEN (SUB: RENDER ALARM)
function alarmDueDaysCounterRender(alarm) {
  const dueDate = dateDifference(alarm)[0];
  const timeDiffDays = dateDifference(alarm)[1];

  // Display only when number of days < today and more than a day
  if (timeDiffDays <= dueDate) {
    if (timeDiffDays > 0 && alarm.due !== "") {
      return `<div class = "alarm-upcoming-time" id="alarm-upcoming-time">Due in ${timeDiffDays} ${timeDiffDays <= 1 ? "day" : "days"
        }  </div> `;
    } else if (timeDiffDays === 0 && alarm.due !== "") {
      return `<div class = "alarm-upcoming-time" id="alarm-upcoming-time">Due in less than 24 HRS </div> `;
    } else {
      return "";
    }
  } else {
    return "";
  }
}

function dateDifference(alarm) {
  // Get the difference between the due soon and current time
  const dueDate = parseInt(alarm.due.substr(0, alarm.due.indexOf(" ")));
  // concatenate the date and time
  const alarmTimeString = alarm.date + " " + alarm.time + ":00";
  // convert to milliseconds
  const timeDiffMs = new Date(alarmTimeString).getTime() - new Date().getTime();
  const timeDiffDays = Math.floor(timeDiffMs / (1000 * 60 * 60 * 24));
  return [dueDate, timeDiffDays];
}

function renderDOMonDateChange() {
  /** App updates every minute to update the
   * number of days left to due date.*/
  alarms.forEach((alarm) => {
    dateDifference(alarm);
  });
  renderAlarmDOM();
}
setInterval(renderDOMonDateChange, 1000 * 60); // rerender every  mins

/** --------------------------------------------------------
                  SECTION 3: EDIT EXISTING ALARM
----------------------------------------------------------*/

// EDIT ALARM
editAlarmsBtn.addEventListener("click", () => {
  const alarmsEditList = document.querySelectorAll(
    ".alarm-set__time_editor-group"
  );

  // Display only cancel button on each alarm card
  editAlarmsBtn.style.display = "none";
  cancelEditAlarmsBtn.style.display = "inline-block";
  setAlarmBtn.style.display = "none";
  // Display delete & edit icons on each card
  for (let i = 0; i < alarmsEditList.length; i++) {
    alarmsEditList[i].style.display = "inline-block";
  }
  // Navigate to the add/edit screen for selected alarm
  const editIconBtn = document.querySelectorAll(".bi-pen-fill");
  editIconBtn.forEach((item) => {
    item.addEventListener("click", editAlarm);
  });

  // *** EDIT EACH ALARM CARD ***
  function editAlarm(event) {
    displaySettingsScreen(event); // show alarm settings
    selectedAlarmid = parseInt(event.target.parentElement.id); // Get element id

    // Populate form fields with alarm attributes
    alarms.forEach((alarm) => {
      if (alarm.id === selectedAlarmid) {
        alarmDateEl.value = alarm.date;
        alarmTimeEl.value = alarm.time;
        alarmTaskEl.value = alarm.task;
        alarmNotesEl.value = alarm.comment ? alarm.comment : "";

        // Fill the options field with selected option
        document
          .querySelector("#reminder-time__options")
          .insertAdjacentHTML(
            "beforeend",
            `<option selected class = "reminder-time__option temp-inserted-selection" value="${alarm.due.length !== 0 ? alarm.due : "no-selection"
            }" selected>${alarm.due.length !== 0 ? alarm.due : "No selection"
            }</option>`
          );
      }
    });

    // Update the options field (remove the selected option)
    alarmDueDaysCounterEl.addEventListener("click", () => {
      const tempSelectedOption = document.querySelector(
        ".temp-inserted-selection"
      );
      if (tempSelectedOption === null) {
        return;
      } else {
        tempSelectedOption.remove();
      }
    });

    // Submit the form and update the alarm
    updateAlarmSubmitBtn.addEventListener(
      "click",
      function () {
        // Get the values from the fields
        const alarmDate = updateFields()[0];
        const alarmTime = updateFields()[1];
        const alarmDueDaysCounter = updateFields()[2];
        const alarmTask = alarmTaskEl.value.trim();
        const alarmNotes = alarmNotesEl.value.trim();

        // Validate the form and create alarm
        if (
          alarmDate === "" ||
          alarmTime === "" ||
          alarmTask.trim().length < 1
        ) {
          showAlert(alarmDateEl, alarmTimeEl, alarmTaskEl);
        } else {
          const updatedAlarm = {
            id: selectedAlarmid,
            date: alarmDate,
            time: alarmTime,
            task: alarmTask,
            due: alarmDueDaysCounter,
            comment: alarmNotes,
            overdue: false,
            status: alarms.find((alarm) => alarm.id === selectedAlarmid).status,
          };
          // update alarms array
          alarms.forEach((alarm, index) => {
            if (updatedAlarm.id === alarm.id) {
              alarms.splice(index, 1, updatedAlarm);
            }
          });
          saveAlarmsToLocalStorage(alarms); // Save to local storage
          closeAlarmSettings(event); // close alarm settings
          renderAlarmDOM();
        }
      }.bind(selectedAlarmid)
    );
  }
});

// DELETE ALARM (ONCLICK ON HTML ATTRIBUTE)
function removeAlarm(id) {
  alarms = alarms.filter((alarm) => alarm.id !== id);
  saveAlarmsToLocalStorage(alarms);
  renderAlarmDOM();
  displayTodo(alarms);
}

// ==============================================================
//  SAVE TO LOCAL STORAGE
function saveAlarmsToLocalStorage(alarms) {
  localStorage.setItem("alarms", JSON.stringify(alarms));
}

// ==========================================================
// TOGGLE ON/OFF AN ALARM
function toggleAlarmSwitch() {
  const toggleBtn = document.getElementsByClassName(
    "toggle-alarm__button-container"
  );

  for (let i = 0; i < toggleBtn.length; i++) {
    toggleBtn[i].addEventListener("click", function (event) {
      let alarmToggleId = event.target.id;
      alarms.forEach((alarm) => {
        `switch_${alarm.id}` === alarmToggleId
          ? (alarm.status = !alarm.status)
          : null;
      });
      // Save the toggle status to local storage
      saveAlarmsToLocalStorage(alarms);
      displayTodo(alarms);
      noActiveTaskDisplay(alarms);
    });
  }
}

/** -----------------------------------------------------------
           SECTION 4: RENDER THE COUNTDOWN COMPONENT
--------------------------------------------------------------*/

// SORT THE ALARMS IN ASCENDING TIME
function sortAlarmsArr() {
  let sortedAlarmArr = [...alarms];
  if (sortedAlarmArr.length > 0) {
    sortedAlarmArr.forEach((alarm) => {
      // concatenate the date and time
      const alarmTimeString = alarm.date + " " + alarm.time + ":00";
      // convert to milliseconds
      const alarmMilliseconds = new Date(alarmTimeString).getTime();
      const nowMilliseconds = new Date().getTime();
      // Subtract current time from alarm time
      const timeIntervalToAlarm = alarmMilliseconds - nowMilliseconds;
      // Split time difference to days, hours and minutes
      const day = Math.floor(timeIntervalToAlarm / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeIntervalToAlarm % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (timeIntervalToAlarm % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((timeIntervalToAlarm % (1000 * 60)) / 1000);

      // Add time properties to alarm array
      alarm.diffMs = timeIntervalToAlarm;
      alarm.days = day;
      alarm.hour = hours;
      alarm.mins = minutes;
      alarm.secs = seconds;
    });
    // Sort and clone array of alarms
    if (sortedAlarmArr.length > 1) {
      return sortedAlarmArr.sort(
        (a, b) => parseInt(a.diffMs) - parseInt(b.diffMs)
      );
    } else {
      return sortedAlarmArr;
    }
  } else return alarms;
}
setInterval(() => {
  sortAlarmsArr;
}, UPDATE_DOM_TIMER);


// COUNTDOWN ACTIVE ALARM (Super: sortAlarmsArr )
function conditionalCounterDOM() {
  // Import the sorted alarms array
  const sortedAlarms = sortAlarmsArr();

  // Find first occurrence of lowest with toogle status set to TRUE
  const alarmToDisplayList = sortedAlarms.filter(
    (alarm) => alarm.status === true
  );

  // If there is an alarm to display, display it
  if (alarmToDisplayList.length > 0) {
    const alarmToDisplay = alarmToDisplayList[0];
    // Get alarm and current time
    const alarmMs = new Date(
      alarmToDisplay.date + " " + alarmToDisplay.time + ":00"
    ).getTime();
    const nowMs = new Date().getTime();

    alarmDaysCounter.style.display = "inline-block"; // display # of days
    alarmSecondsCounter.style.display = "inline-block"; // display # of seconds

    // Activate the alarm when time's up & toggle button is active
    if (alarmMs <= nowMs && alarmToDisplay.status === true) {
      // Change display
      // isAlertSoundOn = true;
      toggleActiveAlarm(alarmToDisplay, alarmToDisplayList);
    } else {
      // isAlertSoundOn = false;
      renderCounterDOM(alarmToDisplay);
    }

    function renderCounterDOM(alarmToDisplay) {
      // (a) Set the blinker condition 
      sortedAlarms.forEach((alarm) => {
        if (alarm.id === alarmToDisplay.id) {
          alarm.id === alarmToDisplay.id &&
            alarm.status &&
            document.querySelector(`.alarm-set__${alarmToDisplay.id}`)
              .firstElementChild.firstElementChild.style.visibility === "hidden"
            ? (document.querySelector(
              `.alarm-set__${alarmToDisplay.id}`
            ).firstElementChild.firstElementChild.style.visibility =
              "visible")
            : (document.querySelector(
              `.alarm-set__${alarmToDisplay.id}`
            ).firstElementChild.firstElementChild.style.visibility =
              "hidden");
        } else if (alarm.id !== alarmToDisplay.id) {
          document.querySelector(
            `.alarm-set__${alarm.id}`
          ).firstElementChild.firstElementChild.style.visibility = "hidden";
        }
      });

      // (b) Add prefix to the time format
      let displayedDays = ("0" + alarmToDisplay.days).slice(-2);
      let displayedHours = ("0" + alarmToDisplay.hour).slice(-2);
      let displayedMins = ("0" + alarmToDisplay.mins).slice(-2);
      let displayedSecs = ("0" + alarmToDisplay.secs).slice(-2);

      // (c) Display the alarm time properties at selected DOM elements
      document.querySelector("#hours__text").innerHTML = displayedHours;
      document.querySelector("#minutes__text").innerHTML = displayedMins;
      document.querySelector(
        "#countdown-time__days"
      ).innerHTML = `${displayedDays}d`;
      document.querySelector(
        "#countdown-time__secs"
      ).innerHTML = `${displayedSecs}secs`;
    }
  } else {
    // Clear center display and show no active task message
    sortedAlarms.forEach((alarm) => {
      document.querySelector(
        `.alarm-set__${alarm.id}`
      ).firstElementChild.firstElementChild.style.visibility = "hidden";
    });
    noActiveTaskDisplay(sortedAlarms);
  }
}
let countdownAlarm = setInterval(conditionalCounterDOM, UPDATE_DOM_TIMER); 

// DISPLAY NO TASK MESSAGE
// @parameter: alarms (renderCounterDOM)
function noActiveTaskDisplay(alarms) {
  const offAlarmLength = alarms.filter(
    (alarm) => alarm.status === false
  ).length;
  if (alarms.length < 1) {
    noTaskDisplay.style.display = "none";
 
  } else if (alarms.length >= 1 && offAlarmLength === alarms.length) {
    noTaskDisplay.style.display = "block";
    countdownContainer.style.display = "none";
    homeScreen.style.display = "none"
  } else { 
    noTaskDisplay.style.display = "none";
    countdownContainer.style.display = "block";
  }
}


// Play the alarm sound after 1s when the alarm is on
const audio = new Audio("mixkit-warning-alarm-buzzer-991.wav");
audio.loop = true;
let isAlertSoundOn = false;
let alarmTimeout = null;

function playAlertAudio(){
  if (isAlertSoundOn) {
    alarmTimeout = setTimeout(() => {
      audio.play();
    }, 1000);
  } else {
    clearTimeout(alarmTimeout);
    audio.pause();
  }
}


// Activate the alarm when time's up & toggle button is active
// =============================================================
function clearTimerDOM(alarmToDisplay, alarmToDisplayList) {
  // Clear the countdown display container
  document.querySelector(".timer__container").style.display = "none";
  countdownDisplayTaskBtn.style.display = "none";
  document.querySelector(".countdown-name").style.display = "none";

  // Turn on alert isAlertSoundOn
  isAlertSoundOn = true;
  playAlertAudio();

  // Create alert component
  const alertCompEl = document.createElement("div");
  alertCompEl.classList.add("alert-comp");
  document.querySelector(".countdown__container").appendChild(alertCompEl);

  // Create HTML alert animation
  const barsEl = document.createElement("div");
  barsEl.classList = 'alert-bars';
  barsEl.innerHTML = `
    <div class="alert-bars__bar">
      <div class="bar bar-1"></div>
      <div class="bar bar-2"></div>
      <div class="bar bar-3"></div>
      <div class="bar bar-4"></div>
      <div class="bar bar-5"></div>
      <div class="bar bar-6"></div>
      <div class="bar bar-7"></div> 
      <div class="bar bar-8"></div>
      <div class="bar bar-9"></div> 
    </div>`;
  document.querySelector(".alert-comp").appendChild(barsEl);

  // Create HTML current due task
  const activeTaskEl = document.createElement("div");
  activeTaskEl.classList = `alarm-set__${alarmToDisplay.id} alert-message-comp`
  activeTaskEl.innerHTML = `
        <div class ="alert-message alert-current">
            <p class = "alert-text alert-text-bold"> ${alarmToDisplay.task} is due</p>
        </div> `;
  document.querySelector(".alert-comp").appendChild(activeTaskEl);

  // Display the upcoming due task if there is any
  if (alarmToDisplayList.length > 1) {
    const divnextEl = document.createElement("div");
    divnextEl.classList = "alert-message-comp alert-next";
    divnextEl.innerHTML = `
      <div class = "alert-message">
            <p class= "alert-text"> NEXT: </p>
            <p class = "alert-text" > Due on  ${alarmToDisplayList[1].time}  ${alarmToDisplayList[1].date} </p>
        </div>`;
    document.querySelector(".alert-comp").appendChild(divnextEl);
  } else {
    return;
  }
}

// Stop countdown and display alert message
function toggleActiveAlarm(alarmToDisplay, alarmToDisplayList) {
  clearInterval(countdownAlarm); // clear countdown
  // Get the index of active alarm
  const activeAlarmId = alarms.findIndex(
    (alarm) => alarm.id === alarmToDisplay.id
  );
  const activatedAlarm = alarms[activeAlarmId];

  if (activatedAlarm.status === true) {
    clearTimerDOM(alarmToDisplay, alarmToDisplayList);

    // Clear active alarm after specified duration
    let clearAlarmDisplay = setTimeout(clearAlarm, APP_ALERT_DURATION, activatedAlarm);

    // Turn off alarm when user switches toggle
    const dueAlarmToggleEl = document.querySelector(
      `#toggle-alarm-button__alarm-${alarmToDisplay.id}`
    );
    dueAlarmToggleEl.addEventListener("click", () => {
      alarmToDisplay === activatedAlarm
        ? (activatedAlarm.status = !activatedAlarm.status)
        : null;
      clearTimeout(clearAlarmDisplay);
      clearActiveAlarm(alarms[activeAlarmId]);    
    });
  } else {
    clearTimeout(clearAlarmDisplay);
    clearActiveAlarm(alarms[activeAlarmId]);
  }
}


// Remove activated alarm (overdue task) from array and 
// call function to clear the DOM
function clearAlarm(alarmToDisplay) {
  // Save the toggle and overdue states to local storage
  let indexMatch = alarms.findIndex((alarm) => alarm.id === alarmToDisplay.id);
  alarms[indexMatch].status = false;
  clearActiveAlarm(alarmToDisplay);
}

// Clear the overdue task from UI
function clearActiveAlarm(alarm) {
  document.querySelector(".alert-comp").remove();
  countdownDisplayTaskBtn.style.display = "block";
  document.querySelector(".timer__container").style.display = "flex";
  document.querySelector(".countdown-name").style.display = "flex";

  // Turn off alert isAlertSoundOn
  isAlertSoundOn = false;
  playAlertAudio();

  // showOverdueTag(alarm);
  saveAlarmsToLocalStorage(alarms);
  renderAlarmDOM();
  disableToggle(alarm);

  // Update the DOM 
  countdownAlarm = setInterval(conditionalCounterDOM, UPDATE_DOM_TIMER);
}


// Disable toggle switch button when alarm is overdue
function disableToggle(alarmToDisplay) {
  const alarmDiv = document.querySelector(
    `#toggle-alarm-button__alarm-${alarmToDisplay.id}`
  );
  // Change the design of the toggle button to disabled icon
  alarmDiv.style.pointerEvents = "none";
  alarmDiv.style.cursor = "not-allowed";
  const alarmToggleEl = document.querySelector(
    `#toggle__fill-alarm-${alarmToDisplay.id}`
  );
  alarmToggleEl.style.backgroundColor = "rgba(207, 207, 207, 0.6)";
  alarmToggleEl.classList.add("disabled-alarm");
}

// Update toggle switch button and alarm status after every minute
// issue this is not an efficient method, the UI updates every minutes | TODO: fix this
function dueAlarmUpdate() {
  alarms.forEach((alarm) => {
    const alarmMs = new Date(alarm.date + " " + alarm.time + ":00").getTime();
    const nowMs = new Date().getTime();
    timeRemaining = alarmMs - nowMs;

    if (timeRemaining <= 0 && alarm.status === false) {
      alarm.overdue = true;
      saveAlarmsToLocalStorage(alarms);
      disableToggle(alarm);
    }
  });
}
setInterval(dueAlarmUpdate, 1000);

/** ------------------------------------------------------
            SECTION 5: DISPLAY ALARM INFORMATION
---------------------------------------------------------*/

// ALARM DETAILS
alarmsContainer.addEventListener("dblclick", displayAlarmDetails);
function displayAlarmDetails(event) {
  event.preventDefault();

  let element = event.target.closest(".alarm-set");
  const selectedAlarm = element.classList[1]; // Get alarm classname with id

  mainScreenButtons.style.display = "none"; // remove buttons

  // Display the details
  let display = "";
  alarms.forEach((alarm) => {
    if (`alarm-set__${alarm.id}` === selectedAlarm) {
      display += `
            <div class="alarm_details-content">
                <div class="alarm-details-header">
                    <p class = "alarm-details_header"> </p>
                    <button class="alarm-details-close-btn" id = "details-close-btn" >&times;</button>
                </div>
                <div class="form-group">
                    <div class = "alarm-details__item details-task">${alarm.task
        } </div>
                    <div class = "alarm-details__item details-date"> ${alarm.date
        }</div>
                    <div class = "alarm-details__item details-time"> ${alarm.time
        }</div>
                    <div class = "alarm-details__item details-due-reminder"> REMINDS IN ${alarm.due !== "no-selection" ? alarm.due : "None"
        }</div> 

                    <div class = "alarm-details__item details-alarm-status"> STATUS ${alarm.status ? "ON" : "OFF"
        }</div>

                    <div class = "alarm-details__item details-notes"> ${alarm.comment ? alarm.comment : ""
        }</div>
                </div>
            </div>`;
    }
    document.getElementById("alarm-cards").innerHTML = display;
  });
  const closeAlarmDetails = document.querySelector("#details-close-btn");
  closeAlarmDetails.addEventListener("click", closeAlarmSettings);
}

// SIDE TRAY ALARM DETAILS (Super: sortAlarmsArr )
countdownDisplayTaskBtn.addEventListener("click", displayTodo);
let displayTask = false;
function displayTodo() {
  // Toggle the side panel display
  displayTask = !displayTask;
  const alarms = [...sortAlarmsArr()];
  const alarmToDisplayList = alarms.filter((alarm) => alarm.status === true);
  //  Get the first 2 alarms in sorted list
  const alarmToDisplay = alarmToDisplayList[0];
  const nextAlarmToDisplay = alarmToDisplayList[1];

  // When toggle is ON:
  if (displayTask === true && alarmToDisplayList.length > 0) {
    // (a) Display current alarm
    alarmTodoDisplay.style.visibility = "visible";
    alarmTodoDisplayNext.style.visibility = "visible";
    countdownDisplayTaskBtn.classList.add("visible");
    countdownDisplayTaskBtn.classList.remove("hidden");
    // (b) Display next alarm
    alarmTodoDisplay.textContent = alarmToDisplay.task;
    alarmToDisplayList.length > 1
      ? (alarmTodoDisplayNext.textContent = `Next Alarm: ${nextAlarmToDisplay.date} ${nextAlarmToDisplay.time}`)
      : (alarmTodoDisplayNext.textContent = "");
  } else {
    alarmTodoDisplay.style.visibility = "hidden";
    alarmTodoDisplayNext.style.visibility = "hidden";
    countdownDisplayTaskBtn.classList.remove("visible");
    countdownDisplayTaskBtn.classList.add("hidden");
  }
}

/** ---------------------------------------------------------------------------
                          SECTION 6: STYLE NO TASK COMPONENT
-------------------------------------------------------------------------------*/
const noTaskHiddenInstruction = document.querySelector(
  ".no-task__instruction-hidden" 
);
const noTaskInstruction = document.querySelector(
  ".no-task__instruction-container"
);

// Display instruction to add new alarm 
noTaskHiddenInstruction.addEventListener("mouseover", onHoverHideInstruction);
function onHoverHideInstruction() {
  noTaskHiddenInstruction.style.visibility = "hidden";
  noTaskInstruction.style.visibility = "visible";

  setTimeout(() => {
    noTaskHiddenInstruction.style.visibility = "visible";
    noTaskInstruction.style.visibility = "hidden";
  }, 5000);
}

window.onload = appStart;
appStart();

// =============[    END     ]====================
