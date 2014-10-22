angular.module("hida", ['ui.router', 'inspinia']).config(function($stateProvider, $urlRouterProvider) {
  $stateProvider.state("main", {
    abstract: true,
    templateUrl: "parts/main.html"
  }).state("main.home", {
    url: "/home",
    templateUrl: "parts/home.html"
  }).state("login", {
    url: "/login",
    templateUrl: "parts/login.html"
  });
  return $urlRouterProvider.otherwise("/home");
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
    console.log(data);
    return data;
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

module.controller('HomeController', function($scope, $rootScope) {
  return new ((function(_super) {
    __extends(_Class, _super);

    function _Class() {
      _Class.__super__.constructor.call(this, $scope, $rootScope);
    }

    return _Class;

  })(DefaultController));
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

var module,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module = angular.module('hida');

module.controller('MainController', function($scope, $rootScope) {
  return new ((function(_super) {
    __extends(_Class, _super);

    function _Class() {
      _Class.__super__.constructor.call(this, $scope, $rootScope);
    }

    return _Class;

  })(DefaultController));
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uY29mZmVlIiwiY29udHJvbGxlci5jb2ZmZWUiLCJmaWx0ZXJzLmNvZmZlZSIsInBhcnRzL2hvbWUuY29mZmVlIiwicGFydHMvbG9naW4uY29mZmVlIiwicGFydHMvbWFpbi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxDQUFDLE1BQVIsQ0FBZSxNQUFmLEVBQXVCLENBQUUsV0FBRixFQUFlLFVBQWYsQ0FBdkIsQ0FFQSxDQUFDLE1BRkQsQ0FFUSxTQUFDLGNBQUQsRUFBaUIsa0JBQWpCLEdBQUE7QUFDTixFQUFBLGNBQ0EsQ0FBQyxLQURELENBQ08sTUFEUCxFQUVFO0FBQUEsSUFBQSxRQUFBLEVBQVUsSUFBVjtBQUFBLElBQ0EsV0FBQSxFQUFhLGlCQURiO0dBRkYsQ0FJQSxDQUFDLEtBSkQsQ0FJTyxXQUpQLEVBS0U7QUFBQSxJQUFBLEdBQUEsRUFBSyxPQUFMO0FBQUEsSUFDQSxXQUFBLEVBQWEsaUJBRGI7R0FMRixDQU9BLENBQUMsS0FQRCxDQU9PLE9BUFAsRUFRRTtBQUFBLElBQUEsR0FBQSxFQUFLLFFBQUw7QUFBQSxJQUNBLFdBQUEsRUFBYSxrQkFEYjtHQVJGLENBQUEsQ0FBQTtTQVdBLGtCQUFrQixDQUFDLFNBQW5CLENBQTZCLE9BQTdCLEVBWk07QUFBQSxDQUZSLENBQUEsQ0FBQTs7QUNBQSxJQUFBLGlCQUFBOztBQUFBO0FBRWUsRUFBQSwyQkFBRSxLQUFGLEVBQVUsSUFBVixHQUFBO0FBQ1gsSUFEWSxJQUFDLENBQUEsUUFBQSxLQUNiLENBQUE7QUFBQSxJQURvQixJQUFDLENBQUEsT0FBQSxJQUNyQixDQUFBO0FBQUEsSUFBQSxJQUFDLENBQUEsS0FBSyxDQUFDLElBQVAsR0FBYyxJQUFDLENBQUEsSUFBZixDQUFBO0FBQUEsSUFDQSxJQUFDLENBQUEsS0FBSyxDQUFDLElBQVAsR0FBYyxJQURkLENBQUE7QUFBQSxJQUdBLElBQUMsQ0FBQSxJQUFELENBQUEsQ0FIQSxDQUFBO0FBQUEsSUFLQSxJQUFDLENBQUEsS0FBSyxDQUFDLEdBQVAsQ0FBVyxVQUFYLEVBQXVCLElBQUMsQ0FBQSxPQUF4QixDQUxBLENBRFc7RUFBQSxDQUFiOztBQUFBLDhCQVFBLElBQUEsR0FBTSxTQUFBLEdBQUEsQ0FSTixDQUFBOztBQUFBLDhCQVVBLE9BQUEsR0FBUyxTQUFBLEdBQUEsQ0FWVCxDQUFBOzsyQkFBQTs7SUFGRixDQUFBOztBQ0FBLElBQUEsTUFBQTs7QUFBQSxNQUFBLEdBQVMsT0FBTyxDQUFDLE1BQVIsQ0FBZSxNQUFmLENBQVQsQ0FBQTs7QUFBQSxNQUVNLENBQUMsTUFBUCxDQUFjLEtBQWQsRUFBdUIsU0FBQSxHQUFBO1NBQUcsU0FBQyxJQUFELEdBQUE7QUFBVSxJQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksSUFBWixDQUFBLENBQUE7V0FBa0IsS0FBNUI7RUFBQSxFQUFIO0FBQUEsQ0FBdkIsQ0FGQSxDQUFBOztBQUFBLE1BR00sQ0FBQyxNQUFQLENBQWMsT0FBZCxFQUF1QixTQUFBLEdBQUE7U0FBRyxTQUFDLElBQUQsR0FBQTtXQUFVLElBQUksQ0FBQyxTQUFMLENBQWUsSUFBZixFQUFWO0VBQUEsRUFBSDtBQUFBLENBQXZCLENBSEEsQ0FBQTs7QUNBQSxJQUFBLE1BQUE7RUFBQTtpU0FBQTs7QUFBQSxNQUFBLEdBQVMsT0FBTyxDQUFDLE1BQVIsQ0FBZSxNQUFmLENBQVQsQ0FBQTs7QUFBQSxNQUNNLENBQUMsVUFBUCxDQUFrQixnQkFBbEIsRUFBb0MsU0FBQyxNQUFELEVBQVMsVUFBVCxHQUFBO1NBRWxDLEdBQUEsQ0FBQTtBQVVFLDZCQUFBLENBQUE7O0FBQWEsSUFBQSxnQkFBQSxHQUFBO0FBQ1gsTUFBQSx3Q0FBTSxNQUFOLEVBQWMsVUFBZCxDQUFBLENBRFc7SUFBQSxDQUFiOztrQkFBQTs7S0FWZ0Isb0JBRmdCO0FBQUEsQ0FBcEMsQ0FEQSxDQUFBOztBQ0FBLElBQUEsTUFBQTtFQUFBO2lTQUFBOztBQUFBLE1BQUEsR0FBUyxPQUFPLENBQUMsTUFBUixDQUFlLE1BQWYsQ0FBVCxDQUFBOztBQUFBLE1BQ00sQ0FBQyxVQUFQLENBQWtCLGlCQUFsQixFQUFxQyxTQUFDLE1BQUQsRUFBUyxVQUFULEdBQUE7U0FFbkMsR0FBQSxDQUFBO0FBVUUsNkJBQUEsQ0FBQTs7QUFBYSxJQUFBLGdCQUFBLEdBQUE7QUFDWCxNQUFBLHdDQUFNLE1BQU4sRUFBYyxVQUFkLENBQUEsQ0FEVztJQUFBLENBQWI7O2tCQUFBOztLQVZnQixvQkFGaUI7QUFBQSxDQUFyQyxDQURBLENBQUE7O0FDQUEsSUFBQSxNQUFBO0VBQUE7aVNBQUE7O0FBQUEsTUFBQSxHQUFTLE9BQU8sQ0FBQyxNQUFSLENBQWUsTUFBZixDQUFULENBQUE7O0FBQUEsTUFDTSxDQUFDLFVBQVAsQ0FBa0IsZ0JBQWxCLEVBQW9DLFNBQUMsTUFBRCxFQUFTLFVBQVQsR0FBQTtTQUVsQyxHQUFBLENBQUE7QUFVRSw2QkFBQSxDQUFBOztBQUFhLElBQUEsZ0JBQUEsR0FBQTtBQUNYLE1BQUEsd0NBQU0sTUFBTixFQUFjLFVBQWQsQ0FBQSxDQURXO0lBQUEsQ0FBYjs7a0JBQUE7O0tBVmdCLG9CQUZnQjtBQUFBLENBQXBDLENBREEsQ0FBQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUgXCJoaWRhXCIsIFsgJ3VpLnJvdXRlcicsICdpbnNwaW5pYScgXVxuXG4uY29uZmlnICgkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSAtPlxuICAkc3RhdGVQcm92aWRlclxuICAuc3RhdGUgXCJtYWluXCIsXG4gICAgYWJzdHJhY3Q6IHRydWVcbiAgICB0ZW1wbGF0ZVVybDogXCJwYXJ0cy9tYWluLmh0bWxcIlxuICAuc3RhdGUgXCJtYWluLmhvbWVcIixcbiAgICB1cmw6IFwiL2hvbWVcIlxuICAgIHRlbXBsYXRlVXJsOiBcInBhcnRzL2hvbWUuaHRtbFwiXG4gIC5zdGF0ZSBcImxvZ2luXCIsXG4gICAgdXJsOiBcIi9sb2dpblwiXG4gICAgdGVtcGxhdGVVcmw6IFwicGFydHMvbG9naW4uaHRtbFwiXG5cbiAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSBcIi9ob21lXCIiLCJjbGFzcyBEZWZhdWx0Q29udHJvbGxlclxuXG4gIGNvbnN0cnVjdG9yOiAoQHNjb3BlLCBAcm9vdCkgLT5cbiAgICBAc2NvcGUucm9vdCA9IEByb290XG4gICAgQHNjb3BlLmN0cmwgPSBAXG5cbiAgICBAaW5pdCgpXG5cbiAgICBAc2NvcGUuJG9uICckZGVzdHJveScsIEBkZXN0cm95XG5cbiAgaW5pdDogLT5cblxuICBkZXN0cm95OiAtPiIsIm1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlICdoaWRhJ1xuXG5tb2R1bGUuZmlsdGVyICdsb2cnLCAgIC0+IChkYXRhKSAtPiBjb25zb2xlLmxvZyBkYXRhOyBkYXRhXG5tb2R1bGUuZmlsdGVyICdwcmludCcsIC0+IChkYXRhKSAtPiBKU09OLnN0cmluZ2lmeSBkYXRhIiwibW9kdWxlID0gYW5ndWxhci5tb2R1bGUgJ2hpZGEnXG5tb2R1bGUuY29udHJvbGxlciAnSG9tZUNvbnRyb2xsZXInLCAoJHNjb3BlLCAkcm9vdFNjb3BlKSAtPlxuXG4gIG5ldyBjbGFzcyBleHRlbmRzIERlZmF1bHRDb250cm9sbGVyXG5cbiAgICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgICAjIEluc3RhbmNlIHZhcmlhYmxlcyAgICAgICNcbiAgICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAgICMgY29uc3RydWN0b3IgJiBpbml0ICAgICAgI1xuICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG4gICAgY29uc3RydWN0b3I6IC0+XG4gICAgICBzdXBlciAkc2NvcGUsICRyb290U2NvcGVcblxuICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAgICMgTWV0aG9kcyAgICAgICAgICAgICAgICAgI1xuICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyIsIm1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlICdoaWRhJ1xubW9kdWxlLmNvbnRyb2xsZXIgJ0xvZ2luQ29udHJvbGxlcicsICgkc2NvcGUsICRyb290U2NvcGUpIC0+XG5cbiAgbmV3IGNsYXNzIGV4dGVuZHMgRGVmYXVsdENvbnRyb2xsZXJcblxuICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAgICMgSW5zdGFuY2UgdmFyaWFibGVzICAgICAgI1xuICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG4gICAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICAgIyBjb25zdHJ1Y3RvciAmIGluaXQgICAgICAjXG4gICAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbiAgICBjb25zdHJ1Y3RvcjogLT5cbiAgICAgIHN1cGVyICRzY29wZSwgJHJvb3RTY29wZVxuXG4gICAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICAgIyBNZXRob2RzICAgICAgICAgICAgICAgICAjXG4gICAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIiwibW9kdWxlID0gYW5ndWxhci5tb2R1bGUgJ2hpZGEnXG5tb2R1bGUuY29udHJvbGxlciAnTWFpbkNvbnRyb2xsZXInLCAoJHNjb3BlLCAkcm9vdFNjb3BlKSAtPlxuXG4gIG5ldyBjbGFzcyBleHRlbmRzIERlZmF1bHRDb250cm9sbGVyXG5cbiAgICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgICAjIEluc3RhbmNlIHZhcmlhYmxlcyAgICAgICNcbiAgICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAgICMgY29uc3RydWN0b3IgJiBpbml0ICAgICAgI1xuICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG4gICAgY29uc3RydWN0b3I6IC0+XG4gICAgICBzdXBlciAkc2NvcGUsICRyb290U2NvcGVcblxuICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAgICMgTWV0aG9kcyAgICAgICAgICAgICAgICAgI1xuICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==