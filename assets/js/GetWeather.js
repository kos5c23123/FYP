const Http = new XMLHttpRequest();
const url = 'https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread';
Http.open("GET", url);
Http.send();

Http.onreadystatechange = (e) => {
    //   console.log(Http.responseText)
    var json = Http.responseText;
    // var obj = JSON.parse(json);
    // arrayList = obj.temperature.data[1];
    console.log(json);

    // function printValues(obj) {
    //     for(var k in obj) {
    //         if(obj[k] instanceof Object) {
    //             printValues(obj[k]);
    //             console.log(obj[k]);
    //         } else {
    //             // console.log(obj[k]);
    //             };
    //     }
    // };

    // printValues(obj);


}

