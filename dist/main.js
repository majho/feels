(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.Feels = factory());
}(this, (function () { 'use strict';

    var tempFormat = function tempFormat(temp) {
        if (temp === 'f' || temp === 'fahrenheit') {
            return 'f';
        }if (temp === 'k' || temp === 'kelvin') {
            return 'k';
        }
        return 'c';
    };

    var speedFormat = function speedFormat(speed) {
        if (speed === 'mph' || speed === 'mi/h') {
            return 'mph';
        }if (['kmh', 'kph', 'kmph', 'km/h'].includes(speed)) {
            return 'kph';
        }
        return 'mps';
    };

    var isCorrect = function isCorrect() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return args.every(function (arg) {
            return arg != null && Number.isFinite(arg);
        });
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

    /* eslint-disable max-len, no-mixed-operators, no-restricted-properties */
    var HI = function HI(temp, humidity) {
        return 16.923 + 0.185212 * temp + 5.37941 * humidity - 0.100254 * temp * humidity + 9.41695 * Math.pow(10, -3) * Math.pow(temp, 2) + 7.28898 * Math.pow(10, -3) * Math.pow(humidity, 2) + 3.45372 * Math.pow(10, -4) * Math.pow(temp, 2) * humidity - 8.14971 * Math.pow(10, -4) * temp * Math.pow(humidity, 2) + 1.02102 * Math.pow(10, -5) * Math.pow(temp, 2) * Math.pow(humidity, 2) - 3.8646 * Math.pow(10, -5) * Math.pow(temp, 3) + 2.91583 * Math.pow(10, -5) * Math.pow(humidity, 3) + 1.42721 * Math.pow(10, -6) * Math.pow(temp, 3) * humidity + 1.97483 * Math.pow(10, -7) * temp * Math.pow(humidity, 3) - 2.18429 * Math.pow(10, -8) * Math.pow(temp, 3) * Math.pow(humidity, 2) + 8.43296 * Math.pow(10, -10) * Math.pow(temp, 2) * Math.pow(humidity, 3) - 4.81975 * Math.pow(10, -11) * Math.pow(temp, 3) * Math.pow(humidity, 3);
    };

    var HI_CA = function HI_CA(temp, WVP) {
        return temp + 0.5555 * (WVP - 10.0);
    };

    var WCI = function WCI(temp, speed) {
        return 13.12 + 0.6215 * temp - 11.37 * Math.pow(speed, 0.16) + 0.3965 * temp * Math.pow(speed, 0.16);
    };

    var WVPbyDP = function WVPbyDP(temp) {
        return 6.11 * Math.exp(5417.7530 * (1 / 273.16 - 1 / (temp + 273.15)));
    };

    var RH = function RH(temp, WVP) {
        return WVP / (6.105 * Math.exp(17.27 * temp / (237.7 + temp))) * 100;
    };

    var WVP = function WVP(temp, humidity) {
        return humidity / 100 * 6.105 * Math.exp(17.27 * temp / (237.7 + temp));
    };

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

    /* eslint-disable no-param-reassign */

    var BaseFeels = function () {
        function BaseFeels() {
            classCallCheck(this, BaseFeels);
        }

        BaseFeels.tempConvert = function tempConvert$$1(temp, from, to) {
            var round = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

            if (round) {
                if (typeof round === 'function') {
                    return round(tempConvert(temp, from, to));
                }
                return Math.round(tempConvert(temp, from, to));
            }
            return tempConvert(temp, from, to);
        };

        BaseFeels.speedConvert = function speedConvert$$1(speed, from, to) {
            var round = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

            if (round) {
                if (typeof round === 'function') {
                    return round(speedConvert(speed, from, to));
                }
                return Math.round(speedConvert(speed, from, to));
            }
            return speedConvert(speed, from, to);
        };

        BaseFeels.heatIndex = function heatIndex(temp, humidity) {
            var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
                dewPoint = _ref.dewPoint,
                round = _ref.round;

            // HI
            if (!isCorrect(temp, humidity)) {
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

            return BaseFeels.tempConvert(HI(t, humidity), 'f', 'c', round);
        };

        BaseFeels.humidex = function humidex(temp, humidity) {
            var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
                dewPoint = _ref2.dewPoint,
                round = _ref2.round;

            // HI_CA
            if (!isCorrect(temp, humidity)) {
                throw new Error('One of the required arguments are not specified');
            }

            if (temp <= 0) {
                throw new RangeError('Humidex: temp must be > (0C, 32F, 273.15K)');
            }

            if (!dewPoint && (humidity <= 0 || humidity > 100)) {
                throw new RangeError('Humidex: humidity must be in (0, 100]');
            }

            var wvp = dewPoint ? BaseFeels.getWVPbyDP(humidity) : BaseFeels.getWVP(temp, humidity);
            return BaseFeels.tempConvert(HI_CA(temp, wvp), '', '', round);
        };

        BaseFeels.windChill = function windChill(temp, speed) {
            var _ref3 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
                round = _ref3.round;

            // WCI
            if (!isCorrect(temp, speed)) {
                throw new Error('One of the required arguments are not specified');
            }

            if (temp > 0) {
                throw new RangeError('Wind Chill: temp must be <= (0C, 32F, 273.15K)');
            } else if (speed < 0) {
                throw new RangeError('Wind Chill: wind speed must be >= 0');
            }

            var s = BaseFeels.speedConvert(speed, 'mps', 'kph');
            if (s >= 5) {
                return BaseFeels.tempConvert(WCI(temp, s), '', '', round);
            }
            return BaseFeels.tempConvert(temp + (-1.59 + 0.1345 * temp) / 5 * s, '', '', round);
        };

        BaseFeels.getWVP = function getWVP(temp, humidity) {
            var _ref4 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
                round = _ref4.round;

            if (!isCorrect(humidity, temp)) {
                throw new Error('One of the required arguments are not specified');
            }

            if (humidity <= 0 || humidity > 100) {
                throw new RangeError('Water Vapour Pressure: humidity must be in (0, 100]');
            }

            return BaseFeels.tempConvert(WVP(temp, humidity), '', '', round);
        };

        BaseFeels.getWVPbyDP = function getWVPbyDP(dewPoint) {
            var _ref5 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
                round = _ref5.round;

            if (!isCorrect(dewPoint)) {
                throw new Error('Dew point is not specified');
            }

            return BaseFeels.tempConvert(WVPbyDP(dewPoint), '', '', round);
        };

        BaseFeels.getRH = function getRH(temp, wvp) {
            var _ref6 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
                dewPoint = _ref6.dewPoint,
                round = _ref6.round;

            if (!isCorrect(temp, wvp)) {
                throw new Error('One of the required arguments are not specified');
            }

            return BaseFeels.tempConvert(RH(temp, dewPoint ? BaseFeels.getWVPbyDP(wvp) : wvp), '', '', round);
        };

        return BaseFeels;
    }();

    /* eslint-disable max-len, no-underscore-dangle, no-restricted-syntax */

    function apparentTemp(tempConvert$$1, func) {
        if (!isCorrect(this.temp) || !isCorrect(this.humidity) && !isCorrect(this.dewPoint)) {
            throw new Error('One of the required arguments are not specified');
        }

        var temp = this.units.temp;

        var t = tempConvert$$1(this.temp, temp, 'c');

        var index = isCorrect(this.dewPoint) && !isCorrect(this.humidity) ? func(t, tempConvert$$1(this.dewPoint, temp, 'c'), { dewPoint: true }) : func(t, this.humidity);

        return tempConvert$$1(index, 'c', this._units.temp, this.round);
    }

    var Feels = function (_BaseFeels) {
        inherits(Feels, _BaseFeels);

        function Feels(opts) {
            classCallCheck(this, Feels);

            var _this = possibleConstructorReturn(this, _BaseFeels.call(this));

            _this.setOptions(opts);
            _this._methods = {
                HI: 'heatIndex',
                HI_CA: 'humidex',
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

        Feels.prototype.like = function like() {
            var methods = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ['HI', 'HI_CA', 'WCI'];

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

                    var m = _ref;

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
            return this.like(['HI', 'HI_CA', 'WCI']);
        };

        Feels.prototype.heatIndex = function heatIndex() {
            // HI
            return apparentTemp.call(this, Feels.tempConvert, Feels.heatIndex);
        };

        Feels.prototype.humidex = function humidex() {
            // HI_CA
            return apparentTemp.call(this, Feels.tempConvert, Feels.humidex);
        };

        Feels.prototype.windChill = function windChill() {
            // WCI
            if (!isCorrect(this.temp, this.speed)) {
                throw new Error('One of the required arguments are not specified');
            }
            var _units = this.units,
                temp = _units.temp,
                speed = _units.speed;

            var u = this._units.temp;
            var t = Feels.tempConvert(this.temp, temp, 'c');
            var s = Feels.speedConvert(this.speed, speed, 'mps');

            return Feels.tempConvert(Feels.windChill(t, s), 'c', u, this.round);
        };

        return Feels;
    }(BaseFeels);

    return Feels;

})));
