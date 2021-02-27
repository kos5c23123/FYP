let db = firebase.database();
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
const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const TimeArray = [00, 30];

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
    var Mins = Time.getMinutes();
    // if (Mins >= 30) {
    //     HKreg = "HK/" + Today + "/" + TimeArray[2] + ":" + TimeArray[1];
    // } else {
    //     HKreg = "HK/" + Today + "/" + TimeArray[2] + ":" + TimeArray[0] + TimeArray[0];
    // }
    HKreg = "HK/2021-02-26/15:30";
    db.ref(HKreg + "/icon").on('value', (snapshot) => {
        iconNumber = snapshot.val() || 'NULL';
        if (iconNumber.length >= 2) {
            currentIcon.style.backgroundImage = "url('assets/css/img/" + iconNumber[0] + ".png')";
            // icon2.style.backgroundImage = "url('assets/css/img/" + iconNumber[1] + ".png')";
        } else {
            currentIcon.style.backgroundImage = "url('assets/css/img/" + iconNumber[0] + ".png')";
            // icon2.style.display = "none";
            // ToIcon.style.display = "none";
        }
    })
    db.ref(HKreg + "/direct/Hong Kong Observatory/temperature").on("value", (snapshot) => {
        currentTemp.innerHTML = (snapshot.val() + "°C")

    })
    db.ref(HKreg + "/rainfall/Yau Tsim Mong").on('value', (snapshot) => {
        currentRain.innerHTML = (snapshot.val().max + "mm")
    })

    db.ref(HKreg + "/humidity").on('value', (snapshot) => {
        currentHum.innerHTML = (snapshot.val() + "%")
    })

    db.ref(HKreg + "/UV").on('value', (snapshot) => {
        currentUV.innerHTML = snapshot.val()
    })

    db.ref("HK/2021-02-26/").on('value', (snapshot) => {
        HighTempValue.innerHTML = (snapshot.val().HighTemp + "°C")
        LowTempValue.innerHTML = (snapshot.val().LowTemp + "°C")
    })

}

StartTime()
GetData()