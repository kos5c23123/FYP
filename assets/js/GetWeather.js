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
const HKDist = [
    "Central and Western","Eastern","Southern",
    "Wan Chai","Sham Shui Po","Kowloon City",
    "Kwun Tong","Wong Tai Sin","Yau Tsim Mong",
    "Islands","Kwai Tsing","North",
    "Sai Kung","Sha Tin","Tai Po",
    "Tsuen Wan","Tuen Mun","Yuen Long"];
let FThours = [];
let NextHours = [];
let iconNumber;
let TimeArray = [00,30];
const viewSize = 6;
let currentIndex = 0;
let [btnNext, btnPrev] = [null, null];
let ZoneStatus = 0;

const setup = () => {
    btnNext = document.querySelector('.next'),
    btnPrev = document.querySelector('.prev')
  
    btnNext.addEventListener('click', clickNext);
    btnPrev.addEventListener('click', clickPrevious);

    showOutput(currentIndex);
}

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
        setup();
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
        // console.log(Dist[Dist.length-1]['address_components'][0]['long_name']);
        ArrayZone = Zone.split(" ");
        for (var i = 0; i < ArrayZone.length-1;i++){
            if (i == ArrayZone.length-2){
                Final += ArrayZone[i];
            }else {
                Final += (ArrayZone[i]+ " ");
            }
        }
        for (var i = 0;i < HKDist.length;i++){
            if (Final == HKDist[i] ){
                NowLocation.innerHTML = Zone;
                ZoneStatus = 1;
                break;
            }
        }
        if (ZoneStatus == 0){
            Final = Dist[(Dist.length)-1]['address_components'][0]['long_name'];
            NowLocation.innerHTML = Final;
        }
        db.ref(HKreg +  "/direct/" + Final).on('value', function(snapshot){
            NowTemp.innerHTML = (snapshot.val() && snapshot.val().temperature) || 'NULL';
            if (NowTemp.innerHTML == "NULL"){
                db.ref(HKreg +  "/direct/Hong Kong Observatory").on('value', function(snapshot){
                    NowTemp.innerHTML = (snapshot.val() && snapshot.val().temperature) || 'NULL';
                })
            }
        })
        db.ref(HKreg + "/rainfall/" + Final).on('value', function(snapshot){
            rainfall.innerHTML = (snapshot.val() && snapshot.val().max) || 'NULL';
            if (rainfall.innerHTML == "NULL"){
                db.ref(HKreg +  "/rainfall/Yau Tsim Mong").on('value', function(snapshot){
                    rainfall.innerHTML = (snapshot.val() && snapshot.val().max) || '0';
                })
            }
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

const isIndexOuterEdge = (index, length, size) => index >= length - size;

const viewNumbers = (FThours, { startIndex = 0, size = viewSize } = {}) => {
    if(FThours == null || (size == null && viewSize == null)) return;
    else if(FThours.length < size) return;
    else return FThours.slice(startIndex, size + startIndex);
}

const clickNext = (event) => {
    if(FThours == null, currentIndex == null || viewSize == null
    || isIndexOuterEdge(currentIndex, FThours.length, viewSize)) return;

    const index = currentIndex++ + 1;
    showOutput(index);
}
const clickPrevious = (event) => {
    if(currentIndex == null || currentIndex <= 0) return;

    const index = currentIndex-- - 1;
    showOutput(index);
}
const showOutput = (index) => {
    if(FThours == null || viewSize == null | viewSize == index || index < 0) return;

    for (var i = 0;i <(viewNumbers(FThours, {startIndex: index})).length;i++){
        if (viewNumbers(NextHours, {startIndex: index})[i] >=12){
            textTime[i].innerHTML = viewNumbers(NextHours, {startIndex: index})[i] + "PM";
        }else{
            textTime[i].innerHTML = viewNumbers(NextHours, {startIndex: index})[i] + "AM";
        }
        text[i].innerHTML = viewNumbers(FThours, {startIndex: index})[i];
    }

    btnPrev.disabled = index <= 0;
    btnNext.disabled = isIndexOuterEdge(index, FThours.length, viewSize);
}

// startTime();
// GetData();

const openModalBotton = document.querySelectorAll('[data-modal-target]')
const closeModalBotton = document.querySelectorAll('[data-close-button]')
const overlay = document.getElementById('overlay')

openModalBotton.forEach(button =>{
  button.addEventListener('click', () => {
    const modal = document.querySelector(button.dataset.modalTarget)
    openModal(modal)
  })
})
overlay.addEventListener('click',() =>{
  const modals = document.querySelectorAll('.modal.active')
  modals.forEach(modal => {
    closeModal(modal)
  })
})
closeModalBotton.forEach(button =>{
  button.addEventListener('click', () => {
    const modal = button.closest('.modal')
    closeModal(modal)
  })
})

function openModal(modal) {
  if (modal == null) return
  modal.classList.add('active')
  overlay.classList.add('active')
}
function closeModal(modal) {
  if (modal == null) return
  modal.classList.remove('active')
  overlay.classList.remove('active')
}

