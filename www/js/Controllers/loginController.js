angular.module('proto.loginController', [])
  .controller('loginController', function(
    $document,
    $scope,
    $ionicSideMenuDelegate,
    $ionicModal,
    Users,
    $ionicLoading,
    $state,
    $timeout,
    $q,
    UserService,
    firebaseRegisterService) {
    $scope.users = Users.all();
    console.log("in login controller")

    $scope.skip = function() {
      $state.go('tab.home')
    }
    
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

    // Sign up facebook modal
    $ionicModal.fromTemplateUrl('templates/welcome/RegisterFB.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modalRegisterFB = modal;
    });
    $scope.openRegisterFB = function() {

      $scope.modalRegisterFB.show();
    };
    $scope.closeRegisterFB = function() {
      $scope.modalRegisterFB.hide();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function(userLogin) {
      $ionicLoading.show({
        template: '<ion-spinner></ion-spinner>'
      });





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
            $ionicLoading.hide()
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


    // facebook
    // This is the success callback from the login method
    var fbLoginSuccess = function(response) {
      if (!response.authResponse) {
        fbLoginError("Cannot find the authResponse");
        return;
      }

      var authResponse = response.authResponse;

      getFacebookProfileInfo(authResponse)
        .then(function(profileInfo) {
          // For the purpose of this example I will store user data on local storage
          UserService.setUser({
            authResponse: authResponse,
            userID: profileInfo.id,
            name: profileInfo.name,
            email: profileInfo.email,
            picture: "http://graph.facebook.com/" + authResponse.userID + "/picture?type=large"
          });
          $ionicLoading.hide();
          
          //$state.go('app.home');
        }, function(fail) {
          // Fail get profile info
          console.log('profile info fail', fail);
        });
    };

    // This is the fail callback from the login method
    var fbLoginError = function(error) {
      console.log('fbLoginError', error);
      $ionicLoading.hide();
    };

    // This method is to get the user profile info from the facebook api
    var getFacebookProfileInfo = function(authResponse) {
      var info = $q.defer();

      facebookConnectPlugin.api('/me?fields=email,name&access_token=' + authResponse.accessToken, null,
        function(response) {
          console.log(response);
          info.resolve(response);
        },
        function(response) {
          console.log(response);
          info.reject(response);
        }
      );
      return info.promise;
    };

    //This method is executed when the user press the "Login with facebook" button
    $scope.facebookSignIn = function() {
      facebookConnectPlugin.getLoginStatus(function(success) {
        if (success.status === 'connected') {
          // The user is logged in and has authenticated your app, and response.authResponse supplies
          // the user's ID, a valid access token, a signed request, and the time the access token
          // and signed request each expire
          console.log('getLoginStatus', success.status);

          // Check if we have our user saved
          var user = UserService.getUser('facebook');
          console.log("user here", user)
          $scope.facebookUser = UserService.getUser('facebook');
                        
          $scope.openRegisterFB()



          if (!user.userID) {
            getFacebookProfileInfo(success.authResponse)
              .then(function(profileInfo) {
                // For the purpose of this example I will store user data on local storage
                $scope.newfacebookUser = {
                  authResponse: success.authResponse,
                  userID: profileInfo.id,
                  name: profileInfo.name,
                  email: profileInfo.email,
                  picture: "http://graph.facebook.com/" + success.authResponse.userID + "/picture?type=large"
                }

                UserService.setUser($scope.newfacebookUser);




                //$state.go('app.home');
              }, function(fail) {
                // Fail get profile info
                console.log('profile info fail', fail);
              });
          } else {

            console.log("getFacebookProfileInfo")
            //$state.go('tab.home');
          }
        } else {
          // If (success.status === 'not_authorized') the user is logged in to Facebook,
          // but has not authenticated your app
          // Else the person is not logged into Facebook,
          // so we're not sure if they are logged into this app or not.

          console.log('getLoginStatus', success.status);

          $ionicLoading.show({
            template: 'Logging in...'
          });

          // Ask the permissions you need. You can learn more about
          // FB permissions here: https://developers.facebook.com/docs/facebook-login/permissions/v2.4
          facebookConnectPlugin.login(['email', 'public_profile','user_birthday'], fbLoginSuccess, fbLoginError);
        }
      });
    };

    //facebook end

    // register fb user with firebase
    $scope.registerFbUserFirebase = function(user) {
      console.log("preparing to create account on firebase")
      $scope.facebookUser.username = $scope.facebookUser.email

      console.log($scope.facebookUser)

      firebaseRegisterService.registerUser($scope.facebookUser)
      $scope.facebookUser.password = null
      firebaseRegisterService.createUserRecord($scope.facebookUser)
      $scope.openLogin()
      // $scope.firebaseEmailLogin()
    }
  })