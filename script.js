/* eslint-disable spaced-comment */
'use strict';

//////////////////////////////////////////////////
//  DOM SELECTORS AND EVENT LISTENERS
//////////////////////////////////////////////////
const formContainer = document.querySelector('.container');
const formInputs = Array.from(document.querySelectorAll('input'));
formContainer.addEventListener('submit', makeReservation);
// Validate form fields when input changes
formContainer.addEventListener('change', e => {
  validateForm(e.target);
});

//////////////////////////////////////////////////
//  FUNCTIONS TO CALCULATE AND DISPLAY TOTAL
//////////////////////////////////////////////////
/**
 * It calculates the total price of a rental car based on the number of days and the start date
 * @returns The total price of the rental.
 */
function calculateTotal() {
  // Array for looking up daily prices using 0-based values for days of week starting with Sunday
  const prices = [7, 5, 5, 5, 5, 5, 7];
  // Get values from DOM and create Date object
  let days = +document.querySelector('#days').value;

  const date = getStartDate();
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

/**
 * It takes the value of the start date input, and returns a Date object with the time zone offset
 * to EST
 * @returns A new Date object with the date and timezone specified by the user.
 */
function getStartDate() {
  // Constants for offsetting Date objects
  const EST = 'T05:00:00';
  const EDT = 'T04:00:00';
  const TIME_ZONE = EST;
  const dateInput = document.querySelector('#start-date').value;

  return new Date(`${dateInput}${TIME_ZONE}`);
}

/**
 * If the totalDiv has a child node, then set totalEl to that child node, otherwise create a new
 * paragraph element and set totalEl to that
 * @param total - the total price of the items in the cart
 */
function displayTotal(total) {
  const totalDiv = document.querySelector('#total');
  const totalEl = totalDiv.hasChildNodes()
    ? totalDiv.firstChild
    : document.createElement('p');
  totalEl.innerText = `Your total is $${total}`;
  totalDiv.appendChild(totalEl);
}

//////////////////////////////////////////////////
// CREDIT CARD VALIDATION
//////////////////////////////////////////////////
/**
 * If the number is 16 digits long and passes the Luhn check, then it's valid
 * @param number - The credit card number
 * @returns A boolean value.
 */
function validateCardNumber(number) {
  const regex = /^[0-9]{16}$/;
  if (!regex.test(number)) return false;

  return luhnCheck(number);
}

/**
 * Runs the Luhn algorithm to validate a credit card number.
 * @param val - The credit card number to validate.
 * @returns boolean
 */
function luhnCheck(val) {
  var sum = 0;
  for (var i = 0; i < val.length; i++) {
    var intVal = parseInt(val.substr(i, 1));
    if (i % 2 === 0) {
      intVal *= 2;
      if (intVal > 9) {
        intVal = 1 + (intVal % 10);
      }
    }
    sum += intVal;
  }
  return sum % 10 === 0;
}

//////////////////////////////////////////////////
// FROM VALIDATION / EVENT HANDLERS
//////////////////////////////////////////////////
/**
 * "If all the form inputs pass validation, display the total."
 *
 * The first line of the function prevents the default behavior of the form submission
 * @param event - The event object that is passed to the event handler.
 * @returns false if any of the form inputs fail validation.
 */
function makeReservation(event) {
  event.preventDefault();
  // Run validation on every input node and return early if any tests fail.
  if (!formInputs.every(input => validateForm(input))) return false;
  displayTotal(calculateTotal());
  return true;
}

/**
 * If the input is valid, return true, otherwise return false
 * @param e - The form element that is being validated.
 * @returns boolean.
 */
function validateForm(e) {
  const today = new Date();
  const todayMonth = today.getMonth();
  const todayFullYear = today.getFullYear();
  const todayShortYear = todayFullYear % 100;

  const fail = function (errorMsg) {
    e.parentElement.classList.add('input-invalid');
    e.setCustomValidity(errorMsg);
    e.reportValidity();
    return false;
  };

  const pass = function () {
    e.parentElement.classList.remove('input-invalid');
    e.setCustomValidity('');
    return true;
  };

  const checkExpDate = function (exp) {
    const expMonth = +exp.slice(0, 2);
    const expYear = +exp.slice(3);
    // Ensure date is in the future
    if (
      todayShortYear > expYear ||
      (todayMonth >= expMonth && todayShortYear === expYear)
    )
      return false;

    return true;
  };

  // List of validation tests for each form item keyed by id
  const validators = {
    name(e) {
      if (e.value === '') return fail('Please enter your name');
      return pass();
    },
    'car-year': function (e) {
      if (e.value === '') return fail('Please enter the year.');
      if (+e.value < 1900) return fail('Please enter a year after 1899');
      if (+e.value > todayFullYear + 1)
        return fail('Car cannot be from the future');
      return pass();
    },
    'car-make': function (e) {
      if (e.value === '') return fail('Please enter the make');
      return pass();
    },
    'car-model': function (e) {
      if (e.value === '') return fail('Please enter the model');
      return pass();
    },
    'start-date': function (e) {
      if (e.value === '') return fail('Please enter the start date');
      if (getStartDate() < today) return fail('Date must be in the future');
      return pass();
    },
    days(e) {
      if (e.value === '')
        return fail('Please enter the length of your reservation');
      if (+e.value < 1 || +e.value > 30)
        fail('Spaces are available for 1-30 days');
      return pass();
    },
    'credit-card': function (e) {
      if (e.value === '') return fail('Please enter your credit card number');
      if (!validateCardNumber(e.value))
        return fail('Invalid credit card number.');
      return pass();
    },
    cvv(e) {
      if (e.value === '') return fail('Please enter your CVV');
      if (!e.value.match(/^\d{3}$/)) return fail('CVV must be three digits');
      return pass();
    },
    expiration(e) {
      const expFormat = /^((0[1-9])|(1[0-2]))\/\d\d$/;
      if (e.value === '') return fail('Please enter the expiration date');
      if (!e.value.match(expFormat)) return fail('Format must be MM/YY');
      if (!checkExpDate(e.value)) return fail('Date must be in the future.');
      return pass();
    },
  };
  // Don't think this is needed anymore. Not relying on html required tags
  // if (!e.checkValidity()) return fail('This field is required');
  // else pass(); // maybe check for blank separately

  // If any of the tests failed, return false
  if (!validators[e.id](e)) return false;

  return true;
}
