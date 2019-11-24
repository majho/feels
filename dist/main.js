const tempFormat = temp => {
  if (temp === 'f' || temp === 'fahrenheit') {
    return 'f';
  }

  if (temp === 'k' || temp === 'kelvin') {
    return 'k';
  }

  return 'c';
};

const speedFormat = speed => {
  if (speed === 'mph' || speed === 'mi/h') {
    return 'mph';
  }

  if (['kmh', 'kph', 'kmph', 'km/h'].includes(speed)) {
    return 'kph';
  }

  return 'mps';
};

const isCorrect = function isCorrect() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return args.every(arg => arg != null && Number.isFinite(arg));
};
const unitsFormat = units => {
  if (!units) {
    return {
      temp: 'c',
      speed: 'mps'
    };
  }

  const temp = units.temp ? units.temp.toLowerCase() : 'c';
  const speed = units.speed ? units.speed.toLowerCase() : 'mps';
  return {
    temp: tempFormat(temp),
    speed: speedFormat(speed)
  };
};
const tempConvert = (temp, from, to) => {
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
const speedConvert = (speed, from, to) => {
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
const HI = (temp, humidity) => 16.923 + 0.185212 * temp + 5.37941 * humidity - 0.100254 * temp * humidity + 9.41695 * Math.pow(10, -3) * Math.pow(temp, 2) + 7.28898 * Math.pow(10, -3) * Math.pow(humidity, 2) + 3.45372 * Math.pow(10, -4) * Math.pow(temp, 2) * humidity - 8.14971 * Math.pow(10, -4) * temp * Math.pow(humidity, 2) + 1.02102 * Math.pow(10, -5) * Math.pow(temp, 2) * Math.pow(humidity, 2) - 3.8646 * Math.pow(10, -5) * Math.pow(temp, 3) + 2.91583 * Math.pow(10, -5) * Math.pow(humidity, 3) + 1.42721 * Math.pow(10, -6) * Math.pow(temp, 3) * humidity + 1.97483 * Math.pow(10, -7) * temp * Math.pow(humidity, 3) - 2.18429 * Math.pow(10, -8) * Math.pow(temp, 3) * Math.pow(humidity, 2) + 8.43296 * Math.pow(10, -10) * Math.pow(temp, 2) * Math.pow(humidity, 3) - 4.81975 * Math.pow(10, -11) * Math.pow(temp, 3) * Math.pow(humidity, 3);
const HI_CA = (temp, WVP) => temp + 0.5555 * (WVP - 10.0);
const WCI = (temp, speed) => 13.12 + 0.6215 * temp - 11.37 * Math.pow(speed, 0.16) + 0.3965 * temp * Math.pow(speed, 0.16);
const WVPbyDP = temp => 6.11 * Math.exp(5417.7530 * (1 / 273.16 - 1 / (temp + 273.15)));
const RH = (temp, WVP) => WVP / (6.105 * Math.exp(17.27 * temp / (237.7 + temp))) * 100;
const WVP = (temp, humidity) => humidity / 100 * 6.105 * Math.exp(17.27 * temp / (237.7 + temp));

/* eslint-disable no-param-reassign */

class BaseFeels {
  static tempConvert(temp, from, to, round) {
    if (round === void 0) {
      round = false;
    }

    if (round) {
      if (typeof round === 'function') {
        return round(tempConvert(temp, from, to));
      }

      return Math.round(tempConvert(temp, from, to));
    }

    return tempConvert(temp, from, to);
  }

  static speedConvert(speed, from, to, round) {
    if (round === void 0) {
      round = false;
    }

    if (round) {
      if (typeof round === 'function') {
        return round(speedConvert(speed, from, to));
      }

      return Math.round(speedConvert(speed, from, to));
    }

    return speedConvert(speed, from, to);
  }

  static heatIndex(temp, humidity, _temp) {
    let {
      dewPoint,
      round
    } = _temp === void 0 ? {} : _temp;

    // HI
    if (!isCorrect(temp, humidity)) {
      throw new Error('One of the required arguments are not specified');
    }

    const t = BaseFeels.tempConvert(temp, 'c', 'f');

    if (t < 68) {
      throw new RangeError('Heat Index: temp must be >= (20C, 68F, 293.15K)');
    }

    if (dewPoint) {
      humidity = BaseFeels.getRH(temp, humidity, {
        dewPoint: true
      });
    } else if (humidity <= 0 || humidity > 100) {
      throw new RangeError('Heat Index: humidity must be in (0, 100]');
    }

    return BaseFeels.tempConvert(HI(t, humidity), 'f', 'c', round);
  }

  static humidex(temp, humidity, _temp2) {
    let {
      dewPoint,
      round
    } = _temp2 === void 0 ? {} : _temp2;

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

    const wvp = dewPoint ? BaseFeels.getWVPbyDP(humidity) : BaseFeels.getWVP(temp, humidity);
    return BaseFeels.tempConvert(HI_CA(temp, wvp), '', '', round);
  }

  static windChill(temp, speed, _temp3) {
    let {
      round
    } = _temp3 === void 0 ? {} : _temp3;

    // WCI
    if (!isCorrect(temp, speed)) {
      throw new Error('One of the required arguments are not specified');
    }

    if (temp > 0) {
      throw new RangeError('Wind Chill: temp must be <= (0C, 32F, 273.15K)');
    } else if (speed < 0) {
      throw new RangeError('Wind Chill: wind speed must be >= 0');
    }

    const s = BaseFeels.speedConvert(speed, 'mps', 'kph');

    if (s >= 5) {
      return BaseFeels.tempConvert(WCI(temp, s), '', '', round);
    }

    return BaseFeels.tempConvert(temp + (-1.59 + 0.1345 * temp) / 5 * s, '', '', round);
  }

  static getWVP(temp, humidity, _temp4) {
    let {
      round
    } = _temp4 === void 0 ? {} : _temp4;

    if (!isCorrect(humidity, temp)) {
      throw new Error('One of the required arguments are not specified');
    }

    if (humidity <= 0 || humidity > 100) {
      throw new RangeError('Water Vapour Pressure: humidity must be in (0, 100]');
    }

    return BaseFeels.tempConvert(WVP(temp, humidity), '', '', round);
  }

  static getWVPbyDP(dewPoint, _temp5) {
    let {
      round
    } = _temp5 === void 0 ? {} : _temp5;

    if (!isCorrect(dewPoint)) {
      throw new Error('Dew point is not specified');
    }

    return BaseFeels.tempConvert(WVPbyDP(dewPoint), '', '', round);
  }

  static getRH(temp, wvp, _temp6) {
    let {
      dewPoint,
      round
    } = _temp6 === void 0 ? {} : _temp6;

    if (!isCorrect(temp, wvp)) {
      throw new Error('One of the required arguments are not specified');
    }

    return BaseFeels.tempConvert(RH(temp, dewPoint ? BaseFeels.getWVPbyDP(wvp) : wvp), '', '', round);
  }

}

/* eslint-disable max-len, no-underscore-dangle, no-restricted-syntax */

function apparentTemp(tempConvert, func) {
  if (!isCorrect(this.temp) || !isCorrect(this.humidity) && !isCorrect(this.dewPoint)) {
    throw new Error('One of the required arguments are not specified');
  }

  const {
    temp
  } = this.units;
  const t = tempConvert(this.temp, temp, 'c');
  const index = isCorrect(this.dewPoint) && !isCorrect(this.humidity) ? func(t, tempConvert(this.dewPoint, temp, 'c'), {
    dewPoint: true
  }) : func(t, this.humidity);
  return tempConvert(index, 'c', this._units.temp, this.round);
}

class Feels extends BaseFeels {
  constructor(opts) {
    super();
    this.setOptions(opts);
    this._methods = {
      HI: 'heatIndex',
      HI_CA: 'humidex',
      WCI: 'windChill'
    };
  }

  setOptions(opts) {
    if (opts === void 0) {
      opts = {};
    }

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
  }

  like(methods) {
    if (methods === void 0) {
      methods = ['HI', 'HI_CA', 'WCI'];
    }

    if (typeof methods === 'string') {
      const method = this._methods[methods.toUpperCase()];

      if (method) {
        return this[method]();
      }

      throw new RangeError("Methods must be one of: " + Object.keys(this._methods).join(', '));
    }

    if (Array.isArray(methods)) {
      let like = 0;
      let count = methods.length;

      for (const m of methods) {
        const method = this._methods[m.toUpperCase()];

        if (method) {
          try {
            like += this[method]();
          } catch (e) {
            // eslint-disable-next-line no-plusplus
            count--;
          }
        } else {
          // eslint-disable-next-line max-len
          throw new RangeError("Methods must be one of: " + Object.keys(this._methods).join(', '));
        }
      }

      if (!count) {
        throw new Error('No valid methods for these values');
      }

      return Feels.tempConvert(like / count, '', '', this.round);
    }

    return this.like(['HI', 'HI_CA', 'WCI']);
  }

  heatIndex() {
    // HI
    return apparentTemp.call(this, Feels.tempConvert, Feels.heatIndex);
  }

  humidex() {
    // HI_CA
    return apparentTemp.call(this, Feels.tempConvert, Feels.humidex);
  }

  windChill() {
    // WCI
    if (!isCorrect(this.temp, this.speed)) {
      throw new Error('One of the required arguments are not specified');
    }

    const {
      temp,
      speed
    } = this.units;
    const u = this._units.temp;
    const t = Feels.tempConvert(this.temp, temp, 'c');
    const s = Feels.speedConvert(this.speed, speed, 'mps');
    return Feels.tempConvert(Feels.windChill(t, s), 'c', u, this.round);
  }

}

export default Feels;
