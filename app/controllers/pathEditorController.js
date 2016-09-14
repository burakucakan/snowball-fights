icerinkApp.controller('pathEditorController', ['$scope', function ($scope) {

    var gameAreaSVG = d3.select('#gameArea');
    $scope.points = [];
    $scope.paths = [];

    // Add Point To Scene 
    $scope.addPoint = function () {
        console.log('Add Point ');
        $scope.points.push([10, 10]);
    }

    $scope.drawPath = function () {
        document.getElementById('gameArea').innerHTML = '';

        console.log($scope.points.length);

        var pathArr = [];

        for (var i = 0; i < $scope.points.length; i++) {
            pathArr.push([$scope.points[i][1], $scope.points[i][0]]);
        }

        var path = gameAreaSVG.append('path').data([pathArr]).attr('d', d3.svg.line().tension(0).interpolate('cardinal-closed'));
    }

    $(function () {
        $('body').on('mousedown', 'span', function () {
            $(this).addClass('draggable').parents().on('mousemove', function (e) {
                $('.draggable').offset({
                    top: e.pageY - $('.draggable').outerHeight() / 2,
                    left: e.pageX - $('.draggable').outerWidth() / 2
                }).on('mouseup', function () {
                    $(this).removeClass('draggable');
                });
                e.preventDefault();
            });
        }).on('mouseup', function (e) {

            // Push Coordinated To Scope
            var top = e.pageY - 2;
            var left = e.pageX - 2;
            var target = $(e.target).attr('data-index');
            $scope.$apply(function () {
                $scope.points[target] = [top, left];
            });

            $('.draggable').removeClass('draggable');
        });
    });

}]);




