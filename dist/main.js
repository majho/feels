(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.Feels = factory());
}(this, (function () { 'use strict';

  /* eslint-disable no-mixed-operators */

  var isCorrect = function isCorrect(data) {
    return !(data == null) && Number.isFinite(data);
  };

  var isCorrect_1 = function isCorrect_1() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return args.every(function (arg) {
      return isCorrect(arg);
    });
  };

  var tempFormat = function tempFormat(temp) {
    if (temp === 'f' || temp === 'fahrenheit') {
      return 'f';
    } else if (temp === 'k' || temp === 'kelvin') {
      return 'k';
    }
    return 'c';
  };

  var speedFormat = function speedFormat(speed) {
    if (speed === 'mph' || speed === 'mi/h') {
      return 'mph';
    } else if (['kmh', 'kph', 'kmph', 'km/h'].includes(speed)) {
      return 'kph';
    }
    return 'mps';
  };

  var unitsFormat = function unitsFormat(units) {
    if (!units) {
      return {
        temp: 'c',
        speed: 'mps'
      };
    }

    var temp = units.temp ? units.temp.toLowerCase() : 'c';
    var speed = units.speed ? units.speed.toLowerCase() : 'mps';

    return { temp: tempFormat(temp), speed: speedFormat(speed) };
  };

  var tempConvert = function tempConvert(temp, from, to) {
    if (!isCorrect(temp)) {
      throw new TypeError('Temp must be specified and must be a number');
    }
    if (from === to) {
      return temp;
    }
    if (!(['c', 'f', 'k'].includes(from) && ['c', 'f', 'k'].includes(to))) {
      throw new RangeError('Units must be c, f or k');
    }
    if (from === 'c') {
      return to === 'f' ? (temp * 1000 * (9 / 5) + 32 * 1000) / 1000 : (temp * 1000 + 273.15 * 1000) / 1000;
    }
    if (from === 'f') {
      return to === 'c' ? (temp - 32) * 1000 * (5 / 9) / 1000 : (temp + 459.67) * 1000 * (5 / 9) / 1000;
    }
    return to === 'c' ? // k
    (temp * 1000 - 273.15 * 1000) / 1000 : (temp * 1000 * (9 / 5) - 459.67 * 1000) / 1000;
  };

  var speedConvert = function speedConvert(speed, from, to) {
    if (!isCorrect(speed)) {
      throw new TypeError('Speed must be specified and must be a number');
    }
    if (from === to) {
      return speed;
    }
    if (!(['mps', 'mph', 'kph'].includes(from) && ['mps', 'mph', 'kph'].includes(to))) {
      throw new RangeError('Units must be mps, mph or kph');
    }
    if (from === 'mps') {
      return to === 'mph' ? speed / 0.44704 : speed * 3.6;
    }
    if (from === 'mph') {
      return to === 'mps' ? speed * 0.44704 : speed * 1.609344;
    }
    return to === 'mps' ? speed / 3.6 : speed / 1.609344; // kph
  };

  var helpers = {
    isCorrect: isCorrect_1,
    unitsFormat: unitsFormat,
    tempConvert: tempConvert,
    speedConvert: speedConvert
  };

  var helpers$1 = /*#__PURE__*/Object.freeze({
    default: helpers,
    __moduleExports: helpers,
    isCorrect: isCorrect_1,
    unitsFormat: unitsFormat,
    tempConvert: tempConvert,
    speedConvert: speedConvert
  });

  /* eslint-disable no-mixed-operators, no-restricted-properties */

  var HI = function HI(temp, humidity) {
    return 16.923 + 0.185212 * temp + 5.37941 * humidity - 0.100254 * temp * humidity + 9.41695 * Math.pow(10, -3) * Math.pow(temp, 2) + 7.28898 * Math.pow(10, -3) * Math.pow(humidity, 2) + 3.45372 * Math.pow(10, -4) * Math.pow(temp, 2) * humidity - 8.14971 * Math.pow(10, -4) * temp * Math.pow(humidity, 2) + 1.02102 * Math.pow(10, -5) * Math.pow(temp, 2) * Math.pow(humidity, 2) - 3.8646 * Math.pow(10, -5) * Math.pow(temp, 3) + 2.91583 * Math.pow(10, -5) * Math.pow(humidity, 3) + 1.42721 * Math.pow(10, -6) * Math.pow(temp, 3) * humidity + 1.97483 * Math.pow(10, -7) * temp * Math.pow(humidity, 3) - 2.18429 * Math.pow(10, -8) * Math.pow(temp, 3) * Math.pow(humidity, 2) + 8.43296 * Math.pow(10, -10) * Math.pow(temp, 2) * Math.pow(humidity, 3) - 4.81975 * Math.pow(10, -11) * Math.pow(temp, 3) * Math.pow(humidity, 3);
  };

  var AWBGT = function AWBGT(temp, WVP) {
    return 0.567 * temp + 0.393 * WVP + 3.94;
  };

  var HI_CA = function HI_CA(temp, WVP) {
    return temp + 0.5555 * (WVP - 10.0);
  };

  var AAT = function AAT(temp, WVP, speed) {
    return temp + 0.33 * WVP - 0.70 * speed - 4.00;
  };

  var WCI = function WCI(temp, speed) {
    return 13.12 + 0.6215 * temp - 11.37 * Math.pow(speed, 0.16) + 0.3965 * temp * Math.pow(speed, 0.16);
  };

  var WVP = function WVP(temp, humidity) {
    return humidity / 100 * 6.105 * Math.exp(17.27 * temp / (237.7 + temp));
  };

  var WVPbyDP = function WVPbyDP(temp) {
    return 6.11 * Math.exp(5417.7530 * (1 / 273.16 - 1 / (temp + 273.15)));
  };

  var ARH = function ARH(temp, dewPoint) {
    return 100 - 5 * (temp - dewPoint);
  };

  var RH = function RH(temp, WVP) {
    return WVP / (6.105 * Math.exp(17.27 * temp / (237.7 + temp))) * 100;
  };

  var ADP = function ADP(temp, humidity) {
    return temp - (100 - humidity) / 5;
  };

  var getG = function getG(temp, humidity, b, c, d) {
    return Math.log(humidity / 100 * Math.exp((b - temp / d) * (temp / (c + temp))));
  };

  var getT = function getT(temp, humidity, b, c, d) {
    return c * getG(temp, humidity, b, c, d) / (b - getG(temp, humidity, b, c, d));
  };

  var formulas = {
    HI: HI,
    AWBGT: AWBGT,
    HI_CA: HI_CA,
    AAT: AAT,
    WCI: WCI,
    WVP: WVP,
    WVPbyDP: WVPbyDP,
    ARH: ARH,
    RH: RH,
    ADP: ADP,
    getT: getT
  };

  var formulas$1 = /*#__PURE__*/Object.freeze({
    default: formulas,
    __moduleExports: formulas,
    HI: HI,
    AWBGT: AWBGT,
    HI_CA: HI_CA,
    AAT: AAT,
    WCI: WCI,
    WVP: WVP,
    WVPbyDP: WVPbyDP,
    ARH: ARH,
    RH: RH,
    ADP: ADP,
    getT: getT
  });

  var require$$0 = ( helpers$1 && helpers ) || helpers$1;

  var require$$1 = ( formulas$1 && formulas ) || formulas$1;

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var inherits = function (subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  };

  var possibleConstructorReturn = function (self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  };

  /* eslint-disable no-mixed-operators */

  var isCorrect$1 = require$$0.isCorrect,
      _tempConvert = require$$0.tempConvert,
      _speedConvert = require$$0.speedConvert;
  var HI$1 = require$$1.HI,
      _AWBGT = require$$1.AWBGT,
      HI_CA$1 = require$$1.HI_CA,
      _AAT = require$$1.AAT,
      WCI$1 = require$$1.WCI,
      WVP$1 = require$$1.WVP,
      WVPbyDP$1 = require$$1.WVPbyDP,
      ARH$1 = require$$1.ARH,
      RH$1 = require$$1.RH,
      ADP$1 = require$$1.ADP,
      getT$1 = require$$1.getT;

  var BaseFeels = function () {
    function BaseFeels() {
      classCallCheck(this, BaseFeels);
    }

    BaseFeels.tempConvert = function tempConvert(temp, from, to) {
      var round = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

      if (round) {
        if (typeof round === 'function') {
          return round(_tempConvert(temp, from, to));
        }
        return Math.round(_tempConvert(temp, from, to));
      }
      return _tempConvert(temp, from, to);
    };

    BaseFeels.speedConvert = function speedConvert(speed, from, to) {
      var round = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

      if (round) {
        if (typeof round === 'function') {
          return round(_speedConvert(speed, from, to));
        }
        return Math.round(_speedConvert(speed, from, to));
      }
      return _speedConvert(speed, from, to);
    };

    BaseFeels.heatIndex = function heatIndex(temp, humidity) {
      var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
          dewPoint = _ref.dewPoint,
          round = _ref.round;

      // HI
      if (!isCorrect$1(temp, humidity)) {
        throw new Error('One of the required arguments are not specified');
      }
      var t = BaseFeels.tempConvert(temp, 'c', 'f');

      if (t < 68) {
        throw new RangeError('Heat Index: temp must be >= (20C, 68F, 293.15K)');
      }

      if (dewPoint) {
        humidity = BaseFeels.getRH(temp, humidity, { dewPoint: true });
      } else if (humidity <= 0 || humidity > 100) {
        throw new RangeError('Heat Index: humidity must be in (0, 100]');
      }

      return BaseFeels.tempConvert(HI$1(t, humidity), 'f', 'c', round);
    };

    BaseFeels.AWBGT = function AWBGT(temp, humidity) {
      var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
          dewPoint = _ref2.dewPoint,
          round = _ref2.round;

      // AWBGT
      if (!isCorrect$1(temp, humidity)) {
        throw new Error('One of the required arguments are not specified');
      }

      if (temp < 15) {
        throw new RangeError('AWBGT: temp must be >= (15C, 59F, 288.15K)');
      }

      if (!dewPoint && (humidity <= 0 || humidity > 100)) {
        throw new RangeError('AWBGT: humidity must be in (0, 100]');
      }

      var wvp = dewPoint ? BaseFeels.getWVPbyDP(humidity) : BaseFeels.getWVP(temp, humidity);
      return BaseFeels.tempConvert(_AWBGT(temp, wvp), '', '', round);
    };

    BaseFeels.humidex = function humidex(temp, humidity) {
      var _ref3 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
          dewPoint = _ref3.dewPoint,
          round = _ref3.round;

      // HI_CA
      if (!isCorrect$1(temp, humidity)) {
        throw new Error('One of the required arguments are not specified');
      }

      if (temp <= 0) {
        throw new RangeError('Humidex: temp must be > (0C, 32F, 273.15K)');
      }

      if (!dewPoint && (humidity <= 0 || humidity > 100)) {
        throw new RangeError('Humidex: humidity must be in (0, 100]');
      }

      var wvp = dewPoint ? BaseFeels.getWVPbyDP(humidity) : BaseFeels.getWVP(temp, humidity);
      return BaseFeels.tempConvert(HI_CA$1(temp, wvp), '', '', round);
    };

    BaseFeels.AAT = function AAT(temp, speed, humidity) {
      var _ref4 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
          dewPoint = _ref4.dewPoint,
          round = _ref4.round;

      // AAT
      if (!isCorrect$1(temp, speed, humidity)) {
        throw new Error('One of the required arguments are not specified');
      }

      if (speed < 0) {
        throw new RangeError('AAT: wind speed must be >= 0');
      }

      if (!dewPoint && (humidity <= 0 || humidity > 100)) {
        throw new RangeError('AAT: humidity must be in (0, 100]');
      }

      var wvp = dewPoint ? BaseFeels.getWVPbyDP(humidity) : BaseFeels.getWVP(temp, humidity);
      return BaseFeels.tempConvert(_AAT(temp, wvp, speed), '', '', round);
    };

    BaseFeels.windChill = function windChill(temp, speed) {
      var _ref5 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
          round = _ref5.round;

      // WCI
      if (!isCorrect$1(temp, speed)) {
        throw new Error('One of the required arguments are not specified');
      }

      if (temp > 0) {
        throw new RangeError('Wind Chill: temp must be <= (0C, 32F, 273.15K)');
      } else if (speed < 0) {
        throw new RangeError('Wind Chill: wind speed must be >= 0');
      }

      var s = BaseFeels.speedConvert(speed, 'mps', 'kph');
      if (s >= 5) {
        return BaseFeels.tempConvert(WCI$1(temp, s), '', '', round);
      }
      return BaseFeels.tempConvert(temp + (-1.59 + 0.1345 * temp) / 5 * s, '', '', round);
    };

    BaseFeels.getWVP = function getWVP(temp, humidity) {
      var _ref6 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
          round = _ref6.round;

      if (!isCorrect$1(humidity, temp)) {
        throw new Error('One of the required arguments are not specified');
      }

      if (humidity <= 0 || humidity > 100) {
        throw new RangeError('Water Vapour Pressure: humidity must be in (0, 100]');
      }

      return BaseFeels.tempConvert(WVP$1(temp, humidity), '', '', round);
    };

    BaseFeels.getWVPbyDP = function getWVPbyDP(dewPoint) {
      var _ref7 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          round = _ref7.round;

      if (!isCorrect$1(dewPoint)) {
        throw new Error('Dew point is not specified');
      }

      return BaseFeels.tempConvert(WVPbyDP$1(dewPoint), '', '', round);
    };

    BaseFeels.getARH = function getARH(temp, dewPoint) {
      var _ref8 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
          round = _ref8.round;

      if (!isCorrect$1(temp, dewPoint)) {
        throw new Error('One of the required arguments are not specified');
      }

      return BaseFeels.tempConvert(ARH$1(temp, dewPoint), '', '', round);
    };

    BaseFeels.getRH = function getRH(temp, wvp) {
      var _ref9 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
          dewPoint = _ref9.dewPoint,
          round = _ref9.round;

      if (!isCorrect$1(temp, wvp)) {
        throw new Error('One of the required arguments are not specified');
      }

      return BaseFeels.tempConvert(RH$1(temp, dewPoint ? BaseFeels.getWVPbyDP(wvp) : wvp), '', '', round);
    };

    BaseFeels.getADP = function getADP(temp, humidity) {
      var _ref10 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
          round = _ref10.round;

      if (!isCorrect$1(temp, humidity)) {
        throw new Error('One of the required arguments are not specified');
      }

      if (humidity <= 0 || humidity > 100) {
        throw new RangeError('Aproximate Dew Point: humidity must be in (0, 100]');
      }

      return BaseFeels.tempConvert(ADP$1(temp, humidity), '', '', round);
    };

    BaseFeels.getDP = function getDP(temp, humidity) {
      var _ref11 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
          round = _ref11.round;

      if (!isCorrect$1(temp, humidity)) {
        throw new Error('One of the required arguments are not specified');
      }

      if (temp < -40 || temp > 50) {
        throw new RangeError('Dew Point: temp must be in [-40, 50]');
      } else if (humidity <= 0 || humidity > 100) {
        throw new RangeError('Dew Point: humidity must be in (0, 100]');
      }

      var b = 18.729;
      var c = 257.87;
      var d = 273.3;
      return BaseFeels.tempConvert(getT$1(temp, humidity, b, c, d), '', '', round);
    };

    BaseFeels.getFP = function getFP(temp, humidity) {
      var _ref12 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
          round = _ref12.round;

      if (!isCorrect$1(temp, humidity)) {
        throw new Error('One of the required arguments are not specified');
      }

      if (temp < -80 || temp > 0) {
        throw new RangeError('Frost Point: temp must be in [-80, 0]');
      } else if (humidity <= 0 || humidity > 100) {
        throw new RangeError('Frost Point: humidity must be in (0, 100]');
      }

      var b = 23.036;
      var c = 279.82;
      var d = 333.7;
      return BaseFeels.tempConvert(getT$1(temp, humidity, b, c, d), '', '', round);
    };

    return BaseFeels;
  }();

  var base = BaseFeels;

  var base$1 = /*#__PURE__*/Object.freeze({
    default: base,
    __moduleExports: base
  });

  var BaseFeels$1 = ( base$1 && base ) || base$1;

  var isCorrect$2 = require$$0.isCorrect,
      unitsFormat$1 = require$$0.unitsFormat;


  function apparentTemp(tempConvert, func) {
    if (!isCorrect$2(this.temp) || !isCorrect$2(this.humidity) && !isCorrect$2(this.dewPoint)) {
      throw new Error('One of the required arguments are not specified');
    }

    var temp = this.units.temp;

    var t = tempConvert(this.temp, temp, 'c');

    var index = isCorrect$2(this.dewPoint) && !isCorrect$2(this.humidity) ? func(t, tempConvert(this.dewPoint, temp, 'c'), { dewPoint: true }) : func(t, this.humidity);

    return tempConvert(index, 'c', this._units.temp, this.round);
  }

  var Feels = function (_BaseFeels) {
    inherits(Feels, _BaseFeels);

    function Feels(opts) {
      classCallCheck(this, Feels);

      var _this = possibleConstructorReturn(this, _BaseFeels.call(this));

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

      this.units = unitsFormat$1(opts.units);
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
      if (!isCorrect$2(this.temp, this.speed) || !isCorrect$2(this.humidity) && !isCorrect$2(this.dewPoint)) {
        throw new Error('One of the required arguments are not specified');
      }

      var _units = this.units,
          temp = _units.temp,
          speed = _units.speed;

      var u = this._units.temp;
      var t = Feels.tempConvert(this.temp, temp, 'c');
      var s = Feels.speedConvert(this.speed, speed, 'mps');

      var index = isCorrect$2(this.dewPoint) && !isCorrect$2(this.humidity) ? Feels.AAT(t, s, Feels.tempConvert(this.dewPoint, temp, 'c'), { dewPoint: true }) : Feels.AAT(t, s, this.humidity);

      return Feels.tempConvert(index, 'c', u, this.round);
    };

    Feels.prototype.windChill = function windChill() {
      // WCI
      if (!isCorrect$2(this.temp, this.speed)) {
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
      if (isCorrect$2(this.wvp)) {
        return this.wvp;
      } else if (isCorrect$2(this.humidity, this.temp)) {
        var temp = Feels.tempConvert(this.temp, this.units.temp, 'c');

        return Feels.getWVP(temp, this.humidity, this.round);
      }
      throw new Error('One of the required arguments are not specified');
    };

    Feels.prototype.getWaterVapourPressureByDewPoint = function getWaterVapourPressureByDewPoint() {
      if (isCorrect$2(this.wvp)) {
        return this.wvp;
      } else if (isCorrect$2(this.dewPoint)) {
        var dewPoint = Feels.tempConvert(this.dewPoint, this.units.temp, 'c');

        return Feels.getWVPbyDP(dewPoint, this.round);
      }
      throw new Error('Dew point is not specified');
    };

    Feels.prototype.getAproximateRelativeHumidity = function getAproximateRelativeHumidity() {
      if (isCorrect$2(this.humidity)) {
        return this.humidity;
      } else if (isCorrect$2(this.temp, this.dewPoint)) {
        var temp = this.units.temp;

        var t = Feels.tempConvert(this.temp, temp, 'c');
        var dewPoint = Feels.tempConvert(this.dewPoint, temp, 'c');

        return Feels.getARH(t, dewPoint, this.round);
      }
      throw new Error('One of the required arguments are not specified');
    };

    Feels.prototype.getRelativeHumidity = function getRelativeHumidity() {
      if (isCorrect$2(this.humidity)) {
        return this.humidity;
      } else if (isCorrect$2(this.temp) && (isCorrect$2(this.wvp) || isCorrect$2(this.dewPoint))) {
        var temp = this.units.temp;

        var t = Feels.tempConvert(this.temp, temp, 'c');

        return isCorrect$2(this.dewPoint) && !isCorrect$2(this.wvp) ? Feels.getRH(t, Feels.tempConvert(this.dewPoint, temp, 'c'), { dewPoint: true, round: this.round }) : Feels.getRH(t, this.wvp, this.round);
      }
      throw new Error('One of the required arguments are not specified');
    };

    Feels.prototype.getAproximateDewPoint = function getAproximateDewPoint() {
      if (isCorrect$2(this.dewPoint)) {
        return this.dewPoint;
      } else if (isCorrect$2(this.temp, this.humidity)) {
        var temp = Feels.tempConvert(this.temp, this.units.temp, 'c');

        return Feels.tempConvert(Feels.getADP(temp, this.humidity), 'c', this._units.temp, this.round);
      }
      throw new Error('One of the required arguments are not specified');
    };

    Feels.prototype.getDewPoint = function getDewPoint() {
      // dew point for [-40, 50], humidity must be in (0, 100]
      if (isCorrect$2(this.dewPoint)) {
        return this.dewPoint;
      } else if (isCorrect$2(this.temp, this.humidity)) {
        var temp = Feels.tempConvert(this.temp, this.units.temp, 'c');

        return Feels.tempConvert(Feels.getDP(temp, this.humidity), 'c', this._units.temp, this.round);
      }
      throw new Error('One of the required arguments are not specified');
    };

    Feels.prototype.getFrostPoint = function getFrostPoint() {
      // frost point for [-80, 0], humidity must be in (0, 100]
      if (!isCorrect$2(this.temp, this.humidity)) {
        throw new Error('One of the required arguments are not specified');
      }

      var temp = Feels.tempConvert(this.temp, this.units.temp, 'c');
      return Feels.tempConvert(Feels.getFP(temp, this.humidity), 'c', this._units.temp, this.round);
    };

    return Feels;
  }(BaseFeels$1);

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

  var main = Feels;

  return main;

})));
