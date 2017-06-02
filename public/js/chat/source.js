//https://api.gfycat.com/v1test/gfycats/trending?count=9
angular.module('myapp', [])
  .config(function($sceDelegateProvider){
      $sceDelegateProvider.resourceUrlWhitelist([
        'self',
        'https://*.gfycat.com/**'
      ]);
  })
  .directive('display', function(){
    function controller($scope, $http){
      $http({
        method: 'GET',
        url: 'https://api.gfycat.com/v1test/gfycats/trending',
        params: {
          count: 20
        }
      })
      .then(function(res) {
        if(!res.data || !res.data.gfycats){
          console.error("No videos returned");
          $scope.videos = [];
          return;
        }
        $scope.videos = res.data.gfycats.map(function(video){
          video.hover = false;
          return video;
        });
      })
      .catch(function(err) {
        console.error(err);
      });
      $scope.hoverOn = function(video){
        video.hover = true;
      };
      $scope.hoverOff = function(video){
        video.hover = false;
      };
      $scope.showModal = function(video){
        video.hover = false;
        $scope.modalVideo = video;
      };
      $scope.hideModal = function(){
        $scope.modalVideo = null;
      };
    }
    return {
      scope: {},
      transclude: true,
      controller: controller,
      templateUrl: 'display.html'
    };
  })
  .directive('videoContainer', function(){
    return {
      restrict: 'E',
      scope: {
        previewUrl: '=',
        mp4Url: '=',
        hover: '='
      },
      transclude: true,
      templateUrl: 'videoContainer.html'
    };
  })
  .directive('modal', function(){
    function controller($scope){
      $scope.hide = $scope.hideModal();
    }
    return {
      restrict: 'E',
      scope: {
        hideModal: '&',
        source: '='
      },
      transclude: true,
      controller: controller,
      templateUrl: 'modal.html'
    };
  });
