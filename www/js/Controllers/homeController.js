angular.module('proto.homeController', [])
  .controller('homeController', function($scope, $state, $firebaseObject, $firebaseArray, Users, $ionicModal) {
    $scope.users = Users.all();

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

    // New Place modal
    $ionicModal.fromTemplateUrl('templates/modal/new_place.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modalPlace = modal;
    });
    $scope.openPlace = function() {
      $scope.modalPlace.show();
    };
    $scope.closePlace = function() {
      $scope.modalPlace.hide();
    };
  })