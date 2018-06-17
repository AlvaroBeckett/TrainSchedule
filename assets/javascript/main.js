
// Initialize Firebase
var config = {
  apiKey: "AIzaSyD2jVCk0nuacSxThIQWZrGC79U0z2rH5zg",
    authDomain: "train-schedule-d7402.firebaseapp.com",
    databaseURL: "https://train-schedule-d7402.firebaseio.com",
    projectId: "train-schedule-d7402",
    storageBucket: "",
    messagingSenderId: "914935946411"
};
firebase.initializeApp(config);
var database = firebase.database();
var trainname;
var destination;
var frequency;
var arrival;
var away;

var scheduler = {

  addTrain: function(){
    $("#addTrain").on("click", function(){
      event.preventDefault();
    
      trainname = $("#inputName").val().trim();
      destination = $("#inputDestination").val().trim();
      frequency = $("#inputFrequency").val().trim();
      arrival = $("#inputTime").val().trim();
      console.log(trainname);
    
      database.ref().push({
        name: trainname,
        destination: destination,
        frequency: frequency,
        arrival: arrival,
        dateAdded: firebase.database.ServerValue.TIMESTAMP,
      })
    })
  },
  addInfo: function(){
    database.ref().on("child_added", function(childSnapshot) {
      var childTime;
      var parseTime;
      var childFrequency;
      var parseFrequency;
      var now;
      var firstTimeConverted;
      var diffTime;;
      var timeRemainder;
      var minutesAway;

      function countTime(){
      childTime = childSnapshot.val().arrival; 
      parseTime = moment(childTime, "HH:mm");
      childFrequency = childSnapshot.val().frequency;
      parseFrequency = moment(childFrequency, "m");
    
      now = moment();
      firstTimeConverted = moment(childTime, "HH:mm").subtract(1, "years"); 
      diffTime = moment().diff(moment(firstTimeConverted), "minutes"); 
        
      timeRemainder = diffTime % childFrequency;
      minutesAway = childFrequency - timeRemainder; 

      childTime = moment().add(minutesAway, "minutes").format("LT");
      console.log("ARRIVAL TIME: " + moment(childTime, "LT").format("LT"));
      }
      countTime();
      
      $("#trainInfo").append(`
          <tr>
          <td>${childSnapshot.val().name}</td>
          <td>${childSnapshot.val().destination}</td>
          <td>${childSnapshot.val().frequency}</td>
          <td id="${childSnapshot.val().dateAdded}arrival">${childTime}</td>
          <td id="${childSnapshot.val().dateAdded}">${minutesAway}</td>
          </tr>
      
      `)
      function updateTime() { 
        countTime();
        var grabId = childSnapshot.val().dateAdded;
        document.getElementById(grabId).innerHTML=minutesAway;
        
        var grabArrivalId = childSnapshot.val().dateAdded;
        document.getElementById(grabId + "arrival").innerHTML=childTime;

        setTimeout(updateTime, 60000);
      }
      updateTime();
      
     
      }, function(errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
  },
}

scheduler.addTrain();
scheduler.addInfo();
