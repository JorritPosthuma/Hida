angular.module("hida", ['ui.router', 'ui.bootstrap']).config(function($stateProvider, $urlRouterProvider) {
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

var DicomFileReader, color_interpretations,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

color_interpretations = ["RGB", "PALETTE COLOR", "YBR_FULL", "YBR_FULL_422", "YBR_PARTIAL_422", "YBR_PARTIAL_420", "YBR_RCT"];

DicomFileReader = (function() {
  var frames;

  frames = [];

  function DicomFileReader(path) {
    this.path = path;
    this.get = __bind(this.get, this);
    this._load = __bind(this._load, this);
    this._metadata = __bind(this._metadata, this);
    this._read = __bind(this._read, this);
    this.isColorImage = __bind(this.isColorImage, this);
    this.fs = require("fs");
    this._read();
    this._metadata();
    this._load();
  }

  DicomFileReader.prototype.isColorImage = function(color) {};

  DicomFileReader.prototype._read = function() {
    var buffer;
    buffer = this.fs.readFileSync(this.path);
    return this.dataSet = dicomParser.parseDicom(new Uint8Array(buffer));
  };

  DicomFileReader.prototype._metadata = function() {
    this.framecount = this.dataSet.string("x00280008") || 1;
    this.color_int = this.dataSet.string("x00280004");
    return this.is_color = -1 !== color_interpretations.indexOf(this.color_int);
  };

  DicomFileReader.prototype._load = function() {
    var frame_id, method;
    method = this.is_color ? cornerstoneWADOImageLoader.makeColorImage : cornerstoneWADOImageLoader.makeGrayscaleImage;
    return this.frames = (function() {
      var _i, _ref, _results;
      _results = [];
      for (frame_id = _i = 0, _ref = this.framecount - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; frame_id = 0 <= _ref ? ++_i : --_i) {
        _results.push(method("" + this.path + "_" + frame_id, this.dataSet, this.dataSet.byteArray, this.color_int, frame_id));
      }
      return _results;
    }).call(this);
  };

  DicomFileReader.prototype.get = function(frame) {
    return this.frames[frame - 1];
  };

  return DicomFileReader;

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
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module = angular.module('hida');

module.controller('HomeController', function($scope, $rootScope, $timeout) {
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
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module = angular.module('hida');

module.controller('MainController', function($scope, $rootScope, $state) {
  return new ((function(_super) {
    __extends(_Class, _super);

    function _Class() {
      this.open = __bind(this.open, this);
      _Class.__super__.constructor.call(this, $scope, $rootScope);
      $scope.$state = $state;
    }

    _Class.prototype.open = function() {
      var file, self;
      file = $('#file');
      self = this;
      file.change(function() {
        return self.image($(this).val());
      });
      file.click();
      return false;
    };

    return _Class;

  })(DefaultController));
});

var module,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module = angular.module('hida');

module.directive('dicom', function() {
  return {
    restrict: 'E',
    scope: {
      path: '='
    },
    templateUrl: "parts/directives/dicom.html",
    link: function(scope, element, attrs, ctrl, b) {
      return scope.ctrl.link(element);
    },
    controller: function($scope, $rootScope, $timeout) {
      return new ((function(_super) {
        __extends(_Class, _super);

        _Class.prototype.ww = 0;

        _Class.prototype.wl = 0;

        _Class.prototype.frames = 1;

        _Class.prototype.color = 'No color';

        _Class.prototype.frame = 1;

        _Class.prototype.scroll = 0;

        function _Class() {
          this.resize = __bind(this.resize, this);
          this.show = __bind(this.show, this);
          this.image = __bind(this.image, this);
          this.register = __bind(this.register, this);
          this.loaded = __bind(this.loaded, this);
          this._link = __bind(this._link, this);
          this.link = __bind(this.link, this);
          _Class.__super__.constructor.call(this, $scope, $rootScope);
        }

        _Class.prototype.link = function($element) {
          this.$element = $element;
          return $timeout(this._link, 0, false);
        };

        _Class.prototype._link = function() {
          this.element = this.$element[0];
          this.$document = $(document);
          this.resize();
          $(window).resize(this.resize);
          cornerstone.enable(this.element);
          this.register();
          this.image("/Users/Jorrit/Development/Hida Private/Patientdata/ANONHBSAMCHERMES1/HIDASPECTFASE2RECONSCAC/1.2.752.37.1.1.3407820023.6.166606720130905");
          this.viewport.voi.windowWidth = 185;
          this.viewport.voi.windowCenter = 84;
          return cornerstone.setViewport(this.element, this.viewport);
        };

        _Class.prototype.loaded = function() {
          return this.viewport != null;
        };

        _Class.prototype.register = function() {
          this.$element.bind('mousewheel', (function(_this) {
            return function(e) {
              var direction;
              e.preventDefault();
              if (!_this.loaded()) {
                return;
              }
              direction = e.originalEvent.wheelDelta;
              if (direction < 0) {
                if (_this.frame > 1) {
                  _this.frame = _this.frame - 1;
                  return _this.show();
                }
              } else {
                if (_this.frame < _this.frames) {
                  _this.frame = _this.frame + 1;
                  return _this.show();
                }
              }
            };
          })(this));
          return this.$element.mousedown((function(_this) {
            return function(e) {
              var lastX, lastY;
              if (!_this.loaded()) {
                return;
              }
              lastX = e.pageX;
              lastY = e.pageY;
              _this.$document.mousemove(function(e) {
                var deltaX, deltaY;
                deltaX = e.pageX - lastX;
                deltaY = e.pageY - lastY;
                lastX = e.pageX;
                lastY = e.pageY;
                _this.viewport.voi.windowWidth += deltaX / _this.viewport.scale;
                _this.viewport.voi.windowCenter += deltaY / _this.viewport.scale;
                cornerstone.setViewport(_this.element, _this.viewport);
                _this.ww = Math.round(_this.viewport.voi.windowWidth);
                _this.wl = Math.round(_this.viewport.voi.windowCenter);
                return _this.scope.$apply();
              });
              return _this.$document.mouseup(function(e) {
                _this.$document.unbind("mousemove");
                return _this.$document.unbind("mouseup");
              });
            };
          })(this));
        };

        _Class.prototype.image = function(file) {
          this.reader = new DicomFileReader(file);
          return this.show();
        };

        _Class.prototype.show = function() {
          return this.reader.get(this.frame).then((function(_this) {
            return function(image) {
              cornerstone.displayImage(_this.element, image);
              _this.viewport = cornerstone.getViewport(_this.element);
              _this.ww = _this.viewport.voi.windowWidth;
              _this.wl = _this.viewport.voi.windowCenter;
              _this.color = _this.reader.color_int;
              _this.frames = _this.reader.framecount;
              return _this.scope.$apply();
            };
          })(this));
        };

        _Class.prototype.resize = function() {
          if (this.loaded()) {
            return cornerstone.resize(this.element, true);
          }
        };

        return _Class;

      })(DefaultController));
    }
  };
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uY29mZmVlIiwiY29udHJvbGxlci5jb2ZmZWUiLCJkaWNvbS5jb2ZmZWUiLCJmaWx0ZXJzLmNvZmZlZSIsInBhcnRzL2V4cG9ydC5jb2ZmZWUiLCJwYXJ0cy9ob21lLmNvZmZlZSIsInBhcnRzL2xvZ2luLmNvZmZlZSIsInBhcnRzL21haW4uY29mZmVlIiwicGFydHMvZGlyZWN0aXZlcy9kaWNvbS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxDQUFDLE1BQVIsQ0FBZSxNQUFmLEVBQXVCLENBQUUsV0FBRixFQUFlLGNBQWYsQ0FBdkIsQ0FFQSxDQUFDLE1BRkQsQ0FFUSxTQUFDLGNBQUQsRUFBaUIsa0JBQWpCLEdBQUE7QUFDTixFQUFBLGNBQ0EsQ0FBQyxLQURELENBQ08sTUFEUCxFQUVFO0FBQUEsSUFBQSxRQUFBLEVBQVUsSUFBVjtBQUFBLElBQ0EsV0FBQSxFQUFhLGlCQURiO0FBQUEsSUFFQSxVQUFBLEVBQVksZ0JBRlo7R0FGRixDQUtBLENBQUMsS0FMRCxDQUtPLFdBTFAsRUFNRTtBQUFBLElBQUEsR0FBQSxFQUFLLE9BQUw7QUFBQSxJQUNBLFdBQUEsRUFBYSxpQkFEYjtBQUFBLElBRUEsVUFBQSxFQUFZLGdCQUZaO0dBTkYsQ0FTQSxDQUFDLEtBVEQsQ0FTTyxhQVRQLEVBVUU7QUFBQSxJQUFBLEdBQUEsRUFBSyxTQUFMO0FBQUEsSUFDQSxXQUFBLEVBQWEsbUJBRGI7QUFBQSxJQUVBLFVBQUEsRUFBWSxrQkFGWjtHQVZGLENBYUEsQ0FBQyxLQWJELENBYU8sT0FiUCxFQWNFO0FBQUEsSUFBQSxHQUFBLEVBQUssUUFBTDtBQUFBLElBQ0EsV0FBQSxFQUFhLGtCQURiO0dBZEYsQ0FBQSxDQUFBO1NBaUJBLGtCQUFrQixDQUFDLFNBQW5CLENBQTZCLE9BQTdCLEVBbEJNO0FBQUEsQ0FGUixDQUFBLENBQUE7O0FDQUEsSUFBQSxpQkFBQTs7QUFBQTtBQUVlLEVBQUEsMkJBQUUsS0FBRixFQUFVLElBQVYsR0FB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QVcsQ0FBQyxXQUFaLENBQXdCLEtBQUMsQ0FBQSxPQUF6QixDQURaLENBQUE7QUFBQSxjQUtBLEtBQUMsQ0FBQSxFQUFELEdBQU0sS0FBQyxDQUFBLFFBQVEsQ0FBQyxHQUFHLENBQUMsV0FMcEIsQ0FBQTtBQUFBLGNBTUEsS0FBQyxDQUFBLEVBQUQsR0FBTSxLQUFDLENBQUEsUUFBUSxDQUFDLEdBQUcsQ0FBQyxZQU5wQixDQUFBO0FBQUEsY0FPQSxLQUFDLENBQUEsS0FBRCxHQUFTLEtBQUMsQ0FBQSxNQUFNLENBQUMsU0FQakIsQ0FBQTtBQUFBLGNBUUEsS0FBQyxDQUFBLE1BQUQsR0FBVSxLQUFDLENBQUEsTUFBTSxDQUFDLFVBUmxCLENBQUE7cUJBU0EsS0FBQyxDQUFBLEtBQUssQ0FBQyxNQUFQLENBQUEsRUFWSTtZQUFBLEVBQUE7VUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRE4sRUFESTtRQUFBLENBbEZOLENBQUE7O0FBQUEseUJBZ0dBLE1BQUEsR0FBUSxTQUFBLEdBQUE7QUFDTixVQUFBLElBQXFDLElBQUMsQ0FBQSxNQUFELENBQUEsQ0FBckM7bUJBQUEsV0FBVyxDQUFDLE1BQVosQ0FBbUIsSUFBQyxDQUFBLE9BQXBCLEVBQTZCLElBQTdCLEVBQUE7V0FETTtRQUFBLENBaEdSLENBQUE7O3NCQUFBOztTQU5nQixvQkFGUjtJQUFBLENBTFo7SUFEd0I7QUFBQSxDQUExQixDQUZBLENBQUEiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImFuZ3VsYXIubW9kdWxlIFwiaGlkYVwiLCBbICd1aS5yb3V0ZXInLCAndWkuYm9vdHN0cmFwJyBdXG5cbi5jb25maWcgKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIC0+XG4gICRzdGF0ZVByb3ZpZGVyXG4gIC5zdGF0ZSBcIm1haW5cIixcbiAgICBhYnN0cmFjdDogdHJ1ZVxuICAgIHRlbXBsYXRlVXJsOiBcInBhcnRzL21haW4uaHRtbFwiXG4gICAgY29udHJvbGxlcjogXCJNYWluQ29udHJvbGxlclwiXG4gIC5zdGF0ZSBcIm1haW4uaG9tZVwiLFxuICAgIHVybDogXCIvaG9tZVwiXG4gICAgdGVtcGxhdGVVcmw6IFwicGFydHMvaG9tZS5odG1sXCJcbiAgICBjb250cm9sbGVyOiBcIkhvbWVDb250cm9sbGVyXCJcbiAgLnN0YXRlIFwibWFpbi5leHBvcnRcIixcbiAgICB1cmw6IFwiL2V4cG9ydFwiXG4gICAgdGVtcGxhdGVVcmw6IFwicGFydHMvZXhwb3J0Lmh0bWxcIlxuICAgIGNvbnRyb2xsZXI6IFwiRXhwb3J0Q29udHJvbGxlclwiXG4gIC5zdGF0ZSBcImxvZ2luXCIsXG4gICAgdXJsOiBcIi9sb2dpblwiXG4gICAgdGVtcGxhdGVVcmw6IFwicGFydHMvbG9naW4uaHRtbFwiXG5cbiAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSBcIi9ob21lXCIiLCJjbGFzcyBEZWZhdWx0Q29udHJvbGxlclxuXG4gIGNvbnN0cnVjdG9yOiAoQHNjb3BlLCBAcm9vdCkgLT5cbiAgICBAc2NvcGUucm9vdCA9IEByb290XG4gICAgQHNjb3BlLmN0cmwgPSBAXG5cbiAgICBAaW5pdCgpXG5cbiAgICBAc2NvcGUuJG9uICckZGVzdHJveScsIEBkZXN0cm95XG5cbiAgaW5pdDogLT5cblxuICBkZXN0cm95OiAtPiIsImNvbG9yX2ludGVycHJldGF0aW9ucyA9IFtcbiAgXCJSR0JcIlxuICBcIlBBTEVUVEUgQ09MT1JcIiBcbiAgXCJZQlJfRlVMTFwiIFxuICBcIllCUl9GVUxMXzQyMlwiXG4gIFwiWUJSX1BBUlRJQUxfNDIyXCIgXG4gIFwiWUJSX1BBUlRJQUxfNDIwXCIgXG4gIFwiWUJSX1JDVFwiXG5dXG5cbmNsYXNzIERpY29tRmlsZVJlYWRlclxuXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAjIEluc3RhbmNlIHZhcmlhYmxlcyAgICAgICNcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbiAgZnJhbWVzID0gW11cblxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgIyBDb25zdHJ1Y3RvciAgICAgICAgICAgICAjXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG4gIGNvbnN0cnVjdG9yOiAoQHBhdGgpIC0+XG4gICAgQGZzID0gcmVxdWlyZSBcImZzXCJcblxuICAgIEBfcmVhZCgpXG4gICAgQF9tZXRhZGF0YSgpXG4gICAgQF9sb2FkKClcblxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgIyBNZXRob2RzICAgICAgICAgICAgICAgICAjXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG4gIGlzQ29sb3JJbWFnZTogKGNvbG9yKSA9PiBcblxuICBfcmVhZDogPT5cbiAgICBidWZmZXIgID0gQGZzLnJlYWRGaWxlU3luYyBAcGF0aFxuICAgIEBkYXRhU2V0ID0gZGljb21QYXJzZXIucGFyc2VEaWNvbSBuZXcgVWludDhBcnJheSBidWZmZXJcblxuICBfbWV0YWRhdGE6ID0+XG4gICAgQGZyYW1lY291bnQgPSBAZGF0YVNldC5zdHJpbmcoXCJ4MDAyODAwMDhcIikgfHwgMVxuICAgIEBjb2xvcl9pbnQgID0gQGRhdGFTZXQuc3RyaW5nKFwieDAwMjgwMDA0XCIpXG4gICAgQGlzX2NvbG9yICAgPSAtMSBpc250IGNvbG9yX2ludGVycHJldGF0aW9ucy5pbmRleE9mIEBjb2xvcl9pbnRcblxuICBfbG9hZDogPT5cbiAgICBtZXRob2QgPSBpZiBAaXNfY29sb3JcbiAgICB0aGVuIGNvcm5lcnN0b25lV0FET0ltYWdlTG9hZGVyLm1ha2VDb2xvckltYWdlXG4gICAgZWxzZSBjb3JuZXJzdG9uZVdBRE9JbWFnZUxvYWRlci5tYWtlR3JheXNjYWxlSW1hZ2VcblxuICAgIEBmcmFtZXMgPSBmb3IgZnJhbWVfaWQgaW4gWzAuLkBmcmFtZWNvdW50IC0gMV1cbiAgICAgIG1ldGhvZCBcIiN7QHBhdGh9XyN7ZnJhbWVfaWR9XCIsIEBkYXRhU2V0LCBAZGF0YVNldC5ieXRlQXJyYXksIEBjb2xvcl9pbnQsIGZyYW1lX2lkXG5cbiAgZ2V0OiAoZnJhbWUpID0+IEBmcmFtZXNbZnJhbWUgLSAxXSIsIm1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlICdoaWRhJ1xuXG5tb2R1bGUuZmlsdGVyICdsb2cnLCAgICAgLT4gKGRhdGEpIC0+IGNvbnNvbGUubG9nIGRhdGE7IGRhdGFcbm1vZHVsZS5maWx0ZXIgJ3ByaW50JywgICAtPiAoZGF0YSkgLT4gSlNPTi5zdHJpbmdpZnkgZGF0YVxuXG5tb2R1bGUuZmlsdGVyICdyZXBsYWNlJywgLT4gKHRleHQsIGEsIGIpIC0+IHRleHQucmVwbGFjZSBhLCBiIiwibW9kdWxlID0gYW5ndWxhci5tb2R1bGUgJ2hpZGEnXG5tb2R1bGUuY29udHJvbGxlciAnRXhwb3J0Q29udHJvbGxlcicsICgkc2NvcGUsICRyb290U2NvcGUpIC0+XG5cbiAgbmV3IGNsYXNzIGV4dGVuZHMgRGVmYXVsdENvbnRyb2xsZXJcblxuICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAgICMgSW5zdGFuY2UgdmFyaWFibGVzICAgICAgI1xuICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG4gICAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICAgIyBjb25zdHJ1Y3RvciAmIGluaXQgICAgICAjXG4gICAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbiAgICBjb25zdHJ1Y3RvcjogLT5cbiAgICAgIHN1cGVyICRzY29wZSwgJHJvb3RTY29wZVxuXG4gICAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICAgIyBNZXRob2RzICAgICAgICAgICAgICAgICAjXG4gICAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIiwibW9kdWxlID0gYW5ndWxhci5tb2R1bGUgJ2hpZGEnXG5tb2R1bGUuY29udHJvbGxlciAnSG9tZUNvbnRyb2xsZXInLCAoJHNjb3BlLCAkcm9vdFNjb3BlLCAkdGltZW91dCkgLT5cblxuICBuZXcgY2xhc3MgZXh0ZW5kcyBEZWZhdWx0Q29udHJvbGxlclxuXG4gICAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICAgIyBJbnN0YW5jZSB2YXJpYWJsZXMgICAgICAjXG4gICAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbiAgICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgICAjIGNvbnN0cnVjdG9yICAgICAgICAgICAgICNcbiAgICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuICAgIGNvbnN0cnVjdG9yOiAtPlxuICAgICAgc3VwZXIgJHNjb3BlLCAkcm9vdFNjb3BlXG5cbiAgICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgICAjIE1ldGhvZHMgICAgICAgICAgICAgICAgICNcbiAgICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMiLCJtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSAnaGlkYSdcbm1vZHVsZS5jb250cm9sbGVyICdMb2dpbkNvbnRyb2xsZXInLCAoJHNjb3BlLCAkcm9vdFNjb3BlKSAtPlxuXG4gIG5ldyBjbGFzcyBleHRlbmRzIERlZmF1bHRDb250cm9sbGVyXG5cbiAgICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgICAjIEluc3RhbmNlIHZhcmlhYmxlcyAgICAgICNcbiAgICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAgICMgY29uc3RydWN0b3IgJiBpbml0ICAgICAgI1xuICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG4gICAgY29uc3RydWN0b3I6IC0+XG4gICAgICBzdXBlciAkc2NvcGUsICRyb290U2NvcGVcblxuICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAgICMgTWV0aG9kcyAgICAgICAgICAgICAgICAgI1xuICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyIsIm1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlICdoaWRhJ1xubW9kdWxlLmNvbnRyb2xsZXIgJ01haW5Db250cm9sbGVyJywgKCRzY29wZSwgJHJvb3RTY29wZSwgJHN0YXRlKSAtPlxuXG4gIG5ldyBjbGFzcyBleHRlbmRzIERlZmF1bHRDb250cm9sbGVyXG5cbiAgICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgICAjIEluc3RhbmNlIHZhcmlhYmxlcyAgICAgICNcbiAgICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAgICMgY29uc3RydWN0b3IgJiBpbml0ICAgICAgI1xuICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG4gICAgY29uc3RydWN0b3I6IC0+XG4gICAgICBzdXBlciAkc2NvcGUsICRyb290U2NvcGVcblxuICAgICAgJHNjb3BlLiRzdGF0ZSA9ICRzdGF0ZVxuXG4gICAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICAgIyBNZXRob2RzICAgICAgICAgICAgICAgICAjXG4gICAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbiAgICBvcGVuOiA9PlxuICAgICAgZmlsZSA9ICQoJyNmaWxlJylcbiAgICAgIHNlbGYgPSBAXG4gICAgICBmaWxlLmNoYW5nZSAtPiBzZWxmLmltYWdlICQoQCkudmFsKClcbiAgICAgIGZpbGUuY2xpY2soKVxuICAgICAgcmV0dXJuIGZhbHNlIiwibW9kdWxlID0gYW5ndWxhci5tb2R1bGUgJ2hpZGEnXG5cbm1vZHVsZS5kaXJlY3RpdmUgJ2RpY29tJywgLT5cbiAgcmVzdHJpY3Q6ICdFJ1xuICBzY29wZTogXG4gICAgcGF0aDogJz0nXG4gIHRlbXBsYXRlVXJsOiBcInBhcnRzL2RpcmVjdGl2ZXMvZGljb20uaHRtbFwiXG4gIGxpbms6IChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGN0cmwsIGIpIC0+IHNjb3BlLmN0cmwubGluayBlbGVtZW50XG4gIGNvbnRyb2xsZXI6ICgkc2NvcGUsICRyb290U2NvcGUsICR0aW1lb3V0KSAtPlxuXG4gICAgbmV3IGNsYXNzIGV4dGVuZHMgRGVmYXVsdENvbnRyb2xsZXJcblxuICAgICAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICAgICAjIEluc3RhbmNlIHZhcmlhYmxlcyAgICAgICNcbiAgICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG4gICAgICB3dzogMFxuICAgICAgd2w6IDBcbiAgICAgIGZyYW1lczogMVxuICAgICAgY29sb3I6ICdObyBjb2xvcidcblxuICAgICAgZnJhbWU6IDFcbiAgICAgIHNjcm9sbDogMFxuXG4gICAgICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgICAgICMgQ29uc3RydWN0b3IgJiBpbml0ICAgICAgI1xuICAgICAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbiAgICAgIGNvbnN0cnVjdG9yOiAtPlxuICAgICAgICBzdXBlciAkc2NvcGUsICRyb290U2NvcGVcblxuICAgICAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICAgICAjIE1ldGhvZHMgICAgICAgICAgICAgICAgICNcbiAgICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG4gICAgICBsaW5rOiAoQCRlbGVtZW50KSA9PlxuICAgICAgICAkdGltZW91dCBAX2xpbmssIDAsIGZhbHNlXG5cbiAgICAgIF9saW5rOiA9PlxuICAgICAgICBAZWxlbWVudCAgICA9IEAkZWxlbWVudFswXVxuICAgICAgICBAJGRvY3VtZW50ICA9ICQoZG9jdW1lbnQpXG5cbiAgICAgICAgQHJlc2l6ZSgpXG4gICAgICAgICQod2luZG93KS5yZXNpemUgQHJlc2l6ZVxuXG4gICAgICAgIGNvcm5lcnN0b25lLmVuYWJsZSBAZWxlbWVudFxuICAgICAgICBAcmVnaXN0ZXIoKVxuXG4gICAgICAgIEBpbWFnZSBcIi9Vc2Vycy9Kb3JyaXQvRGV2ZWxvcG1lbnQvSGlkYSBQcml2YXRlL1BhdGllbnRkYXRhL0FOT05IQlNBTUNIRVJNRVMxL0hJREFTUEVDVEZBU0UyUkVDT05TQ0FDLzEuMi43NTIuMzcuMS4xLjM0MDc4MjAwMjMuNi4xNjY2MDY3MjAxMzA5MDVcIlxuICAgICAgICBAdmlld3BvcnQudm9pLndpbmRvd1dpZHRoID0gMTg1XG4gICAgICAgIEB2aWV3cG9ydC52b2kud2luZG93Q2VudGVyID0gODRcbiAgICAgICAgY29ybmVyc3RvbmUuc2V0Vmlld3BvcnQgQGVsZW1lbnQsIEB2aWV3cG9ydCAgICAgICAgXG5cbiAgICAgIGxvYWRlZDogPT4gQHZpZXdwb3J0P1xuXG4gICAgICByZWdpc3RlcjogPT5cbiAgICAgICAgQCRlbGVtZW50LmJpbmQgJ21vdXNld2hlZWwnLCAoZSkgPT5cbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICByZXR1cm4gaWYgbm90IEBsb2FkZWQoKVxuXG4gICAgICAgICAgZGlyZWN0aW9uID0gZS5vcmlnaW5hbEV2ZW50LndoZWVsRGVsdGFcblxuICAgICAgICAgIGlmIGRpcmVjdGlvbiA8IDBcbiAgICAgICAgICAgIGlmIEBmcmFtZSA+IDFcbiAgICAgICAgICAgICAgQGZyYW1lID0gQGZyYW1lIC0gMVxuICAgICAgICAgICAgICBAc2hvdygpXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgaWYgQGZyYW1lIDwgQGZyYW1lc1xuICAgICAgICAgICAgICBAZnJhbWUgPSBAZnJhbWUgKyAxXG4gICAgICAgICAgICAgIEBzaG93KClcblxuICAgICAgICBAJGVsZW1lbnQubW91c2Vkb3duIChlKSA9PlxuICAgICAgICAgIHJldHVybiBpZiBub3QgQGxvYWRlZCgpXG5cbiAgICAgICAgICBsYXN0WCA9IGUucGFnZVhcbiAgICAgICAgICBsYXN0WSA9IGUucGFnZVlcblxuICAgICAgICAgIEAkZG9jdW1lbnQubW91c2Vtb3ZlIChlKSA9PlxuICAgICAgICAgICAgZGVsdGFYID0gZS5wYWdlWCAtIGxhc3RYXG4gICAgICAgICAgICBkZWx0YVkgPSBlLnBhZ2VZIC0gbGFzdFlcbiAgICAgICAgICAgIGxhc3RYID0gZS5wYWdlWFxuICAgICAgICAgICAgbGFzdFkgPSBlLnBhZ2VZXG4gICAgICAgICAgICBAdmlld3BvcnQudm9pLndpbmRvd1dpZHRoICs9IGRlbHRhWCAvIEB2aWV3cG9ydC5zY2FsZVxuICAgICAgICAgICAgQHZpZXdwb3J0LnZvaS53aW5kb3dDZW50ZXIgKz0gZGVsdGFZIC8gQHZpZXdwb3J0LnNjYWxlXG4gICAgICAgICAgICBjb3JuZXJzdG9uZS5zZXRWaWV3cG9ydCBAZWxlbWVudCwgQHZpZXdwb3J0XG5cbiAgICAgICAgICAgIEB3dyA9IE1hdGgucm91bmQgQHZpZXdwb3J0LnZvaS53aW5kb3dXaWR0aFxuICAgICAgICAgICAgQHdsID0gTWF0aC5yb3VuZCBAdmlld3BvcnQudm9pLndpbmRvd0NlbnRlclxuICAgICAgICAgICAgQHNjb3BlLiRhcHBseSgpXG5cbiAgICAgICAgICBAJGRvY3VtZW50Lm1vdXNldXAgKGUpID0+XG4gICAgICAgICAgICBAJGRvY3VtZW50LnVuYmluZCBcIm1vdXNlbW92ZVwiXG4gICAgICAgICAgICBAJGRvY3VtZW50LnVuYmluZCBcIm1vdXNldXBcIlxuXG4gICAgICBpbWFnZTogKGZpbGUpID0+XG4gICAgICAgIEByZWFkZXIgPSBuZXcgRGljb21GaWxlUmVhZGVyIGZpbGVcbiAgICAgICAgQHNob3coKVxuXG4gICAgICBzaG93OiA9PlxuICAgICAgICBAcmVhZGVyLmdldCBAZnJhbWVcbiAgICAgICAgLnRoZW4gKGltYWdlKSA9PlxuICAgICAgICAgIGNvcm5lcnN0b25lLmRpc3BsYXlJbWFnZSBAZWxlbWVudCwgaW1hZ2VcbiAgICAgICAgICBAdmlld3BvcnQgPSBjb3JuZXJzdG9uZS5nZXRWaWV3cG9ydCBAZWxlbWVudFxuXG4gICAgICAgICAgIyBjb25zb2xlLmluZm8gY29ybmVyc3RvbmVcblxuICAgICAgICAgIEB3dyA9IEB2aWV3cG9ydC52b2kud2luZG93V2lkdGhcbiAgICAgICAgICBAd2wgPSBAdmlld3BvcnQudm9pLndpbmRvd0NlbnRlclxuICAgICAgICAgIEBjb2xvciA9IEByZWFkZXIuY29sb3JfaW50XG4gICAgICAgICAgQGZyYW1lcyA9IEByZWFkZXIuZnJhbWVjb3VudFxuICAgICAgICAgIEBzY29wZS4kYXBwbHkoKVxuXG4gICAgICByZXNpemU6ID0+XG4gICAgICAgIGNvcm5lcnN0b25lLnJlc2l6ZSBAZWxlbWVudCwgdHJ1ZSBpZiBAbG9hZGVkKCkiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=