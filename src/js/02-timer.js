import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Notiflix from 'notiflix';

const clockface = {
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
}
const startBtn = document.querySelector('[data-start]');

const options = {
enableTime: true,
time_24hr: true,
defaultDate: new Date(),
  minuteIncrement: 1,

onClose(selectedDates) {
    console.log(selectedDates[0]);
    const endTime = selectedDates[0].getTime();
    const startTime = options.defaultDate.getTime();

    if (startTime > endTime) {
        Notiflix.Notify.failure('Please choose a date in the future');
        return; 
      }
    startTimer(endTime);
},
};

flatpickr("#datetime-picker", options);


class Timer {
constructor({ onTick, stopTime }) {
  this.intervalId = null;
  this.isActive = false;
    this.onTick = onTick;
    this.stopTime = stopTime;

}


start() {
  if (this.isActive) {
    return;
  }

  const startTime = Date.now();
  this.isActive = true;

  this.intervalId = setInterval(() => {
    const currentTime = Date.now();
      const deltaTime = this.stopTime - currentTime;
      if (deltaTime <= 0) {
          this.stop();
          return;
      }
    const time = this.convertMs(deltaTime);

    this.onTick(time);
  }, 1000);
}

stop() {
  clearInterval(this.intervalId);
  this.isActive = false;
  const time = this.convertMs(0);
  this.onTick(time);
}

  convertMs(ms) {
      // Number of milliseconds per unit of time
      const second = 1000;
      const minute = second * 60;
      const hour = minute * 60;
      const day = hour * 24;

      // Remaining days
      const days = this.pad(Math.floor(ms / day));
      // Remaining hours
      const hours = this.pad(Math.floor((ms % day) / hour));
      // Remaining minutes
      const minutes = this.pad(Math.floor(((ms % day) % hour) / minute));
      // Remaining seconds
      const seconds = this.pad(Math.floor((((ms % day) % hour) % minute) / second));

      return { days, hours, minutes, seconds };
  }

  pad(value) {
      if (value > 99) {
          return String(value);
      }
      return String(value).padStart(2, '0');
  }
}
const startTimer = endTime => {
  const timer = new Timer({
      onTick: updateClockface,
      stopTime: endTime, 
  });

  startBtn.addEventListener('click', timer.start.bind(timer));
}
const updateClockface = ({ days, hours, minutes, seconds }) => {
  clockface.days.textContent = `${days}`;
  clockface.hours.textContent = `${hours}`;
  clockface.minutes.textContent = `${minutes}`;
  clockface.seconds.textContent = `${seconds}`;
}