import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import Notiflix from 'notiflix';

const refs = {
  input: document.querySelector('#datetime-picker'),
  start: document.querySelector('button[data-start]'),
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  mins: document.querySelector('[data-minutes]'),
  secs: document.querySelector('[data-seconds]'),
};

let intervalId = null;

refs.start.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    
    if (selectedDates[0] <= new Date()) {
      refs.start.disabled = true;
      Notiflix.Notify.failure('Please choose a date in the future! Do not look back..');
      return;
    }
    if (selectedDates[0] > new Date()) {
      refs.start.disabled = false;
    }

    refs.start.addEventListener('click', () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
      intervalId = setInterval(() => {
        const differenceInTime = selectedDates[0] - new Date();

        if (differenceInTime < 1000) {
          clearInterval(intervalId);
        }
        const result = convertMs(differenceInTime);
        viewOfTimer(result);
      }, 1000);
    });
  },
};

flatpickr('#datetime-picker', options);

function addLeadingZero (vaule) {
  return vaule.toString().padStart(2, '0')
};
function viewOfTimer({ days, hours, minutes, seconds }) {
  refs.days.textContent = `${addLeadingZero(days)}`;
  refs.hours.textContent = `${addLeadingZero(hours)}`;
  refs.mins.textContent = `${addLeadingZero(minutes)}`;
  refs.secs.textContent = `${addLeadingZero(seconds)}`;
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = (Math.floor(ms / day));
  const hours = (Math.floor((ms % day) / hour));
  const minutes = (Math.floor(((ms % day) % hour) / minute));
  const seconds = (Math.floor((((ms % day) % hour) % minute) / second));

  return { days, hours, minutes, seconds };
};

console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
console.log(convertMs(24140000)); // {days: 0, hours: 6 minutes: 42, seconds: 20}
