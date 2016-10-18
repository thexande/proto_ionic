angular.module('proto.loginController', [])
  .controller('loginController', function(
    $document, 
    $scope, 
    $ionicSideMenuDelegate, 
    $ionicModal, 
    Users, 
    $ionicLoading, 
    $state, 
    $timeout) {
    $scope.users = Users.all();
    console.log("in login controller")

    $scope.toggleMenu = function() {
      $ionicSideMenuDelegate.toggleRight();
    };

    $scope.refresh = function() {
      // Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    }

    $scope.goToHome = function() {
      $ionicLoading.show({
        template: '<ion-spinner></ion-spinner>'
      });

      $timeout(function() {
        $ionicLoading.hide();
        $state.go('tab.home');
        $scope.closeLogin();
        $scope.closeRegister();
      }, 2000);
    }

    $scope.actionSheet = function() {
      var hideSheet = $ionicActionSheet.show({
        // titleText: 'Modify your album',
        buttons: [{
          text: 'Block or report'
        }, {
          text: 'Copy Link'
        }],
        destructiveText: 'Delete',
        cancelText: 'Cancel',
        cancel: function() {
          // add cancel code..
        },
        buttonClicked: function(index) {
          return true;
        }
      });
    }

    // Add connection modal
    $ionicModal.fromTemplateUrl('templates/modal/new_connection.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modalAdd = modal;
    });
    $scope.openAdd = function() {
      $scope.modalAdd.show();
    };
    $scope.closeAdd = function() {
      $scope.modalAdd.hide();
    };

    // New Post modal
    $ionicModal.fromTemplateUrl('templates/modal/new_post.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modalPost = modal;
    });
    $scope.openPost = function() {
      $scope.modalPost.show();
    };
    $scope.closePost = function() {
      $scope.modalPost.hide();
    };

    // Login modal
    $ionicModal.fromTemplateUrl('templates/welcome/login.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modalLogin = modal;
    });
    $scope.openLogin = function() {
      $scope.modalLogin.show();
    };
    $scope.closeLogin = function() {
      $scope.modalLogin.hide();
    };

    // Sign up modal
    $ionicModal.fromTemplateUrl('templates/welcome/register.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modalRegister = modal;
    });
    $scope.openRegister = function() {
      $scope.modalRegister.show();
    };
    $scope.closeRegister = function() {
      $scope.modalRegister.hide();
    };

            // Perform the login action when the user submits the login form
        $scope.doLogin = function(userLogin) {
          $ionicLoading.show({
            template: '<ion-spinner></ion-spinner>'
          });


            console.log(userLogin);

            if ($document[0].getElementById("user_name").value != "" && $document[0].getElementById("user_pass").value != "") {


                firebase.auth().signInWithEmailAndPassword(userLogin.username, userLogin.password).then(function() {
                    // Sign-In successful.
                    //console.log("Login successful");




                    var user = firebase.auth().currentUser;

                    var name, email, photoUrl, uid;

                    if (user.emailVerified) { //check for verification email confirmed by user from the inbox

                        $ionicLoading.hide();
                        $state.go('tab.home');
                        $scope.closeLogin();
                        $scope.closeRegister();

                        name = user.displayName;
                        email = user.email;
                        photoUrl = user.photoURL;
                        uid = user.uid;

                        //console.log(name + "<>" + email + "<>" +  photoUrl + "<>" +  uid);

                        localStorage.setItem("photo", photoUrl);

                    } else {

                        alert("Email not verified, please check your inbox or spam messages")
                        return false;

                    } // end check verification email


                }, function(error) {
                    // An error happened.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    console.log(errorCode);
                    if (errorCode === 'auth/invalid-email') {
                        alert('Enter a valid email.');
                        return false;
                    } else if (errorCode === 'auth/wrong-password') {
                        alert('Incorrect password.');
                        return false;
                    } else if (errorCode === 'auth/argument-error') {
                        alert('Password must be string.');
                        return false;
                    } else if (errorCode === 'auth/user-not-found') {
                        alert('No such user found.');
                        return false;
                    } else if (errorCode === 'auth/too-many-requests') {
                        alert('Too many failed login attempts, please try after sometime.');
                        return false;
                    } else if (errorCode === 'auth/network-request-failed') {
                        alert('Request timed out, please try again.');
                        return false;
                    } else {
                        alert(errorMessage);
                        return false;
                    }
                });



            } else {

                alert('Please enter email and password');
                return false;

            } //end check client username password


        }; // end $scope.doLogin()
  })