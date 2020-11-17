/* global calcIslamic */

// Global consts for new DOM elements
const newMonthField = document.getElementById('new-select-month')
const newDayField = document.getElementById('new-select-day')
const newStartYearField = document.getElementById('new-select-start-year')
const newEndYearField = document.getElementById('new-select-end-year')
const newWeekdayField = document.getElementById('new-select-weekday')
const newSubmitButton = document.getElementById('new-submit-button')
const newResetButton = document.getElementById('new-reset-button')
const newResultsTextField = document.getElementById('new-results-text')

// Function to search for matching years
function experimentalSearch () {
  // Consts for submitted values
  const submittedMonthIndex = newMonthField.selectedIndex
  const submittedDay = newDayField.value
  const submittedStartYear = Number(newStartYearField.value)
  const submittedEndYear = Number(newEndYearField.value)
  const submittedWeekday = newWeekdayField.value

  // Abort if any field has been left empty
  if (!submittedDay || !submittedStartYear || !submittedEndYear) {
    return
  }

  // Abort if any submitted value is out of bounds
  if (
    submittedDay < 1 ||
    submittedDay > 30 ||
    submittedStartYear < 100 ||
    submittedStartYear > 1400 ||
    submittedEndYear < 100 ||
    submittedEndYear > 1400
  ) {
    newResultsTextField.innerText =
      'At least one submitted value was out of bounds!'
    return
  }

  // Abort if start year is later than end year
  if (submittedStartYear > submittedEndYear) {
    newResultsTextField.innerText =
      'The start year is later than the end year…?'
    return
  }

  // Limit year range to 300 (technically 301 inclusive)
  // Abort if this is bad
  if (submittedEndYear - submittedStartYear > 300) {
    newResultsTextField.innerText = 'The year range is too large!'
    return
  }

  // Empty array to populate with results
  const resultsList = []

  // Iterate over the desired inclusive range of years
  for (let i = submittedStartYear; i <= submittedEndYear; i++) {
    // Set hidden Islamic date values
    // The month and day are reset each time, since they can fluctuate
    document.islamic.year.value = i
    document.islamic.month.selectedIndex = submittedMonthIndex
    document.islamic.day.value = submittedDay

    // Now that the hidden date is set, run the big calc function
    calcIslamic()

    // Make sure the hidden month and day haven't been changed
    // I'm not 100% sure this works
    if (
      document.islamic.month.selectedIndex === submittedMonthIndex &&
      document.islamic.day.value === submittedDay
    ) {
      // If calculated weekday == submitted weekday
      if (document.gregorian.wday.value === submittedWeekday) {
        // Push the year to the results array
        resultsList.push(i)
      }
    }
  }

  // Display results, if any
  if (resultsList.length > 0) {
    newResultsTextField.innerText = resultsList.join(', ')
  } else {
    newResultsTextField.innerText = 'No matches were found.'
  }
}

// Function to clear all fields
function newReset () {
  newMonthField.selectedIndex = 0
  newDayField.value = ''
  newStartYearField.value = ''
  newEndYearField.value = ''
  newWeekdayField.selectedIndex = 0
  newResultsTextField.innerText = '…'
}

// Event listeners for new functions
newSubmitButton.addEventListener('click', experimentalSearch)
newResetButton.addEventListener('click', newReset)
