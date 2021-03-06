// Import stylesheets
import "./style.css";
// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from "firebase/app";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";

import * as firebaseui from "firebaseui";

// Document elements
const startRsvpButton = document.getElementById("startRsvp");
const guestbookContainer = document.getElementById("guestbook-container");

const form = document.getElementById("leave-message");
const input = document.getElementById("message");
const guestbook = document.getElementById("guestbook");
const numberAttending = document.getElementById("number-attending");
const rsvpYes = document.getElementById("rsvp-yes");
const rsvpNo = document.getElementById("rsvp-no");

var rsvpListener = null;
var guestbookListener = null;

async function main() {
  // Add Firebase project configuration object here
  var firebaseConfig = {
    apiKey: "AIzaSyCVrQ8RxFlUgqDRNK8ivXkzECKk0YIBJlo",
    authDomain: "fir-web-codelab-2c8e2.firebaseapp.com",
    projectId: "fir-web-codelab-2c8e2",
    storageBucket: "fir-web-codelab-2c8e2.appspot.com",
    messagingSenderId: "656194907691",
    appId: "1:656194907691:web:3f37cad13e04cb85d8c46e"
  };
  //  Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  // var firebaseConfig = {};

  // firebase.initializeApp(firebaseConfig);

  // FirebaseUI config
  const uiConfig = {
    credentialHelper: firebaseui.auth.CredentialHelper.NONE,
    signInOptions: [
      // Email / Password Provider.
      firebase.auth.EmailAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      signInSuccessWithAuthResult: function(authResult, redirectUrl) {
        // Handle sign-in.
        // Return false to avoid redirect.
        return false;
      }
    }
  };

  // const ui = new firebaseui.auth.AuthUI(firebase.auth());
  // ...
// Initialize the FirebaseUI widget using Firebase
const ui = new firebaseui.auth.AuthUI(firebase.auth());
// ... 
// At the bottom

// Called when the user clicks the RSVP button
startRsvpButton.addEventListener("click",
 () => {
    if (firebase.auth().currentUser) {
      // User is signed in; allows user to sign out
      firebase.auth().signOut();
    } else {
      // No user is signed in; allows user to sign in
      ui.start("#firebaseui-auth-container", uiConfig);
    }
});

// ...
/// ...
// Listen to the current Auth state
firebase.auth().onAuthStateChanged((user) => {
  if (user){
    startRsvpButton.textContent = "LOGOUT";
    // Show guestbook to logged-in users
    guestbookContainer.style.display = "block";
  }
  else{
    startRsvpButton.textContent = "RSVP";
    // Hide guestbook for non-logged-in users
    guestbookContainer.style.display = "none";
  }
 });
// ..
// Listen to the form submission
form.addEventListener("submit", (e) => {
  // Prevent the default form redirect
  e.preventDefault();
  // Write a new message to the database collection "guestbook"
  firebase.firestore().collection("guestbook").add({
    text: input.value,
    timestamp: Date.now(),
    name: firebase.auth().currentUser.displayName,
    userId: firebase.auth().currentUser.uid
  })
  // clear message input field
  input.value = ""; 
  // Return false to avoid redirect
  return false;
 });

 // ...
// Create query for messages
firebase.firestore().collection("guestbook")
.orderBy("timestamp","desc")
.onSnapshot((snaps) => {
 // Reset page
 guestbook.innerHTML = "";
 // Loop through documents in database
 snaps.forEach((doc) => {
   // Create an HTML entry for each document and add it to the chat
   const entry = document.createElement("p");
   entry.textContent = doc.data().name + ": " + doc.data().text;
   guestbook.appendChild(entry);
 });
});

}
main();
