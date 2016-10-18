angular.module('proto.registerController', [])
  
.controller('registerController', ['$scope', '$state', '$document', '$firebaseArray', 'CONFIG', function($scope, $state, $document, $firebaseArray, CONFIG) {

$scope.doSignup = function(userSignup) {
    

   
    //console.log(userSignup);

    if($document[0].getElementById("cuser_name").value != "" && $document[0].getElementById("cuser_pass").value != ""){


        firebase.auth().createUserWithEmailAndPassword(userSignup.cusername, userSignup.cpassword).then(function() {
          // Sign-In successful.
          //console.log("Signup successful");

          var user = firebase.auth().currentUser;

          user.sendEmailVerification().then(function(result) { console.log(result) },function(error){ console.log(error)}); 

          user.updateProfile({
            displayName: userSignup.displayname
          }).then(function() {
            // Update successful.
            $state.go("login");
          }, function(error) {
            // An error happened.
            console.log(error);
          });
          
          


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



          
        });



    }else{

        alert('Please enter email and password');
        return false;

    }//end check client username password

    
  };// end $scope.doSignup()
  
  
  
}])