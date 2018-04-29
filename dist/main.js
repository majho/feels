(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (factory());
}(this, (function () { 'use strict';

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

  var _require = require('./lib/helpers'),
      isCorrect = _require.isCorrect,
      unitsFormat = _require.unitsFormat;

  var BaseFeels = require('./lib/base');

  function apparentTemp(tempConvert, func) {
    if (!isCorrect(this.temp) || !isCorrect(this.humidity) && !isCorrect(this.dewPoint)) {
      throw new Error('One of the required arguments are not specified');
    }

    var temp = this.units.temp;

    var t = tempConvert(this.temp, temp, 'c');

    var index = isCorrect(this.dewPoint) && !isCorrect(this.humidity) ? func(t, tempConvert(this.dewPoint, temp, 'c'), { dewPoint: true }) : func(t, this.humidity);

    return tempConvert(index, 'c', this._units.temp, this.round);
  }

  var Feels = function (_BaseFeels) {
    _inherits(Feels, _BaseFeels);

    function Feels(opts) {
      _classCallCheck(this, Feels);

      var _this = _possibleConstructorReturn(this, _BaseFeels.call(this));

      _this.setOptions(opts);
      _this._methods = {
        HI: 'heatIndex',
        AWBGT: 'AWBGT',
        HI_CA: 'humidex',
        AAT: 'AAT',
        WCI: 'windChill'
      };
      return _this;
    }

    Feels.prototype.setOptions = function setOptions() {
      var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this.units = unitsFormat(opts.units);
      this.temp = opts.temp;
      this.speed = opts.speed || 0;
      this.humidity = opts.humidity;
      this.dewPoint = opts.dewPoint;
      this.wvp = opts.wvp;
      this.round = opts.round;
      this._units = {
        temp: this.units.temp,
        speed: this.units.speed
      };
      return this;
    };

    Feels.prototype.registerMethod = function registerMethod(method) {
      if (this[method]) {
        this._methods[method.toUpperCase()] = method;
        return this;
      }
      throw new Error(method + ' doesn\'t exists');
    };

    Feels.prototype.registerMethods = function registerMethods(methods) {
      if (Array.isArray(methods)) {
        for (var _iterator = methods, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
          var _ref;

          if (_isArray) {
            if (_i >= _iterator.length) break;
            _ref = _iterator[_i++];
          } else {
            _i = _iterator.next();
            if (_i.done) break;
            _ref = _i.value;
          }

          var method = _ref;

          this.registerMethod(method);
        }
        return this;
      }
      throw new TypeError('Methods must be an array');
    };

    Feels.prototype.addMethod = function addMethod(method, func) {
      if (typeof func === 'function') {
        this[method] = func.bind(this);
        this.registerMethod(method);
        return this;
      }
      throw new TypeError(method + ' must be a function');
    };

    Feels.prototype.toCelsius = function toCelsius() {
      this._units.temp = 'c';
      return this;
    };

    Feels.prototype.toFahrenheit = function toFahrenheit() {
      this._units.temp = 'f';
      return this;
    };

    Feels.prototype.toKelvin = function toKelvin() {
      this._units.temp = 'k';
      return this;
    };

    Feels.prototype.like = function like() {
      var methods = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ['HI', 'HI_CA', 'AAT', 'WCI'];

      if (typeof methods === 'string') {
        var method = this._methods[methods.toUpperCase()];
        if (method) {
          return this[method]();
        }
        throw new RangeError('Methods must be one of: ' + Object.keys(this._methods).join(', '));
      }

      if (Array.isArray(methods)) {
        var like = 0;
        var count = methods.length;
        for (var _iterator2 = methods, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
          var _ref2;

          if (_isArray2) {
            if (_i2 >= _iterator2.length) break;
            _ref2 = _iterator2[_i2++];
          } else {
            _i2 = _iterator2.next();
            if (_i2.done) break;
            _ref2 = _i2.value;
          }

          var m = _ref2;

          var _method = this._methods[m.toUpperCase()];
          if (_method) {
            try {
              like += this[_method]();
            } catch (e) {
              // eslint-disable-next-line no-plusplus
              count--;
            }
          } else {
            // eslint-disable-next-line max-len
            throw new RangeError('Methods must be one of: ' + Object.keys(this._methods).join(', '));
          }
        }

        if (!count) {
          throw new Error('No valid methods for these values');
        }
        return Feels.tempConvert(like / count, '', '', this.round);
      }
      return this.like(['HI', 'HI_CA', 'AAT', 'WCI']);
    };

    Feels.prototype.heatIndex = function heatIndex() {
      // HI
      return apparentTemp.call(this, Feels.tempConvert, Feels.heatIndex);
    };

    Feels.prototype.AWBGT = function AWBGT() {
      // AWBGT
      return apparentTemp.call(this, Feels.tempConvert, Feels.AWBGT);
    };

    Feels.prototype.humidex = function humidex() {
      // HI_CA
      return apparentTemp.call(this, Feels.tempConvert, Feels.humidex);
    };

    Feels.prototype.AAT = function AAT() {
      // AAT
      // eslint-disable-next-line max-len
      if (!isCorrect(this.temp, this.speed) || !isCorrect(this.humidity) && !isCorrect(this.dewPoint)) {
        throw new Error('One of the required arguments are not specified');
      }

      var _units = this.units,
          temp = _units.temp,
          speed = _units.speed;

      var u = this._units.temp;
      var t = Feels.tempConvert(this.temp, temp, 'c');
      var s = Feels.speedConvert(this.speed, speed, 'mps');

      var index = isCorrect(this.dewPoint) && !isCorrect(this.humidity) ? Feels.AAT(t, s, Feels.tempConvert(this.dewPoint, temp, 'c'), { dewPoint: true }) : Feels.AAT(t, s, this.humidity);

      return Feels.tempConvert(index, 'c', u, this.round);
    };

    Feels.prototype.windChill = function windChill() {
      // WCI
      if (!isCorrect(this.temp, this.speed)) {
        throw new Error('One of the required arguments are not specified');
      }
      var _units2 = this.units,
          temp = _units2.temp,
          speed = _units2.speed;

      var u = this._units.temp;
      var t = Feels.tempConvert(this.temp, temp, 'c');
      var s = Feels.speedConvert(this.speed, speed, 'mps');

      return Feels.tempConvert(Feels.windChill(t, s), 'c', u, this.round);
    };

    Feels.prototype.getWaterVapourPressure = function getWaterVapourPressure() {
      if (isCorrect(this.wvp)) {
        return this.wvp;
      } else if (isCorrect(this.humidity, this.temp)) {
        var temp = Feels.tempConvert(this.temp, this.units.temp, 'c');

        return Feels.getWVP(temp, this.humidity, this.round);
      }
      throw new Error('One of the required arguments are not specified');
    };

    Feels.prototype.getWaterVapourPressureByDewPoint = function getWaterVapourPressureByDewPoint() {
      if (isCorrect(this.wvp)) {
        return this.wvp;
      } else if (isCorrect(this.dewPoint)) {
        var dewPoint = Feels.tempConvert(this.dewPoint, this.units.temp, 'c');

        return Feels.getWVPbyDP(dewPoint, this.round);
      }
      throw new Error('Dew point is not specified');
    };

    Feels.prototype.getAproximateRelativeHumidity = function getAproximateRelativeHumidity() {
      if (isCorrect(this.humidity)) {
        return this.humidity;
      } else if (isCorrect(this.temp, this.dewPoint)) {
        var temp = this.units.temp;

        var t = Feels.tempConvert(this.temp, temp, 'c');
        var dewPoint = Feels.tempConvert(this.dewPoint, temp, 'c');

        return Feels.getARH(t, dewPoint, this.round);
      }
      throw new Error('One of the required arguments are not specified');
    };

    Feels.prototype.getRelativeHumidity = function getRelativeHumidity() {
      if (isCorrect(this.humidity)) {
        return this.humidity;
      } else if (isCorrect(this.temp) && (isCorrect(this.wvp) || isCorrect(this.dewPoint))) {
        var temp = this.units.temp;

        var t = Feels.tempConvert(this.temp, temp, 'c');

        return isCorrect(this.dewPoint) && !isCorrect(this.wvp) ? Feels.getRH(t, Feels.tempConvert(this.dewPoint, temp, 'c'), { dewPoint: true, round: this.round }) : Feels.getRH(t, this.wvp, this.round);
      }
      throw new Error('One of the required arguments are not specified');
    };

    Feels.prototype.getAproximateDewPoint = function getAproximateDewPoint() {
      if (isCorrect(this.dewPoint)) {
        return this.dewPoint;
      } else if (isCorrect(this.temp, this.humidity)) {
        var temp = Feels.tempConvert(this.temp, this.units.temp, 'c');

        return Feels.tempConvert(Feels.getADP(temp, this.humidity), 'c', this._units.temp, this.round);
      }
      throw new Error('One of the required arguments are not specified');
    };

    Feels.prototype.getDewPoint = function getDewPoint() {
      // dew point for [-40, 50], humidity must be in (0, 100]
      if (isCorrect(this.dewPoint)) {
        return this.dewPoint;
      } else if (isCorrect(this.temp, this.humidity)) {
        var temp = Feels.tempConvert(this.temp, this.units.temp, 'c');

        return Feels.tempConvert(Feels.getDP(temp, this.humidity), 'c', this._units.temp, this.round);
      }
      throw new Error('One of the required arguments are not specified');
    };

    Feels.prototype.getFrostPoint = function getFrostPoint() {
      // frost point for [-80, 0], humidity must be in (0, 100]
      if (!isCorrect(this.temp, this.humidity)) {
        throw new Error('One of the required arguments are not specified');
      }

      var temp = Feels.tempConvert(this.temp, this.units.temp, 'c');
      return Feels.tempConvert(Feels.getFP(temp, this.humidity), 'c', this._units.temp, this.round);
    };

    return Feels;
  }(BaseFeels);

  Feels.prototype.toC = Feels.prototype.toCelsius;
  Feels.prototype.toF = Feels.prototype.toFahrenheit;
  Feels.prototype.toK = Feels.prototype.toKelvin;

  Feels.prototype.getWVP = Feels.prototype.getWaterVapourPressure;
  Feels.prototype.getWVPbyDP = Feels.prototype.getWaterVapourPressureByDewPoint;
  Feels.prototype.getARH = Feels.prototype.getAproximateRelativeHumidity;
  Feels.prototype.getRH = Feels.prototype.getRelativeHumidity;
  Feels.prototype.getADP = Feels.prototype.getAproximateDewPoint;
  Feels.prototype.getDP = Feels.prototype.getDewPoint;
  Feels.prototype.getFP = Feels.prototype.getFrostPoint;

  module.exports = Feels;

})));
