// event listeners
//========================
document.addEventListener("deviceReady", connectToDatabase);
document.getElementById("insert").addEventListener("click", insert);
document.getElementById("show").addEventListener("click", show);
document.getElementById("rescueme").addEventListener("click", rescueme);
 
// global variables
var db = null;


function connectToDatabase() {
  console.log("device is ready - connecting to database");
 
  // 2. open the database. The code is depends on your platform!
  if (window.cordova.platformId === 'browser') {
    console.log("browser detected...");
    // For browsers, use this syntax:
    //  (nameOfDb, version number, description, db size)
    // By default, set version to 1.0, and size to 5MB
    db = window.openDatabase("superdb", "1.0", "Database for Rescue Heroes app", 5*1024*1024);
  }
  else {
    alert("mobile device detected");
    console.log("mobile device detected!");
 
    var databaseDetails = {"name":"super.db", "location":"default"}
    db = window.sqlitePlugin.openDatabase(databaseDetails);
    console.log("done opening db");
  }
 
  if (!db) {
    alert("databse not opened!");
    return false;
  }
  
  db.transaction(
    function(tx){
      // Execute the SQL via a usually anonymous function
      // tx.executeSql( SQL string, arrary of arguments, success callback function, failure callback function)
      // To keep it simple I've added to functions below called onSuccessExecuteSql() and onFailureExecuteSql()
      // to be used in the callbacks
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS heroes (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, isAvailable INTEGER)",
        [],
        onSuccessExecuteSql,
        onError
      )
    },
    onError,
    onReadyTransaction
  );
 
 function insert() {
  // debug:
  console.log("insert button pressed!");
  alert("insert button pressed!");
 
  // 2. INSERT INTO DATABASE
  db.transaction(
        function(tx){
      //INSERT INTO employees (name, dept) VALUES ("pritesh", "madt");
            tx.executeSql( "INSERT INTO heroes(name, dept) VALUES
			("Spiderman",1), ("Thor",1),("Captain America",0),("Wonder Woman",0)",
			//  [n, d],
            onSuccessExecuteSql,
            onError )
        },
        onError,
        onReadyTransaction
    )
}
}

 
function show() {
  //debug:
  console.log("show button pressed!");
  alert("show button pressed!");
 
  // 1. RUN YOUR SQL QUERY
  db.transaction(
        function(tx){
            tx.executeSql( "SELECT * FROM heroes",
            [],
            displayResults,
            onError )
        },
        onError,
        onReadyTransaction
    )
}

function displayResults( tx, results ){
 
    if(results.rows.length == 0) {
            alert("No records found");
            return false;
        }
 
        var row = "";
        for(var i=0; i<results.rows.length; i++) {
      document.getElementById("resultsSection").innerHTML +=
          "<p> Name: "
        +   results.rows.item(i).name
        + "<br>"
        + "Availablel to hire: "
        +   results.rows.item(i).dept
        + "</p>";
     
        }
 
    }


// common database functions
function onReadyTransaction( ){
  console.log( 'Transaction completed' )
}
function onSuccessExecuteSql( tx, results ){
  console.log( 'Execute SQL completed' )
}
function onError( err ){
  console.log( err )
}
