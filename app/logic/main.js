angular.module("hida", ['ui.router', 'inspinia']).config(function($stateProvider, $urlRouterProvider) {
  $stateProvider.state("main", {
    abstract: true,
    templateUrl: "parts/main.html",
    controller: "MainController"
  }).state("main.home", {
    url: "/home",
    templateUrl: "parts/home.html",
    controller: "HomeController"
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

module.filter('replace', function() {
  return function(text, a, b) {
    return text.replace(a, b);
  };
});

var file, module,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

file = 'dicomfile:/Users/Jorrit/Development/Hida/app/data/test.dcm';

module = angular.module('hida');

module.controller('HomeController', function($scope, $rootScope) {
  return new ((function(_super) {
    __extends(_Class, _super);

    _Class.prototype.ww = 0;

    _Class.prototype.wl = 0;

    function _Class() {
      var $element, element, fs;
      _Class.__super__.constructor.call(this, $scope, $rootScope);
      $element = $('.dicom');
      element = $element[0];
      fs = require('fs');
      cornerstone.enable(element);
      cornerstone.loadImage(file).then((function(_this) {
        return function(image) {
          var viewport;
          cornerstone.displayImage(element, image);
          viewport = cornerstone.getViewport(element);
          _this.ww = viewport.voi.windowWidth;
          _this.wl = viewport.voi.windowCenter;
          return $element.mousedown(function(e) {
            var lastX, lastY;
            lastX = e.pageX;
            lastY = e.pageY;
            $(document).mousemove(function(e) {
              var deltaX, deltaY;
              deltaX = e.pageX - lastX;
              deltaY = e.pageY - lastY;
              lastX = e.pageX;
              lastY = e.pageY;
              viewport = cornerstone.getViewport(element);
              viewport.voi.windowWidth += deltaX / viewport.scale;
              viewport.voi.windowCenter += deltaY / viewport.scale;
              cornerstone.setViewport(element, viewport);
              _this.ww = Math.round(viewport.voi.windowWidth);
              _this.wl = Math.round(viewport.voi.windowCenter);
              return _this.scope.$apply();
            });
            return $(document).mouseup(function(e) {
              $(document).unbind("mousemove");
              return $(document).unbind("mouseup");
            });
          });
        };
      })(this));
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

module.controller('MainController', function($scope, $rootScope, $state) {
  return new ((function(_super) {
    __extends(_Class, _super);

    function _Class() {
      _Class.__super__.constructor.call(this, $scope, $rootScope);
      $scope.$state = $state;
    }

    return _Class;

  })(DefaultController));
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uY29mZmVlIiwiY29udHJvbGxlci5jb2ZmZWUiLCJmaWx0ZXJzLmNvZmZlZSIsInBhcnRzL2hvbWUuY29mZmVlIiwicGFydHMvbG9naW4uY29mZmVlIiwicGFydHMvbWFpbi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxDQUFDLE1BQVIsQ0FBZSxNQUFmLEVBQXVCLENBQUUsV0FBRixFQUFlLFVBQWYsQ0FBdkIsQ0FFQSxDQUFDLE1BRkQsQ0FFUSxTQUFDLGNBQUQsRUFBaUIsa0JBQWpCLEdBQUE7QUFDTixFQUFBLGNBQ0EsQ0FBQyxLQURELENBQ08sTUFEUCxFQUVFO0FBQUEsSUFBQSxRQUFBLEVBQVUsSUFBVjtBQUFBLElBQ0EsV0FBQSxFQUFhLGlCQURiO0FBQUEsSUFFQSxVQUFBLEVBQVksZ0JBRlo7R0FGRixDQUtBLENBQUMsS0FMRCxDQUtPLFdBTFAsRUFNRTtBQUFBLElBQUEsR0FBQSxFQUFLLE9BQUw7QUFBQSxJQUNBLFdBQUEsRUFBYSxpQkFEYjtBQUFBLElBRUEsVUFBQSxFQUFZLGdCQUZaO0dBTkYsQ0FTQSxDQUFDLEtBVEQsQ0FTTyxPQVRQLEVBVUU7QUFBQSxJQUFBLEdBQUEsRUFBSyxRQUFMO0FBQUEsSUFDQSxXQUFBLEVBQWEsa0JBRGI7R0FWRixDQUFBLENBQUE7U0FhQSxrQkFBa0IsQ0FBQyxTQUFuQixDQUE2QixPQUE3QixFQWRNO0FBQUEsQ0FGUixDQUFBLENBQUE7O0FDQUEsSUFBQSxpQkFBQTs7QUFBQTtBQUVlLEVBQUEsMkJBQUUsS0FBRixFQUFVLElBQVYsR0FBQTtBQUNYLElBRFksSUFBQyxDQUFBLFFBQUEsS0FDYixDQUFBO0FBQUEsSUFEb0IsSUFBQyxDQUFBLE9BQUEsSUFDckIsQ0FBQTtBQUFBLElBQUEsSUFBQyxDQUFBLEtBQUssQ0FBQyxJQUFQLEdBQWMsSUFBQyxDQUFBLElBQWYsQ0FBQTtBQUFBLElBQ0EsSUFBQyxDQUFBLEtBQUssQ0FBQyxJQUFQLEdBQWMsSUFEZCxDQUFB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QUFBLENBQXBCLEVBbEJpQjtVQUFBLENBQW5CLEVBUEk7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUROLENBVEEsQ0FEVztJQUFBLENBUGI7O2tCQUFBOztLQU5nQixvQkFGZ0I7QUFBQSxDQUFwQyxDQUhBLENBQUE7O0FDQUEsSUFBQSxNQUFBO0VBQUE7aVNBQUE7O0FBQUEsTUFBQSxHQUFTLE9BQU8sQ0FBQyxNQUFSLENBQWUsTUFBZixDQUFULENBQUE7O0FBQUEsTUFDTSxDQUFDLFVBQVAsQ0FBa0IsaUJBQWxCLEVBQXFDLFNBQUMsTUFBRCxFQUFTLFVBQVQsR0FBQTtTQUVuQyxHQUFBLENBQUE7QUFVRSw2QkFBQSxDQUFBOztBQUFhLElBQUEsZ0JBQUEsR0FBQTtBQUNYLE1BQUEsd0NBQU0sTUFBTixFQUFjLFVBQWQsQ0FBQSxDQURXO0lBQUEsQ0FBYjs7a0JBQUE7O0tBVmdCLG9CQUZpQjtBQUFBLENBQXJDLENBREEsQ0FBQTs7QUNBQSxJQUFBLE1BQUE7RUFBQTtpU0FBQTs7QUFBQSxNQUFBLEdBQVMsT0FBTyxDQUFDLE1BQVIsQ0FBZSxNQUFmLENBQVQsQ0FBQTs7QUFBQSxNQUNNLENBQUMsVUFBUCxDQUFrQixnQkFBbEIsRUFBb0MsU0FBQyxNQUFELEVBQVMsVUFBVCxFQUFxQixNQUFyQixHQUFBO1NBRWxDLEdBQUEsQ0FBQTtBQVVFLDZCQUFBLENBQUE7O0FBQWEsSUFBQSxnQkFBQSxHQUFBO0FBQ1gsTUFBQSx3Q0FBTSxNQUFOLEVBQWMsVUFBZCxDQUFBLENBQUE7QUFBQSxNQUVBLE1BQU0sQ0FBQyxNQUFQLEdBQWdCLE1BRmhCLENBRFc7SUFBQSxDQUFiOztrQkFBQTs7S0FWZ0Isb0JBRmdCO0FBQUEsQ0FBcEMsQ0FEQSxDQUFBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyLm1vZHVsZSBcImhpZGFcIiwgWyAndWkucm91dGVyJywgJ2luc3BpbmlhJyBdXG5cbi5jb25maWcgKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIC0+XG4gICRzdGF0ZVByb3ZpZGVyXG4gIC5zdGF0ZSBcIm1haW5cIixcbiAgICBhYnN0cmFjdDogdHJ1ZVxuICAgIHRlbXBsYXRlVXJsOiBcInBhcnRzL21haW4uaHRtbFwiXG4gICAgY29udHJvbGxlcjogXCJNYWluQ29udHJvbGxlclwiXG4gIC5zdGF0ZSBcIm1haW4uaG9tZVwiLFxuICAgIHVybDogXCIvaG9tZVwiXG4gICAgdGVtcGxhdGVVcmw6IFwicGFydHMvaG9tZS5odG1sXCJcbiAgICBjb250cm9sbGVyOiBcIkhvbWVDb250cm9sbGVyXCJcbiAgLnN0YXRlIFwibG9naW5cIixcbiAgICB1cmw6IFwiL2xvZ2luXCJcbiAgICB0ZW1wbGF0ZVVybDogXCJwYXJ0cy9sb2dpbi5odG1sXCJcblxuICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlIFwiL2hvbWVcIiIsImNsYXNzIERlZmF1bHRDb250cm9sbGVyXG5cbiAgY29uc3RydWN0b3I6IChAc2NvcGUsIEByb290KSAtPlxuICAgIEBzY29wZS5yb290ID0gQHJvb3RcbiAgICBAc2NvcGUuY3RybCA9IEBcblxuICAgIEBpbml0KClcblxuICAgIEBzY29wZS4kb24gJyRkZXN0cm95JywgQGRlc3Ryb3lcblxuICBpbml0OiAtPlxuXG4gIGRlc3Ryb3k6IC0+IiwibW9kdWxlID0gYW5ndWxhci5tb2R1bGUgJ2hpZGEnXG5cbm1vZHVsZS5maWx0ZXIgJ2xvZycsICAgICAtPiAoZGF0YSkgLT4gY29uc29sZS5sb2cgZGF0YTsgZGF0YVxubW9kdWxlLmZpbHRlciAncHJpbnQnLCAgIC0+IChkYXRhKSAtPiBKU09OLnN0cmluZ2lmeSBkYXRhXG5cbm1vZHVsZS5maWx0ZXIgJ3JlcGxhY2UnLCAtPiAodGV4dCwgYSwgYikgLT4gdGV4dC5yZXBsYWNlIGEsIGIiLCJmaWxlID0gJ2RpY29tZmlsZTovVXNlcnMvSm9ycml0L0RldmVsb3BtZW50L0hpZGEvYXBwL2RhdGEvdGVzdC5kY20nXG5cbm1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlICdoaWRhJ1xubW9kdWxlLmNvbnRyb2xsZXIgJ0hvbWVDb250cm9sbGVyJywgKCRzY29wZSwgJHJvb3RTY29wZSkgLT5cblxuICBuZXcgY2xhc3MgZXh0ZW5kcyBEZWZhdWx0Q29udHJvbGxlclxuXG4gICAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICAgIyBJbnN0YW5jZSB2YXJpYWJsZXMgICAgICAjXG4gICAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbiAgICB3dzogMFxuICAgIHdsOiAwXG5cbiAgICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgICAjIGNvbnN0cnVjdG9yICYgaW5pdCAgICAgICNcbiAgICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuICAgIGNvbnN0cnVjdG9yOiAtPlxuICAgICAgc3VwZXIgJHNjb3BlLCAkcm9vdFNjb3BlXG5cbiAgICAgICRlbGVtZW50ID0gJCgnLmRpY29tJylcbiAgICAgIGVsZW1lbnQgPSAkZWxlbWVudFswXVxuXG4gICAgICBmcyA9IHJlcXVpcmUgJ2ZzJ1xuXG4gICAgICBjb3JuZXJzdG9uZS5lbmFibGUgZWxlbWVudFxuXG4gICAgICBjb3JuZXJzdG9uZS5sb2FkSW1hZ2UgZmlsZVxuICAgICAgLnRoZW4gKGltYWdlKSA9PlxuICAgICAgICBjb3JuZXJzdG9uZS5kaXNwbGF5SW1hZ2UgZWxlbWVudCwgaW1hZ2VcbiAgICAgICAgdmlld3BvcnQgPSBjb3JuZXJzdG9uZS5nZXRWaWV3cG9ydCBlbGVtZW50XG5cbiAgICAgICAgQHd3ID0gdmlld3BvcnQudm9pLndpbmRvd1dpZHRoXG4gICAgICAgIEB3bCA9IHZpZXdwb3J0LnZvaS53aW5kb3dDZW50ZXJcblxuICAgICAgICAkZWxlbWVudC5tb3VzZWRvd24gKGUpID0+XG4gICAgICAgICAgbGFzdFggPSBlLnBhZ2VYXG4gICAgICAgICAgbGFzdFkgPSBlLnBhZ2VZXG5cbiAgICAgICAgICAkKGRvY3VtZW50KS5tb3VzZW1vdmUgKGUpID0+XG4gICAgICAgICAgICBkZWx0YVggPSBlLnBhZ2VYIC0gbGFzdFhcbiAgICAgICAgICAgIGRlbHRhWSA9IGUucGFnZVkgLSBsYXN0WVxuICAgICAgICAgICAgbGFzdFggPSBlLnBhZ2VYXG4gICAgICAgICAgICBsYXN0WSA9IGUucGFnZVlcbiAgICAgICAgICAgIHZpZXdwb3J0ID0gY29ybmVyc3RvbmUuZ2V0Vmlld3BvcnQoZWxlbWVudClcbiAgICAgICAgICAgIHZpZXdwb3J0LnZvaS53aW5kb3dXaWR0aCArPSAoZGVsdGFYIC8gdmlld3BvcnQuc2NhbGUpXG4gICAgICAgICAgICB2aWV3cG9ydC52b2kud2luZG93Q2VudGVyICs9IChkZWx0YVkgLyB2aWV3cG9ydC5zY2FsZSlcbiAgICAgICAgICAgIGNvcm5lcnN0b25lLnNldFZpZXdwb3J0IGVsZW1lbnQsIHZpZXdwb3J0XG5cbiAgICAgICAgICAgIEB3dyA9IE1hdGgucm91bmQgdmlld3BvcnQudm9pLndpbmRvd1dpZHRoXG4gICAgICAgICAgICBAd2wgPSBNYXRoLnJvdW5kIHZpZXdwb3J0LnZvaS53aW5kb3dDZW50ZXJcbiAgICAgICAgICAgIEBzY29wZS4kYXBwbHkoKVxuXG4gICAgICAgICAgJChkb2N1bWVudCkubW91c2V1cCAoZSkgLT5cbiAgICAgICAgICAgICQoZG9jdW1lbnQpLnVuYmluZCBcIm1vdXNlbW92ZVwiXG4gICAgICAgICAgICAkKGRvY3VtZW50KS51bmJpbmQgXCJtb3VzZXVwXCJcblxuICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAgICMgTWV0aG9kcyAgICAgICAgICAgICAgICAgI1xuICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyIsIm1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlICdoaWRhJ1xubW9kdWxlLmNvbnRyb2xsZXIgJ0xvZ2luQ29udHJvbGxlcicsICgkc2NvcGUsICRyb290U2NvcGUpIC0+XG5cbiAgbmV3IGNsYXNzIGV4dGVuZHMgRGVmYXVsdENvbnRyb2xsZXJcblxuICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAgICMgSW5zdGFuY2UgdmFyaWFibGVzICAgICAgI1xuICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG4gICAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICAgIyBjb25zdHJ1Y3RvciAmIGluaXQgICAgICAjXG4gICAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbiAgICBjb25zdHJ1Y3RvcjogLT5cbiAgICAgIHN1cGVyICRzY29wZSwgJHJvb3RTY29wZVxuXG4gICAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICAgIyBNZXRob2RzICAgICAgICAgICAgICAgICAjXG4gICAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIiwibW9kdWxlID0gYW5ndWxhci5tb2R1bGUgJ2hpZGEnXG5tb2R1bGUuY29udHJvbGxlciAnTWFpbkNvbnRyb2xsZXInLCAoJHNjb3BlLCAkcm9vdFNjb3BlLCAkc3RhdGUpIC0+XG5cbiAgbmV3IGNsYXNzIGV4dGVuZHMgRGVmYXVsdENvbnRyb2xsZXJcblxuICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAgICMgSW5zdGFuY2UgdmFyaWFibGVzICAgICAgI1xuICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG4gICAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICAgIyBjb25zdHJ1Y3RvciAmIGluaXQgICAgICAjXG4gICAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbiAgICBjb25zdHJ1Y3RvcjogLT5cbiAgICAgIHN1cGVyICRzY29wZSwgJHJvb3RTY29wZVxuXG4gICAgICAkc2NvcGUuJHN0YXRlID0gJHN0YXRlXG5cbiAgICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgICAjIE1ldGhvZHMgICAgICAgICAgICAgICAgICNcbiAgICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=