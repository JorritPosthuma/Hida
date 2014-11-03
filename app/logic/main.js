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
  return $urlRouterProvider.otherwise("/export");
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

    _Class.prototype.path = '';

    function _Class() {
      _Class.__super__.constructor.call(this, $scope, $rootScope);
      $rootScope.$watch('image_path', (function(_this) {
        return function(image_path) {
          return _this.path = image_path;
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

var module,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module = angular.module('hida');

module.controller('NavController', function($scope, $rootScope, $state) {
  return new ((function(_super) {
    __extends(_Class, _super);

    function _Class() {
      this.open = __bind(this.open, this);
      _Class.__super__.constructor.call(this, $scope, $rootScope);
    }

    _Class.prototype.open = function() {
      var file, self;
      file = $('#file');
      self = this;
      file.change(function() {
        $rootScope.image_path = $(this).val();
        return $state.go('main.home');
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
          return $scope.$watch('path', (function(_this) {
            return function(path) {
              console.info(path);
              if ((path != null) && path !== '') {
                return _this.image(path);
              }
            };
          })(this));
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uY29mZmVlIiwiY29udHJvbGxlci5jb2ZmZWUiLCJkaWNvbS5jb2ZmZWUiLCJmaWx0ZXJzLmNvZmZlZSIsInBhcnRzL2V4cG9ydC5jb2ZmZWUiLCJwYXJ0cy9ob21lLmNvZmZlZSIsInBhcnRzL2xvZ2luLmNvZmZlZSIsInBhcnRzL21haW4uY29mZmVlIiwicGFydHMvbmF2LmNvZmZlZSIsInBhcnRzL2RpcmVjdGl2ZXMvZGljb20uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sQ0FBQyxNQUFSLENBQWUsTUFBZixFQUF1QixDQUFFLFdBQUYsRUFBZSxjQUFmLENBQXZCLENBRUEsQ0FBQyxNQUZELENBRVEsU0FBQyxjQUFELEVBQWlCLGtCQUFqQixHQUFBO0FBQ04sRUFBQSxjQUNBLENBQUMsS0FERCxDQUNPLE1BRFAsRUFFRTtBQUFBLElBQUEsUUFBQSxFQUFVLElBQVY7QUFBQSxJQUNBLFdBQUEsRUFBYSxpQkFEYjtBQUFBLElBRUEsVUFBQSxFQUFZLGdCQUZaO0dBRkYsQ0FLQSxDQUFDLEtBTEQsQ0FLTyxXQUxQLEVBTUU7QUFBQSxJQUFBLEdBQUEsRUFBSyxPQUFMO0FBQUEsSUFDQSxXQUFBLEVBQWEsaUJBRGI7QUFBQSxJQUVBLFVBQUEsRUFBWSxnQkFGWjtHQU5GLENBU0EsQ0FBQyxLQVRELENBU08sYUFUUCxFQVVFO0FBQUEsSUFBQSxHQUFBLEVBQUssU0FBTDtBQUFBLElBQ0EsV0FBQSxFQUFhLG1CQURiO0FBQUEsSUFFQSxVQUFBLEVBQVksa0JBRlo7R0FWRixDQWFBLENBQUMsS0FiRCxDQWFPLE9BYlAsRUFjRTtBQUFBLElBQUEsR0FBQSxFQUFLLFFBQUw7QUFBQSxJQUNBLFdBQUEsRUFBYSxrQkFEYjtHQWRGLENBQUEsQ0FBQTtTQWlCQSxrQkFBa0IsQ0FBQyxTQUFuQixDQUE2QixTQUE3QixFQWxCTTtBQUFBLENBRlIsQ0FBQSxDQUFBOztBQ0FBLElBQUEsaUJBQUE7O0FBQUE7QUFFZSxFQUFBLDJCQUFF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QUE7QUFDSixjQUFBLFdBQVcsQ0FBQyxZQUFaLENBQXlCLEtBQUMsQ0FBQSxPQUExQixFQUFtQyxLQUFuQyxDQUFBLENBQUE7QUFBQSxjQUNBLEtBQUMsQ0FBQSxRQUFELEdBQVksV0FBVyxDQUFDLFdBQVosQ0FBd0IsS0FBQyxDQUFBLE9BQXpCLENBRFosQ0FBQTtBQUFBLGNBS0EsS0FBQyxDQUFBLEVBQUQsR0FBTSxLQUFDLENBQUEsUUFBUSxDQUFDLEdBQUcsQ0FBQyxXQUxwQixDQUFBO0FBQUEsY0FNQSxLQUFDLENBQUEsRUFBRCxHQUFNLEtBQUMsQ0FBQSxRQUFRLENBQUMsR0FBRyxDQUFDLFlBTnBCLENBQUE7QUFBQSxjQU9BLEtBQUMsQ0FBQSxLQUFELEdBQVMsS0FBQyxDQUFBLE1BQU0sQ0FBQyxTQVBqQixDQUFBO0FBQUEsY0FRQSxLQUFDLENBQUEsTUFBRCxHQUFVLEtBQUMsQ0FBQSxNQUFNLENBQUMsVUFSbEIsQ0FBQTtxQkFTQSxLQUFDLENBQUEsS0FBSyxDQUFDLE1BQVAsQ0FBQSxFQVZJO1lBQUEsRUFBQTtVQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FETixFQURJO1FBQUEsQ0FwR04sQ0FBQTs7QUFBQSx5QkFrSEEsTUFBQSxHQUFRLFNBQUEsR0FBQTtBQUNOLFVBQUEsSUFBcUMsSUFBQyxDQUFBLE1BQUQsQ0FBQSxDQUFyQzttQkFBQSxXQUFXLENBQUMsTUFBWixDQUFtQixJQUFDLENBQUEsT0FBcEIsRUFBNkIsSUFBN0IsRUFBQTtXQURNO1FBQUEsQ0FsSFIsQ0FBQTs7c0JBQUE7O1NBTmdCLG9CQUZSO0lBQUEsQ0FMWjtJQUR3QjtBQUFBLENBQTFCLENBRkEsQ0FBQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUgXCJoaWRhXCIsIFsgJ3VpLnJvdXRlcicsICd1aS5ib290c3RyYXAnIF1cblxuLmNvbmZpZyAoJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikgLT5cbiAgJHN0YXRlUHJvdmlkZXJcbiAgLnN0YXRlIFwibWFpblwiLFxuICAgIGFic3RyYWN0OiB0cnVlXG4gICAgdGVtcGxhdGVVcmw6IFwicGFydHMvbWFpbi5odG1sXCJcbiAgICBjb250cm9sbGVyOiBcIk1haW5Db250cm9sbGVyXCJcbiAgLnN0YXRlIFwibWFpbi5ob21lXCIsXG4gICAgdXJsOiBcIi9ob21lXCJcbiAgICB0ZW1wbGF0ZVVybDogXCJwYXJ0cy9ob21lLmh0bWxcIlxuICAgIGNvbnRyb2xsZXI6IFwiSG9tZUNvbnRyb2xsZXJcIlxuICAuc3RhdGUgXCJtYWluLmV4cG9ydFwiLFxuICAgIHVybDogXCIvZXhwb3J0XCJcbiAgICB0ZW1wbGF0ZVVybDogXCJwYXJ0cy9leHBvcnQuaHRtbFwiXG4gICAgY29udHJvbGxlcjogXCJFeHBvcnRDb250cm9sbGVyXCJcbiAgLnN0YXRlIFwibG9naW5cIixcbiAgICB1cmw6IFwiL2xvZ2luXCJcbiAgICB0ZW1wbGF0ZVVybDogXCJwYXJ0cy9sb2dpbi5odG1sXCJcblxuICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlIFwiL2V4cG9ydFwiIiwiY2xhc3MgRGVmYXVsdENvbnRyb2xsZXJcblxuICBjb25zdHJ1Y3RvcjogKEBzY29wZSwgQHJvb3QpIC0+XG4gICAgQHNjb3BlLnJvb3QgPSBAcm9vdFxuICAgIEBzY29wZS5jdHJsID0gQFxuXG4gICAgQGluaXQoKVxuXG4gICAgQHNjb3BlLiRvbiAnJGRlc3Ryb3knLCBAZGVzdHJveVxuXG4gIGluaXQ6IC0+XG5cbiAgZGVzdHJveTogLT4iLCJjb2xvcl9pbnRlcnByZXRhdGlvbnMgPSBbXG4gIFwiUkdCXCJcbiAgXCJQQUxFVFRFIENPTE9SXCIgXG4gIFwiWUJSX0ZVTExcIiBcbiAgXCJZQlJfRlVMTF80MjJcIlxuICBcIllCUl9QQVJUSUFMXzQyMlwiIFxuICBcIllCUl9QQVJUSUFMXzQyMFwiIFxuICBcIllCUl9SQ1RcIlxuXVxuXG5jbGFzcyBEaWNvbUZpbGVSZWFkZXJcblxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgIyBJbnN0YW5jZSB2YXJpYWJsZXMgICAgICAjXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG4gIGZyYW1lcyA9IFtdXG5cbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICMgQ29uc3RydWN0b3IgICAgICAgICAgICAgI1xuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuICBjb25zdHJ1Y3RvcjogKEBwYXRoKSAtPlxuICAgIEBmcyA9IHJlcXVpcmUgXCJmc1wiXG5cbiAgICBAX3JlYWQoKVxuICAgIEBfbWV0YWRhdGEoKVxuICAgIEBfbG9hZCgpXG5cbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICMgTWV0aG9kcyAgICAgICAgICAgICAgICAgI1xuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuICBpc0NvbG9ySW1hZ2U6IChjb2xvcikgPT4gXG5cbiAgX3JlYWQ6ID0+XG4gICAgYnVmZmVyICA9IEBmcy5yZWFkRmlsZVN5bmMgQHBhdGhcbiAgICBAZGF0YVNldCA9IGRpY29tUGFyc2VyLnBhcnNlRGljb20gbmV3IFVpbnQ4QXJyYXkgYnVmZmVyXG5cbiAgX21ldGFkYXRhOiA9PlxuICAgIEBmcmFtZWNvdW50ID0gQGRhdGFTZXQuc3RyaW5nKFwieDAwMjgwMDA4XCIpIHx8IDFcbiAgICBAY29sb3JfaW50ICA9IEBkYXRhU2V0LnN0cmluZyhcIngwMDI4MDAwNFwiKVxuICAgIEBpc19jb2xvciAgID0gLTEgaXNudCBjb2xvcl9pbnRlcnByZXRhdGlvbnMuaW5kZXhPZiBAY29sb3JfaW50XG5cbiAgX2xvYWQ6ID0+XG4gICAgbWV0aG9kID0gaWYgQGlzX2NvbG9yXG4gICAgdGhlbiBjb3JuZXJzdG9uZVdBRE9JbWFnZUxvYWRlci5tYWtlQ29sb3JJbWFnZVxuICAgIGVsc2UgY29ybmVyc3RvbmVXQURPSW1hZ2VMb2FkZXIubWFrZUdyYXlzY2FsZUltYWdlXG5cbiAgICBAZnJhbWVzID0gZm9yIGZyYW1lX2lkIGluIFswLi5AZnJhbWVjb3VudCAtIDFdXG4gICAgICBtZXRob2QgXCIje0BwYXRofV8je2ZyYW1lX2lkfVwiLCBAZGF0YVNldCwgQGRhdGFTZXQuYnl0ZUFycmF5LCBAY29sb3JfaW50LCBmcmFtZV9pZFxuXG4gIGdldDogKGZyYW1lKSA9PiBAZnJhbWVzW2ZyYW1lIC0gMV0iLCJtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSAnaGlkYSdcblxubW9kdWxlLmZpbHRlciAnbG9nJywgICAgIC0+IChkYXRhKSAtPiBjb25zb2xlLmxvZyBkYXRhOyBkYXRhXG5tb2R1bGUuZmlsdGVyICdwcmludCcsICAgLT4gKGRhdGEpIC0+IEpTT04uc3RyaW5naWZ5IGRhdGFcblxubW9kdWxlLmZpbHRlciAncmVwbGFjZScsIC0+ICh0ZXh0LCBhLCBiKSAtPiB0ZXh0LnJlcGxhY2UgYSwgYiIsIm1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlICdoaWRhJ1xubW9kdWxlLmNvbnRyb2xsZXIgJ0V4cG9ydENvbnRyb2xsZXInLCAoJHNjb3BlLCAkcm9vdFNjb3BlKSAtPlxuXG4gIG5ldyBjbGFzcyBleHRlbmRzIERlZmF1bHRDb250cm9sbGVyXG5cbiAgICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgICAjIEluc3RhbmNlIHZhcmlhYmxlcyAgICAgICNcbiAgICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAgICMgY29uc3RydWN0b3IgJiBpbml0ICAgICAgI1xuICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG4gICAgY29uc3RydWN0b3I6IC0+XG4gICAgICBzdXBlciAkc2NvcGUsICRyb290U2NvcGVcblxuICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAgICMgTWV0aG9kcyAgICAgICAgICAgICAgICAgI1xuICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyIsIm1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlICdoaWRhJ1xubW9kdWxlLmNvbnRyb2xsZXIgJ0hvbWVDb250cm9sbGVyJywgKCRzY29wZSwgJHJvb3RTY29wZSwgJHRpbWVvdXQpIC0+XG5cbiAgbmV3IGNsYXNzIGV4dGVuZHMgRGVmYXVsdENvbnRyb2xsZXJcblxuICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAgICMgSW5zdGFuY2UgdmFyaWFibGVzICAgICAgI1xuICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG4gICAgcGF0aDogJydcblxuICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAgICMgY29uc3RydWN0b3IgICAgICAgICAgICAgI1xuICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG4gICAgY29uc3RydWN0b3I6IC0+XG4gICAgICBzdXBlciAkc2NvcGUsICRyb290U2NvcGVcblxuICAgICAgJHJvb3RTY29wZS4kd2F0Y2ggJ2ltYWdlX3BhdGgnLCAoaW1hZ2VfcGF0aCkgPT5cbiAgICAgICAgQHBhdGggPSBpbWFnZV9wYXRoXG5cbiAgICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgICAjIE1ldGhvZHMgICAgICAgICAgICAgICAgICNcbiAgICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMiLCJtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSAnaGlkYSdcbm1vZHVsZS5jb250cm9sbGVyICdMb2dpbkNvbnRyb2xsZXInLCAoJHNjb3BlLCAkcm9vdFNjb3BlKSAtPlxuXG4gIG5ldyBjbGFzcyBleHRlbmRzIERlZmF1bHRDb250cm9sbGVyXG5cbiAgICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgICAjIEluc3RhbmNlIHZhcmlhYmxlcyAgICAgICNcbiAgICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAgICMgY29uc3RydWN0b3IgJiBpbml0ICAgICAgI1xuICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG4gICAgY29uc3RydWN0b3I6IC0+XG4gICAgICBzdXBlciAkc2NvcGUsICRyb290U2NvcGVcblxuICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAgICMgTWV0aG9kcyAgICAgICAgICAgICAgICAgI1xuICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyIsIm1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlICdoaWRhJ1xubW9kdWxlLmNvbnRyb2xsZXIgJ01haW5Db250cm9sbGVyJywgKCRzY29wZSwgJHJvb3RTY29wZSwgJHN0YXRlKSAtPlxuXG4gIG5ldyBjbGFzcyBleHRlbmRzIERlZmF1bHRDb250cm9sbGVyXG5cbiAgICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgICAjIEluc3RhbmNlIHZhcmlhYmxlcyAgICAgICNcbiAgICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAgICMgY29uc3RydWN0b3IgJiBpbml0ICAgICAgI1xuICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG4gICAgY29uc3RydWN0b3I6IC0+XG4gICAgICBzdXBlciAkc2NvcGUsICRyb290U2NvcGVcblxuICAgICAgJHNjb3BlLiRzdGF0ZSA9ICRzdGF0ZVxuXG4gICAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICAgIyBNZXRob2RzICAgICAgICAgICAgICAgICAjXG4gICAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIiwibW9kdWxlID0gYW5ndWxhci5tb2R1bGUgJ2hpZGEnXG5tb2R1bGUuY29udHJvbGxlciAnTmF2Q29udHJvbGxlcicsICgkc2NvcGUsICRyb290U2NvcGUsICRzdGF0ZSkgLT5cblxuICBuZXcgY2xhc3MgZXh0ZW5kcyBEZWZhdWx0Q29udHJvbGxlclxuXG4gICAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICAgIyBJbnN0YW5jZSB2YXJpYWJsZXMgICAgICAjXG4gICAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbiAgICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgICAjIGNvbnN0cnVjdG9yICYgaW5pdCAgICAgICNcbiAgICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuICAgIGNvbnN0cnVjdG9yOiAtPlxuICAgICAgc3VwZXIgJHNjb3BlLCAkcm9vdFNjb3BlXG5cbiAgICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgICAjIE1ldGhvZHMgICAgICAgICAgICAgICAgICNcbiAgICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuICAgIG9wZW46ID0+XG4gICAgICBmaWxlID0gJCgnI2ZpbGUnKVxuICAgICAgc2VsZiA9IEBcbiAgICAgIGZpbGUuY2hhbmdlIC0+IFxuICAgICAgICAkcm9vdFNjb3BlLmltYWdlX3BhdGggPSAkKEApLnZhbCgpXG4gICAgICAgICRzdGF0ZS5nbyAnbWFpbi5ob21lJ1xuICAgICAgZmlsZS5jbGljaygpXG4gICAgICByZXR1cm4gZmFsc2UiLCJtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSAnaGlkYSdcblxubW9kdWxlLmRpcmVjdGl2ZSAnZGljb20nLCAtPlxuICByZXN0cmljdDogJ0UnXG4gIHNjb3BlOiBcbiAgICBwYXRoOiAnPSdcbiAgdGVtcGxhdGVVcmw6IFwicGFydHMvZGlyZWN0aXZlcy9kaWNvbS5odG1sXCJcbiAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY3RybCwgYikgLT4gc2NvcGUuY3RybC5saW5rIGVsZW1lbnRcbiAgY29udHJvbGxlcjogKCRzY29wZSwgJHJvb3RTY29wZSwgJHRpbWVvdXQpIC0+XG5cbiAgICBuZXcgY2xhc3MgZXh0ZW5kcyBEZWZhdWx0Q29udHJvbGxlclxuXG4gICAgICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgICAgICMgSW5zdGFuY2UgdmFyaWFibGVzICAgICAgI1xuICAgICAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbiAgICAgIHd3OiAwXG4gICAgICB3bDogMFxuICAgICAgZnJhbWVzOiAxXG4gICAgICBjb2xvcjogJ05vIGNvbG9yJ1xuXG4gICAgICBmcmFtZTogMVxuICAgICAgc2Nyb2xsOiAwXG5cbiAgICAgIHNjcm9sbF9zcGVlZDogMTAwICMgSGlnaGVyIGlzIHNsb3dlclxuICAgICAgc2Nyb2xsX2N1bXVsYXRpdmU6IDBcblxuICAgICAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICAgICAjIENvbnN0cnVjdG9yICYgaW5pdCAgICAgICNcbiAgICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG4gICAgICBjb25zdHJ1Y3RvcjogLT5cbiAgICAgICAgc3VwZXIgJHNjb3BlLCAkcm9vdFNjb3BlXG5cbiAgICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAgICAgIyBNZXRob2RzICAgICAgICAgICAgICAgICAjXG4gICAgICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuICAgICAgbGluazogKEAkZWxlbWVudCkgPT5cbiAgICAgICAgQGVsZW1lbnQgICAgPSBAJGVsZW1lbnRbMF1cbiAgICAgICAgQCRkb2N1bWVudCAgPSAkKGRvY3VtZW50KVxuXG4gICAgICAgICQod2luZG93KS5yZXNpemUgQHJlc2l6ZVxuXG4gICAgICAgIGNvcm5lcnN0b25lLmVuYWJsZSBAZWxlbWVudFxuICAgICAgICBAcmVnaXN0ZXIoKVxuXG4gICAgICAgICRzY29wZS4kd2F0Y2ggJ3BhdGgnLCAocGF0aCkgPT5cbiAgICAgICAgICBjb25zb2xlLmluZm8gcGF0aFxuICAgICAgICAgIGlmIHBhdGg/IGFuZCBwYXRoIGlzbnQgJydcbiAgICAgICAgICAgIEBpbWFnZSBwYXRoXG5cbiAgICAgICAgIyBAaW1hZ2UgXCIvVXNlcnMvSm9ycml0L0RldmVsb3BtZW50L0hpZGEgUHJpdmF0ZS9QYXRpZW50ZGF0YS9BTk9OSEJTQU1DSEVSTUVTMS9ISURBU1BFQ1RGQVNFMlJFQ09OU0NBQy8xLjIuNzUyLjM3LjEuMS4zNDA3ODIwMDIzLjYuMTY2NjA2NzIwMTMwOTA1XCJcbiAgICAgICAgIyBAdmlld3BvcnQudm9pLndpbmRvd1dpZHRoID0gMTg1XG4gICAgICAgICMgQHZpZXdwb3J0LnZvaS53aW5kb3dDZW50ZXIgPSA4NFxuICAgICAgICAjIGNvcm5lcnN0b25lLnNldFZpZXdwb3J0IEBlbGVtZW50LCBAdmlld3BvcnQgICAgICAgIFxuXG4gICAgICBsb2FkZWQ6ID0+IEB2aWV3cG9ydD9cblxuICAgICAgcmVnaXN0ZXI6ID0+XG4gICAgICAgIEAkZWxlbWVudC5iaW5kICdtb3VzZXdoZWVsJywgKGUpID0+XG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgcmV0dXJuIGlmIG5vdCBAbG9hZGVkKClcblxuICAgICAgICAgIGRpcmVjdGlvbiA9IGUub3JpZ2luYWxFdmVudC53aGVlbERlbHRhXG5cbiAgICAgICAgICAjIE1ha2Ugc3VyZSB3ZSBhZGQgdXAgaW4gcmlnaHQgc2Nyb2xsIGRpcmVjdGlvblxuICAgICAgICAgIGlmIGRpcmVjdGlvbiA+IDBcbiAgICAgICAgICAgIGlmIEBzY3JvbGxfY3VtdWxhdGl2ZSA8IDBcbiAgICAgICAgICAgICAgQHNjcm9sbF9jdW11bGF0aXZlID0gMFxuICAgICAgICAgIGVsc2UgXG4gICAgICAgICAgICBpZiBAc2Nyb2xsX2N1bXVsYXRpdmUgPiAwXG4gICAgICAgICAgICAgIEBzY3JvbGxfY3VtdWxhdGl2ZSA9IDBcblxuICAgICAgICAgIEBzY3JvbGxfY3VtdWxhdGl2ZSA9IEBzY3JvbGxfY3VtdWxhdGl2ZSArIGRpcmVjdGlvblxuXG4gICAgICAgICAgc3RlcHMgPSBNYXRoLmZsb29yIE1hdGguYWJzKEBzY3JvbGxfY3VtdWxhdGl2ZSkgLyBAc2Nyb2xsX3NwZWVkXG5cbiAgICAgICAgICBpZiBzdGVwcyBpc250IDBcbiAgICAgICAgICAgIEBzY3JvbGxfY3VtdWxhdGl2ZSA9IEBzY3JvbGxfY3VtdWxhdGl2ZSAlIEBzY3JvbGxfc3BlZWRcbiAgICAgICAgICAgIGlmIGRpcmVjdGlvbiA8IDBcbiAgICAgICAgICAgICAgaWYgQGZyYW1lID4gMVxuICAgICAgICAgICAgICAgIEBmcmFtZSA9IEBmcmFtZSAtIDFcbiAgICAgICAgICAgICAgICBAc2hvdygpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIGlmIEBmcmFtZSA8IEBmcmFtZXNcbiAgICAgICAgICAgICAgICBAZnJhbWUgPSBAZnJhbWUgKyAxXG4gICAgICAgICAgICAgICAgQHNob3coKVxuXG4gICAgICAgIEAkZWxlbWVudC5tb3VzZWRvd24gKGUpID0+XG4gICAgICAgICAgcmV0dXJuIGlmIG5vdCBAbG9hZGVkKClcblxuICAgICAgICAgIGxhc3RYID0gZS5wYWdlWFxuICAgICAgICAgIGxhc3RZID0gZS5wYWdlWVxuXG4gICAgICAgICAgQCRkb2N1bWVudC5tb3VzZW1vdmUgKGUpID0+XG4gICAgICAgICAgICBkZWx0YVggPSBlLnBhZ2VYIC0gbGFzdFhcbiAgICAgICAgICAgIGRlbHRhWSA9IGUucGFnZVkgLSBsYXN0WVxuICAgICAgICAgICAgbGFzdFggPSBlLnBhZ2VYXG4gICAgICAgICAgICBsYXN0WSA9IGUucGFnZVlcbiAgICAgICAgICAgIEB2aWV3cG9ydC52b2kud2luZG93V2lkdGggKz0gZGVsdGFYIC8gQHZpZXdwb3J0LnNjYWxlXG4gICAgICAgICAgICBAdmlld3BvcnQudm9pLndpbmRvd0NlbnRlciArPSBkZWx0YVkgLyBAdmlld3BvcnQuc2NhbGVcbiAgICAgICAgICAgIGNvcm5lcnN0b25lLnNldFZpZXdwb3J0IEBlbGVtZW50LCBAdmlld3BvcnRcblxuICAgICAgICAgICAgQHd3ID0gTWF0aC5yb3VuZCBAdmlld3BvcnQudm9pLndpbmRvd1dpZHRoXG4gICAgICAgICAgICBAd2wgPSBNYXRoLnJvdW5kIEB2aWV3cG9ydC52b2kud2luZG93Q2VudGVyXG4gICAgICAgICAgICBAc2NvcGUuJGFwcGx5KClcblxuICAgICAgICAgIEAkZG9jdW1lbnQubW91c2V1cCAoZSkgPT5cbiAgICAgICAgICAgIEAkZG9jdW1lbnQudW5iaW5kIFwibW91c2Vtb3ZlXCJcbiAgICAgICAgICAgIEAkZG9jdW1lbnQudW5iaW5kIFwibW91c2V1cFwiXG5cbiAgICAgIGltYWdlOiAoZmlsZSkgPT5cbiAgICAgICAgQHJlYWRlciA9IG5ldyBEaWNvbUZpbGVSZWFkZXIgZmlsZVxuICAgICAgICBAc2hvdygpXG5cbiAgICAgIHNob3c6ID0+XG4gICAgICAgIEByZWFkZXIuZ2V0IEBmcmFtZVxuICAgICAgICAudGhlbiAoaW1hZ2UpID0+XG4gICAgICAgICAgY29ybmVyc3RvbmUuZGlzcGxheUltYWdlIEBlbGVtZW50LCBpbWFnZVxuICAgICAgICAgIEB2aWV3cG9ydCA9IGNvcm5lcnN0b25lLmdldFZpZXdwb3J0IEBlbGVtZW50XG5cbiAgICAgICAgICAjIGNvbnNvbGUuaW5mbyBjb3JuZXJzdG9uZVxuXG4gICAgICAgICAgQHd3ID0gQHZpZXdwb3J0LnZvaS53aW5kb3dXaWR0aFxuICAgICAgICAgIEB3bCA9IEB2aWV3cG9ydC52b2kud2luZG93Q2VudGVyXG4gICAgICAgICAgQGNvbG9yID0gQHJlYWRlci5jb2xvcl9pbnRcbiAgICAgICAgICBAZnJhbWVzID0gQHJlYWRlci5mcmFtZWNvdW50XG4gICAgICAgICAgQHNjb3BlLiRhcHBseSgpXG5cbiAgICAgIHJlc2l6ZTogPT5cbiAgICAgICAgY29ybmVyc3RvbmUucmVzaXplIEBlbGVtZW50LCB0cnVlIGlmIEBsb2FkZWQoKSJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==