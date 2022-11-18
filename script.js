'use strict';

const formContainer = document.querySelector('.container');
const totalDiv = document.querySelector('#total');

formContainer.addEventListener('submit', makeReservation);

function makeReservation(event) {
  event.preventDefault();
  displayTotal(5);
}

function calculateTotal() {
  // let days =
}

function displayTotal(total) {
  const totalEl = document.createElement('p');
  totalEl.innerText = `Your total is $${total}`;
  totalDiv.appendChild(totalEl);
}
