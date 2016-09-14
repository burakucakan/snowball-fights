 // Welcome Controller
icerinkApp.controller('WelcomeController', ['$scope', '$rootScope', '$location', '$filter', '$timeout', 'fireManager', '$firebaseObject', '$firebaseArray', 'DbConfig', 'GameConfig', function ($scope, $rootScope, $location, $filter, $timeout, fireManager, $firebaseObject, $firebaseArray, DbConfig, GameConfig) {

  // Set Audio
  var audioHitWindow = new Audio(GameConfig.snowballAudioHitWindow);

  // User Image
  $scope.characterLook = '';

  // Get Game Backgorund
  var gameBg = document.getElementById('gameBgContainer');

  // Hide Dialog Content
  $scope.showDialog = false;

  // Set Default Visibility
  $scope.intro1 = true;
  $scope.intro2 = false;

  $scope.login1 = false;
  $scope.login2 = false;

  $scope.loginGroup = false;

  $scope.loading = false;

  $scope.showLogo = true;

  // When Dialog Init
  $scope.startAnimation = function() {

    // Snowball Animation Chain
    $timeout(function() {
      // Start Snowball Animation
      var snowBall = document.getElementById('snowballBig');
      snowBall.className = snowBall.className + ' sbAnim';
      $timeout(function() {

        // Play Hit Window Sound
        audioHitWindow.play();

        // Set Background Blur
        gameBg.className = gameBg.className + ' blur';

        document.getElementById('appContainer').className = 'shakeAnim';


        // Show Dialog
        $scope.showDialog = true;
        // Set Default
        snowBall.className = snowBall.className.replace(' sbAnim', '');

      }, 500);
    }, 100);
  }

  // Next To How To
  $scope.btnCommence = function() {
    $scope.intro1 = false;
    $scope.intro2 = true;
  }

  // Next to Login
  $scope.btnNext = function() {

    // Hide How To
    $scope.intro2 = false;

    // Hide Logo
    $scope.showLogo = false;

    // Show Loading
    $scope.loading = true;

    // Get People
    var fireConnn = new fireManager($firebaseObject, $firebaseArray, DbConfig.FIREBASE_URL).getAll();

    fireConnn.$loaded().then(function() {
      // Hide Loading
      $scope.loading = false;
      $scope.people = fireConnn;
      $scope.peopleNames = [];

      // Get Names
      for (var i = 0; i < $scope.people.length; i++) {
        $scope.peopleNames[i] = $scope.people[i].name + ' | ' + $scope.people[i].company[0];
      }

        // Set browser autocomplete off
      document.getElementById('autoCompleteUser').setAttribute('autocomplete', 'off');

      // Show Login
      $scope.login1 = true;
    });

  }

  // Show Character On If Not In Group
  $scope.onLoginClick = function() {

    // Fake Login
    if (GameConfig.fakeLoginOn) { $scope.txtUserName = GameConfig.fakeLoginName; }


    if ($scope.txtUserName !== null && $scope.txtUserName.length > 0) {

      var selectedUser = $filter('filter')($scope.people, {
        name: $scope.txtUserName.substr(0, $scope.txtUserName.indexOf('|') - 1)
      });

      if (selectedUser !== null && selectedUser.length > 0) {

        // Get User through web service and three-way binding
        var fireConnn = new fireManager($firebaseObject, $firebaseArray, DbConfig.FIREBASE_URL + "/" + selectedUser[0].$id).getUser();

        fireConnn.$loaded().then(function() {
          fireConnn.$bindTo($rootScope, "fireUser").then(function() {

            console.log("logged in: " + $rootScope.fireUser.$id + ": " + $rootScope.fireUser.name);

            $scope.login1 = false;

            console.log('Group : ' + $rootScope.fireUser.group.length);

            // Check User Is In More Than One Group
            if ($rootScope.fireUser.group.length > 1) {
              $scope.userGroups = $rootScope.fireUser.group;
              $scope.loginGroup = true;
              $scope.groupList = DbConfig.GROUPS;
            } else {
              $scope.groupSelectedId = $rootScope.fireUser.group[0];
              $scope.showCaracter();

              $rootScope.groupSelectedId = $scope.groupSelectedId;
            }

          });
        });
      }
    }
  };

  // Show Character On Group Selection
  $scope.onGroupChange = function() {
    $scope.loginGroup = false;
    $scope.showCaracter();
    $rootScope.groupSelectedId = $scope.groupSelectedId;
  };

  // Next Character
  $scope.showCaracter = function() {
    $scope.login2 = true;
    $scope.characterLook = $scope.getCharImg($rootScope.fireUser.id);
  };

  // Start Game
  $scope.btnStartGame = function() {

    // console.log("groupSelectedId: " + $rootScope.groupSelectedId);

    // Remove Blur
    gameBg.className = gameBg.className.replace(' blur', '');

    // Filter
    $rootScope.fireGroupPlayers = $filter('filter')($scope.people, { name: '!' + $rootScope.fireUser.name });

    $rootScope.fireGroupPlayers = $filter("hasItems")($rootScope.fireGroupPlayers, [$scope.groupSelectedId], 'group');
    $rootScope.fireGroupPlayers.sort(function() {
      return 0.5 - Math.random();
    });
    $rootScope.fireGroupPlayers = $filter('limitTo')($rootScope.fireGroupPlayers, GameConfig.maxPlayer);

    // console.log($rootScope.fireGroupPlayers);

    // Redirect Game
    $location.path("/Game");
  };

  // Get User Image By ID/Name
  $scope.getCharImg = function (charName) {
    charName = charName + '';
    return GameConfig.charImgBig.replace('[NAME]', charName.toLowerCase()).replace(/ /g, '');
  };
}]);


icerinkApp.filter('inArray', function($filter) {
  return function(list, arrayFilter, element) {
    if (arrayFilter) {
      return $filter("filter")(list, function(listItem) {
        return arrayFilter.indexOf(listItem[element]) != -1;
      });
    }
  };
});

icerinkApp.filter('hasItems', function() {
  return function(source, arrValue, field) {
    return source.filter(function(item) {
      for (var i in item[field]) {
        if (arrValue.indexOf(item[field][i]) != -1) {
          return true;
        }
      }

      return false;

    });
  };
});


// Custom Enter Directive
app.directive('aSubmit', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.aSubmit);
                });
                event.preventDefault();
            }
        });
    };
});
