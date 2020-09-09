let db = firebase.database();
let NowTemp = document.getElementById("NowTemp");
let icon = document.getElementById("icon");
let UV = document.getElementById("UV");
let humidity = document.getElementById("humidity");
let rainfall = document.getElementById("rainfall");
let iconNumber;
let TimeArray = [00,30];

function GetData() {
    var Time = new Date();
    let Today = Time.getFullYear() + '-' + ('0' + (Time.getMonth()+1)).slice(-2) + '-' + ('0' + Time.getDate()).slice(-2);
    let HKreg = "HK/" + Today;
    var Mins = Time.getMinutes();
    if (Mins >= 30){
        HKreg = "HK/" + Today + "/" + TimeArray[2] + ":" + TimeArray[1];
    }else {
        HKreg = "HK/" + Today + "/" + TimeArray[2] + ":" + TimeArray[0] + TimeArray[0];
    }
    db.ref(HKreg +  "/direct/Hong Kong Observatory").on('value', function(snapshot){
        NowTemp.innerHTML = snapshot.val().temperature || 'NULL';
    })
    db.ref(HKreg + "/icon").on('value', function(snapshot){
        iconNumber = snapshot.val() || 'NULL';
        icon.style.backgroundImage = "url('assets/css/img/" +iconNumber + ".png')";
    })
    db.ref(HKreg).on('value', function(snapshot){
        UV.innerHTML = snapshot.val().UV;
    })
    db.ref(HKreg).on('value', function(snapshot){
        humidity.innerHTML = snapshot.val().humidity;
    })
    db.ref(HKreg + "/rainfall/Sha Tin").on('value', function(snapshot){
        rainfall.innerHTML = snapshot.val().max;
    })
}

function checkTime(i) {
    return (i < 10) ? "0" + i : i;
}

function startTime() {
    var today = new Date(),
        dd = String(today.getDate()).padStart(2, '0'),
        mm = String(today.getMonth() + 1).padStart(2, '0'), //January is 0!
        yyyy = today.getFullYear(),
        h = checkTime(today.getHours()),
        m = checkTime(today.getMinutes()),
        s = checkTime(today.getSeconds());
    TimeArray[2] = h;
    document.getElementById('nowTime').innerHTML = h + ":" + m + ":" + s;
    document.getElementById('Date').innerHTML = mm + '/' + dd + '/' + yyyy;
    t = setTimeout(function () {
        startTime();
        checkTimeIsMatch();
    }, 1000);
}

function checkTimeIsMatch() {
    var today = new Date(),
        m = checkTime(today.getMinutes()),
        s = checkTime(today.getSeconds());
    if ((m == 15 || m == 45) && s == 00) {
        var T = setTimeout(function () {
            GetData();
        }, 500)
    }
}

startTime();
GetData();