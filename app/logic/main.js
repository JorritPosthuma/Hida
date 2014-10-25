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

var DicomFileReader, reader,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

DicomFileReader = (function() {
  function DicomFileReader() {
    this.loadImage = __bind(this.loadImage, this);
    this.createImageObject = __bind(this.createImageObject, this);
    this.isColorImage = __bind(this.isColorImage, this);
  }

  DicomFileReader.prototype.colorInterpretations = ["RGB", "PALETTE COLOR", "YBR_FULL", "YBR_FULL_422", "YBR_PARTIAL_422", "YBR_PARTIAL_420", "YBR_RCT"];

  DicomFileReader.prototype.isColorImage = function(photoMetricInterpretation) {
    return -1 !== this.colorInterpretations.indexOf(photoMetricInterpretation);
  };

  DicomFileReader.prototype.createImageObject = function(dataSet, imageId) {
    var isColor, photoMetricInterpretation;
    photoMetricInterpretation = dataSet.string("x00280004");
    isColor = this.isColorImage(photoMetricInterpretation);
    if (!isColor) {
      return cornerstoneWADOImageLoader.makeGrayscaleImage(imageId, dataSet, dataSet.byteArray, photoMetricInterpretation, 0);
    } else {
      return cornerstoneWADOImageLoader.makeColorImage(imageId, dataSet, dataSet.byteArray, photoMetricInterpretation, 0);
    }
  };

  DicomFileReader.prototype.loadImage = function(imageId) {
    var deferred, url;
    deferred = $.Deferred();
    if (!this.fs) {
      this.fs = require("fs");
    }
    url = imageId.substring(10);
    this.fs.readFile(url, (function(_this) {
      return function(err, buffer) {
        var dataSet, imagePromise;
        dataSet = dicomParser.parseDicom(new Uint8Array(buffer));
        imagePromise = _this.createImageObject(dataSet, imageId);
        return imagePromise.then(deferred.resolve, function() {
          return deferred.reject();
        });
      };
    })(this));
    return deferred;
  };

  return DicomFileReader;

})();

reader = new DicomFileReader;

