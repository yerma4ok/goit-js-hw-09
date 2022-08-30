import flatpickr from "flatpickr";
import 'flatpickr/dist/flatpickr.min.css';
import Notiflix from 'notiflix';

const refs = {
  flatInput: document.querySelector('#datetime-picker'),
  btnStart: document.querySelector('[data-start]'),
  clockDay: document.querySelector('[data-days]'),
  clockHours: document.querySelector('[data-hours]'),
  clockMinutes: document.querySelector('[data-minutes]'),
  clockSeconds: document.querySelector('[data-seconds]'),
};

refs.btnStart.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,

  onClose(selectedDates) {
    const defaultDate = options.defaultDate.getTime();
    const setUserDate = selectedDates[0].getTime();

    if (setUserDate < defaultDate) {
      Notiflix.Notify.failure('Please choose a date in the future');
      return;
    }
    if (setUserDate >= defaultDate) {
      refs.btnStart.disabled = false;
    }
    setTimer(setUserDate);
  },
};

flatpickr(refs.flatInput, options);

function setTimer(userTime) {
  refs.btnStart.addEventListener('click', () => {
    timerId = setInterval(() => {
      const currentTime = Date.now();
      // console.log("current time",currentTime);
      const deltaTime = userTime - currentTime;
      console.log('Осталось до дати', deltaTime);
      const { days, hours, minutes, seconds } = convertMs(deltaTime);

      refs.clockDay.textContent = addLeadingZero(days);
      refs.clockHours.textContent = addLeadingZero(hours);
      refs.clockMinutes.textContent = addLeadingZero(minutes);
      refs.clockSeconds.textContent = addLeadingZero(seconds);
    }, 1000);
  });
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}