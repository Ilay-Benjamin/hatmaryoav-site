///// User Authentication /////

const auth = firebase.auth();




///// Firestore /////

const db = firebase.firestore();

let usersRef = db.collection("users").doc("1").get().then(snapshot => {
     //alert(snapshot.get("nickname"));
     console.log(snapshot.get("nickname"));
});