cornerstone.registerImageLoader("dicomfile", reader.loadImage);

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uY29mZmVlIiwiY29udHJvbGxlci5jb2ZmZWUiLCJkaWNvbS5jb2ZmZWUiLCJmaWx0ZXJzLmNvZmZlZSIsInBhcnRzL2V4cG9ydC5jb2ZmZWUiLCJwYXJ0cy9ob21lLmNvZmZlZSIsInBhcnRzL2xvZ2luLmNvZmZlZSIsInBhcnRzL21haW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sQ0FBQyxNQUFSLENBQWUsTUFBZixFQUF1QixDQUFFLFdBQUYsRUFBZSxVQUFmLENBQXZCLENBRUEsQ0FBQyxNQUZELENBRVEsU0FBQyxjQUFELEVBQWlCLGtCQUFqQixHQUFBO0FBQ04sRUFBQSxjQUNBLENBQUMsS0FERCxDQUNPLE1BRFAsRUFFRTtBQUFBLElBQUEsUUFBQSxFQUFVLElBQVY7QUFBQSxJQUNBLFdBQUEsRUFBYSxpQkFEYjtBQUFBLElBRUEsVUFBQSxFQUFZLGdCQUZaO0dBRkYsQ0FLQSxDQUFDLEtBTEQsQ0FLTyxXQUxQLEVBTUU7QUFBQSxJQUFBLEdBQUEsRUFBSyxPQUFMO0FBQUEsSUFDQSxXQUFBLEVBQWEsaUJBRGI7QUFBQSxJQUVBLFVBQUEsRUFBWSxnQkFGWjtHQU5GLENBU0EsQ0FBQyxLQVRELENBU08sYUFUUCxFQVVFO0FBQUEsSUFBQSxHQUFBLEVBQUssU0FBTDtBQUFBLElBQ0EsV0FBQSxFQUFhLG1CQURiO0FBQUEsSUFFQSxVQUFBLEVBQVksa0JBRlo7R0FWRixDQWFBLENBQUMsS0FiRCxDQWFPLE9BYlAsRUFjRTtBQUFBLElBQUEsR0FBQSxFQUFLLFFBQUw7QUFBQSxJQUNBLFdBQUEsRUFBYSxrQkFEYjtHQWRGLENBQUEsQ0FBQTtTQWlCQSxrQkFBa0IsQ0FBQyxTQUFuQixDQUE2QixPQUE3QixFQWxCTTtBQUFBLENBRlIsQ0FBQSxDQUFBOztBQ0FBLElBQUEsaUJBQUE7O0FBQUE7QUFFZSxFQUFBLDJCQUFFLEtBQUYsRUFBVSxJQUFWLEdBQUE7QUFDWCxJQURZLElBQUMsQ0FBQSxRQUFBLEtBQ2Is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QUFBLEdBQUE7QUFDWCxNQUFBLHdDQUFNLE1BQU4sRUFBYyxVQUFkLENBQUEsQ0FEVztJQUFBLENBQWI7O2tCQUFBOztLQVZnQixvQkFGaUI7QUFBQSxDQUFyQyxDQURBLENBQUE7O0FDQUEsSUFBQSxNQUFBO0VBQUE7aVNBQUE7O0FBQUEsTUFBQSxHQUFTLE9BQU8sQ0FBQyxNQUFSLENBQWUsTUFBZixDQUFULENBQUE7O0FBQUEsTUFDTSxDQUFDLFVBQVAsQ0FBa0IsZ0JBQWxCLEVBQW9DLFNBQUMsTUFBRCxFQUFTLFVBQVQsRUFBcUIsTUFBckIsR0FBQTtTQUVsQyxHQUFBLENBQUE7QUFVRSw2QkFBQSxDQUFBOztBQUFhLElBQUEsZ0JBQUEsR0FBQTtBQUNYLE1BQUEsd0NBQU0sTUFBTixFQUFjLFVBQWQsQ0FBQSxDQUFBO0FBQUEsTUFFQSxNQUFNLENBQUMsTUFBUCxHQUFnQixNQUZoQixDQURXO0lBQUEsQ0FBYjs7a0JBQUE7O0tBVmdCLG9CQUZnQjtBQUFBLENBQXBDLENBREEsQ0FBQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUgXCJoaWRhXCIsIFsgJ3VpLnJvdXRlcicsICdpbnNwaW5pYScgXVxuXG4uY29uZmlnICgkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSAtPlxuICAkc3RhdGVQcm92aWRlclxuICAuc3RhdGUgXCJtYWluXCIsXG4gICAgYWJzdHJhY3Q6IHRydWVcbiAgICB0ZW1wbGF0ZVVybDogXCJwYXJ0cy9tYWluLmh0bWxcIlxuICAgIGNvbnRyb2xsZXI6IFwiTWFpbkNvbnRyb2xsZXJcIlxuICAuc3RhdGUgXCJtYWluLmhvbWVcIixcbiAgICB1cmw6IFwiL2hvbWVcIlxuICAgIHRlbXBsYXRlVXJsOiBcInBhcnRzL2hvbWUuaHRtbFwiXG4gICAgY29udHJvbGxlcjogXCJIb21lQ29udHJvbGxlclwiXG4gIC5zdGF0ZSBcIm1haW4uZXhwb3J0XCIsXG4gICAgdXJsOiBcIi9leHBvcnRcIlxuICAgIHRlbXBsYXRlVXJsOiBcInBhcnRzL2V4cG9ydC5odG1sXCJcbiAgICBjb250cm9sbGVyOiBcIkV4cG9ydENvbnRyb2xsZXJcIlxuICAuc3RhdGUgXCJsb2dpblwiLFxuICAgIHVybDogXCIvbG9naW5cIlxuICAgIHRlbXBsYXRlVXJsOiBcInBhcnRzL2xvZ2luLmh0bWxcIlxuXG4gICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UgXCIvaG9tZVwiIiwiY2xhc3MgRGVmYXVsdENvbnRyb2xsZXJcblxuICBjb25zdHJ1Y3RvcjogKEBzY29wZSwgQHJvb3QpIC0+XG4gICAgQHNjb3BlLnJvb3QgPSBAcm9vdFxuICAgIEBzY29wZS5jdHJsID0gQFxuXG4gICAgQGluaXQoKVxuXG4gICAgQHNjb3BlLiRvbiAnJGRlc3Ryb3knLCBAZGVzdHJveVxuXG4gIGluaXQ6IC0+XG5cbiAgZGVzdHJveTogLT4iLCJjbGFzcyBEaWNvbUZpbGVSZWFkZXJcblxuICBjb2xvckludGVycHJldGF0aW9uczogW1xuICAgIFwiUkdCXCJcbiAgICBcIlBBTEVUVEUgQ09MT1JcIiBcbiAgICBcIllCUl9GVUxMXCIgXG4gICAgXCJZQlJfRlVMTF80MjJcIlxuICAgIFwiWUJSX1BBUlRJQUxfNDIyXCIgXG4gICAgXCJZQlJfUEFSVElBTF80MjBcIiBcbiAgICBcIllCUl9SQ1RcIlxuICBdXG5cbiAgaXNDb2xvckltYWdlOiAocGhvdG9NZXRyaWNJbnRlcnByZXRhdGlvbikgPT5cbiAgICAtMSBpc250IEBjb2xvckludGVycHJldGF0aW9ucy5pbmRleE9mIHBob3RvTWV0cmljSW50ZXJwcmV0YXRpb25cblxuICBjcmVhdGVJbWFnZU9iamVjdDogKGRhdGFTZXQsIGltYWdlSWQpID0+XG4gICAgIyBtYWtlIHRoZSBpbWFnZSBiYXNlZCBvbiB3aGV0aGVyIGl0IGlzIGNvbG9yIG9yIG5vdFxuICAgIHBob3RvTWV0cmljSW50ZXJwcmV0YXRpb24gPSBkYXRhU2V0LnN0cmluZyhcIngwMDI4MDAwNFwiKVxuICAgICMgeDAwMjgwMDA4ID09IEFhbnRhbCBmcmFtZXNcbiAgICBpc0NvbG9yID0gQGlzQ29sb3JJbWFnZSBwaG90b01ldHJpY0ludGVycHJldGF0aW9uXG5cbiAgICBpZiBub3QgaXNDb2xvclxuICAgICAgY29ybmVyc3RvbmVXQURPSW1hZ2VMb2FkZXIubWFrZUdyYXlzY2FsZUltYWdlIGltYWdlSWQsIGRhdGFTZXQsIGRhdGFTZXQuYnl0ZUFycmF5LCBwaG90b01ldHJpY0ludGVycHJldGF0aW9uLCAwXG4gICAgZWxzZVxuICAgICAgY29ybmVyc3RvbmVXQURPSW1hZ2VMb2FkZXIubWFrZUNvbG9ySW1hZ2UgaW1hZ2VJZCwgZGF0YVNldCwgZGF0YVNldC5ieXRlQXJyYXksIHBob3RvTWV0cmljSW50ZXJwcmV0YXRpb24sIDBcblxuICBsb2FkSW1hZ2U6IChpbWFnZUlkKSA9PlxuICAgIGRlZmVycmVkID0gJC5EZWZlcnJlZCgpXG5cbiAgICBAZnMgPSByZXF1aXJlKFwiZnNcIikgaWYgbm90IEBmc1xuICAgIHVybCA9IGltYWdlSWQuc3Vic3RyaW5nIDEwXG5cbiAgICBAZnMucmVhZEZpbGUgdXJsLCAoZXJyLCBidWZmZXIpID0+XG4gICAgICBkYXRhU2V0ID0gZGljb21QYXJzZXIucGFyc2VEaWNvbSBuZXcgVWludDhBcnJheSBidWZmZXJcbiAgICAgIGltYWdlUHJvbWlzZSA9IEBjcmVhdGVJbWFnZU9iamVjdCBkYXRhU2V0LCBpbWFnZUlkXG4gICAgICBpbWFnZVByb21pc2UudGhlbiBkZWZlcnJlZC5yZXNvbHZlLCAtPiBkZWZlcnJlZC5yZWplY3QoKVxuXG4gICAgZGVmZXJyZWRcblxucmVhZGVyID0gbmV3IERpY29tRmlsZVJlYWRlclxuY29ybmVyc3RvbmUucmVnaXN0ZXJJbWFnZUxvYWRlciBcImRpY29tZmlsZVwiLCByZWFkZXIubG9hZEltYWdlIiwibW9kdWxlID0gYW5ndWxhci5tb2R1bGUgJ2hpZGEnXG5cbm1vZHVsZS5maWx0ZXIgJ2xvZycsICAgICAtPiAoZGF0YSkgLT4gY29uc29sZS5sb2cgZGF0YTsgZGF0YVxubW9kdWxlLmZpbHRlciAncHJpbnQnLCAgIC0+IChkYXRhKSAtPiBKU09OLnN0cmluZ2lmeSBkYXRhXG5cbm1vZHVsZS5maWx0ZXIgJ3JlcGxhY2UnLCAtPiAodGV4dCwgYSwgYikgLT4gdGV4dC5yZXBsYWNlIGEsIGIiLCJtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSAnaGlkYSdcbm1vZHVsZS5jb250cm9sbGVyICdFeHBvcnRDb250cm9sbGVyJywgKCRzY29wZSwgJHJvb3RTY29wZSkgLT5cblxuICBuZXcgY2xhc3MgZXh0ZW5kcyBEZWZhdWx0Q29udHJvbGxlclxuXG4gICAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICAgIyBJbnN0YW5jZSB2YXJpYWJsZXMgICAgICAjXG4gICAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbiAgICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgICAjIGNvbnN0cnVjdG9yICYgaW5pdCAgICAgICNcbiAgICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuICAgIGNvbnN0cnVjdG9yOiAtPlxuICAgICAgc3VwZXIgJHNjb3BlLCAkcm9vdFNjb3BlXG5cbiAgICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgICAjIE1ldGhvZHMgICAgICAgICAgICAgICAgICNcbiAgICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMiLCJtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSAnaGlkYSdcbm1vZHVsZS5jb250cm9sbGVyICdIb21lQ29udHJvbGxlcicsICgkc2NvcGUsICRyb290U2NvcGUpIC0+XG5cbiAgbmV3IGNsYXNzIGV4dGVuZHMgRGVmYXVsdENvbnRyb2xsZXJcblxuICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAgICMgSW5zdGFuY2UgdmFyaWFibGVzICAgICAgI1xuICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG4gICAgd3c6IDBcbiAgICB3bDogMFxuXG4gICAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICAgIyBjb25zdHJ1Y3RvciAmIGluaXQgICAgICAjXG4gICAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbiAgICBjb25zdHJ1Y3RvcjogLT5cbiAgICAgIHN1cGVyICRzY29wZSwgJHJvb3RTY29wZVxuXG4gICAgICBAJGVsZW1lbnQgPSAkKCcuZGljb20nKVxuICAgICAgQGVsZW1lbnQgPSBAJGVsZW1lbnRbMF1cblxuICAgICAgY29ybmVyc3RvbmUuZW5hYmxlIEBlbGVtZW50XG5cbiAgICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgICAjIE1ldGhvZHMgICAgICAgICAgICAgICAgICNcbiAgICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuICAgIGltYWdlOiAoZmlsZSkgPT5cbiAgICAgIGNvcm5lcnN0b25lLmxvYWRJbWFnZSAnZGljb21maWxlOicgKyBmaWxlXG4gICAgICAudGhlbiAoaW1hZ2UpID0+XG4gICAgICAgIGNvcm5lcnN0b25lLmRpc3BsYXlJbWFnZSBAZWxlbWVudCwgaW1hZ2VcbiAgICAgICAgdmlld3BvcnQgPSBjb3JuZXJzdG9uZS5nZXRWaWV3cG9ydCBAZWxlbWVudFxuXG4gICAgICAgIEB3dyA9IHZpZXdwb3J0LnZvaS53aW5kb3dXaWR0aFxuICAgICAgICBAd2wgPSB2aWV3cG9ydC52b2kud2luZG93Q2VudGVyXG5cbiAgICAgICAgQCRlbGVtZW50Lm1vdXNlZG93biAoZSkgPT5cbiAgICAgICAgICBsYXN0WCA9IGUucGFnZVhcbiAgICAgICAgICBsYXN0WSA9IGUucGFnZVlcblxuICAgICAgICAgICQoZG9jdW1lbnQpLm1vdXNlbW92ZSAoZSkgPT5cbiAgICAgICAgICAgIGRlbHRhWCA9IGUucGFnZVggLSBsYXN0WFxuICAgICAgICAgICAgZGVsdGFZID0gZS5wYWdlWSAtIGxhc3RZXG4gICAgICAgICAgICBsYXN0WCA9IGUucGFnZVhcbiAgICAgICAgICAgIGxhc3RZID0gZS5wYWdlWVxuICAgICAgICAgICAgdmlld3BvcnQgPSBjb3JuZXJzdG9uZS5nZXRWaWV3cG9ydChAZWxlbWVudClcbiAgICAgICAgICAgIHZpZXdwb3J0LnZvaS53aW5kb3dXaWR0aCArPSAoZGVsdGFYIC8gdmlld3BvcnQuc2NhbGUpXG4gICAgICAgICAgICB2aWV3cG9ydC52b2kud2luZG93Q2VudGVyICs9IChkZWx0YVkgLyB2aWV3cG9ydC5zY2FsZSlcbiAgICAgICAgICAgIGNvcm5lcnN0b25lLnNldFZpZXdwb3J0IEBlbGVtZW50LCB2aWV3cG9ydFxuXG4gICAgICAgICAgICBAd3cgPSBNYXRoLnJvdW5kIHZpZXdwb3J0LnZvaS53aW5kb3dXaWR0aFxuICAgICAgICAgICAgQHdsID0gTWF0aC5yb3VuZCB2aWV3cG9ydC52b2kud2luZG93Q2VudGVyXG4gICAgICAgICAgICBAc2NvcGUuJGFwcGx5KClcblxuICAgICAgICAgICQoZG9jdW1lbnQpLm1vdXNldXAgKGUpIC0+XG4gICAgICAgICAgICAkKGRvY3VtZW50KS51bmJpbmQgXCJtb3VzZW1vdmVcIlxuICAgICAgICAgICAgJChkb2N1bWVudCkudW5iaW5kIFwibW91c2V1cFwiXG5cbiAgICBvcGVuOiA9PlxuICAgICAgZmlsZSA9ICQoJyNmaWxlJylcbiAgICAgIHNlbGYgPSBAXG4gICAgICBmaWxlLmNoYW5nZSAtPiBzZWxmLmltYWdlICQoQCkudmFsKClcbiAgICAgIGZpbGUuY2xpY2soKSIsIm1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlICdoaWRhJ1xubW9kdWxlLmNvbnRyb2xsZXIgJ0xvZ2luQ29udHJvbGxlcicsICgkc2NvcGUsICRyb290U2NvcGUpIC0+XG5cbiAgbmV3IGNsYXNzIGV4dGVuZHMgRGVmYXVsdENvbnRyb2xsZXJcblxuICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAgICMgSW5zdGFuY2UgdmFyaWFibGVzICAgICAgI1xuICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG4gICAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICAgIyBjb25zdHJ1Y3RvciAmIGluaXQgICAgICAjXG4gICAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbiAgICBjb25zdHJ1Y3RvcjogLT5cbiAgICAgIHN1cGVyICRzY29wZSwgJHJvb3RTY29wZVxuXG4gICAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICAgIyBNZXRob2RzICAgICAgICAgICAgICAgICAjXG4gICAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIiwibW9kdWxlID0gYW5ndWxhci5tb2R1bGUgJ2hpZGEnXG5tb2R1bGUuY29udHJvbGxlciAnTWFpbkNvbnRyb2xsZXInLCAoJHNjb3BlLCAkcm9vdFNjb3BlLCAkc3RhdGUpIC0+XG5cbiAgbmV3IGNsYXNzIGV4dGVuZHMgRGVmYXVsdENvbnRyb2xsZXJcblxuICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuICAgICMgSW5zdGFuY2UgdmFyaWFibGVzICAgICAgI1xuICAgICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG4gICAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4gICAgIyBjb25zdHJ1Y3RvciAmIGluaXQgICAgICAjXG4gICAgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbiAgICBjb25zdHJ1Y3RvcjogLT5cbiAgICAgIHN1cGVyICRzY29wZSwgJHJvb3RTY29wZVxuXG4gICAgICAkc2NvcGUuJHN0YXRlID0gJHN0YXRlXG5cbiAgICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgICAjIE1ldGhvZHMgICAgICAgICAgICAgICAgICNcbiAgICAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=