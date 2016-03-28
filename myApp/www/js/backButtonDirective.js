  var BackButtonCtrl = function ($scope, $log, $state, $ionicHistory, $ionicViewSwitcher) {

    var ctrl = this;

    /**
     * Checks to see if there is a view to navigate back to
     * if we have no current back view.
     *
     * @param  {string} state The current view state
     * @return {boolean}      If there is a view we should navigate back to
     */
    this.canGoBack = function (state) {

      if (!state) {
        state = $ionicHistory.currentStateName();
      }

      var states = state.split('/');

      if (states.length > 1 && !$ionicHistory.backView())  {
        states.pop();
        ctrl.toState = states.join('/');
        return true;
      }
      return false;
    };

    $scope.state = {
      show: true,
      previousState: ''
    };

    $scope.goBack = function () {

      // check we can go back first
      if (!ctrl.canGoBack()) {
        return false;
      }

      // Switch this animation around so it looks like we're navigating backwards
      $ionicViewSwitcher.nextDirection('back');

      // Stop it from caching this view as one to return to
      $ionicHistory.nextViewOptions({
        historyRoot: true,
        disableBack: true
      });

      // Switch to our new previous state
      $state.go(ctrl.toState, $state.params);
    };

    $scope.state.show = ctrl.canGoBack();

    $scope.$on('$stateChangeStart', function (e, to) {
      $scope.state.show = ctrl.canGoBack(to.name);
    });
  };

  var BackButtonDirective = function () {
    return {
      restrict: 'E',
      replace: true,
      controller: 'MlzBackButtonCtrl',
      template: [
        '<ion-nav-buttons> ',
          '<button class="button back-button mlz-back-button buttons button-clear header-item" ng-if="state.show" ng-click="goBack()">',
            '<i class="icon ion-ios7-arrow-back"></i>',
            '<span class="back-text">',
              '<span class="default-title">Back</span>',
            '</span>',
          '</button>',
        '</ion-nav-buttons>'
      ].join('')
    };
  };

  angular.module('mlz.backbutton', ['ionic'])
    .controller('BackButtonCtrl', ['$scope', '$log', '$state', '$ionicHistory', '$ionicViewSwitcher', BackButtonCtrl])
    .directive('mlzBackButton', [BackButtonDirective]);