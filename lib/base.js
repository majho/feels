/* eslint-disable no-param-reassign */
import { isCorrect, tempConvert, speedConvert } from './helpers';
import { HI, HI_CA, WCI, RH, WVP, WVPbyDP } from './formulas';

class BaseFeels {
    static tempConvert(temp, from, to, round = false) {
        if (round) {
            if (typeof round === 'function') {
                return round(tempConvert(temp, from, to));
            }
            return Math.round(tempConvert(temp, from, to));
        }
        return tempConvert(temp, from, to);
    }

    static speedConvert(speed, from, to, round = false) {
        if (round) {
            if (typeof round === 'function') {
                return round(speedConvert(speed, from, to));
            }
            return Math.round(speedConvert(speed, from, to));
        }
        return speedConvert(speed, from, to);
    }

    static heatIndex(temp, humidity, { dewPoint, round } = {}) { // HI
        if (!isCorrect(temp, humidity)) {
            throw new Error('One of the required arguments are not specified');
        }
        const t = BaseFeels.tempConvert(temp, 'c', 'f');

        if (t < 68) {
            throw new RangeError('Heat Index: temp must be >= (20C, 68F, 293.15K)');
        }

        if (dewPoint) {
            humidity = BaseFeels.getRH(temp, humidity, { dewPoint: true });
        } else if (humidity <= 0 || humidity > 100) {
            throw new RangeError('Heat Index: humidity must be in (0, 100]');
        }

        return BaseFeels.tempConvert(HI(t, humidity), 'f', 'c', round);
    }

    static humidex(temp, humidity, { dewPoint, round } = {}) { // HI_CA
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

    static windChill(temp, speed, { round } = {}) { // WCI
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
        return BaseFeels.tempConvert(temp + ((-1.59 + 0.1345 * temp) / 5) * s, '', '', round);
    }

    static getWVP(temp, humidity, { round } = {}) {
        if (!isCorrect(humidity, temp)) {
            throw new Error('One of the required arguments are not specified');
        }

        if (humidity <= 0 || humidity > 100) {
            throw new RangeError('Water Vapour Pressure: humidity must be in (0, 100]');
        }

        return BaseFeels.tempConvert(WVP(temp, humidity), '', '', round);
    }

    static getWVPbyDP(dewPoint, { round } = {}) {
        if (!isCorrect(dewPoint)) {
            throw new Error('Dew point is not specified');
        }

        return BaseFeels.tempConvert(WVPbyDP(dewPoint), '', '', round);
    }

    static getRH(temp, wvp, { dewPoint, round } = {}) {
        if (!isCorrect(temp, wvp)) {
            throw new Error('One of the required arguments are not specified');
        }

        return BaseFeels.tempConvert(RH(temp, (dewPoint) ? BaseFeels.getWVPbyDP(wvp) : wvp), '', '', round);
    }
}

export default BaseFeels;
