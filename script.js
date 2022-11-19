'use strict';

const formContainer = document.querySelector('.container');
formContainer.addEventListener('submit', makeReservation);
formContainer.addEventListener('change', e => {
  console.log(e.target.id);
  validateForm(e.target);
});
// const allInputs = Array.from(document.querySelectorAll('input'));

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
  const totalDiv = document.querySelector('#total');
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

function validateForm(e) {
  const fail = function (errorMsg) {
    e.parentElement.classList.add('input-invalid');
    e.setCustomValidity(errorMsg);
    e.reportValidity();
  };

  const pass = function () {
    e.parentElement.classList.remove('input-invalid');
    e.setCustomValidity('');
  };

  const checkExp = function (exp) {
    // check for correct format
    const expRegEx = /^((0[1-9])|(1[0-2]))\/\d\d$/;
    if (!exp.match(expRegEx)) return false;
    // if the format is correct, check the date
    const today = new Date();
    const todayMonth = today.getMonth();
    const todayYear = today.getFullYear() % 100;
    const expMonth = +exp.slice(0, 2);
    const expYear = +exp.slice(3);
    console.log(expMonth, expYear);
    // Ensure date is in the future
    if (
      todayYear > expYear ||
      (todayMonth >= expMonth && todayYear === expYear)
    )
      return false;

    return true;
  };

  // List of validation tests for each form item keyed by id
  const validators = {
    'car-year': function (e) {
      if (+e.value < 1900) fail('Please enter a year after 1899');
      else pass();
    },
    days: function (e) {
      if (+e.value < 1 || +e.value > 30)
        fail('Spaces are available for 1-30 days');
      else pass();
    },
    'credit-card': function (e) {
      if (!validateCardNumber(e.value))
        fail('Enter a valid credit card number.');
      else pass();
    },
    cvv: function (e) {
      if (!e.value.match(/^\d{3}$/)) fail('Please enter a three digit CVV');
      else pass();
    },
    expiration: function (e) {
      if (!checkExp(e.value))
        fail('Date must be in the future. Format must be MM/YY');
      else pass();
    },
  };
  validators[e.id]?.(e);
  console.log(e.checkValidity()); // maybe check for blank separately

  // Check every <div> for required tag (or any other validation, which will lead to a misleading error message)
  // if (!allInputs.every(e => e.checkValidity())) {
  //   alert('Please fill out all the fields');
  //   return false;
  // }

  return true;
}
