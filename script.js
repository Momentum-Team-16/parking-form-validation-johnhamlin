'use strict';

const formContainer = document.querySelector('.container');
const totalDiv = document.querySelector('#total');

formContainer.addEventListener('submit', makeReservation);

function makeReservation(event) {
  event.preventDefault();

  displayTotal(calculateTotal());
}

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
