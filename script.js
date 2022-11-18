'use strict';

const formContainer = document.querySelector('.container');
const totalDiv = document.querySelector('#total');

formContainer.addEventListener('submit', makeReservation);

function makeReservation(event) {
  event.preventDefault();
  if (!validateForm()) return false;
  displayTotal(calculateTotal());
}

//////////////////////////////////////////////////
//  Methods for Calculating and displaying Total
//////////////////////////////////////////////////
function calculateTotal() {
  // Constants for offsetting Date object
  const EST = 'T05:00:00';
  const EDT = 'T04:00:00';
  // Array for looking up daily prices using 0-based values for days of the week starting with Sunday
  const prices = [7, 5, 5, 5, 5, 5, 7];
  // Get values from DOM and create Date object
  let days = +document.querySelector('#days').value;
  const dateInput = document.querySelector('#start-date').value;
  let date = new Date(`${dateInput}${EST}`);
  // Initialize total
  let total = 0;
  // Loop to calculate total
  for (days; days > 0; days--) {
    total += prices[date.getDay()];
    // increment date
    date.setDate(date.getDate() + 1);
  }
  return total;
}

function displayTotal(total) {
  const totalEl = document.createElement('p');
  totalEl.innerText = `Your total is $${total}`;
  totalDiv.appendChild(totalEl);
}

//////////////////////////////////////////////////
// Credit Card Methods
//////////////////////////////////////////////////
function validateCardNumber(number) {
  var regex = new RegExp('^[0-9]{16}$');
  if (!regex.test(number)) return false;

  return luhnCheck(number);
}

function luhnCheck(val) {
  var sum = 0;
  for (var i = 0; i < val.length; i++) {
    var intVal = parseInt(val.substr(i, 1));
    if (i % 2 == 0) {
      intVal *= 2;
      if (intVal > 9) {
        intVal = 1 + (intVal % 10);
      }
    }
    sum += intVal;
  }
  return sum % 10 == 0;
}

function validateForm() {
  const allInputs = Array.from(document.querySelectorAll('input'));
  const carYearEl = document.querySelector('#car-year');
  const daysEl = document.querySelector('#days');
  const creditCardEl = document.querySelector('#credit-card');
  const cvvEl = document.querySelector('#cvv');

  if (+carYearEl.value < 1900) {
    carYearEl.setCustomValidity('Please enter a year after 1899');
    carYearEl.reportValidity();
    return false;
  }

  if (+daysEl.value < 1 || +daysEl.value > 30) {
    daysEl.setCustomValidity('Spaces are available for 1-30 days');
    daysEl.reportValidity();
    return false;
  }

  if (!validateCardNumber(creditCardEl.value)) {
    creditCardEl.setCustomValidity('Enter a valid credit card number.');
    creditCardEl.reportValidity();
    return false;
  }

  if (!cvvEl.value.match(/^\d{3}$/)) {
    cvvEl.setCustomValidity('Please enter a three digit CVV');
    cvvEl.reportValidity();
    return false;
  }

  // Check every <div> for required tag (or any other validation, which will lead to a misleading error message)
  if (!allInputs.every(e => e.checkValidity())) {
    alert('Please fill out all the fields');
    return false;
  }

  return true;
}
