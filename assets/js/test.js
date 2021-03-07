let db = firebase.database();
const container = document.getElementById("container");
const nowDate = document.getElementById("Date");
const currentTime = document.getElementById("currentTime");
const Weeks = document.getElementById("Weeks");
const currentIcon = document.getElementById("currentIcon");
const currentTemp = document.getElementById("currentTemp");
const currentRain = document.getElementById("currentRain");
const currentHum = document.getElementById("currentHum");
const currentUV = document.getElementById("currentUV");
const HighTempValue = document.getElementById("HighTempValue");
const LowTempValue = document.getElementById("LowTempValue");
const warning = document.getElementById("warning");
const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const checkTime = (i) => (i < 10) ? "0" + i : i;


const StartTime = () => {
    var today = new Date(),
        dd = String(today.getDate()).padStart(2, '0'),
        mm = String(today.getMonth() + 1).padStart(2, '0'), //January is 0!
        yyyy = today.getFullYear(),
        h = checkTime(today.getHours()),
        m = checkTime(today.getMinutes()),
        s = checkTime(today.getSeconds()),
        week = today.getDay();

    Weeks.innerHTML = weekday[week]
    nowDate.innerHTML = mm + '/' + dd + '/' + yyyy;
    currentTime.innerHTML = h + ":" + m + ":" + s;
    t = setTimeout(function() {
        StartTime();
        checkTimeIsMatch();
        Shining()
    }, 1000);
}

const checkTimeIsMatch = () => {
    var today = new Date(),
        m = checkTime(today.getMinutes()),
        s = checkTime(today.getSeconds());
    if ((m == 15 || m == 45) && s == 00) {
        var T = setTimeout(function() {
            GetData();
        }, 500)
    }
}

function GetData() {
    var Time = new Date();
    let Today = Time.getFullYear() + '-' + ('0' + (Time.getMonth() + 1)).slice(-2) + '-' + ('0' + Time.getDate()).slice(-2);
    let HKreg = "HK/" + Today;
    var Hour = checkTime(Time.getHours());
    var Mins = checkTime(Time.getMinutes());
    if (Mins >= 30) {
        HKreg = `HK/${Today}/${Hour}:30`;
    } else {
        HKreg = `HK/${Today}/${Hour}:00`;
    }
    console.log(HKreg)
    db.ref(`${HKreg}/Warning`).once('value', (snapshot) => {
        if (snapshot.exists()) {
            showWarning()
        } else {
            NonshowWarning()
        }
    })
    db.ref(HKreg + "/icon").once('value', (snapshot) => {
        iconNumber = snapshot.val() || 'NULL';
        if (iconNumber.length >= 2) {
            currentIcon.style.backgroundImage = `url(assets/css/img/${iconNumber[0]}.png)`;
            // icon2.style.backgroundImage = "url('assets/css/img/" + iconNumber[1] + ".png')";
        } else {
            currentIcon.style.backgroundImage = `url(assets/css/img/${iconNumber[0]}.png)`;
            // icon2.style.display = "none";
            // ToIcon.style.display = "none";
        }
    })
    db.ref(HKreg + "/direct/Hong Kong Observatory/temperature").once("value", (snapshot) => {
        currentTemp.innerHTML = (snapshot.val() + "°C")

    })
    db.ref(HKreg + "/rainfall/Yau Tsim Mong").once('value', (snapshot) => {
        currentRain.innerHTML = (snapshot.val().max + "mm")
    })

    db.ref(HKreg + "/humidity").once('value', (snapshot) => {
        currentHum.innerHTML = (snapshot.val() + "%")
    })

    db.ref(HKreg + "/UV").once('value', (snapshot) => {
        currentUV.innerHTML = snapshot.val()
    })

    db.ref("HK/2021-03-01/").once('value', (snapshot) => {
        HighTempValue.innerHTML = (snapshot.val().HighTemp + "°C")
        LowTempValue.innerHTML = (snapshot.val().LowTemp + "°C")
    })

}

const NonshowWarning = () => {
    container.style.gridTemplateAreas = '"Time Time Time Time" "ICON ICON TEMP TEMP" "Rain Hum UV HIGHLOW"';
    currentTemp.style.fontSize = "6rem"
}

const showWarning = () => {
    container.style.gridTemplateAreas = '"Time Time Time Time" "ICON TEMP WRANING WRANING" "Rain Hum UV HIGHLOW"';
    if (warning.hasChildNodes()) {
        while (warning.lastElementChild) {
            warning.removeChild(warning.lastElementChild);
        }
    }
    db.ref("HK/2021-03-01/10:00/Warning").once('value', (snapshot) => {
        const Warnarr = Object.entries(snapshot.val())
        for (var i = 0; i < Warnarr.length; i++) {
            var div = document.createElement("div")
            div.setAttribute("id", `${Warnarr[i][0]}`);
            div.setAttribute("class", "warningIcon");
            warning.appendChild(div)
            div.style.backgroundImage = `url(assets/css/warning/${Warnarr[i][1].Name}.png)`
        }
    })
}

const Shining = () => {
    const div = warning.querySelectorAll("div");
    div.forEach(el => {
        el.classList.toggle("myGlower")
    })
}
StartTime()
GetData()