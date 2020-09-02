let SendBut = document.getElementById("Send");
let GetBut = document.getElementById("Get");
let DeleteBut = document.getElementById("Delete");
let db = firebase.database();

SendBut.addEventListener("click", function () {
    let name = document.getElementById("name").value;
    let number = document.getElementById("number").value;
    if (name == "" || number == "") {
        alert("Please input someing");
    } else {
        var data = {
            number: number,
            name: name
        }

        db.ref("record/" + number).set(data);
        // document.getElementById('name').value = snapshot.val().name;
    }
})

GetBut.addEventListener("click", function () {
    let number = document.getElementById("number").value;
    if (number == "") {
        alert("Please input something for search");
    } else {
        db.ref("record/" + number).once('value').then(function (snapshot) {
            document.getElementById('name').value = (snapshot.val() && snapshot.val().name) || 'Null';
        });
    }
})

DeleteBut.addEventListener("click", function(){
    let number = document.getElementById("number").value;
    if (number == "") {
        alert("Please input something for delete");
    } else {
        db.ref("record/" + number).remove();
    }
})