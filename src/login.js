const email = document.getElementById("login-email").value;
const password = document.getElementById("login-password").value;
firebase.auth().signInWithEmailAndPassword(email, password).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // ...
});