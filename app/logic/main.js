angular.module("hida", ['ui.router', 'inspinia']).config(function($stateProvider, $urlRouterProvider) {
  $stateProvider.state("login", {
    url: "/login",
    templateUrl: "parts/login.html"
  });
  return $urlRouterProvider.otherwise("/login");
});

var DefaultController;

DefaultController = (function() {
  function DefaultController(scope, root) {
    this.scope = scope;
    this.root = root;
    this.scope.root = this.root;
    this.scope.ctrl = this;
    this.init();
    this.scope.$on('$destroy', this.destroy);
  }

  DefaultController.prototype.init = function() {};

  DefaultController.prototype.destroy = function() {};

  return DefaultController;

})();

var module;

module = angular.module('hida');

module.filter('log', function() {
  return function(data) {
    return console.log(data);
  };
});

module.filter('print', function() {
  return function(data) {
    return JSON.stringify(data);
  };
});

var module,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module = angular.module('hida');

module.controller('LoginController', function($scope, $rootScope) {
  return new ((function(_super) {
    __extends(_Class, _super);

    function _Class() {
      _Class.__super__.constructor.call(this, $scope, $rootScope);
    }

    return _Class;

  })(DefaultController));
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uY29mZmVlIiwiY29udHJvbGxlci5jb2ZmZWUiLCJmaWx0ZXJzLmNvZmZlZSIsInBhcnRzL2xvZ2luLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLENBQUMsTUFBUixDQUFlLE1BQWYsRUFBdUIsQ0FBRSxXQUFGLEVBQWUsVUFBZixDQUF2QixDQUVBLENBQUMsTUFGRCxDQUVRLFNBQUMsY0FBRCxFQUFpQixrQkFBakIsR0FBQTtBQUNOLEVBQUEsY0FDQSxDQUFDLEtBREQsQ0FDTyxPQURQLEVBRUU7QUFBQSxJQUFBLEdBQUEsRUFBSyxRQUFMO0FBQUEsSUFDQSxXQUFBLEVBQWEsa0JBRGI7R0FGRixDQUFBLENBQUE7U0FLQSxrQkFBa0IsQ0FBQyxTQUFuQixDQUE2QixRQUE3QixFQU5NO0FBQUEsQ0FGUixDQUFBLENBQUE7O0FDQUEsSUFBQSxpQkFBQTs7QUFBQTtBQUVlLEVBQUEsMkJBQUUsS0FBRixFQUFVLElBQVYsR0FBQTtBQUNYLElBRFksSUFBQyxDQUFBLFFBQUEsS0FDYixDQUFBO0FBQUEsSUFEb0IsSUFBQyxDQUFBLE9BQUEsSUFDckIsQ0FBQTtBQUFBLElBQUEsSUFBQyxDQUFBLEtBQUssQ0FBQyxJQUFQLEdBQWMsSUFBQyxDQUFBLElBQWYsQ0FBQTtBQUFBLElBQ0EsSUFBQyxDQUFBLEtBQUssQ0FBQyxJQUFQLEdBQWMsSUFEZCxDQUFBO0FBQUEsSUFHQSxJQUFDLENBQUEsSUFBRCxDQUFBLENBSEEsQ0FBQTtBQUFBLElBS0EsSUFBQyxDQUFBLEtBQUssQ0FBQyxHQUFQLENBQVcsVUFBWCxFQUF1QixJQUFDLENBQUEsT0FBeEIsQ0FMQSxDQURXO0VBQUEsQ0FBYjs7QUFBQSw4QkFRQSxJQUFBLEdBQU0sU0FBQSxHQUFBLENBUk4sQ0FBQTs7QUFBQSw4QkFVQSxPQUFBLEdBQVMsU0FBQSxHQUFBLENBVlQsQ0FBQTs7MkJBQUE7O0lBRkYsQ0FBQTs7QUNBQSxJQUFBLE1BQUE7O0FBQUEsTUFBQSxHQUFTLE9BQU8sQ0FBQyxNQUFSLENBQWUsTUFBZixDQUFULENBQUE7O0FBQUEsTUFFTSxDQUFDLE1BQVAsQ0FBYyxLQUFkLEVBQXVCLFNBQUEsR0FBQTtTQUFHLFNBQUMsSUFBRCxHQUFBO1dBQVUsT0FBTyxDQUFDLEdBQVIsQ0FBWSxJQUFaLEVBQVY7RUFBQSxFQUFIO0FBQUEsQ0FBdkIsQ0FGQSxDQUFBOztBQUFBLE1BR00sQ0FBQyxNQUFQLENBQWMsT0FBZCxFQUF1QixTQUFBLEdBQUE7U0FBRyxTQUFDLElBQUQsR0FBQTtXQUFVLElBQUksQ0FBQyxTQUFMLENBQWUsSUFBZixFQUFWO0VBQUEsRUFBSDtBQUFBLENBQXZCLENBSEEsQ0FBQTs7QUNBQSxJQUFBLE1BQUE7RUFBQTtpU0FBQTs7QUFBQSxNQUFBLEdBQVMsT0FBTyxDQUFDLE1BQVIsQ0FBZSxNQUFmLENBQVQsQ0FBQTs7QUFBQSxNQUNNLENBQUMsVUFBUCxDQUFrQixpQkFBbEIsRUFBcUMsU0FBQyxNQUFELEVBQVMsVUFBVCxHQUFBO1NBRW5DLEdBQUEsQ0FBQTtBQVVFLDZCQUFBLENBQUE7O0FBQWEsSUFBQSxnQkFBQSxHQUFBO0FBQ1gsTUFBQSx3Q0FBTSxNQUFOLEVBQWMsVUFBZCxDQUFBLENBRFc7SUFBQSxDQUFiOztrQkFBQTs7S0FWZ0Isb0JBRmlCO0FBQUEsQ0FBckMsQ0FEQSxDQUFBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyLm1vZHVsZSBcImhpZGFcIiwgWyAndWkucm91dGVyJywgJ2luc3BpbmlhJyBdXG5cbi5jb25maWcgKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIC0+XG4gICRzdGF0ZVByb3ZpZGVyXG4gIC5zdGF0ZSBcImxvZ2luXCIsXG4gICAgdXJsOiBcIi9sb2dpblwiXG4gICAgdGVtcGxhdGVVcmw6IFwicGFydHMvbG9naW4uaHRtbFwiXG5cbiAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSBcIi9sb2dpblwiIiwiY2xhc3MgRGVmYXVsdENvbnRyb2xsZXJcblxuICBjb25zdHJ1Y3RvcjogKEBzY29wZSwgQHJvb3QpIC0+XG4gICAgQHNjb3BlLnJvb3QgPSBAcm9vdFxuICAgIEBzY29wZS5jdHJsID0gQFxuXG4gICAgQGluaXQoKVxuXG4gICAgQHNjb3BlLiRvbiAnJGRlc3Ryb3knLCBAZGVzdHJveVxuXG4gIGluaXQ6IC0+XG5cbiAgZGVzdHJveTogLT4iLCJtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSAnaGlkYSdcblxubW9kdWxlLmZpbHRlciAnbG9nJywgICAtPiAoZGF0YSkgLT4gY29uc29sZS5sb2cgZGF0YVxubW9kdWxlLmZpbHRlciAncHJpbnQnLCAtPiAoZGF0YSkgLT4gSlNPTi5zdHJpbmdpZnkgZGF0YSIsIm1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlICdoaWRhJ1xubW9kdWxlLmNvbnRyb2xsZXIgJ0xvZ2luQ29udHJvbGxlcicsICgkc2NvcGUsICRyb290U2NvcGUpIC0+XG5cbiAgbmV3IGNsYXNzIGV4dGVuZHMgRGVmYXVsdENvbnRyb2xsZXJcblxuICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAgICMgSW5zdGFuY2UgdmFyaWFibGVzICAgICAgI1xuICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG4gICAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICAgIyBjb25zdHJ1Y3RvciAmIGluaXQgICAgICAjXG4gICAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbiAgICBjb25zdHJ1Y3RvcjogLT5cbiAgICAgIHN1cGVyICRzY29wZSwgJHJvb3RTY29wZVxuXG4gICAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICAgIyBNZXRob2RzICAgICAgICAgICAgICAgICAjXG4gICAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9