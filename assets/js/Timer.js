
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
    document.getElementById('nowTime').innerHTML = h + ":" + m + ":" + s;
    document.getElementById('Date').innerHTML = mm + '/' + dd + '/' + yyyy;
    t = setTimeout(function () {
        startTime();
        checkTimeIsMatch();
    }, 500);
}

startTime();

function checkTimeIsMatch() {
    const Min = 30;
    const Sec = 00;
    var today = new Date(),
        m = checkTime(today.getMinutes()),
        s = checkTime(today.getSeconds());
    if ((m == Min || m == Sec) && s == Sec) {
        var T = setTimeout(function () {
            GetData();
        }, 500)
    }
}

// navigator.geolocation.getCurrentPosition(function (position) {
//     console.log('Pos: ', position);
//   }, function (error) {
//     console.log('Err', error);
//     alert(error.message);
//   });