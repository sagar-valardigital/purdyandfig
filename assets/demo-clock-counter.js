document.addEventListener("DOMContentLoaded", () => {
  function updateClock() {
    const clockEl = document.getElementById("demo-clock");
    if (!clockEl) {
      return;
    }
    const now = new Date();
    clockEl.innerText = now.toLocaleTimeString();
  }
  setInterval(updateClock, 1000);

  const counterEl = document.getElementById("demo-counter");
  const buttonEl = document.getElementById("demo-counter-btn");

  let count = 0;

  if (!counterEl || !buttonEl) {
    return;
  }
  buttonEl.addEventListener("click", () => {
    count++;
    counterEl.innerText = count;
  });
});
