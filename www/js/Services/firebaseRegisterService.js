angular.module('proto.firebaseRegisterService', [])
  .service('firebaseRegisterService',  

  function($firebaseArray, CONFIG) {
    return "woot"
    // var registerUser = function(user) {


    //     firebase.auth().createUserWithEmailAndPassword(userSignup.cusername, userSignup.cpassword).then(function() {
    //       // Sign-In successful.
    //       //console.log("Signup successful");

    //       var user = firebase.auth().currentUser;

    //       user.sendEmailVerification().then(function(result) { console.log(result) },function(error){ console.log(error)}); 

    //       user.updateProfile({
    //         displayName: userSignup.displayname
    //       }).then(function() {
    //         // Update successful.
    //         $state.go("login");
    //       }, function(error) {
    //         // An error happened.
    //         console.log(error);
    //       });
          
          


    //     }, function(error) {
    //       // An error happened.
    //       var errorCode = error.code;
    //       var errorMessage = error.message;
    //       console.log(errorCode);

    //       if (errorCode === 'auth/weak-password') {
    //          alert('Password is weak, choose a strong password.');
    //          return false;
    //       }else if (errorCode === 'auth/email-already-in-use') {
    //          alert('Email you entered is already in use.');
    //          return false;
    //       }
    //   })               
    // }
    // return {
    //   registerUser: registerUser
    // }
  })