angular.module("hida", ['ui.router', 'inspinia']).config(function($stateProvider, $urlRouterProvider) {
  $stateProvider.state("main", {
    abstract: true,
    templateUrl: "parts/main.html",
    controller: "MainController"
  }).state("main.home", {
    url: "/home",
    templateUrl: "parts/home.html",
    controller: "HomeController"
  }).state("main.export", {
    url: "/export",
    templateUrl: "parts/export.html",
    controller: "ExportController"
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

var module,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module = angular.module('hida');

module.controller('ExportController', function($scope, $rootScope) {
  return new ((function(_super) {
    __extends(_Class, _super);

    function _Class() {
      _Class.__super__.constructor.call(this, $scope, $rootScope);
    }

    return _Class;

  })(DefaultController));
});

var module,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module = angular.module('hida');

module.controller('HomeController', function($scope, $rootScope) {
  return new ((function(_super) {
    __extends(_Class, _super);

    _Class.prototype.ww = 0;

    _Class.prototype.wl = 0;

    function _Class() {
      this.open = __bind(this.open, this);
      this.image = __bind(this.image, this);
      _Class.__super__.constructor.call(this, $scope, $rootScope);
      this.$element = $('.dicom');
      this.element = this.$element[0];
      cornerstone.enable(this.element);
    }

    _Class.prototype.image = function(file) {
      return cornerstone.loadImage('dicomfile:' + file).then((function(_this) {
        return function(image) {
          var viewport;
          cornerstone.displayImage(_this.element, image);
          viewport = cornerstone.getViewport(_this.element);
          _this.ww = viewport.voi.windowWidth;
          _this.wl = viewport.voi.windowCenter;
          return _this.$element.mousedown(function(e) {
            var lastX, lastY;
            lastX = e.pageX;
            lastY = e.pageY;
            $(document).mousemove(function(e) {
              var deltaX, deltaY;
              deltaX = e.pageX - lastX;
              deltaY = e.pageY - lastY;
              lastX = e.pageX;
              lastY = e.pageY;
              viewport = cornerstone.getViewport(_this.element);
              viewport.voi.windowWidth += deltaX / viewport.scale;
              viewport.voi.windowCenter += deltaY / viewport.scale;
              cornerstone.setViewport(_this.element, viewport);
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
    };

    _Class.prototype.open = function() {
      var file, self;
      file = $('#file');
      self = this;
      file.change(function() {
        return self.image($(this).val());
      });
      return file.click();
    };

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uY29mZmVlIiwiY29udHJvbGxlci5jb2ZmZWUiLCJmaWx0ZXJzLmNvZmZlZSIsInBhcnRzL2V4cG9ydC5jb2ZmZWUiLCJwYXJ0cy9ob21lLmNvZmZlZSIsInBhcnRzL2xvZ2luLmNvZmZlZSIsInBhcnRzL21haW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sQ0FBQyxNQUFSLENBQWUsTUFBZixFQUF1QixDQUFFLFdBQUYsRUFBZSxVQUFmLENBQXZCLENBRUEsQ0FBQyxNQUZELENBRVEsU0FBQyxjQUFELEVBQWlCLGtCQUFqQixHQUFBO0FBQ04sRUFBQSxjQUNBLENBQUMsS0FERCxDQUNPLE1BRFAsRUFFRTtBQUFBLElBQUEsUUFBQSxFQUFVLElBQVY7QUFBQSxJQUNBLFdBQUEsRUFBYSxpQkFEYjtBQUFBLElBRUEsVUFBQSxFQUFZLGdCQUZaO0dBRkYsQ0FLQSxDQUFDLEtBTEQsQ0FLTyxXQUxQLEVBTUU7QUFBQSxJQUFBLEdBQUEsRUFBSyxPQUFMO0FBQUEsSUFDQSxXQUFBLEVBQWEsaUJBRGI7QUFBQSxJQUVBLFVBQUEsRUFBWSxnQkFGWjtHQU5GLENBU0EsQ0FBQyxLQVRELENBU08sYUFUUCxFQVVFO0FBQUEsSUFBQSxHQUFBLEVBQUssU0FBTDtBQUFBLElBQ0EsV0FBQSxFQUFhLG1CQURiO0FBQUEsSUFFQSxVQUFBLEVBQVksa0JBRlo7R0FWRixDQWFBLENBQUMsS0FiRCxDQWFPLE9BYlAsRUFjRTtBQUFBLElBQUEsR0FBQSxFQUFLLFFBQUw7QUFBQSxJQUNBLFdBQUEsRUFBYSxrQkFEYjtHQWRGLENBQUEsQ0FBQTtTQWlCQSxrQkFBa0IsQ0FBQyxTQUFuQixDQUE2QixPQUE3QixFQWxCTTtBQUFBLENBRlIsQ0FBQSxDQUFBOztBQ0FBLElBQUEsaUJBQUE7O0FBQUE7QUFFZSxFQUFBLDJCQUFFLEtBQUYsRUFBVSxJQUFWLEdBQUE7QUFDWCxJQURZLElBQUMsQ0FBQSxRQUFBLEtBQ2IsQ0FBQTtBQUFBLElBRG9C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TixDQUFBOztrQkFBQTs7S0FOZ0Isb0JBRmdCO0FBQUEsQ0FBcEMsQ0FEQSxDQUFBOztBQ0FBLElBQUEsTUFBQTtFQUFBO2lTQUFBOztBQUFBLE1BQUEsR0FBUyxPQUFPLENBQUMsTUFBUixDQUFlLE1BQWYsQ0FBVCxDQUFBOztBQUFBLE1BQ00sQ0FBQyxVQUFQLENBQWtCLGlCQUFsQixFQUFxQyxTQUFDLE1BQUQsRUFBUyxVQUFULEdBQUE7U0FFbkMsR0FBQSxDQUFBO0FBVUUsNkJBQUEsQ0FBQTs7QUFBYSxJQUFBLGdCQUFBLEdBQUE7QUFDWCxNQUFBLHdDQUFNLE1BQU4sRUFBYyxVQUFkLENBQUEsQ0FEVztJQUFBLENBQWI7O2tCQUFBOztLQVZnQixvQkFGaUI7QUFBQSxDQUFyQyxDQURBLENBQUE7O0FDQUEsSUFBQSxNQUFBO0VBQUE7aVNBQUE7O0FBQUEsTUFBQSxHQUFTLE9BQU8sQ0FBQyxNQUFSLENBQWUsTUFBZixDQUFULENBQUE7O0FBQUEsTUFDTSxDQUFDLFVBQVAsQ0FBa0IsZ0JBQWxCLEVBQW9DLFNBQUMsTUFBRCxFQUFTLFVBQVQsRUFBcUIsTUFBckIsR0FBQTtTQUVsQyxHQUFBLENBQUE7QUFVRSw2QkFBQSxDQUFBOztBQUFhLElBQUEsZ0JBQUEsR0FBQTtBQUNYLE1BQUEsd0NBQU0sTUFBTixFQUFjLFVBQWQsQ0FBQSxDQUFBO0FBQUEsTUFFQSxNQUFNLENBQUMsTUFBUCxHQUFnQixNQUZoQixDQURXO0lBQUEsQ0FBYjs7a0JBQUE7O0tBVmdCLG9CQUZnQjtBQUFBLENBQXBDLENBREEsQ0FBQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUgXCJoaWRhXCIsIFsgJ3VpLnJvdXRlcicsICdpbnNwaW5pYScgXVxuXG4uY29uZmlnICgkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSAtPlxuICAkc3RhdGVQcm92aWRlclxuICAuc3RhdGUgXCJtYWluXCIsXG4gICAgYWJzdHJhY3Q6IHRydWVcbiAgICB0ZW1wbGF0ZVVybDogXCJwYXJ0cy9tYWluLmh0bWxcIlxuICAgIGNvbnRyb2xsZXI6IFwiTWFpbkNvbnRyb2xsZXJcIlxuICAuc3RhdGUgXCJtYWluLmhvbWVcIixcbiAgICB1cmw6IFwiL2hvbWVcIlxuICAgIHRlbXBsYXRlVXJsOiBcInBhcnRzL2hvbWUuaHRtbFwiXG4gICAgY29udHJvbGxlcjogXCJIb21lQ29udHJvbGxlclwiXG4gIC5zdGF0ZSBcIm1haW4uZXhwb3J0XCIsXG4gICAgdXJsOiBcIi9leHBvcnRcIlxuICAgIHRlbXBsYXRlVXJsOiBcInBhcnRzL2V4cG9ydC5odG1sXCJcbiAgICBjb250cm9sbGVyOiBcIkV4cG9ydENvbnRyb2xsZXJcIlxuICAuc3RhdGUgXCJsb2dpblwiLFxuICAgIHVybDogXCIvbG9naW5cIlxuICAgIHRlbXBsYXRlVXJsOiBcInBhcnRzL2xvZ2luLmh0bWxcIlxuXG4gICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UgXCIvaG9tZVwiIiwiY2xhc3MgRGVmYXVsdENvbnRyb2xsZXJcblxuICBjb25zdHJ1Y3RvcjogKEBzY29wZSwgQHJvb3QpIC0+XG4gICAgQHNjb3BlLnJvb3QgPSBAcm9vdFxuICAgIEBzY29wZS5jdHJsID0gQFxuXG4gICAgQGluaXQoKVxuXG4gICAgQHNjb3BlLiRvbiAnJGRlc3Ryb3knLCBAZGVzdHJveVxuXG4gIGluaXQ6IC0+XG5cbiAgZGVzdHJveTogLT4iLCJtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSAnaGlkYSdcblxubW9kdWxlLmZpbHRlciAnbG9nJywgICAgIC0+IChkYXRhKSAtPiBjb25zb2xlLmxvZyBkYXRhOyBkYXRhXG5tb2R1bGUuZmlsdGVyICdwcmludCcsICAgLT4gKGRhdGEpIC0+IEpTT04uc3RyaW5naWZ5IGRhdGFcblxubW9kdWxlLmZpbHRlciAncmVwbGFjZScsIC0+ICh0ZXh0LCBhLCBiKSAtPiB0ZXh0LnJlcGxhY2UgYSwgYiIsIm1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlICdoaWRhJ1xubW9kdWxlLmNvbnRyb2xsZXIgJ0V4cG9ydENvbnRyb2xsZXInLCAoJHNjb3BlLCAkcm9vdFNjb3BlKSAtPlxuXG4gIG5ldyBjbGFzcyBleHRlbmRzIERlZmF1bHRDb250cm9sbGVyXG5cbiAgICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgICAjIEluc3RhbmNlIHZhcmlhYmxlcyAgICAgICNcbiAgICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAgICMgY29uc3RydWN0b3IgJiBpbml0ICAgICAgI1xuICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG4gICAgY29uc3RydWN0b3I6IC0+XG4gICAgICBzdXBlciAkc2NvcGUsICRyb290U2NvcGVcblxuICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAgICMgTWV0aG9kcyAgICAgICAgICAgICAgICAgI1xuICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyIsIm1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlICdoaWRhJ1xubW9kdWxlLmNvbnRyb2xsZXIgJ0hvbWVDb250cm9sbGVyJywgKCRzY29wZSwgJHJvb3RTY29wZSkgLT5cblxuICBuZXcgY2xhc3MgZXh0ZW5kcyBEZWZhdWx0Q29udHJvbGxlclxuXG4gICAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICAgIyBJbnN0YW5jZSB2YXJpYWJsZXMgICAgICAjXG4gICAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbiAgICB3dzogMFxuICAgIHdsOiAwXG5cbiAgICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgICAjIGNvbnN0cnVjdG9yICYgaW5pdCAgICAgICNcbiAgICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuICAgIGNvbnN0cnVjdG9yOiAtPlxuICAgICAgc3VwZXIgJHNjb3BlLCAkcm9vdFNjb3BlXG5cbiAgICAgIEAkZWxlbWVudCA9ICQoJy5kaWNvbScpXG4gICAgICBAZWxlbWVudCA9IEAkZWxlbWVudFswXVxuXG4gICAgICBjb3JuZXJzdG9uZS5lbmFibGUgQGVsZW1lbnRcblxuICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAgICMgTWV0aG9kcyAgICAgICAgICAgICAgICAgI1xuICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG4gICAgaW1hZ2U6IChmaWxlKSA9PlxuICAgICAgY29ybmVyc3RvbmUubG9hZEltYWdlICdkaWNvbWZpbGU6JyArIGZpbGVcbiAgICAgIC50aGVuIChpbWFnZSkgPT5cbiAgICAgICAgY29ybmVyc3RvbmUuZGlzcGxheUltYWdlIEBlbGVtZW50LCBpbWFnZVxuICAgICAgICB2aWV3cG9ydCA9IGNvcm5lcnN0b25lLmdldFZpZXdwb3J0IEBlbGVtZW50XG5cbiAgICAgICAgQHd3ID0gdmlld3BvcnQudm9pLndpbmRvd1dpZHRoXG4gICAgICAgIEB3bCA9IHZpZXdwb3J0LnZvaS53aW5kb3dDZW50ZXJcblxuICAgICAgICBAJGVsZW1lbnQubW91c2Vkb3duIChlKSA9PlxuICAgICAgICAgIGxhc3RYID0gZS5wYWdlWFxuICAgICAgICAgIGxhc3RZID0gZS5wYWdlWVxuXG4gICAgICAgICAgJChkb2N1bWVudCkubW91c2Vtb3ZlIChlKSA9PlxuICAgICAgICAgICAgZGVsdGFYID0gZS5wYWdlWCAtIGxhc3RYXG4gICAgICAgICAgICBkZWx0YVkgPSBlLnBhZ2VZIC0gbGFzdFlcbiAgICAgICAgICAgIGxhc3RYID0gZS5wYWdlWFxuICAgICAgICAgICAgbGFzdFkgPSBlLnBhZ2VZXG4gICAgICAgICAgICB2aWV3cG9ydCA9IGNvcm5lcnN0b25lLmdldFZpZXdwb3J0KEBlbGVtZW50KVxuICAgICAgICAgICAgdmlld3BvcnQudm9pLndpbmRvd1dpZHRoICs9IChkZWx0YVggLyB2aWV3cG9ydC5zY2FsZSlcbiAgICAgICAgICAgIHZpZXdwb3J0LnZvaS53aW5kb3dDZW50ZXIgKz0gKGRlbHRhWSAvIHZpZXdwb3J0LnNjYWxlKVxuICAgICAgICAgICAgY29ybmVyc3RvbmUuc2V0Vmlld3BvcnQgQGVsZW1lbnQsIHZpZXdwb3J0XG5cbiAgICAgICAgICAgIEB3dyA9IE1hdGgucm91bmQgdmlld3BvcnQudm9pLndpbmRvd1dpZHRoXG4gICAgICAgICAgICBAd2wgPSBNYXRoLnJvdW5kIHZpZXdwb3J0LnZvaS53aW5kb3dDZW50ZXJcbiAgICAgICAgICAgIEBzY29wZS4kYXBwbHkoKVxuXG4gICAgICAgICAgJChkb2N1bWVudCkubW91c2V1cCAoZSkgLT5cbiAgICAgICAgICAgICQoZG9jdW1lbnQpLnVuYmluZCBcIm1vdXNlbW92ZVwiXG4gICAgICAgICAgICAkKGRvY3VtZW50KS51bmJpbmQgXCJtb3VzZXVwXCJcblxuICAgIG9wZW46ID0+XG4gICAgICBmaWxlID0gJCgnI2ZpbGUnKVxuICAgICAgc2VsZiA9IEBcbiAgICAgIGZpbGUuY2hhbmdlIC0+IHNlbGYuaW1hZ2UgJChAKS52YWwoKVxuICAgICAgZmlsZS5jbGljaygpIiwibW9kdWxlID0gYW5ndWxhci5tb2R1bGUgJ2hpZGEnXG5tb2R1bGUuY29udHJvbGxlciAnTG9naW5Db250cm9sbGVyJywgKCRzY29wZSwgJHJvb3RTY29wZSkgLT5cblxuICBuZXcgY2xhc3MgZXh0ZW5kcyBEZWZhdWx0Q29udHJvbGxlclxuXG4gICAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICAgIyBJbnN0YW5jZSB2YXJpYWJsZXMgICAgICAjXG4gICAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbiAgICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgICAjIGNvbnN0cnVjdG9yICYgaW5pdCAgICAgICNcbiAgICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuICAgIGNvbnN0cnVjdG9yOiAtPlxuICAgICAgc3VwZXIgJHNjb3BlLCAkcm9vdFNjb3BlXG5cbiAgICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgICAjIE1ldGhvZHMgICAgICAgICAgICAgICAgICNcbiAgICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMiLCJtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSAnaGlkYSdcbm1vZHVsZS5jb250cm9sbGVyICdNYWluQ29udHJvbGxlcicsICgkc2NvcGUsICRyb290U2NvcGUsICRzdGF0ZSkgLT5cblxuICBuZXcgY2xhc3MgZXh0ZW5kcyBEZWZhdWx0Q29udHJvbGxlclxuXG4gICAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICAgIyBJbnN0YW5jZSB2YXJpYWJsZXMgICAgICAjXG4gICAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbiAgICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgICAjIGNvbnN0cnVjdG9yICYgaW5pdCAgICAgICNcbiAgICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuICAgIGNvbnN0cnVjdG9yOiAtPlxuICAgICAgc3VwZXIgJHNjb3BlLCAkcm9vdFNjb3BlXG5cbiAgICAgICRzY29wZS4kc3RhdGUgPSAkc3RhdGVcblxuICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAgICMgTWV0aG9kcyAgICAgICAgICAgICAgICAgI1xuICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==