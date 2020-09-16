let db = firebase.database();
let NowTemp = document.getElementById("NowTemp");
let icon1 = document.getElementById("icon1");
let icon2 = document.getElementById("icon2");
let ToIcon = document.getElementById("Toicon");
let UV = document.getElementById("UV");
let humidity = document.getElementById("humidity");
let rainfall = document.getElementById("rainfall");
var slides = document.getElementsByClassName("Slides").length;
let text = document.getElementsByClassName("SlideText");
let textTime = document.getElementsByClassName("SlideTextTime");
let NowLocation = document.getElementById("NowLocation");
const Http = new XMLHttpRequest();
let FThours = [];
let NextHours = [];
let currentIndex = 0;
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
    db.ref(HKreg + "/icon").on('value', function(snapshot){
        iconNumber = snapshot.val() || 'NULL';
        if (iconNumber.length >= 2){
            icon1.style.backgroundImage = "url('assets/css/img/" +iconNumber[0] + ".png')";
            icon2.style.backgroundImage = "url('assets/css/img/" +iconNumber[1] + ".png')";
        }else{
            icon1.style.backgroundImage = "url('assets/css/img/" +iconNumber + ".png')";
            icon2.style.display = "none";
            ToIcon.style.display = "none";
        }
    })
    db.ref(HKreg).on('value', function(snapshot){
        UV.innerHTML = snapshot.val().UV;
    })
    db.ref(HKreg).on('value', function(snapshot){
        humidity.innerHTML = snapshot.val().humidity || 'NULL';
    })
    db.ref("HK/" + Today).on('value', function(snapshot){
        HighTempValue.innerHTML = snapshot.val().HighTemp || 'NULL';
        LowTempValue.innerHTML = snapshot.val().LowTemp || 'NULL';
    })
    db.ref("HK/Next48Hours").on('value', function(snapshot){
        for(var i = 0;i <(snapshot.val()).length;i++){
            FThours[i] = (snapshot.val())[i].temp;
            NextHours[i] = (snapshot.val())[i].time;
        }
        Add(0);
    })

}

function GetDataOfDist(){
    var Time = new Date();
    Today = Time.getFullYear() + '-' + ('0' + (Time.getMonth()+1)).slice(-2) + '-' + ('0' + Time.getDate()).slice(-2);
    HKreg = "HK/" + Today;
    var Mins = Time.getMinutes();
    if (Mins >= 30){
        HKreg = "HK/" + Today + "/" + TimeArray[2] + ":" + TimeArray[1];
    }else {
        HKreg = "HK/" + Today + "/" + TimeArray[2] + ":" + TimeArray[0] + TimeArray[0];
    }
    Http.onreadystatechange = (e) =>{
        let json = JSON.parse(Http.responseText);
        var Dist = json["results"];
        let Final = "";
        let Zone = Dist[(Dist.length)-4]['address_components'][0]['long_name'];
        NowLocation.innerHTML = Zone;
        ArrayZone = Zone.split(" ");
        for (var i = 0; i < ArrayZone.length-1;i++){
            if (i == ArrayZone.length-2){
                Final += ArrayZone[i];
            }else {
                Final += (ArrayZone[i]+ " ");
            }
        }
        db.ref(HKreg +  "/direct/" + Final).on('value', function(snapshot){
            NowTemp.innerHTML = snapshot.val().temperature || 'NULL';
        })
        db.ref(HKreg + "/rainfall/" + Final).on('value', function(snapshot){
            rainfall.innerHTML = snapshot.val().max || 'NULL';
        })
    }
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

function GetLocation() {
    if(!navigator.geolocation) {
        alert('Geolocation is not supported by your browser');
      } else {
        navigator.geolocation.getCurrentPosition(success, error);
      }
}
function success(position){
    const latitude  = position.coords.latitude;
    const longitude = position.coords.longitude;
    let url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude +','+ longitude + '&key=AIzaSyAw9PVACjlLl2HtKdUwxBw0DGhyKwpK9pQ&language=en';
    //Example Link
    // let url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=22.3919353,114.1863081&key=AIzaSyAw9PVACjlLl2HtKdUwxBw0DGhyKwpK9pQ&language=en';
    Http.open("GET",url);
    Http.send();
    GetDataOfDist();
}
function error(err) {
    alert(`ERROR(${err.code}): ${err.message}`)
}

const Add = step => {
    currentIndex += step;
    while(currentIndex < 0) {
      currentIndex += FThours.length;
    }
    const result = Array.from({ length: slides }, (_, i) => FThours[(currentIndex + i) % FThours.length]);
    const TimeResult = Array.from({length : slides}, (_, i) =>NextHours[(currentIndex + i) % NextHours.length]);
    for (var j = 0 ;j <result.length;j++){
    textTime[j].innerHTML = TimeResult[j];
    text[j].innerHTML = result[j];
    }
    return result;
  }


startTime();
GetData();

