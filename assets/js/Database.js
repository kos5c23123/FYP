let SendBut = document.getElementById("Send");
let GetBut = document.getElementById("Get");
let DeleteBut = document.getElementById("Delete");
let EnterZone = document.getElementById("enterzone");
let db = firebase.database();
var Zone;
var OpenZone = false;

EnterZone.addEventListener("click", function () {
    let zone = document.getElementById("zone").value;
    if (zone == "") {
        alert("Please input a zone first");
    } else {
        OpenZone = true;
        Zone = zone;
    }
})

SendBut.addEventListener("click", function () {
    let name = document.getElementById("name").value;
    let number = document.getElementById("number").value;
    if (!OpenZone) {
        alert("Please input a zone first");
    }
    else if (name == "" || number == "") {
        alert("Please input someing");
    } else {
        var data = {
            number: number,
            name: name
        }

        db.ref(Zone + "/" + number).set(data);
        // document.getElementById('name').value = snapshot.val().name;
    }
})

GetBut.addEventListener("click", function () {
    let number = document.getElementById("number").value;
    if (!OpenZone) {
        alert("Please input a zone first");
    }
    else if (number == "") {
        alert("Please input something for search");
    } else {
        db.ref(Zone + "/" + number).once('value').then(function (snapshot) {
            document.getElementById('name').value = (snapshot.val() && snapshot.val().name) || 'Null';
        });
    }
})

DeleteBut.addEventListener("click", function () {
    let number = document.getElementById("number").value;
    if (!OpenZone) {
        alert("Please input a zone first");
    }
    else if (number == "") {
        alert("Please input something for delete");
    } else {
        db.ref(Zone + "/" + number).remove();
    }
})
