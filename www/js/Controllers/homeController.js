angular.module('proto.homeController', ['ngCordova'])
  .controller('homeController', function(
    $scope, 
    $state, 
    $firebaseObject, 
    $firebaseArray, 
    Users, 
    $ionicModal,
    $cordovaFile, 
    $cordovaSocialSharing,
    $ionicHistory) {

// Get a reference to the storage service, which is used to create references in your storage bucket
var storage = firebase.storage();
// Create a storage reference from our storage service
var storageRef = storage.ref();
// Create a child reference
var imagesRef = storageRef.child('images');

$scope.uploadPlaceImage = function(imageBlob) {
  imagesRef.put(imageBlob).then(function(snapshot) {
    console.log('Uploaded a blob or file!');
  });
}


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


    //begin camera logic
    $scope.$on("$ionicView.enter", function(event) {
          $ionicHistory.clearCache();
          $ionicHistory.clearHistory();
    });

   // LOAD IMAGE FROM THE CAMERA
   $scope.takePhoto = function(type) {
		
		var image = new Image();

		if ( type == "Camera" )
			type = navigator.camera.PictureSourceType.CAMERA ;
		else type = navigator.camera.PictureSourceType.PHOTOLIBRARY ;
	


		navigator.camera.getPicture(function(imageURI) {
			 image.onload = function() {
				 $scope.imageSRC = image ;
 
 
var getFileBlob = function (url, cb) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.responseType = "blob";
        xhr.addEventListener('load', function() {
            cb(xhr.response);
        });
        xhr.send();
};

var blobToFile = function (blob, name) {
        blob.lastModifiedDate = new Date();
        blob.name = name;
        return blob;
};

var getFileObject = function(filePathOrUrl, cb) {
       getFileBlob(filePathOrUrl, function (blob) {
          cb(blobToFile(blob, 'test.jpg'));
       });
};

getFileObject(imageURI, function (fileObject) {
     console.log(fileObject);
     $scope.uploadPlaceImage(fileObject)

}); 




         console.log("image here ", image)
				  var canvas =  document.getElementById('myCanvas');
				  canvas.width = image.width;
				  canvas.height = image.height;

				  var ctx = canvas.getContext("2d");
				  ctx.drawImage(image, 0,0, image.width,image.height); // DRAW THE IMAGE ONTO CANVAS      
				 
				  // READING METADATA FROM IMAGE	
				  EXIF.getData(image, function() {
					console.log("in exif " +  JSON.stringify(this));
					});
				  
				$scope.cleanUp(); // CLEAN UP IMAGES TAKEN
			};
		
			image.src = imageURI ; // LOAD THE IMAGE OBJECT
 
			}, function(message) { //ERROR HANDLER
				console.log("error " + message);
				
			}, { // CAMERA OPTIONS
				quality:50,
				sourceType: type,
				encodingType: Camera.EncodingType.JPEG,
				correctOrientation: true,
				destinationType: Camera.DestinationType.FILE_URI
			});
}

	$scope.cleanUp = function(){ // CLEAN UP PHOTOS TAKEN
		
		navigator.camera.cleanup(onSuccess, onFail);

			function onSuccess() {
				console.log("Camera cleanup success.")
			}

			function onFail(message) {
				alert('Failed because: ' + message);
			}
	}
		

  // ROTATE IMAGE FUNCTION
  $scope.rotateImage = function(degree){

     $ionicLoading.show({
            template: 'Working...'
      });

      // DEPENDING ON THE SIZE OF THE IMAGE, THE ROTATION CAN ALSO BE CPU HEAVY
      // BECAUSE IT NEEDS TO REDRAW THE IMAGE
      
      setTimeout( function() { // SET A TIMEOUT SO THAT THE LOADING POPUP CAN BE SHOWN

		  var image = $scope.imageSRC ;

		  image.onload = null ; // remove the onload handler
	 
		  var canvas =  document.getElementById('myCanvas');

		  // swap the width and height for 90 degree rotation
		  canvas.width = image.height;
		  canvas.height = image.width;

		  var ctx = canvas.getContext("2d");

		  // translate context to center of canvas
		  ctx.translate(image.height / 2, image.width / 2);
		  ctx.rotate((Math.PI/180) * degree); // rotate image

		  // draw the new rotated image
		  ctx.drawImage(image, - image.width / 2, - image.height / 2, image.width, image.height);

		  $scope.imageSRC.src = canvas.toDataURL(); // save the new original image

      }, 100);

      setTimeout( function() {$ionicLoading.hide();},100); // HIDE THE POPUP AFTER IT'S DONE
  }

  // SHARE OR SAVE PHOTO FUNCTION
  $scope.sharePhoto = function(){
   
  	if ( ionic.Platform.isAndroid() ) { // SAVE FOR ANDROID
  	   window.canvas2ImagePlugin.saveImageDataToLibrary(
                        function(msg){
                            alert("Photo Saved!");
                        }, 
                        function(err){
                            alert(err);
                        }, 
                        'myCanvas'
                    );
	}
	else{ // SHARE SHEET WORKS FOR IOS ONLY

  	    var canvas =  document.getElementById('myCanvas');
	  	var dataURL = canvas.toDataURL();

		$cordovaSocialSharing
			.share("title", "message", dataURL, "link") // Share via native share sheet
			.then(function(result) {
				// Success!
			}, function(err) {
			  // An error occured. Show a message to the user
		  	});
  		}
	}	
    // end camera logic

        $scope.upload = function() {
        var options = {
            quality : 75,
            destinationType : Camera.DestinationType.DATA_URL,
            sourceType : Camera.PictureSourceType.CAMERA,
            allowEdit : true,
            encodingType: Camera.EncodingType.JPEG,
            popoverOptions: CameraPopoverOptions,
            targetWidth: 500,
            targetHeight: 500,
            saveToPhotoAlbum: false
        };
        $cordovaCamera.getPicture(options).then(function(imageData) {
            syncArray.$add({image: imageData}).then(function() {
                alert("Image has been uploaded");
            });
        }, function(error) {
            console.error(error);
        });
    }


  })