// Game Controller
icerinkApp.controller('IcerinkController', ['$scope', '$document', '$rootScope', '$http', '$filter', '$q', '$log', 'prefixService', 'snowEffect', 'parallaxEffect', '$timeout', 'fireManager', '$firebaseObject', '$firebaseArray', 'DbConfig', 'GameConfig',
  function GameController($scope, $document, $rootScope, $http, $filter, $q, $log, prefixService, snowEffect, parallaxEffect, $timeout, fireManager, $firebaseObject, $firebaseArray, DbConfig, GameConfig) {

    $scope.userId = $rootScope.fireUser.id;
    $scope.userName = $rootScope.fireUser.name;
    $scope.userCharacter = $rootScope.fireUser.character;
    $scope.userGroupId = $rootScope.groupSelectedId;

    var arrPositiveMessages = [
      'killing it!',
      'nice one!',
      'doing well!',
      'keep it up!',
      'ho-ho-ho-ooold up!',
      'gonna be a good xmas!',
      'its a blizzard!'
    ];

    var arrNegativeMessages = [
      'you are losing it',
      'you can do better',
      'oh (rein)dear',
      'try harder!',
      'you suck, santa!',
      'you throw #likeagirl'
    ];


$scope.currentRank = 0;

    var fb = new Firebase(DbConfig.FIREBASE_URL);
    $scope.leaderboard = [];
     fb.on('value', function(snap) {
         $timeout(function() {
            $scope.leaderboard = snap.val();
            //$scope.leaderboard = $filter("hasItems")($scope.leaderboard, [$rootScope.groupSelectedId], 'group');
            $scope.currentRank = document.getElementById('uRank-' + $rootScope.fireUser.id).innerText;

            $log.info("sc: " + $scope.currentRank);

         });
     });

     var oldRank = 0;

     $scope.$watchCollection('leaderboard', function() {
       console.log("cc");

       oldRank = $scope.currentRank;
       $scope.currentRank = document.getElementById('uRank-' + $rootScope.fireUser.id).innerText;

       $log.info("sc new: " + $scope.currentRank);

       if (oldRank < $scope.currentRank && $scope.currentRank <= 7)
           $scope.notifications.push(arrPositiveMessages[$scope.currentRank - 1]);
       else
           $scope.notifications.push(arrNegativeMessages[$scope.currentRank - 1]);
    });


      // var fireLeaderboard = new fireManager($firebaseObject, $firebaseArray, DbConfig.FIREBASE_URL).getAll();
      // fireLeaderboard.$loaded().then(function () {
      //
      //     $scope.leaderboard = fireLeaderboard;
      //     $scope.leaderboard = $filter("hasItems")($scope.leaderboard, [$rootScope.groupSelectedId], 'group');
      //
      // });

      // Keep Current Hit
      $scope.currentHit = [];
      $scope.currentHitBy = [];

      $scope.notifications = [];

      // Set Default Views
      $scope.modalOverlay = false;
      $scope.scoreModal = false;
      $scope.howToPlayModal = false;

      $scope.skaters = $rootScope.fireGroupPlayers;
      $scope.score = $rootScope.fireUser.score;
      $scope.hitpoint = GameConfig.hitPoint;
      $scope.getHitPoint = GameConfig.getHitPoint;

      // Get Browser Prefix
      var prefix = prefixService.prefix();

      // Start Snow Effect
      if (GameConfig.snowEffect) {
          snowEffect.start();
      }

      // Start Snow Effect
      if (GameConfig.parallaxEffect) {
          parallaxEffect.start();
      }

      // Get Game Backgorund
      var gameBg = document.getElementById('gameBgContainer');
      var gameLayoutBg = document.getElementById('gameLayout');

      // Remove Blur Effects
      gameBg.className = gameBg.className.replace(' blur', '');
      gameLayoutBg.className = gameLayoutBg.className.replace(' blur', '');

      // Watch : if somebody hit you push to screen
      var firstPush = true;
      $scope.$watch('$root.fireUser', function () {
          if (!firstPush) {
              $scope.notifications.push(['hitByNotification', GameConfig.getHitPoint, $rootScope.fireUser.get_hit_by + ' hit you']); // Push Hit To Screen
              $scope.score = $rootScope.fireUser.score;
          }
          firstPush = false;
      });

      // Get Paths - You can use path editor for making new paths. ( Enable Jquery from index.html and go to /Editor )
      $http({
          method: 'GET',
          url: 'data/paths.json',
          cache: false
      }).then(function successCallback(response) {

          // Assign Results to scope
          $scope.paths = response.data;

          // console.log($scope.paths);

          // Get Game Area SVG
          var gameAreaSVG = d3.select('#gameArea');
          var gameAreaDIV = d3.select('#skaters');

          // Add Path to SVG for Each Character
          var i = 0;
          for (i = 0; i < $scope.skaters.length; i++) {

              var skaterID = "char" + $scope.skaters[i].id;
              var pathID = skaterID + 'Path';
              var points = $scope.paths[i];

              // Add Skater
              var currentStyle = 'background-image:url(' + $scope.getCharImg('' + $scope.skaters[i].id) + '); ';
              var skater = gameAreaDIV.insert('div', ':first-child')
                .attr('class', 'skaters')
                .attr('id', skaterID)
                .attr('data-index', $scope.skaters[i].$id)
                .attr('data-hit', 'false')
                .attr('style', currentStyle).html('<span class="skaterName gothamBlack">' + $scope.skaters[i].name + '</span>');

              // console.log([points]);
              // console.log(pathID);

              // Add Path
              var path = gameAreaSVG.append('path').data([points]).attr('d', d3.svg.line().tension(0).interpolate('cardinal-closed')).attr('id', pathID);

              // // Mark Path Points || For Debug
              // gameAreaSVG.selectAll(".point")
              //         .data(points)
              //         .enter().append("circle")
              //           .attr("r", 4)
              //           .attr("transform", function (d) { return "translate(" + d + ")"; });

              $scope.transitions(d3.select('#' + pathID), d3.select('#' + skaterID), currentStyle);
          }
      }, function errorCallback(response) {
          $log.error(response);
      });

      // When Snowball Hit Someone
      $scope.hitSomeone = function (getHitDataIndex) {

          // Update Own Score
          $rootScope.fireUser.hit_count += 1;
          $rootScope.fireUser.score += GameConfig.hitPoint;
          $scope.score = $rootScope.fireUser.score;

          // Get Target User
          var fGetHitUser = new fireManager($firebaseObject, $firebaseArray, DbConfig.FIREBASE_URL + "/" + getHitDataIndex).getUser();
          fGetHitUser.$loaded().then(function () {
              // Push Scoreboard
              $scope.notifications.push(['hitNotification', '+' + $scope.hitpoint, 'hit ' + fGetHitUser.name]); // Push Hit To Screen

              // Update Target User Score
              fGetHitUser.score += GameConfig.getHitPoint;
              fGetHitUser.get_hit_count += 1;
              fGetHitUser.get_hit_by = $rootScope.fireUser.name;
              fGetHitUser.$save();
          });
      };

      // Recursive Transition Loop
      $scope.transitions = function (path, skater, currentStyle) {
          // Animate Skaters
          skater.transition()
            .duration($scope.calcDuration(path.node().getTotalLength()))
            .ease('none')
            .attrTween('style', $scope.translateAlong(path.node(), currentStyle))
            .each('end', function () {
                $scope.transitions(path, skater, currentStyle);
            });
      };

      // Get Character Sprite
      $scope.getCharImg = function (charName) {
          return GameConfig.charImg.replace('[NAME]', charName.toLowerCase()).replace(/ /g, '');
      };

      // Calculates Speed for Each User
      $scope.calcDuration = function (totalLength) {
          return ~~(totalLength * (Math.floor(Math.random() * (GameConfig.maxSpeed - GameConfig.minSpeed)) + GameConfig.minSpeed));
      };

      // Returns an attrTween for translating along the specified path element.
      $scope.translateAlong = function (path, currentStyle) {
          var tmpX = 0;
          var tmpY = 0;
          var l = path.getTotalLength();
          return function (d, i, a) {
              return function (t) {
                  var p = path.getPointAtLength(t * l);

                  // Set Direction
                  var direction = 1;
                  if (tmpX < p.x) {
                      direction = -1;
                  } else {
                      direction = 1;
                  }
                  tmpX = p.x;

                  // Icerink height is : 400px
                  // Character Original height is : 135px (Closer)
                  // 135 / 100 * 10(%) = 13.5px (Char Min/Max Diffrence)

                  // Find Current Height
                  // CurrentPozisyon * (13.5 / 400 = 0.03375) = 10.125
                  // 135 - 10.125 = 124.875(Current Height)
                  // 135 / 13.5 = 10



                  // Char Min Heiht : 135 - 13.5 = 121.5


                  // 400 / 135 = 2.96 px

                  // 400 / 200 = (10) / 2 = (5)
                  // 100-5 = 0.95
                  var size = 1;
                  if (tmpY < p.y) {
                      // Yakinlas

                  } else {
                      // Uzaklas

                  }
                  tmpY = p.y;


                  // Set Size %10
                  //console.log(currentStyle);

                  return prefix + 'transform:scaleX(' + direction + ') !important; ' + currentStyle + ' z-index:' + ~~([p.y]) + ';top:' + p.y + 'px;left:' + p.x + 'px;';
              };
          };
      };

      $scope.respawn = function (getHitId) {
          // console.log("respawn here " + getHitId);
          var getHitCharCurrStyle = 'background-image:url(' + $scope.getCharImg(getHitId.replace("char", '')) + '); ';
          $scope.transitions(d3.select('#' + getHitId + 'Path'), d3.select('#' + getHitId), getHitCharCurrStyle);

          // Remove Respawn class
          $timeout(function () {
              document.getElementById(getHitId).className = document.getElementById(getHitId).className.replace(' respawned', '');
          }, 1200);
      };

      // Open Scoreboard
      $scope.OpenScoreBoard = function () {
          // Open Overlay
          $scope.modalOverlay = true;
          // Add Blur
          gameBg.className = gameBg.className + ' blur';
          gameLayoutBg.className = gameLayoutBg.className + ' blur';
          // Show Modal
          $scope.scoreModal = true;

      };

      $scope.getRowClass = function (item) {
          return (item.name === $rootScope.fireUser.name) ? "currentUser" : "normal";
      };

      // Open How To Play
      $scope.OpenHowToPlay = function () {

          // Add Blur
          gameBg.className = gameBg.className + ' blur';
          gameLayoutBg.className = gameLayoutBg.className + ' blur';

          $scope.modalOverlay = true;
          $scope.howToPlayModal = true;
      };

      // Close Modal
      $scope.closeModal = function () {

          // Remove Blur
          gameBg.className = gameBg.className.replace(' blur', '');
          gameLayoutBg.className = gameLayoutBg.className.replace(' blur', '');

          // Close Modals
          $scope.howToPlayModal = false;
          $scope.scoreModal = false;
          $scope.modalOverlay = false;
      }
  }
]);
