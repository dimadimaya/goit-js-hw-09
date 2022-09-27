// Описан в документации
import flatpickr from 'flatpickr';
// Дополнительный импорт стилей
import 'flatpickr/dist/flatpickr.min.css';
import Notiflix from 'notiflix';

const dataTimePicker = document.querySelector('#datetime-picker');
const timeFace = document.querySelector('.timer');
const btnStart = document.querySelector('button[data-start]');
let interval = null;

btnStart.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0] < new Date()) {
      Notiflix.Notify.failure('Please choose a date in the future');
      return clearInterval(interval);
    }
    if (selectedDates[0] > new Date()) {
      btnStart.disabled = false;
    }
    console.log(selectedDates[0]);
    selectedDate = selectedDates[0];
  },
};
flatpickr(dataTimePicker, options);

btnStart.addEventListener('click', startCount);

function startCount() {
  interval = setInterval(timeCounter, 1000);
}

function timeCounter() {
  let deltaTime = selectedDate - new Date();
  const time = convertMs(deltaTime);

  if (deltaTime <= 0) {
    Notiflix.Notify.success('Timer is Over!');
    btnStart.disabled = true;
    clearInterval(interval);
    return;
  }

  updateTimerFace(time);
}

function updateTimerFace({ days, hours, minutes, seconds }) {
  timeFace.textContent = `${days}:${hours}:${minutes}:${seconds}`;
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = addLeadingZero(Math.floor(ms / day));
  // Remaining hours
  const hours = addLeadingZero(Math.floor((ms % day) / hour));
  // Remaining minutes
  const minutes = addLeadingZero(Math.floor(((ms % day) % hour) / minute));
  // Remaining seconds
  const seconds = addLeadingZero(
    Math.floor((((ms % day) % hour) % minute) / second)
  );

  return { days, hours, minutes, seconds };
}
