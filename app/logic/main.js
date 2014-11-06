var gui, shortcut;

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

gui = require("nw.gui");

shortcut = new gui.Shortcut({
  key: 'Ctrl+Q',
  active: gui.App.quit
});

gui.App.registerGlobalHotKey(shortcut);

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
  DicomFileReader.prototype.frames = [];

  function DicomFileReader(files) {
    var _i, _len, _ref;
    this.files = files;
    this.getFrameCount = __bind(this.getFrameCount, this);
    this.getFrame = __bind(this.getFrame, this);
    this._load = __bind(this._load, this);
    this._metadata = __bind(this._metadata, this);
    this._read = __bind(this._read, this);
    this.fs = require("fs");
    _ref = this.files;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      this.file = _ref[_i];
      this._read();
      this._metadata();
      this._load();
    }
  }

  DicomFileReader.prototype._read = function() {
    var buffer;
    buffer = this.fs.readFileSync(this.file);
    return this.dataSet = dicomParser.parseDicom(new Uint8Array(buffer));
  };

  DicomFileReader.prototype._metadata = function() {
    this.framecount = this.dataSet.string("x00280008") || 1;
    this.color_int = this.dataSet.string("x00280004");
    return this.is_color = -1 !== color_interpretations.indexOf(this.color_int);
  };

  DicomFileReader.prototype._load = function() {
    var frame_id, method, _i, _ref, _results;
    method = this.is_color ? cornerstoneWADOImageLoader.makeColorImage : cornerstoneWADOImageLoader.makeGrayscaleImage;
    _results = [];
    for (frame_id = _i = 0, _ref = this.framecount - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; frame_id = 0 <= _ref ? ++_i : --_i) {
      _results.push(this.frames.push(method("" + this.file + "_" + frame_id, this.dataSet, this.dataSet.byteArray, this.color_int, frame_id)));
    }
    return _results;
  };

  DicomFileReader.prototype.getFrame = function(frame) {
    return this.frames[frame - 1];
  };

  DicomFileReader.prototype.getFrameCount = function() {
    return this.frames.length;
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

    _Class.prototype.images = '';

    function _Class() {
      _Class.__super__.constructor.call(this, $scope, $rootScope);
      $rootScope.$watch('images', (function(_this) {
        return function(images) {
          return _this.images = images;
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
      var file;
      file = $('#file');
      file.change(function() {
        $rootScope.images = $(this).val().split(';');
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
      images: '='
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
          return $scope.$watch('images', (function(_this) {
            return function(images) {
              if ((images != null) && images !== '') {
                return _this.image(images);
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
                    _this.show();
                  }
                } else {
                  if (_this.frame < _this.frames) {
                    _this.frame = _this.frame + 1;
                    _this.show();
                  }
                }
                return _this.scope.$apply();
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

        _Class.prototype.image = function(files) {
          this.reader = new DicomFileReader(files);
          this.frame = 1;
          this.scroll_cumulative = 0;
          return this.show();
        };

        _Class.prototype.show = function() {
          return this.reader.getFrame(this.frame).then((function(_this) {
            return function(image) {
              cornerstone.displayImage(_this.element, image);
              _this.viewport = cornerstone.getViewport(_this.element);
              _this.viewport.voi.windowCenter = image.windowCenter;
              _this.viewport.voi.windowWidth = image.windowWidth;
              cornerstone.setViewport(_this.element, _this.viewport);
              _this.ww = _this.viewport.voi.windowWidth;
              _this.wl = _this.viewport.voi.windowCenter;
              _this.color = _this.reader.color_int;
              _this.frames = _this.reader.getFrameCount();
              return _this.resize();
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uY29mZmVlIiwiY29udHJvbGxlci5jb2ZmZWUiLCJkaWNvbS5jb2ZmZWUiLCJmaWx0ZXJzLmNvZmZlZSIsInBhcnRzL2V4cG9ydC5jb2ZmZWUiLCJwYXJ0cy9ob21lLmNvZmZlZSIsInBhcnRzL2xvZ2luLmNvZmZlZSIsInBhcnRzL21haW4uY29mZmVlIiwicGFydHMvbmF2LmNvZmZlZSIsInBhcnRzL2RpcmVjdGl2ZXMvZGljb20uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUEsYUFBQTs7QUFBQSxPQUFPLENBQUMsTUFBUixDQUFlLE1BQWYsRUFBdUIsQ0FBRSxXQUFGLEVBQWUsY0FBZixDQUF2QixDQUVBLENBQUMsTUFGRCxDQUVRLFNBQUMsY0FBRCxFQUFpQixrQkFBakIsR0FBQTtBQUNOLEVBQUEsY0FDQSxDQUFDLEtBREQsQ0FDTyxNQURQLEVBRUU7QUFBQSxJQUFBLFFBQUEsRUFBVSxJQUFWO0FBQUEsSUFDQSxXQUFBLEVBQWEsaUJBRGI7QUFBQSxJQUVBLFVBQUEsRUFBWSxnQkFGWjtHQUZGLENBS0EsQ0FBQyxLQUxELENBS08sV0FMUCxFQU1FO0FBQUEsSUFBQSxHQUFBLEVBQUssT0FBTDtBQUFBLElBQ0EsV0FBQSxFQUFhLGlCQURiO0FBQUEsSUFFQSxVQUFBLEVBQVksZ0JBRlo7R0FORixDQVNBLENBQUMsS0FURCxDQVNPLGFBVFAsRUFVRTtBQUFBLElBQUEsR0FBQSxFQUFLLFNBQUw7QUFBQSxJQUNBLFdBQUEsRUFBYSxtQkFEYjtBQUFBLElBRUEsVUFBQSxFQUFZLGtCQUZaO0dBVkYsQ0FhQSxDQUFDLEtBYkQsQ0FhTyxPQWJQLEVBY0U7QUFBQSxJQUFBLEdBQUEsRUFBSyxRQUFMO0FBQUEsSUFDQSxXQUFBLEVBQWEsa0JBRGI7R0FkRixDQUFBLENBQUE7U0FpQkEsa0JBQWtCLENBQUMsU0FBbkIsQ0FBNkIsU0FBN0IsRUFsQk07QUFBQSxDQUZSLENBQUEsQ0FBQTs7QUFBQSxHQXNCQSxHQUFNLE9BQUEsQ0FBUSxRQUFSLENBdEJOLENBQUE7O0FBQUEsUUF3QkEsR0FBZSxJQUFBLEdBQUcsQ0FBQyxRQUFKLENBQ2I7QUFBQSxFQUFBLEdBQUEsRUFBSyxRQUFMO0FBQUEsRUFDQSxNQUFBLEVBQVEsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQURoQjtDQURhLENBeEJmLENBQUE7O0FBQUEsR0E0QkcsQ0FBQyxHQUFHLENBQUMsb0JBQVIsQ0FBNkIsUUFBN0IsQ0E1QkEsQ0FBQTs7QUNBQSxJQUFBLGlCQUFBOztBQUFBO0FBRWUsRUFBQSwyQkFBRSxLQUFGLEVBQVUsSUFBVixHQUFBO0FBQ1gsSUFEWSxJQUFDLENBQUEsUUFBQSxLQUNiLENBQUE7QUFBQSxJQURvQixJQUFDLENBQUEsT0FBQSxJQUNyQixDQUFBO0FBQUEsSUFBQSxJQUFDLENBQUEsS0FBSyxDQUFDLElBQVAsR0FBYyxJQUFDLENBQUEsSUFBZixDQUFBO0FBQUEsSUFDQSxJQUFDLENBQUEsS0FBSyxDQUFDLElBQVAsR0FBYyxJQURkLENBQUE7QUFBQSxJQUdBLElBQUMsQ0FBQSxJQUFELENBQUEsQ0FIQSxDQUFBO0FBQUEsSUFLQSxJQUFDLENBQUEsS0FBSyxDQUFDLEdBQVAsQ0FBVyxVQUFYLEVBQXVCLElBQUMsQ0FBQSxPQUF4QixDQUxBLENBRFc7RUFBQSxDQUFiOztBQUFBLDhCQVFBLElBQUEsR0FBTSxTQUFBLEdBQUEsQ0FSTixDQUFBOztBQUFBLDhCQVVBLE9BQUEsR0FBUyxTQUFBLEdBQUEsQ0FWVCxDQUFBOzsyQkFBQTs7SUFGRixDQUFBOztBQ0FBLElBQUEsc0NBQUE7RUFBQSxrRkFBQTs7QUFBQSxxQkFBQSxHQUF3QixDQUN0QixLQURzQixFQUV0QixlQUZzQixFQUd0QixVQUhzQixFQUl0QixjQUpzQixFQUt0QixpQkFMc0IsRUFNdEIsaUJBTnNCLEVBT3RCLFNBUHNCLENBQXhCLENBQUE7O0FBQUE7QUFnQkUsNEJBQUEsTUFBQSxHQUFRLEVBQVIsQ0FBQTs7QUFNYSxFQUFBLHlCQUFFLEtBQUYsR0FBQTtBQUNYLFFBQUEsY0FBQTtBQUFBLElBRFksSUFBQyxDQUFBLFFBQUEsS0FDYixDQUFBO0FBQUEseURBQUEsQ0FBQTtBQUFBLCtDQUFBLENBQUE7QUFBQSx5Q0FBQSxDQUFBO0FBQUEsaURBQUEsQ0FBQTtBQUFBLHlDQUFBLENBQUE7QUFBQSxJQUFBLElBQUMsQ0FBQSxFQUFELEdBQU0sT0FBQSxDQUFRLElBQVIsQ0FBTixDQUFBO0FBRUE7QUFBQSxTQUFBLDJDQUFBLEdBQUE7QUFDRSxNQURFLElBQUMsQ0FBQSxlQUNILENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxLQUFELENBQUEsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsU0FBRCxDQUFBLENBREEsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLEtBQUQsQ0FBQSxDQUZBLENBREY7QUFBQSxLQUhXO0VBQUEsQ0FOYjs7QUFBQSw0QkFrQkEsS0FBQSxHQUFPLFNBQUEsR0FBQTtBQUNMLFFBQUEsTUFBQTtBQUFBLElBQUEsTUFBQSxHQUFVLElBQUMsQ0FBQSxFQUFFLENBQUMsWUFBSixDQUFpQixJQUFDLENBQUEsSUFBbEIsQ0FBVixDQUFBO1dBQ0EsSUFBQyxDQUFBLE9BQUQsR0FBVyxXQUFXLENBQUMsVUFBWixDQUEyQixJQUFBLFVBQUEsQ0FBVyxNQUFYLENBQTNCLEVBRk47RUFBQSxDQWxCUCxDQUFBOztBQUFBLDRCQXNCQSxTQUFBLEdBQVcsU0FBQSxHQUFBO0FBQ1QsSUFBQSxJQUFDLENBQUEsVUFBRCxHQUFjLElBQUMsQ0FBQSxPQUFPLENBQUMsTUFBVCxDQUFnQixXQUFoQixDQUFBLElBQWdDLENBQTlDLENBQUE7QUFBQSxJQUNBLElBQUMsQ0FBQSxTQUFELEdBQWMsSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUFULENBQWdCLFdBQWhCLENBRGQsQ0FBQTtXQUVBLElBQUMsQ0FBQSxRQUFELEdBQWMsQ0FBQSxDQUFBLEtBQVEscUJBQXFCLENBQUMsT0FBdEIsQ0FBOEIsSUFBQyxDQUFBLFNBQS9CLEVBSGI7RUFBQSxDQXRCWCxDQUFBOztBQUFBLDRCQTJCQSxLQUFBLEdBQU8sU0FBQSxHQUFBO0FBQ0wsUUFBQSxvQ0FBQTtBQUFBLElBQUEsTUFBQSxHQUFZLElBQUMsQ0FBQSxRQUFKLEdBQ0osMEJBQTBCLENBQUMsY0FEdkIsR0FFSiwwQkFBMEIsQ0FBQyxrQkFGaEMsQ0FBQTtBQUlBO1NBQWdCLHNIQUFoQixHQUFBO0FBQ0Usb0JBQUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxJQUFSLENBQWEsTUFBQSxDQUFPLEVBQUEsR0FBRyxJQUFDLENBQUEsSUFBSixHQUFTLEdBQVQsR0FBWSxRQUFuQixFQUErQixJQUFDLENBQUEsT0FBaEMsRUFBeUMsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFsRCxFQUE2RCxJQUFDLENBQUEsU0FBOUQsRUFBeUUsUUFBekUsQ0FBYixFQUFBLENBREY7QUFBQTtvQkFMSztFQUFBLENBM0JQLENBQUE7O0FBQUEsNEJBbUNBLFFBQUEsR0FBVSxTQUFDLEtBQUQsR0FBQTtXQUFXLElBQUMsQ0FBQSxNQUFPLENBQUEsS0FBQSxHQUFRLENBQVIsRUFBbkI7RUFBQSxDQW5DVixDQUFBOztBQUFBLDRCQXFDQSxhQUFBLEdBQWUsU0FBQSxHQUFBO1dBQUcsSUFBQyxDQUFBLE1BQU0sQ0FBQyxPQUFYO0VBQUEsQ0FyQ2YsQ0FBQTs7eUJBQUE7O0lBaEJGLENBQUE7O0FDQUEsSUFBQSxNQUFBOztBQUFBLE1BQUEsR0FBUyxPQUFPLENBQUMsTUFBUixDQUFlLE1BQWYsQ0FBVCxDQUFBOztBQUFBLE1BRU0sQ0FBQyxNQUFQLENBQWMsS0FBZCxFQUF5QixTQUFBLEdBQUE7U0FBRyxTQUFDLElBQUQsR0FBQTtBQUFVLElBQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxJQUFaLENBQUEsQ0FBQTtXQUFrQixLQUE1QjtFQUFBLEVBQUg7QUFBQSxDQUF6QixDQUZBLENBQUE7O0FBQUEsTUFHTSxDQUFDLE1BQVAsQ0FBYyxPQUFkLEVBQXlCLFNBQUEsR0FBQTtTQUFHLFNBQUMsSUFBRCxHQUFBO1dBQVUsSUFBSSxDQUFDLFNBQUwsQ0FBZSxJQUFmLEVBQVY7RUFBQSxFQUFIO0FBQUEsQ0FBekIsQ0FIQSxDQUFBOztBQUFBLE1BS00sQ0FBQyxNQUFQLENBQWMsU0FBZCxFQUF5QixTQUFBLEdBQUE7U0FBRyxTQUFDLElBQUQsRUFBTyxDQUFQLEVBQVUsQ0FBVixHQUFBO1dBQWdCLElBQUksQ0FBQyxPQUFMLENBQWEsQ0FBYixFQUFnQixDQUFoQixFQUFoQjtFQUFBLEVBQUg7QUFBQSxDQUF6QixDQUxBLENBQUE7O0FDQUEsSUFBQSxNQUFBO0VBQUE7aVNBQUE7O0FBQUEsTUFBQSxHQUFTLE9BQU8sQ0FBQyxNQUFSLENBQWUsTUFBZixDQUFULENBQUE7O0FBQUEsTUFDTSxDQUFDLFVBQVAsQ0FBa0Isa0JBQWxCLEVBQXNDLFNBQUMsTUFBRCxFQUFTLFVBQVQsR0FBQTtTQUVwQyxHQUFBLENBQUE7QUFVRSw2QkFBQSxDQUFBOztBQUFhLElBQUEsZ0JBQUEsR0FBQTtBQUNYLE1BQUEsd0NBQU0sTUFBTixFQUFjLFVBQWQsQ0FBQSxDQURXO0lBQUEsQ0FBYjs7a0JBQUE7O0tBVmdCLG9CQUZrQjtBQUFBLENBQXRDLENBREEsQ0FBQTs7QUNBQSxJQUFBLE1BQUE7RUFBQTtpU0FBQTs7QUFBQSxNQUFBLEdBQVMsT0FBTyxDQUFDLE1BQVIsQ0FBZSxNQUFmLENBQVQsQ0FBQTs7QUFBQSxNQUNNLENBQUMsVUFBUCxDQUFrQixnQkFBbEIsRUFBb0MsU0FBQyxNQUFELEVBQVMsVUFBVCxFQUFxQixRQUFyQixHQUFBO1NBRWxDLEdBQUEsQ0FBQTtBQU1FLDZCQUFBLENBQUE7O0FBQUEscUJBQUEsTUFBQSxHQUFRLEVBQVIsQ0FBQTs7QUFNYSxJQUFBLGdCQUFBLEdBQUE7QUFDWCxNQUFBLHdDQUFNLE1BQU4sRUFBYyxVQUFkLENBQUEsQ0FBQTtBQUFBLE1BRUEsVUFBVSxDQUFDLE1BQVgsQ0FBa0IsUUFBbEIsRUFBNEIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsTUFBRCxHQUFBO2lCQUMxQixLQUFDLENBQUEsTUFBRCxHQUFVLE9BRGdCO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBNUIsQ0FGQSxDQURXO0lBQUEsQ0FOYjs7a0JBQUE7O0tBTmdCLG9CQUZnQjtBQUFBLENBQXBDLENBREEsQ0FBQTs7QUNBQSxJQUFBLE1BQUE7RUFBQTtpU0FBQTs7QUFBQSxNQUFBLEdBQVMsT0FBTyxDQUFDLE1BQVIsQ0FBZSxNQUFmLENBQVQsQ0FBQTs7QUFBQSxNQUNNLENBQUMsVUFBUCxDQUFrQixpQkFBbEIsRUFBcUMsU0FBQyxNQUFELEVBQVMsVUFBVCxHQUFBO1NBRW5DLEdBQUEsQ0FBQTtBQVVFLDZCQUFBLENBQUE7O0FBQWEsSUFBQSxnQkFBQSxHQUFBO0FBQ1gsTUFBQSx3Q0FBTSxNQUFOLEVBQWMsVUFBZCxDQUFBLENBRFc7SUFBQSxDQUFiOztrQkFBQTs7S0FWZ0Isb0JBRmlCO0FBQUEsQ0FBckMsQ0FEQSxDQUFBOztBQ0FBLElBQUEsTUFBQTtFQUFBO2lTQUFBOztBQUFBLE1BQUEsR0FBUyxPQUFPLENBQUMsTUFBUixDQUFlLE1BQWYsQ0FBVCxDQUFBOztBQUFBLE1BQ00sQ0FBQyxVQUFQLENBQWtCLGdCQUFsQixFQUFvQyxTQUFDLE1BQUQsRUFBUyxVQUFULEVBQXFCLE1BQXJCLEdBQUE7U0FFbEMsR0FBQSxDQUFBO0FBVUUsNkJBQUEsQ0FBQTs7QUFBYSxJQUFBLGdCQUFBLEdBQUE7QUFDWCxNQUFBLHdDQUFNLE1BQU4sRUFBYyxVQUFkLENBQUEsQ0FBQTtBQUFBLE1BRUEsTUFBTSxDQUFDLE1BQVAsR0FBZ0IsTUFGaEIsQ0FEVztJQUFBLENBQWI7O2tCQUFBOztLQVZnQixvQkFGZ0I7QUFBQSxDQUFwQyxDQURBLENBQUE7O0FDQUEsSUFBQSxNQUFBO0VBQUE7O2lTQUFBOztBQUFBLE1BQUEsR0FBUyxPQUFPLENBQUMsTUFBUixDQUFlLE1BQWYsQ0FBVCxDQUFBOztBQUFBLE1BQ00sQ0FBQyxVQUFQLENBQWtCLGVBQWxCLEVBQW1DLFNBQUMsTUFBRCxFQUFTLFVBQVQsRUFBcUIsTUFBckIsR0FBQTtTQUVqQyxHQUFBLENBQUE7QUFVRSw2QkFBQSxDQUFBOztBQUFhLElBQUEsZ0JBQUEsR0FBQTtBQUNYLHlDQUFBLENBQUE7QUFBQSxNQUFBLHdDQUFNLE1BQU4sRUFBYyxVQUFkLENBQUEsQ0FEVztJQUFBLENBQWI7O0FBQUEscUJBT0EsSUFBQSxHQUFNLFNBQUEsR0FBQTtBQUNKLFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBQSxHQUFPLENBQUEsQ0FBRSxPQUFGLENBQVAsQ0FBQTtBQUFBLE1BQ0EsSUFBSSxDQUFDLE1BQUwsQ0FBWSxTQUFBLEdBQUE7QUFDVixRQUFBLFVBQVUsQ0FBQyxNQUFYLEdBQW9CLENBQUEsQ0FBRSxJQUFGLENBQUksQ0FBQyxHQUFMLENBQUEsQ0FBVSxDQUFDLEtBQVgsQ0FBaUIsR0FBakIsQ0FBcEIsQ0FBQTtlQUNBLE1BQU0sQ0FBQyxFQUFQLENBQVUsV0FBVixFQUZVO01BQUEsQ0FBWixDQURBLENBQUE7QUFBQSxNQUlBLElBQUksQ0FBQyxLQUFMLENBQUEsQ0FKQSxDQUFBO0FBS0EsYUFBTyxLQUFQLENBTkk7SUFBQSxDQVBOLENBQUE7O2tCQUFBOztLQVZnQixvQkFGZTtBQUFBLENBQW5DLENBREEsQ0FBQTs7QUNBQSxJQUFBLE1BQUE7RUFBQTs7aVNBQUE7O0FBQUEsTUFBQSxHQUFTLE9BQU8sQ0FBQyxNQUFSLENBQWUsTUFBZixDQUFULENBQUE7O0FBQUEsTUFFTSxDQUFDLFNBQVAsQ0FBaUIsT0FBakIsRUFBMEIsU0FBQSxHQUFBO1NBQ3hCO0FBQUEsSUFBQSxRQUFBLEVBQVUsR0FBVjtBQUFBLElBQ0EsS0FBQSxFQUNFO0FBQUEsTUFBQSxNQUFBLEVBQVEsR0FBUjtLQUZGO0FBQUEsSUFHQSxXQUFBLEVBQWEsNkJBSGI7QUFBQSxJQUlBLElBQUEsRUFBTSxTQUFDLEtBQUQsRUFBUSxPQUFSLEVBQWlCLEtBQWpCLEVBQXdCLElBQXhCLEVBQThCLENBQTlCLEdBQUE7YUFBb0MsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFYLENBQWdCLE9BQWhCLEVBQXBDO0lBQUEsQ0FKTjtBQUFBLElBS0EsVUFBQSxFQUFZLFNBQUMsTUFBRCxFQUFTLFVBQVQsRUFBcUIsUUFBckIsR0FBQTthQUVWLEdBQUEsQ0FBQTtBQU1FLGlDQUFBLENBQUE7O0FBQUEseUJBQUEsRUFBQSxHQUFJLENBQUosQ0FBQTs7QUFBQSx5QkFDQSxFQUFBLEdBQUksQ0FESixDQUFBOztBQUFBLHlCQUVBLE1BQUEsR0FBUSxDQUZSLENBQUE7O0FBQUEseUJBR0EsS0FBQSxHQUFPLFVBSFAsQ0FBQTs7QUFBQSx5QkFLQSxLQUFBLEdBQU8sQ0FMUCxDQUFBOztBQUFBLHlCQU9BLFlBQUEsR0FBYyxHQVBkLENBQUE7O0FBQUEseUJBUUEsaUJBQUEsR0FBbUIsQ0FSbkIsQ0FBQTs7QUFjYSxRQUFBLGdCQUFBLEdBQUE7QUFDWCxpREFBQSxDQUFBO0FBQUEsNkNBQUEsQ0FBQTtBQUFBLCtDQUFBLENBQUE7QUFBQSxxREFBQSxDQUFBO0FBQUEsaURBQUEsQ0FBQTtBQUFBLDZDQUFBLENBQUE7QUFBQSxVQUFBLHdDQUFNLE1BQU4sRUFBYyxVQUFkLENBQUEsQ0FEVztRQUFBLENBZGI7O0FBQUEseUJBcUJBLElBQUEsR0FBTSxTQUFFLFFBQUYsR0FBQTtBQUNKLFVBREssSUFBQyxDQUFBLFdBQUEsUUFDTixDQUFBO0FBQUEsVUFBQSxJQUFDLENBQUEsT0FBRCxHQUFjLElBQUMsQ0FBQSxRQUFTLENBQUEsQ0FBQSxDQUF4QixDQUFBO0FBQUEsVUFDQSxJQUFDLENBQUEsU0FBRCxHQUFjLENBQUEsQ0FBRSxRQUFGLENBRGQsQ0FBQTtBQUFBLFVBR0EsQ0FBQSxDQUFFLE1BQUYsQ0FBUyxDQUFDLE1BQVYsQ0FBaUIsSUFBQyxDQUFBLE1BQWxCLENBSEEsQ0FBQTtBQUFBLFVBS0EsV0FBVyxDQUFDLE1BQVosQ0FBbUIsSUFBQyxDQUFBLE9BQXBCLENBTEEsQ0FBQTtBQUFBLFVBTUEsSUFBQyxDQUFBLFFBQUQsQ0FBQSxDQU5BLENBQUE7aUJBUUEsTUFBTSxDQUFDLE1BQVAsQ0FBYyxRQUFkLEVBQXdCLENBQUEsU0FBQSxLQUFBLEdBQUE7bUJBQUEsU0FBQyxNQUFELEdBQUE7QUFDdEIsY0FBQSxJQUFHLGdCQUFBLElBQVksTUFBQSxLQUFZLEVBQTNCO3VCQUNFLEtBQUMsQ0FBQSxLQUFELENBQU8sTUFBUCxFQURGO2VBRHNCO1lBQUEsRUFBQTtVQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBeEIsRUFUSTtRQUFBLENBckJOLENBQUE7O0FBQUEseUJBa0NBLE1BQUEsR0FBUSxTQUFBLEdBQUE7aUJBQUcsc0JBQUg7UUFBQSxDQWxDUixDQUFBOztBQUFBLHlCQW9DQSxRQUFBLEdBQVUsU0FBQSxHQUFBO0FBQ1IsVUFBQSxJQUFDLENBQUEsUUFBUSxDQUFDLElBQVYsQ0FBZSxZQUFmLEVBQTZCLENBQUEsU0FBQSxLQUFBLEdBQUE7bUJBQUEsU0FBQyxDQUFELEdBQUE7QUFDM0Isa0JBQUEsZ0JBQUE7QUFBQSxjQUFBLENBQUMsQ0FBQyxjQUFGLENBQUEsQ0FBQSxDQUFBO0FBQ0EsY0FBQSxJQUFVLENBQUEsS0FBSyxDQUFBLE1BQUQsQ0FBQSxDQUFkO0FBQUEsc0JBQUEsQ0FBQTtlQURBO0FBQUEsY0FHQSxTQUFBLEdBQVksQ0FBQyxDQUFDLGFBQWEsQ0FBQyxVQUg1QixDQUFBO0FBTUEsY0FBQSxJQUFHLFNBQUEsR0FBWSxDQUFmO0FBQ0UsZ0JBQUEsSUFBRyxLQUFDLENBQUEsaUJBQUQsR0FBcUIsQ0FBeEI7QUFDRSxrQkFBQSxLQUFDLENBQUEsaUJBQUQsR0FBcUIsQ0FBckIsQ0FERjtpQkFERjtlQUFBLE1BQUE7QUFJRSxnQkFBQSxJQUFHLEtBQUMsQ0FBQSxpQkFBRCxHQUFxQixDQUF4QjtBQUNFLGtCQUFBLEtBQUMsQ0FBQSxpQkFBRCxHQUFxQixDQUFyQixDQURGO2lCQUpGO2VBTkE7QUFBQSxjQWFBLEtBQUMsQ0FBQSxpQkFBRCxHQUFxQixLQUFDLENBQUEsaUJBQUQsR0FBcUIsU0FiMUMsQ0FBQTtBQUFBLGNBZUEsS0FBQSxHQUFRLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBSSxDQUFDLEdBQUwsQ0FBUyxLQUFDLENBQUEsaUJBQVYsQ0FBQSxHQUErQixLQUFDLENBQUEsWUFBM0MsQ0FmUixDQUFBO0FBaUJBLGNBQUEsSUFBRyxLQUFBLEtBQVcsQ0FBZDtBQUNFLGdCQUFBLEtBQUMsQ0FBQSxpQkFBRCxHQUFxQixLQUFDLENBQUEsaUJBQUQsR0FBcUIsS0FBQyxDQUFBLFlBQTNDLENBQUE7QUFDQSxnQkFBQSxJQUFHLFNBQUEsR0FBWSxDQUFmO0FBQ0Usa0JBQUEsSUFBRyxLQUFDLENBQUEsS0FBRCxHQUFTLENBQVo7QUFDRSxvQkFBQSxLQUFDLENBQUEsS0FBRCxHQUFTLEtBQUMsQ0FBQSxLQUFELEdBQVMsQ0FBbEIsQ0FBQTtBQUFBLG9CQUNBLEtBQUMsQ0FBQSxJQUFELENBQUEsQ0FEQSxDQURGO21CQURGO2lCQUFBLE1BQUE7QUFLRSxrQkFBQSxJQUFHLEtBQUMsQ0FBQSxLQUFELEdBQVMsS0FBQyxDQUFBLE1BQWI7QUFDRSxvQkFBQSxLQUFDLENBQUEsS0FBRCxHQUFTLEtBQUMsQ0FBQSxLQUFELEdBQVMsQ0FBbEIsQ0FBQTtBQUFBLG9CQUNBLEtBQUMsQ0FBQSxJQUFELENBQUEsQ0FEQSxDQURGO21CQUxGO2lCQURBO3VCQVVBLEtBQUMsQ0FBQSxLQUFLLENBQUMsTUFBUCxDQUFBLEVBWEY7ZUFsQjJCO1lBQUEsRUFBQTtVQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBN0IsQ0FBQSxDQUFBO2lCQStCQSxJQUFDLENBQUEsUUFBUSxDQUFDLFNBQVYsQ0FBb0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTttQkFBQSxTQUFDLENBQUQsR0FBQTtBQUNsQixrQkFBQSxZQUFBO0FBQUEsY0FBQSxJQUFVLENBQUEsS0FBSyxDQUFBLE1BQUQsQ0FBQSxDQUFkO0FBQUEsc0JBQUEsQ0FBQTtlQUFBO0FBQUEsY0FFQSxLQUFBLEdBQVEsQ0FBQyxDQUFDLEtBRlYsQ0FBQTtBQUFBLGNBR0EsS0FBQSxHQUFRLENBQUMsQ0FBQyxLQUhWLENBQUE7QUFBQSxjQUtBLEtBQUMsQ0FBQSxTQUFTLENBQUMsU0FBWCxDQUFxQixTQUFDLENBQUQsR0FBQTtBQUNuQixvQkFBQSxjQUFBO0FBQUEsZ0JBQUEsTUFBQSxHQUFTLENBQUMsQ0FBQyxLQUFGLEdBQVUsS0FBbkIsQ0FBQTtBQUFBLGdCQUNBLE1BQUEsR0FBUyxDQUFDLENBQUMsS0FBRixHQUFVLEtBRG5CLENBQUE7QUFBQSxnQkFFQSxLQUFBLEdBQVEsQ0FBQyxDQUFDLEtBRlYsQ0FBQTtBQUFBLGdCQUdBLEtBQUEsR0FBUSxDQUFDLENBQUMsS0FIVixDQUFBO0FBQUEsZ0JBSUEsS0FBQyxDQUFBLFFBQVEsQ0FBQyxHQUFHLENBQUMsV0FBZCxJQUE2QixNQUFBLEdBQVMsS0FBQyxDQUFBLFFBQVEsQ0FBQyxLQUpoRCxDQUFBO0FBQUEsZ0JBS0EsS0FBQyxDQUFBLFFBQVEsQ0FBQyxHQUFHLENBQUMsWUFBZCxJQUE4QixNQUFBLEdBQVMsS0FBQyxDQUFBLFFBQVEsQ0FBQyxLQUxqRCxDQUFBO0FBQUEsZ0JBTUEsV0FBVyxDQUFDLFdBQVosQ0FBd0IsS0FBQyxDQUFBLE9BQXpCLEVBQWtDLEtBQUMsQ0FBQSxRQUFuQyxDQU5BLENBQUE7QUFBQSxnQkFRQSxLQUFDLENBQUEsRUFBRCxHQUFNLElBQUksQ0FBQyxLQUFMLENBQVcsS0FBQyxDQUFBLFFBQVEsQ0FBQyxHQUFHLENBQUMsV0FBekIsQ0FSTixDQUFBO0FBQUEsZ0JBU0EsS0FBQyxDQUFBLEVBQUQsR0FBTSxJQUFJLENBQUMsS0FBTCxDQUFXLEtBQUMsQ0FBQSxRQUFRLENBQUMsR0FBRyxDQUFDLFlBQXpCLENBVE4sQ0FBQTt1QkFVQSxLQUFDLENBQUEsS0FBSyxDQUFDLE1BQVAsQ0FBQSxFQVhtQjtjQUFBLENBQXJCLENBTEEsQ0FBQTtxQkFrQkEsS0FBQyxDQUFBLFNBQVMsQ0FBQyxPQUFYLENBQW1CLFNBQUMsQ0FBRCxHQUFBO0FBQ2pCLGdCQUFBLEtBQUMsQ0FBQSxTQUFTLENBQUMsTUFBWCxDQUFrQixXQUFsQixDQUFBLENBQUE7dUJBQ0EsS0FBQyxDQUFBLFNBQVMsQ0FBQyxNQUFYLENBQWtCLFNBQWxCLEVBRmlCO2NBQUEsQ0FBbkIsRUFuQmtCO1lBQUEsRUFBQTtVQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBcEIsRUFoQ1E7UUFBQSxDQXBDVixDQUFBOztBQUFBLHlCQTJGQSxLQUFBLEdBQU8sU0FBQyxLQUFELEdBQUE7QUFDTCxVQUFBLElBQUMsQ0FBQSxNQUFELEdBQWMsSUFBQSxlQUFBLENBQWdCLEtBQWhCLENBQWQsQ0FBQTtBQUFBLFVBRUEsSUFBQyxDQUFBLEtBQUQsR0FBUyxDQUZULENBQUE7QUFBQSxVQUdBLElBQUMsQ0FBQSxpQkFBRCxHQUFxQixDQUhyQixDQUFBO2lCQUtBLElBQUMsQ0FBQSxJQUFELENBQUEsRUFOSztRQUFBLENBM0ZQLENBQUE7O0FBQUEseUJBbUdBLElBQUEsR0FBTSxTQUFBLEdBQUE7aUJBQ0osSUFBQyxDQUFBLE1BQU0sQ0FBQyxRQUFSLENBQWlCLElBQUMsQ0FBQSxLQUFsQixDQUNBLENBQUMsSUFERCxDQUNNLENBQUEsU0FBQSxLQUFBLEdBQUE7bUJBQUEsU0FBQyxLQUFELEdBQUE7QUFDSixjQUFBLFdBQVcsQ0FBQyxZQUFaLENBQXlCLEtBQUMsQ0FBQSxPQUExQixFQUFtQyxLQUFuQyxDQUFBLENBQUE7QUFBQSxjQUNBLEtBQUMsQ0FBQSxRQUFELEdBQVksV0FBVyxDQUFDLFdBQVosQ0FBd0IsS0FBQyxDQUFBLE9BQXpCLENBRFosQ0FBQTtBQUFBLGNBR0EsS0FBQyxDQUFBLFFBQVEsQ0FBQyxHQUFHLENBQUMsWUFBZCxHQUE2QixLQUFLLENBQUMsWUFIbkMsQ0FBQTtBQUFBLGNBSUEsS0FBQyxDQUFBLFFBQVEsQ0FBQyxHQUFHLENBQUMsV0FBZCxHQUE0QixLQUFLLENBQUMsV0FKbEMsQ0FBQTtBQUFBLGNBS0EsV0FBVyxDQUFDLFdBQVosQ0FBd0IsS0FBQyxDQUFBLE9BQXpCLEVBQWtDLEtBQUMsQ0FBQSxRQUFuQyxDQUxBLENBQUE7QUFBQSxjQU9BLEtBQUMsQ0FBQSxFQUFELEdBQU0sS0FBQyxDQUFBLFFBQVEsQ0FBQyxHQUFHLENBQUMsV0FQcEIsQ0FBQTtBQUFBLGNBUUEsS0FBQyxDQUFBLEVBQUQsR0FBTSxLQUFDLENBQUEsUUFBUSxDQUFDLEdBQUcsQ0FBQyxZQVJwQixDQUFBO0FBQUEsY0FTQSxLQUFDLENBQUEsS0FBRCxHQUFTLEtBQUMsQ0FBQSxNQUFNLENBQUMsU0FUakIsQ0FBQTtBQUFBLGNBVUEsS0FBQyxDQUFBLE1BQUQsR0FBVSxLQUFDLENBQUEsTUFBTSxDQUFDLGFBQVIsQ0FBQSxDQVZWLENBQUE7cUJBWUEsS0FBQyxDQUFBLE1BQUQsQ0FBQSxFQWJJO1lBQUEsRUFBQTtVQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FETixFQURJO1FBQUEsQ0FuR04sQ0FBQTs7QUFBQSx5QkFvSEEsTUFBQSxHQUFRLFNBQUEsR0FBQTtBQUNOLFVBQUEsSUFBcUMsSUFBQyxDQUFBLE1BQUQsQ0FBQSxDQUFyQzttQkFBQSxXQUFXLENBQUMsTUFBWixDQUFtQixJQUFDLENBQUEsT0FBcEIsRUFBNkIsSUFBN0IsRUFBQTtXQURNO1FBQUEsQ0FwSFIsQ0FBQTs7c0JBQUE7O1NBTmdCLG9CQUZSO0lBQUEsQ0FMWjtJQUR3QjtBQUFBLENBQTFCLENBRkEsQ0FBQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUgXCJoaWRhXCIsIFsgJ3VpLnJvdXRlcicsICd1aS5ib290c3RyYXAnIF1cblxuLmNvbmZpZyAoJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikgLT5cbiAgJHN0YXRlUHJvdmlkZXJcbiAgLnN0YXRlIFwibWFpblwiLFxuICAgIGFic3RyYWN0OiB0cnVlXG4gICAgdGVtcGxhdGVVcmw6IFwicGFydHMvbWFpbi5odG1sXCJcbiAgICBjb250cm9sbGVyOiBcIk1haW5Db250cm9sbGVyXCJcbiAgLnN0YXRlIFwibWFpbi5ob21lXCIsXG4gICAgdXJsOiBcIi9ob21lXCJcbiAgICB0ZW1wbGF0ZVVybDogXCJwYXJ0cy9ob21lLmh0bWxcIlxuICAgIGNvbnRyb2xsZXI6IFwiSG9tZUNvbnRyb2xsZXJcIlxuICAuc3RhdGUgXCJtYWluLmV4cG9ydFwiLFxuICAgIHVybDogXCIvZXhwb3J0XCJcbiAgICB0ZW1wbGF0ZVVybDogXCJwYXJ0cy9leHBvcnQuaHRtbFwiXG4gICAgY29udHJvbGxlcjogXCJFeHBvcnRDb250cm9sbGVyXCJcbiAgLnN0YXRlIFwibG9naW5cIixcbiAgICB1cmw6IFwiL2xvZ2luXCJcbiAgICB0ZW1wbGF0ZVVybDogXCJwYXJ0cy9sb2dpbi5odG1sXCJcblxuICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlIFwiL2V4cG9ydFwiXG5cbmd1aSA9IHJlcXVpcmUgXCJudy5ndWlcIlxuXG5zaG9ydGN1dCA9IG5ldyBndWkuU2hvcnRjdXRcbiAga2V5OiAnQ3RybCtRJ1xuICBhY3RpdmU6IGd1aS5BcHAucXVpdFxuXG5ndWkuQXBwLnJlZ2lzdGVyR2xvYmFsSG90S2V5IHNob3J0Y3V0IiwiY2xhc3MgRGVmYXVsdENvbnRyb2xsZXJcblxuICBjb25zdHJ1Y3RvcjogKEBzY29wZSwgQHJvb3QpIC0+XG4gICAgQHNjb3BlLnJvb3QgPSBAcm9vdFxuICAgIEBzY29wZS5jdHJsID0gQFxuXG4gICAgQGluaXQoKVxuXG4gICAgQHNjb3BlLiRvbiAnJGRlc3Ryb3knLCBAZGVzdHJveVxuXG4gIGluaXQ6IC0+XG5cbiAgZGVzdHJveTogLT4iLCJjb2xvcl9pbnRlcnByZXRhdGlvbnMgPSBbXG4gIFwiUkdCXCJcbiAgXCJQQUxFVFRFIENPTE9SXCIgXG4gIFwiWUJSX0ZVTExcIiBcbiAgXCJZQlJfRlVMTF80MjJcIlxuICBcIllCUl9QQVJUSUFMXzQyMlwiIFxuICBcIllCUl9QQVJUSUFMXzQyMFwiIFxuICBcIllCUl9SQ1RcIlxuXVxuXG5jbGFzcyBEaWNvbUZpbGVSZWFkZXJcblxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgIyBJbnN0YW5jZSB2YXJpYWJsZXMgICAgICAjXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG4gIGZyYW1lczogW11cblxuICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgIyBDb25zdHJ1Y3RvciAgICAgICAgICAgICAjXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG4gIGNvbnN0cnVjdG9yOiAoQGZpbGVzKSAtPlxuICAgIEBmcyA9IHJlcXVpcmUgXCJmc1wiXG5cbiAgICBmb3IgQGZpbGUgaW4gQGZpbGVzXG4gICAgICBAX3JlYWQoKVxuICAgICAgQF9tZXRhZGF0YSgpXG4gICAgICBAX2xvYWQoKVxuXG4gICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAjIE1ldGhvZHMgICAgICAgICAgICAgICAgICNcbiAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbiAgX3JlYWQ6ID0+XG4gICAgYnVmZmVyICA9IEBmcy5yZWFkRmlsZVN5bmMgQGZpbGVcbiAgICBAZGF0YVNldCA9IGRpY29tUGFyc2VyLnBhcnNlRGljb20gbmV3IFVpbnQ4QXJyYXkgYnVmZmVyXG5cbiAgX21ldGFkYXRhOiA9PlxuICAgIEBmcmFtZWNvdW50ID0gQGRhdGFTZXQuc3RyaW5nKFwieDAwMjgwMDA4XCIpIHx8IDFcbiAgICBAY29sb3JfaW50ICA9IEBkYXRhU2V0LnN0cmluZyhcIngwMDI4MDAwNFwiKVxuICAgIEBpc19jb2xvciAgID0gLTEgaXNudCBjb2xvcl9pbnRlcnByZXRhdGlvbnMuaW5kZXhPZiBAY29sb3JfaW50XG5cbiAgX2xvYWQ6ID0+XG4gICAgbWV0aG9kID0gaWYgQGlzX2NvbG9yXG4gICAgdGhlbiBjb3JuZXJzdG9uZVdBRE9JbWFnZUxvYWRlci5tYWtlQ29sb3JJbWFnZVxuICAgIGVsc2UgY29ybmVyc3RvbmVXQURPSW1hZ2VMb2FkZXIubWFrZUdyYXlzY2FsZUltYWdlXG5cbiAgICBmb3IgZnJhbWVfaWQgaW4gWzAuLkBmcmFtZWNvdW50IC0gMV1cbiAgICAgIEBmcmFtZXMucHVzaCBtZXRob2QgXCIje0BmaWxlfV8je2ZyYW1lX2lkfVwiLCBAZGF0YVNldCwgQGRhdGFTZXQuYnl0ZUFycmF5LCBAY29sb3JfaW50LCBmcmFtZV9pZFxuXG4gIGdldEZyYW1lOiAoZnJhbWUpID0+IEBmcmFtZXNbZnJhbWUgLSAxXVxuXG4gIGdldEZyYW1lQ291bnQ6ID0+IEBmcmFtZXMubGVuZ3RoIiwibW9kdWxlID0gYW5ndWxhci5tb2R1bGUgJ2hpZGEnXG5cbm1vZHVsZS5maWx0ZXIgJ2xvZycsICAgICAtPiAoZGF0YSkgLT4gY29uc29sZS5sb2cgZGF0YTsgZGF0YVxubW9kdWxlLmZpbHRlciAncHJpbnQnLCAgIC0+IChkYXRhKSAtPiBKU09OLnN0cmluZ2lmeSBkYXRhXG5cbm1vZHVsZS5maWx0ZXIgJ3JlcGxhY2UnLCAtPiAodGV4dCwgYSwgYikgLT4gdGV4dC5yZXBsYWNlIGEsIGIiLCJtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSAnaGlkYSdcbm1vZHVsZS5jb250cm9sbGVyICdFeHBvcnRDb250cm9sbGVyJywgKCRzY29wZSwgJHJvb3RTY29wZSkgLT5cblxuICBuZXcgY2xhc3MgZXh0ZW5kcyBEZWZhdWx0Q29udHJvbGxlclxuXG4gICAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICAgIyBJbnN0YW5jZSB2YXJpYWJsZXMgICAgICAjXG4gICAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbiAgICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgICAjIGNvbnN0cnVjdG9yICYgaW5pdCAgICAgICNcbiAgICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuICAgIGNvbnN0cnVjdG9yOiAtPlxuICAgICAgc3VwZXIgJHNjb3BlLCAkcm9vdFNjb3BlXG5cbiAgICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgICAjIE1ldGhvZHMgICAgICAgICAgICAgICAgICNcbiAgICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMiLCJtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSAnaGlkYSdcbm1vZHVsZS5jb250cm9sbGVyICdIb21lQ29udHJvbGxlcicsICgkc2NvcGUsICRyb290U2NvcGUsICR0aW1lb3V0KSAtPlxuXG4gIG5ldyBjbGFzcyBleHRlbmRzIERlZmF1bHRDb250cm9sbGVyXG5cbiAgICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgICAjIEluc3RhbmNlIHZhcmlhYmxlcyAgICAgICNcbiAgICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuICAgIGltYWdlczogJydcblxuICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAgICMgY29uc3RydWN0b3IgICAgICAgICAgICAgI1xuICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG4gICAgY29uc3RydWN0b3I6IC0+XG4gICAgICBzdXBlciAkc2NvcGUsICRyb290U2NvcGVcblxuICAgICAgJHJvb3RTY29wZS4kd2F0Y2ggJ2ltYWdlcycsIChpbWFnZXMpID0+XG4gICAgICAgIEBpbWFnZXMgPSBpbWFnZXNcblxuICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAgICMgTWV0aG9kcyAgICAgICAgICAgICAgICAgI1xuICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyIsIm1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlICdoaWRhJ1xubW9kdWxlLmNvbnRyb2xsZXIgJ0xvZ2luQ29udHJvbGxlcicsICgkc2NvcGUsICRyb290U2NvcGUpIC0+XG5cbiAgbmV3IGNsYXNzIGV4dGVuZHMgRGVmYXVsdENvbnRyb2xsZXJcblxuICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAgICMgSW5zdGFuY2UgdmFyaWFibGVzICAgICAgI1xuICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG4gICAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICAgIyBjb25zdHJ1Y3RvciAmIGluaXQgICAgICAjXG4gICAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbiAgICBjb25zdHJ1Y3RvcjogLT5cbiAgICAgIHN1cGVyICRzY29wZSwgJHJvb3RTY29wZVxuXG4gICAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICAgIyBNZXRob2RzICAgICAgICAgICAgICAgICAjXG4gICAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIiwibW9kdWxlID0gYW5ndWxhci5tb2R1bGUgJ2hpZGEnXG5tb2R1bGUuY29udHJvbGxlciAnTWFpbkNvbnRyb2xsZXInLCAoJHNjb3BlLCAkcm9vdFNjb3BlLCAkc3RhdGUpIC0+XG5cbiAgbmV3IGNsYXNzIGV4dGVuZHMgRGVmYXVsdENvbnRyb2xsZXJcblxuICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAgICMgSW5zdGFuY2UgdmFyaWFibGVzICAgICAgI1xuICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG4gICAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICAgIyBjb25zdHJ1Y3RvciAmIGluaXQgICAgICAjXG4gICAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbiAgICBjb25zdHJ1Y3RvcjogLT5cbiAgICAgIHN1cGVyICRzY29wZSwgJHJvb3RTY29wZVxuXG4gICAgICAkc2NvcGUuJHN0YXRlID0gJHN0YXRlXG5cbiAgICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgICAjIE1ldGhvZHMgICAgICAgICAgICAgICAgICNcbiAgICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMiLCJtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSAnaGlkYSdcbm1vZHVsZS5jb250cm9sbGVyICdOYXZDb250cm9sbGVyJywgKCRzY29wZSwgJHJvb3RTY29wZSwgJHN0YXRlKSAtPlxuXG4gIG5ldyBjbGFzcyBleHRlbmRzIERlZmF1bHRDb250cm9sbGVyXG5cbiAgICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgICAjIEluc3RhbmNlIHZhcmlhYmxlcyAgICAgICNcbiAgICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAgICMgY29uc3RydWN0b3IgJiBpbml0ICAgICAgI1xuICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG4gICAgY29uc3RydWN0b3I6IC0+XG4gICAgICBzdXBlciAkc2NvcGUsICRyb290U2NvcGVcblxuICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAgICMgTWV0aG9kcyAgICAgICAgICAgICAgICAgI1xuICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG4gICAgb3BlbjogPT5cbiAgICAgIGZpbGUgPSAkKCcjZmlsZScpXG4gICAgICBmaWxlLmNoYW5nZSAtPiBcbiAgICAgICAgJHJvb3RTY29wZS5pbWFnZXMgPSAkKEApLnZhbCgpLnNwbGl0ICc7J1xuICAgICAgICAkc3RhdGUuZ28gJ21haW4uaG9tZSdcbiAgICAgIGZpbGUuY2xpY2soKVxuICAgICAgcmV0dXJuIGZhbHNlIiwibW9kdWxlID0gYW5ndWxhci5tb2R1bGUgJ2hpZGEnXG5cbm1vZHVsZS5kaXJlY3RpdmUgJ2RpY29tJywgLT5cbiAgcmVzdHJpY3Q6ICdFJ1xuICBzY29wZTogXG4gICAgaW1hZ2VzOiAnPSdcbiAgdGVtcGxhdGVVcmw6IFwicGFydHMvZGlyZWN0aXZlcy9kaWNvbS5odG1sXCJcbiAgbGluazogKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY3RybCwgYikgLT4gc2NvcGUuY3RybC5saW5rIGVsZW1lbnRcbiAgY29udHJvbGxlcjogKCRzY29wZSwgJHJvb3RTY29wZSwgJHRpbWVvdXQpIC0+XG5cbiAgICBuZXcgY2xhc3MgZXh0ZW5kcyBEZWZhdWx0Q29udHJvbGxlclxuXG4gICAgICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgICAgICMgSW5zdGFuY2UgdmFyaWFibGVzICAgICAgI1xuICAgICAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbiAgICAgIHd3OiAwXG4gICAgICB3bDogMFxuICAgICAgZnJhbWVzOiAxXG4gICAgICBjb2xvcjogJ05vIGNvbG9yJ1xuXG4gICAgICBmcmFtZTogMVxuXG4gICAgICBzY3JvbGxfc3BlZWQ6IDEwMCAjIEhpZ2hlciBpcyBzbG93ZXJcbiAgICAgIHNjcm9sbF9jdW11bGF0aXZlOiAwXG5cbiAgICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAgICAgIyBDb25zdHJ1Y3RvciAmIGluaXQgICAgICAjXG4gICAgICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuICAgICAgY29uc3RydWN0b3I6IC0+XG4gICAgICAgIHN1cGVyICRzY29wZSwgJHJvb3RTY29wZVxuXG4gICAgICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgICAgICMgTWV0aG9kcyAgICAgICAgICAgICAgICAgI1xuICAgICAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbiAgICAgIGxpbms6IChAJGVsZW1lbnQpID0+XG4gICAgICAgIEBlbGVtZW50ICAgID0gQCRlbGVtZW50WzBdXG4gICAgICAgIEAkZG9jdW1lbnQgID0gJChkb2N1bWVudClcblxuICAgICAgICAkKHdpbmRvdykucmVzaXplIEByZXNpemVcblxuICAgICAgICBjb3JuZXJzdG9uZS5lbmFibGUgQGVsZW1lbnRcbiAgICAgICAgQHJlZ2lzdGVyKClcblxuICAgICAgICAkc2NvcGUuJHdhdGNoICdpbWFnZXMnLCAoaW1hZ2VzKSA9PlxuICAgICAgICAgIGlmIGltYWdlcz8gYW5kIGltYWdlcyBpc250ICcnXG4gICAgICAgICAgICBAaW1hZ2UgaW1hZ2VzXG5cbiAgICAgIGxvYWRlZDogPT4gQHZpZXdwb3J0P1xuXG4gICAgICByZWdpc3RlcjogPT5cbiAgICAgICAgQCRlbGVtZW50LmJpbmQgJ21vdXNld2hlZWwnLCAoZSkgPT5cbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICByZXR1cm4gaWYgbm90IEBsb2FkZWQoKVxuXG4gICAgICAgICAgZGlyZWN0aW9uID0gZS5vcmlnaW5hbEV2ZW50LndoZWVsRGVsdGFcblxuICAgICAgICAgICMgTWFrZSBzdXJlIHdlIGFkZCB1cCBpbiByaWdodCBzY3JvbGwgZGlyZWN0aW9uXG4gICAgICAgICAgaWYgZGlyZWN0aW9uID4gMFxuICAgICAgICAgICAgaWYgQHNjcm9sbF9jdW11bGF0aXZlIDwgMFxuICAgICAgICAgICAgICBAc2Nyb2xsX2N1bXVsYXRpdmUgPSAwXG4gICAgICAgICAgZWxzZSBcbiAgICAgICAgICAgIGlmIEBzY3JvbGxfY3VtdWxhdGl2ZSA+IDBcbiAgICAgICAgICAgICAgQHNjcm9sbF9jdW11bGF0aXZlID0gMFxuXG4gICAgICAgICAgQHNjcm9sbF9jdW11bGF0aXZlID0gQHNjcm9sbF9jdW11bGF0aXZlICsgZGlyZWN0aW9uXG5cbiAgICAgICAgICBzdGVwcyA9IE1hdGguZmxvb3IgTWF0aC5hYnMoQHNjcm9sbF9jdW11bGF0aXZlKSAvIEBzY3JvbGxfc3BlZWRcblxuICAgICAgICAgIGlmIHN0ZXBzIGlzbnQgMFxuICAgICAgICAgICAgQHNjcm9sbF9jdW11bGF0aXZlID0gQHNjcm9sbF9jdW11bGF0aXZlICUgQHNjcm9sbF9zcGVlZFxuICAgICAgICAgICAgaWYgZGlyZWN0aW9uIDwgMFxuICAgICAgICAgICAgICBpZiBAZnJhbWUgPiAxXG4gICAgICAgICAgICAgICAgQGZyYW1lID0gQGZyYW1lIC0gMVxuICAgICAgICAgICAgICAgIEBzaG93KClcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgaWYgQGZyYW1lIDwgQGZyYW1lc1xuICAgICAgICAgICAgICAgIEBmcmFtZSA9IEBmcmFtZSArIDFcbiAgICAgICAgICAgICAgICBAc2hvdygpXG5cbiAgICAgICAgICAgIEBzY29wZS4kYXBwbHkoKVxuXG4gICAgICAgIEAkZWxlbWVudC5tb3VzZWRvd24gKGUpID0+XG4gICAgICAgICAgcmV0dXJuIGlmIG5vdCBAbG9hZGVkKClcblxuICAgICAgICAgIGxhc3RYID0gZS5wYWdlWFxuICAgICAgICAgIGxhc3RZID0gZS5wYWdlWVxuXG4gICAgICAgICAgQCRkb2N1bWVudC5tb3VzZW1vdmUgKGUpID0+XG4gICAgICAgICAgICBkZWx0YVggPSBlLnBhZ2VYIC0gbGFzdFhcbiAgICAgICAgICAgIGRlbHRhWSA9IGUucGFnZVkgLSBsYXN0WVxuICAgICAgICAgICAgbGFzdFggPSBlLnBhZ2VYXG4gICAgICAgICAgICBsYXN0WSA9IGUucGFnZVlcbiAgICAgICAgICAgIEB2aWV3cG9ydC52b2kud2luZG93V2lkdGggKz0gZGVsdGFYIC8gQHZpZXdwb3J0LnNjYWxlXG4gICAgICAgICAgICBAdmlld3BvcnQudm9pLndpbmRvd0NlbnRlciArPSBkZWx0YVkgLyBAdmlld3BvcnQuc2NhbGVcbiAgICAgICAgICAgIGNvcm5lcnN0b25lLnNldFZpZXdwb3J0IEBlbGVtZW50LCBAdmlld3BvcnRcblxuICAgICAgICAgICAgQHd3ID0gTWF0aC5yb3VuZCBAdmlld3BvcnQudm9pLndpbmRvd1dpZHRoXG4gICAgICAgICAgICBAd2wgPSBNYXRoLnJvdW5kIEB2aWV3cG9ydC52b2kud2luZG93Q2VudGVyXG4gICAgICAgICAgICBAc2NvcGUuJGFwcGx5KClcblxuICAgICAgICAgIEAkZG9jdW1lbnQubW91c2V1cCAoZSkgPT5cbiAgICAgICAgICAgIEAkZG9jdW1lbnQudW5iaW5kIFwibW91c2Vtb3ZlXCJcbiAgICAgICAgICAgIEAkZG9jdW1lbnQudW5iaW5kIFwibW91c2V1cFwiXG5cbiAgICAgIGltYWdlOiAoZmlsZXMpID0+XG4gICAgICAgIEByZWFkZXIgPSBuZXcgRGljb21GaWxlUmVhZGVyIGZpbGVzXG5cbiAgICAgICAgQGZyYW1lID0gMVxuICAgICAgICBAc2Nyb2xsX2N1bXVsYXRpdmUgPSAwXG5cbiAgICAgICAgQHNob3coKVxuXG4gICAgICBzaG93OiA9PlxuICAgICAgICBAcmVhZGVyLmdldEZyYW1lIEBmcmFtZVxuICAgICAgICAudGhlbiAoaW1hZ2UpID0+XG4gICAgICAgICAgY29ybmVyc3RvbmUuZGlzcGxheUltYWdlIEBlbGVtZW50LCBpbWFnZVxuICAgICAgICAgIEB2aWV3cG9ydCA9IGNvcm5lcnN0b25lLmdldFZpZXdwb3J0IEBlbGVtZW50XG5cbiAgICAgICAgICBAdmlld3BvcnQudm9pLndpbmRvd0NlbnRlciA9IGltYWdlLndpbmRvd0NlbnRlclxuICAgICAgICAgIEB2aWV3cG9ydC52b2kud2luZG93V2lkdGggPSBpbWFnZS53aW5kb3dXaWR0aFxuICAgICAgICAgIGNvcm5lcnN0b25lLnNldFZpZXdwb3J0IEBlbGVtZW50LCBAdmlld3BvcnRcblxuICAgICAgICAgIEB3dyA9IEB2aWV3cG9ydC52b2kud2luZG93V2lkdGhcbiAgICAgICAgICBAd2wgPSBAdmlld3BvcnQudm9pLndpbmRvd0NlbnRlclxuICAgICAgICAgIEBjb2xvciA9IEByZWFkZXIuY29sb3JfaW50XG4gICAgICAgICAgQGZyYW1lcyA9IEByZWFkZXIuZ2V0RnJhbWVDb3VudCgpXG5cbiAgICAgICAgICBAcmVzaXplKClcblxuICAgICAgcmVzaXplOiA9PlxuICAgICAgICBjb3JuZXJzdG9uZS5yZXNpemUgQGVsZW1lbnQsIHRydWUgaWYgQGxvYWRlZCgpIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9