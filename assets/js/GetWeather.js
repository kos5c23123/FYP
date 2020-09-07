let db = firebase.database();
let NowTemp = document.getElementById("NowTemp");
let icon = document.getElementById("icon");
let iconNumber;

var Time = new Date();
let Today = Time.getFullYear() + '-' + ('0' + (Time.getMonth()+1)).slice(-2) + '-' + ('0' + Time.getDate()).slice(-2);
let HKreg = "HK/" + Today;

function GetData() {
    db.ref(HKreg +  "/direct/Hong Kong Observatory").on('value', function(snapshot){
        NowTemp.innerHTML = snapshot.val().temperature || 'NULL';
    })
    db.ref(HKreg + "/icon").on('value', function(snapshot){
        iconNumber = snapshot.val();
    })
    // if (iconNumber == ){}
}
GetData();