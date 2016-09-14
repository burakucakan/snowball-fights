 // Snowball Controller
icerinkApp.controller('SnowballController', ['$scope', '$rootScope', '$log', 'Snowball', 'prefixService', '$timeout', 'GameConfig', function($scope, $rootScope, $log, Snowball, prefixService, $timeout, GameConfig) {


  // Load Sound
  var audioSnowBall = new Audio(GameConfig.snowballAudioHit);
  var audioSlideDown = new Audio(GameConfig.skaterAudioSlip);

  // Get Browser Prefix
  var prefix = prefixService.prefix();

  // Set Defaults
  $scope.showSnowball = false;
  $scope.readyFire = true;

  // Get Hit Area
  var svgHitContainer = document.getElementById('svgHitContainer');

  // Create Path
  $scope.drawPath = function(event) {

    if ($scope.readyFire) {

      // Lock Fire
      $scope.readyFire = false;
      svgHitContainer.className = svgHitContainer.className + ' locked';

      // Get Mouse Position - Cross Browser
      $scope.getMousePosition = function (e) {
          e = e || window.event;
          var target = e.target || e.srcElement,
              rect = target.getBoundingClientRect(),
              offsetX = e.clientX - rect.left,
              offsetY = e.clientY - rect.top;
          return [offsetX, offsetY];
      };

      // Create Path
      $scope.snowpath = Snowball.getPath(GameConfig.snowballStartPoint, $scope.getMousePosition(event));
      
      // Set Snowball Direction
      $scope.direction = '';
      if ($scope.getMousePosition(event)[0] > GameConfig.snowballStartPoint[0]) {
        $scope.direction = '-';
      }

      // Show Snowball
      $scope.showSnowball = true;

      // Get Path
      var path = document.getElementById('snowballPath');

      // Get SnowBall
      var tmpSnowball = d3.select('#snowball');

      //detect valu defines
      var skaters = document.getElementsByClassName('skaters');

      // Reset SnowBall
      tmpSnowball.style('opacity', '1'); // Set Visible
      tmpSnowball.classed("impact", false); // Chage Impact Position

      // Returns an attrTween for translating along the specified path element.
      function translateAlong(path) {
          return function (d, i, a) {
              return function (t) {

                  // Get snowball position on path
                  var p = path.getPointAtLength(t * path.getTotalLength());

                  // Set snowball aim size
                  var snowballsize = 0.2;
                  if ((1 - t) > 0.2) {
                      snowballsize = (1 - t);
                  }

                  // Snowball Rotation
                  var rotation = 0;
                  if (rotation < 360) {
                      rotation = ((snowballsize * 100) + snowballsize) * 2.1;
                  }

                  return prefix + 'transform: translate(' + p.x + 'px,' + p.y + 'px) scale(' + snowballsize + ') rotate(' + $scope.direction + rotation + 'deg)';
              };
          };
      }


      // Animate SnowBall
      tmpSnowball.transition().duration(GameConfig.snowballSpeed).ease('none').attrTween('style', translateAlong(path)).each("end", function() {

        // Splash Snowball
        tmpSnowball.classed("impact", true);

        // Hide snowball
        $timeout(function() { tmpSnowball.style('opacity', '0'); }, GameConfig.snowballFadeout);

        // Play Sound
        audioSnowBall.play();

        // Hit control
        for (var i = 0; i < skaters.length; i++) {
          var c = skaters[i];
          if (($scope.getMousePosition(event)[0] > c.offsetLeft && ($scope.getMousePosition(event)[0] < (c.offsetLeft + c.offsetWidth))) && ($scope.getMousePosition(event)[1] > c.offsetTop && $scope.getMousePosition(event)[1] < (c.offsetTop + c.offsetHeight))) {
            // Stop Animation
            d3.selectAll('#' + c.id).transition().duration(0);
            var fallingSkater = document.getElementById(c.id);

            // Play Sound
            audioSlideDown.play();

            // Save Hit Information by Data Index
            $scope.hitSomeone(fallingSkater.getAttribute("data-index"));

            // Start Fall Animation
            fallingSkater.className = 'fallingSkater';
            $timeout(function() {
              fallingSkater.className = fallingSkater.className + ' fall1';

              // Remove Skater
              $timeout(function() {
                fallingSkater.className = fallingSkater.className + ' hide';

                // Respawn Skater
                $timeout(function() {

                    fallingSkater.className = 'skaters respawned';

                  $scope.respawn(c.id);

                }, GameConfig.respawnAfterHit);

              }, GameConfig.hideWhenHit);

            }, 200);

            break;
          }
        }

        $scope.readyFire = true; // Unlock Fire
        svgHitContainer.className = svgHitContainer.className.replace(' locked', '');
      });


    }
  }

}]);

icerinkApp.factory('Snowball', ['GameConfig', function(GameConfig) {
  return {
    getPath: function(startPoint, endPoint) {
      // Calculate X Point for Bezier
      var qbX = 0;
      if (startPoint[0] > endPoint[0]) {
        qbX = startPoint[0] - ((startPoint[0] - endPoint[0]) / 2);
      } else {
        qbX = startPoint[0] + ((endPoint[0] - startPoint[0]) / 2);
      }
      // Calculate Y Point for Bezier
      var qbY = endPoint[1] - GameConfig.snowballCurve;
      // Set Quadratic Bezier
      var quadraticBezier = [qbX, qbY];

      return 'M ' + startPoint[0] + ',' + startPoint[1] + ' Q ' + qbX + ',' + qbY + ' ' + endPoint[0] + ',' + endPoint[1];
    }
  };
}]);
