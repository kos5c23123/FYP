const nowDate = document.getElementById("Date");
const currentTime = document.getElementById("currentTime");
const Weeks = document.getElementById("Weeks");
const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const checkTime = (i) => (i < 10 ? "0" + i : i);

const StartTime = () => {
  var today = new Date(),
    dd = String(today.getDate()).padStart(2, "0"),
    mm = String(today.getMonth() + 1).padStart(2, "0"), //January is 0!
    yyyy = today.getFullYear(),
    h = checkTime(today.getHours()),
    m = checkTime(today.getMinutes()),
    s = checkTime(today.getSeconds()),
    week = today.getDay();

  Weeks.innerHTML = weekday[week];
  nowDate.innerHTML = mm + "/" + dd + "/" + yyyy;
  currentTime.innerHTML = h + ":" + m + ":" + s;
  t = setTimeout(function () {
    StartTime();
    checkTimeIsMatch();
  }, 1000);
};

const checkTimeIsMatch = () => {
  var today = new Date(),
    m = checkTime(today.getMinutes()),
    s = checkTime(today.getSeconds());
  if ((m == 15 || m == 45) && s == 00) {
    var T = setTimeout(function () {
      GetData();
    }, 500);
  }
};

StartTime();