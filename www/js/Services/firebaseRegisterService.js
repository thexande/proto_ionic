angular.module('proto.firebaseRegisterService', [])
  .service('firebaseRegisterService',  

  function($firebaseObject, $firebaseArray, CONFIG) {

    var registerUser = function(userSignup) {
      firebase.auth().createUserWithEmailAndPassword(userSignup.username, userSignup.password).then(function() {
        var user = firebase.auth().currentUser;
          user.sendEmailVerification().then(function(result) { console.log(result) },function(error){ console.log(error)}); 

          // user.updateProfile({
          //   displayName: userSignup.displayname
          // }).then(function() {


          //  console.log("update completes")
          //  return

          // }, function(error) {
          //   // An error happened.
          //   console.log(error);
          // });
          
          


        }, function(error) {
          // An error happened.
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(errorCode);

          if (errorCode === 'auth/weak-password') {
             alert('Password is weak, choose a strong password.');
             return false;
          }else if (errorCode === 'auth/email-already-in-use') {
             alert('Email you entered is already in use.');
             return false;
          }
      })               
    }
    var createUserRecord = function(user) {
      var ref = firebase.database().ref('users')
      var list = $firebaseArray(ref)
      list.$add(user)
    }
    return {
      registerUser: registerUser,
      createUserRecord: createUserRecord
    }
  })