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

        _Class.prototype.scroll_speed = 100;

        _Class.prototype.scroll_cumulative = 0;

        function _Class() {
          this.resize = __bind(this.resize, this);
          this.show = __bind(this.show, this);
          this.image = __bind(this.image, this);
          this.register = __bind(this.register, this);
          this.loaded = __bind(this.loaded, this);
          this.link = __bind(this.link, this);
          _Class.__super__.constructor.call(this, $scope, $rootScope);
        }

        _Class.prototype.link = function($element) {
          this.$element = $element;
          this.element = this.$element[0];
          this.$document = $(document);
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
              var direction, steps;
              e.preventDefault();
              if (!_this.loaded()) {
                return;
              }
              direction = e.originalEvent.wheelDelta;
              if (direction > 0) {
                if (_this.scroll_cumulative < 0) {
                  _this.scroll_cumulative = 0;
                }
              } else {
                if (_this.scroll_cumulative > 0) {
                  _this.scroll_cumulative = 0;
                }
              }
              _this.scroll_cumulative = _this.scroll_cumulative + direction;
              steps = Math.floor(Math.abs(_this.scroll_cumulative) / _this.scroll_speed);
              if (steps !== 0) {
                _this.scroll_cumulative = _this.scroll_cumulative % _this.scroll_speed;
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uY29mZmVlIiwiY29udHJvbGxlci5jb2ZmZWUiLCJkaWNvbS5jb2ZmZWUiLCJmaWx0ZXJzLmNvZmZlZSIsInBhcnRzL2V4cG9ydC5jb2ZmZWUiLCJwYXJ0cy9ob21lLmNvZmZlZSIsInBhcnRzL2xvZ2luLmNvZmZlZSIsInBhcnRzL21haW4uY29mZmVlIiwicGFydHMvZGlyZWN0aXZlcy9kaWNvbS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxDQUFDLE1BQVIsQ0FBZSxNQUFmLEVBQXVCLENBQUUsV0FBRixFQUFlLGNBQWYsQ0FBdkIsQ0FFQSxDQUFDLE1BRkQsQ0FFUSxTQUFDLGNBQUQsRUFBaUIsa0JBQWpCLEdBQUE7QUFDTixFQUFBLGNBQ0EsQ0FBQyxLQURELENBQ08sTUFEUCxFQUVFO0FBQUEsSUFBQSxRQUFBLEVBQVUsSUFBVjtBQUFBLElBQ0EsV0FBQSxFQUFhLGlCQURiO0FBQUEsSUFFQSxVQUFBLEVBQVksZ0JBRlo7R0FGRixDQUtBLENBQUMsS0FMRCxDQUtPLFdBTFAsRUFNRTtBQUFBLElBQUEsR0FBQSxFQUFLLE9BQUw7QUFBQSxJQUNBLFdBQUEsRUFBYSxpQkFEYjtBQUFBLElBRUEsVUFBQSxFQUFZLGdCQUZaO0dBTkYsQ0FTQSxDQUFDLEtBVEQsQ0FTTyxhQVRQLEVBVUU7QUFBQSxJQUFBLEdBQUEsRUFBSyxTQUFMO0FBQUEsSUFDQSxXQUFBLEVBQWEsbUJBRGI7QUFBQSxJQUVBLFVBQUEsRUFBWSxrQkFGWjtHQVZGLENBYUEsQ0FBQyxLQWJELENBYU8sT0FiUCxFQWNFO0FBQUEsSUFBQSxHQUFBLEVBQUssUUFBTDtBQUFBLElBQ0EsV0FBQSxFQUFhLGtCQURiO0dBZEYsQ0FBQSxDQUFBO1NBaUJBLGtCQUFrQixDQUFDLFNBQW5CLENBQTZCLE9BQTdCLEVBbEJNO0FBQUEsQ0FGUixDQUFBLENBQUE7O0FDQUEsSUFBQSxpQkFBQTs7QUFBQTtBQUVlLEVBQUEsMkJBQUUsS0FBRixFQUFVLElBQVYsR0FB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LE1BQUQsQ0FBQSxDQUFyQzttQkFBQSxXQUFXLENBQUMsTUFBWixDQUFtQixJQUFDLENBQUEsT0FBcEIsRUFBNkIsSUFBN0IsRUFBQTtXQURNO1FBQUEsQ0E3R1IsQ0FBQTs7c0JBQUE7O1NBTmdCLG9CQUZSO0lBQUEsQ0FMWjtJQUR3QjtBQUFBLENBQTFCLENBRkEsQ0FBQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUgXCJoaWRhXCIsIFsgJ3VpLnJvdXRlcicsICd1aS5ib290c3RyYXAnIF1cblxuLmNvbmZpZyAoJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikgLT5cbiAgJHN0YXRlUHJvdmlkZXJcbiAgLnN0YXRlIFwibWFpblwiLFxuICAgIGFic3RyYWN0OiB0cnVlXG4gICAgdGVtcGxhdGVVcmw6IFwicGFydHMvbWFpbi5odG1sXCJcbiAgICBjb250cm9sbGVyOiBcIk1haW5Db250cm9sbGVyXCJcbiAgLnN0YXRlIFwibWFpbi5ob21lXCIsXG4gICAgdXJsOiBcIi9ob21lXCJcbiAgICB0ZW1wbGF0ZVVybDogXCJwYXJ0cy9ob21lLmh0bWxcIlxuICAgIGNvbnRyb2xsZXI6IFwiSG9tZUNvbnRyb2xsZXJcIlxuICAuc3RhdGUgXCJtYWluLmV4cG9ydFwiLFxuICAgIHVybDogXCIvZXhwb3J0XCJcbiAgICB0ZW1wbGF0ZVVybDogXCJwYXJ0cy9leHBvcnQuaHRtbFwiXG4gICAgY29udHJvbGxlcjogXCJFeHBvcnRDb250cm9sbGVyXCJcbiAgLnN0YXRlIFwibG9naW5cIixcbiAgICB1cmw6IFwiL2xvZ2luXCJcbiAgICB0ZW1wbGF0ZVVybDogXCJwYXJ0cy9sb2dpbi5odG1sXCJcblxuICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlIFwiL2hvbWVcIiIsImNsYXNzIERlZmF1bHRDb250cm9sbGVyXG5cbiAgY29uc3RydWN0b3I6IChAc2NvcGUsIEByb290KSAtPlxuICAgIEBzY29wZS5yb290ID0gQHJvb3RcbiAgICBAc2NvcGUuY3RybCA9IEBcblxuICAgIEBpbml0KClcblxuICAgIEBzY29wZS4kb24gJyRkZXN0cm95JywgQGRlc3Ryb3lcblxuICBpbml0OiAtPlxuXG4gIGRlc3Ryb3k6IC0+IiwiY29sb3JfaW50ZXJwcmV0YXRpb25zID0gW1xuICBcIlJHQlwiXG4gIFwiUEFMRVRURSBDT0xPUlwiIFxuICBcIllCUl9GVUxMXCIgXG4gIFwiWUJSX0ZVTExfNDIyXCJcbiAgXCJZQlJfUEFSVElBTF80MjJcIiBcbiAgXCJZQlJfUEFSVElBTF80MjBcIiBcbiAgXCJZQlJfUkNUXCJcbl1cblxuY2xhc3MgRGljb21GaWxlUmVhZGVyXG5cbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICMgSW5zdGFuY2UgdmFyaWFibGVzICAgICAgI1xuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuICBmcmFtZXMgPSBbXVxuXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAjIENvbnN0cnVjdG9yICAgICAgICAgICAgICNcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbiAgY29uc3RydWN0b3I6IChAcGF0aCkgLT5cbiAgICBAZnMgPSByZXF1aXJlIFwiZnNcIlxuXG4gICAgQF9yZWFkKClcbiAgICBAX21ldGFkYXRhKClcbiAgICBAX2xvYWQoKVxuXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAjIE1ldGhvZHMgICAgICAgICAgICAgICAgICNcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbiAgaXNDb2xvckltYWdlOiAoY29sb3IpID0+IFxuXG4gIF9yZWFkOiA9PlxuICAgIGJ1ZmZlciAgPSBAZnMucmVhZEZpbGVTeW5jIEBwYXRoXG4gICAgQGRhdGFTZXQgPSBkaWNvbVBhcnNlci5wYXJzZURpY29tIG5ldyBVaW50OEFycmF5IGJ1ZmZlclxuXG4gIF9tZXRhZGF0YTogPT5cbiAgICBAZnJhbWVjb3VudCA9IEBkYXRhU2V0LnN0cmluZyhcIngwMDI4MDAwOFwiKSB8fCAxXG4gICAgQGNvbG9yX2ludCAgPSBAZGF0YVNldC5zdHJpbmcoXCJ4MDAyODAwMDRcIilcbiAgICBAaXNfY29sb3IgICA9IC0xIGlzbnQgY29sb3JfaW50ZXJwcmV0YXRpb25zLmluZGV4T2YgQGNvbG9yX2ludFxuXG4gIF9sb2FkOiA9PlxuICAgIG1ldGhvZCA9IGlmIEBpc19jb2xvclxuICAgIHRoZW4gY29ybmVyc3RvbmVXQURPSW1hZ2VMb2FkZXIubWFrZUNvbG9ySW1hZ2VcbiAgICBlbHNlIGNvcm5lcnN0b25lV0FET0ltYWdlTG9hZGVyLm1ha2VHcmF5c2NhbGVJbWFnZVxuXG4gICAgQGZyYW1lcyA9IGZvciBmcmFtZV9pZCBpbiBbMC4uQGZyYW1lY291bnQgLSAxXVxuICAgICAgbWV0aG9kIFwiI3tAcGF0aH1fI3tmcmFtZV9pZH1cIiwgQGRhdGFTZXQsIEBkYXRhU2V0LmJ5dGVBcnJheSwgQGNvbG9yX2ludCwgZnJhbWVfaWRcblxuICBnZXQ6IChmcmFtZSkgPT4gQGZyYW1lc1tmcmFtZSAtIDFdIiwibW9kdWxlID0gYW5ndWxhci5tb2R1bGUgJ2hpZGEnXG5cbm1vZHVsZS5maWx0ZXIgJ2xvZycsICAgICAtPiAoZGF0YSkgLT4gY29uc29sZS5sb2cgZGF0YTsgZGF0YVxubW9kdWxlLmZpbHRlciAncHJpbnQnLCAgIC0+IChkYXRhKSAtPiBKU09OLnN0cmluZ2lmeSBkYXRhXG5cbm1vZHVsZS5maWx0ZXIgJ3JlcGxhY2UnLCAtPiAodGV4dCwgYSwgYikgLT4gdGV4dC5yZXBsYWNlIGEsIGIiLCJtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSAnaGlkYSdcbm1vZHVsZS5jb250cm9sbGVyICdFeHBvcnRDb250cm9sbGVyJywgKCRzY29wZSwgJHJvb3RTY29wZSkgLT5cblxuICBuZXcgY2xhc3MgZXh0ZW5kcyBEZWZhdWx0Q29udHJvbGxlclxuXG4gICAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICAgIyBJbnN0YW5jZSB2YXJpYWJsZXMgICAgICAjXG4gICAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbiAgICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgICAjIGNvbnN0cnVjdG9yICYgaW5pdCAgICAgICNcbiAgICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuICAgIGNvbnN0cnVjdG9yOiAtPlxuICAgICAgc3VwZXIgJHNjb3BlLCAkcm9vdFNjb3BlXG5cbiAgICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgICAjIE1ldGhvZHMgICAgICAgICAgICAgICAgICNcbiAgICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMiLCJtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSAnaGlkYSdcbm1vZHVsZS5jb250cm9sbGVyICdIb21lQ29udHJvbGxlcicsICgkc2NvcGUsICRyb290U2NvcGUsICR0aW1lb3V0KSAtPlxuXG4gIG5ldyBjbGFzcyBleHRlbmRzIERlZmF1bHRDb250cm9sbGVyXG5cbiAgICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgICAjIEluc3RhbmNlIHZhcmlhYmxlcyAgICAgICNcbiAgICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAgICMgY29uc3RydWN0b3IgICAgICAgICAgICAgI1xuICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG4gICAgY29uc3RydWN0b3I6IC0+XG4gICAgICBzdXBlciAkc2NvcGUsICRyb290U2NvcGVcblxuICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAgICMgTWV0aG9kcyAgICAgICAgICAgICAgICAgI1xuICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyIsIm1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlICdoaWRhJ1xubW9kdWxlLmNvbnRyb2xsZXIgJ0xvZ2luQ29udHJvbGxlcicsICgkc2NvcGUsICRyb290U2NvcGUpIC0+XG5cbiAgbmV3IGNsYXNzIGV4dGVuZHMgRGVmYXVsdENvbnRyb2xsZXJcblxuICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAgICMgSW5zdGFuY2UgdmFyaWFibGVzICAgICAgI1xuICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG4gICAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICAgIyBjb25zdHJ1Y3RvciAmIGluaXQgICAgICAjXG4gICAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbiAgICBjb25zdHJ1Y3RvcjogLT5cbiAgICAgIHN1cGVyICRzY29wZSwgJHJvb3RTY29wZVxuXG4gICAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICAgIyBNZXRob2RzICAgICAgICAgICAgICAgICAjXG4gICAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIiwibW9kdWxlID0gYW5ndWxhci5tb2R1bGUgJ2hpZGEnXG5tb2R1bGUuY29udHJvbGxlciAnTWFpbkNvbnRyb2xsZXInLCAoJHNjb3BlLCAkcm9vdFNjb3BlLCAkc3RhdGUpIC0+XG5cbiAgbmV3IGNsYXNzIGV4dGVuZHMgRGVmYXVsdENvbnRyb2xsZXJcblxuICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAgICMgSW5zdGFuY2UgdmFyaWFibGVzICAgICAgI1xuICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG4gICAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICAgIyBjb25zdHJ1Y3RvciAmIGluaXQgICAgICAjXG4gICAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbiAgICBjb25zdHJ1Y3RvcjogLT5cbiAgICAgIHN1cGVyICRzY29wZSwgJHJvb3RTY29wZVxuXG4gICAgICAkc2NvcGUuJHN0YXRlID0gJHN0YXRlXG5cbiAgICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgICAjIE1ldGhvZHMgICAgICAgICAgICAgICAgICNcbiAgICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuICAgIG9wZW46ID0+XG4gICAgICBmaWxlID0gJCgnI2ZpbGUnKVxuICAgICAgc2VsZiA9IEBcbiAgICAgIGZpbGUuY2hhbmdlIC0+IHNlbGYuaW1hZ2UgJChAKS52YWwoKVxuICAgICAgZmlsZS5jbGljaygpXG4gICAgICByZXR1cm4gZmFsc2UiLCJtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSAnaGlkYSdcblxubW9kdWxlLmRpcmVjdGl2ZSAnZGljb20nLCAtPlxuICByZXN0cmljdDogJ0UnXG4gIHNjb3BlOiBcbiAgICBwYXRoOiAnPSdcbiAgdGVtcGxhdGVVcmw6IFwicGFydHMvZGlyZWN0aXZlcy9kaWNvbS5odG1sXCJcbiAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY3RybCwgYikgLT4gc2NvcGUuY3RybC5saW5rIGVsZW1lbnRcbiAgY29udHJvbGxlcjogKCRzY29wZSwgJHJvb3RTY29wZSwgJHRpbWVvdXQpIC0+XG5cbiAgICBuZXcgY2xhc3MgZXh0ZW5kcyBEZWZhdWx0Q29udHJvbGxlclxuXG4gICAgICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgICAgICMgSW5zdGFuY2UgdmFyaWFibGVzICAgICAgI1xuICAgICAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbiAgICAgIHd3OiAwXG4gICAgICB3bDogMFxuICAgICAgZnJhbWVzOiAxXG4gICAgICBjb2xvcjogJ05vIGNvbG9yJ1xuXG4gICAgICBmcmFtZTogMVxuICAgICAgc2Nyb2xsOiAwXG5cbiAgICAgIHNjcm9sbF9zcGVlZDogMTAwICMgSGlnaGVyIGlzIHNsb3dlclxuICAgICAgc2Nyb2xsX2N1bXVsYXRpdmU6IDBcblxuICAgICAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICAgICAjIENvbnN0cnVjdG9yICYgaW5pdCAgICAgICNcbiAgICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG4gICAgICBjb25zdHJ1Y3RvcjogLT5cbiAgICAgICAgc3VwZXIgJHNjb3BlLCAkcm9vdFNjb3BlXG5cbiAgICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAgICAgIyBNZXRob2RzICAgICAgICAgICAgICAgICAjXG4gICAgICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuICAgICAgbGluazogKEAkZWxlbWVudCkgPT5cbiAgICAgICAgQGVsZW1lbnQgICAgPSBAJGVsZW1lbnRbMF1cbiAgICAgICAgQCRkb2N1bWVudCAgPSAkKGRvY3VtZW50KVxuXG4gICAgICAgICQod2luZG93KS5yZXNpemUgQHJlc2l6ZVxuXG4gICAgICAgIGNvcm5lcnN0b25lLmVuYWJsZSBAZWxlbWVudFxuICAgICAgICBAcmVnaXN0ZXIoKVxuXG4gICAgICAgIEBpbWFnZSBcIi9Vc2Vycy9Kb3JyaXQvRGV2ZWxvcG1lbnQvSGlkYSBQcml2YXRlL1BhdGllbnRkYXRhL0FOT05IQlNBTUNIRVJNRVMxL0hJREFTUEVDVEZBU0UyUkVDT05TQ0FDLzEuMi43NTIuMzcuMS4xLjM0MDc4MjAwMjMuNi4xNjY2MDY3MjAxMzA5MDVcIlxuICAgICAgICBAdmlld3BvcnQudm9pLndpbmRvd1dpZHRoID0gMTg1XG4gICAgICAgIEB2aWV3cG9ydC52b2kud2luZG93Q2VudGVyID0gODRcbiAgICAgICAgY29ybmVyc3RvbmUuc2V0Vmlld3BvcnQgQGVsZW1lbnQsIEB2aWV3cG9ydCAgICAgICAgXG5cbiAgICAgIGxvYWRlZDogPT4gQHZpZXdwb3J0P1xuXG4gICAgICByZWdpc3RlcjogPT5cbiAgICAgICAgQCRlbGVtZW50LmJpbmQgJ21vdXNld2hlZWwnLCAoZSkgPT5cbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICByZXR1cm4gaWYgbm90IEBsb2FkZWQoKVxuXG4gICAgICAgICAgZGlyZWN0aW9uID0gZS5vcmlnaW5hbEV2ZW50LndoZWVsRGVsdGFcblxuICAgICAgICAgICMgTWFrZSBzdXJlIHdlIGFkZCB1cCBpbiByaWdodCBzY3JvbGwgZGlyZWN0aW9uXG4gICAgICAgICAgaWYgZGlyZWN0aW9uID4gMFxuICAgICAgICAgICAgaWYgQHNjcm9sbF9jdW11bGF0aXZlIDwgMFxuICAgICAgICAgICAgICBAc2Nyb2xsX2N1bXVsYXRpdmUgPSAwXG4gICAgICAgICAgZWxzZSBcbiAgICAgICAgICAgIGlmIEBzY3JvbGxfY3VtdWxhdGl2ZSA+IDBcbiAgICAgICAgICAgICAgQHNjcm9sbF9jdW11bGF0aXZlID0gMFxuXG4gICAgICAgICAgQHNjcm9sbF9jdW11bGF0aXZlID0gQHNjcm9sbF9jdW11bGF0aXZlICsgZGlyZWN0aW9uXG5cbiAgICAgICAgICBzdGVwcyA9IE1hdGguZmxvb3IgTWF0aC5hYnMoQHNjcm9sbF9jdW11bGF0aXZlKSAvIEBzY3JvbGxfc3BlZWRcblxuICAgICAgICAgIGlmIHN0ZXBzIGlzbnQgMFxuICAgICAgICAgICAgQHNjcm9sbF9jdW11bGF0aXZlID0gQHNjcm9sbF9jdW11bGF0aXZlICUgQHNjcm9sbF9zcGVlZFxuICAgICAgICAgICAgaWYgZGlyZWN0aW9uIDwgMFxuICAgICAgICAgICAgICBpZiBAZnJhbWUgPiAxXG4gICAgICAgICAgICAgICAgQGZyYW1lID0gQGZyYW1lIC0gMVxuICAgICAgICAgICAgICAgIEBzaG93KClcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgaWYgQGZyYW1lIDwgQGZyYW1lc1xuICAgICAgICAgICAgICAgIEBmcmFtZSA9IEBmcmFtZSArIDFcbiAgICAgICAgICAgICAgICBAc2hvdygpXG5cbiAgICAgICAgQCRlbGVtZW50Lm1vdXNlZG93biAoZSkgPT5cbiAgICAgICAgICByZXR1cm4gaWYgbm90IEBsb2FkZWQoKVxuXG4gICAgICAgICAgbGFzdFggPSBlLnBhZ2VYXG4gICAgICAgICAgbGFzdFkgPSBlLnBhZ2VZXG5cbiAgICAgICAgICBAJGRvY3VtZW50Lm1vdXNlbW92ZSAoZSkgPT5cbiAgICAgICAgICAgIGRlbHRhWCA9IGUucGFnZVggLSBsYXN0WFxuICAgICAgICAgICAgZGVsdGFZID0gZS5wYWdlWSAtIGxhc3RZXG4gICAgICAgICAgICBsYXN0WCA9IGUucGFnZVhcbiAgICAgICAgICAgIGxhc3RZID0gZS5wYWdlWVxuICAgICAgICAgICAgQHZpZXdwb3J0LnZvaS53aW5kb3dXaWR0aCArPSBkZWx0YVggLyBAdmlld3BvcnQuc2NhbGVcbiAgICAgICAgICAgIEB2aWV3cG9ydC52b2kud2luZG93Q2VudGVyICs9IGRlbHRhWSAvIEB2aWV3cG9ydC5zY2FsZVxuICAgICAgICAgICAgY29ybmVyc3RvbmUuc2V0Vmlld3BvcnQgQGVsZW1lbnQsIEB2aWV3cG9ydFxuXG4gICAgICAgICAgICBAd3cgPSBNYXRoLnJvdW5kIEB2aWV3cG9ydC52b2kud2luZG93V2lkdGhcbiAgICAgICAgICAgIEB3bCA9IE1hdGgucm91bmQgQHZpZXdwb3J0LnZvaS53aW5kb3dDZW50ZXJcbiAgICAgICAgICAgIEBzY29wZS4kYXBwbHkoKVxuXG4gICAgICAgICAgQCRkb2N1bWVudC5tb3VzZXVwIChlKSA9PlxuICAgICAgICAgICAgQCRkb2N1bWVudC51bmJpbmQgXCJtb3VzZW1vdmVcIlxuICAgICAgICAgICAgQCRkb2N1bWVudC51bmJpbmQgXCJtb3VzZXVwXCJcblxuICAgICAgaW1hZ2U6IChmaWxlKSA9PlxuICAgICAgICBAcmVhZGVyID0gbmV3IERpY29tRmlsZVJlYWRlciBmaWxlXG4gICAgICAgIEBzaG93KClcblxuICAgICAgc2hvdzogPT5cbiAgICAgICAgQHJlYWRlci5nZXQgQGZyYW1lXG4gICAgICAgIC50aGVuIChpbWFnZSkgPT5cbiAgICAgICAgICBjb3JuZXJzdG9uZS5kaXNwbGF5SW1hZ2UgQGVsZW1lbnQsIGltYWdlXG4gICAgICAgICAgQHZpZXdwb3J0ID0gY29ybmVyc3RvbmUuZ2V0Vmlld3BvcnQgQGVsZW1lbnRcblxuICAgICAgICAgICMgY29uc29sZS5pbmZvIGNvcm5lcnN0b25lXG5cbiAgICAgICAgICBAd3cgPSBAdmlld3BvcnQudm9pLndpbmRvd1dpZHRoXG4gICAgICAgICAgQHdsID0gQHZpZXdwb3J0LnZvaS53aW5kb3dDZW50ZXJcbiAgICAgICAgICBAY29sb3IgPSBAcmVhZGVyLmNvbG9yX2ludFxuICAgICAgICAgIEBmcmFtZXMgPSBAcmVhZGVyLmZyYW1lY291bnRcbiAgICAgICAgICBAc2NvcGUuJGFwcGx5KClcblxuICAgICAgcmVzaXplOiA9PlxuICAgICAgICBjb3JuZXJzdG9uZS5yZXNpemUgQGVsZW1lbnQsIHRydWUgaWYgQGxvYWRlZCgpIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9