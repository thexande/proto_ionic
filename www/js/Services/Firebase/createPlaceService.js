angular.module('proto.createPlaceService', [])
  .service('createPlaceService', function($firebaseObject, $firebaseArray) {
    var ref = firebase.database().ref('Places')
    var places = $firebaseArray(ref)

    var createPlace = function(place) {
      places.$add(place)
    }

    return {
      createPlace,

    }
  })