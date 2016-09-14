icerinkApp.factory('fireManager', ['$firebaseObject', '$firebaseArray', function($firebaseObject, $firebaseArray) {

    function Factory($firebaseObject, $firebaseArray, connUrl) {
      this.$firebaseObject = $firebaseObject;
      this.$firebaseArray = $firebaseArray;
      this.ref = new Firebase(connUrl);
    }

    Factory.prototype.getAll = function() {
      return this.$firebaseArray(this.ref);
    };

    Factory.prototype.getUser = function() {
      return $firebaseObject(this.ref);
    };

    // Factory.prototype.getLeaderboard = function() {
    //   return $firebaseObject(this.ref);
    // };

    return Factory;

  }]

);
