/* eslint-disable max-len, no-underscore-dangle, no-restricted-syntax */
import { isCorrect, unitsFormat } from './lib/helpers';
import BaseFeels from './lib/base';

function apparentTemp(tempConvert, func) {
    if (!isCorrect(this.temp) || (!isCorrect(this.humidity) && !isCorrect(this.dewPoint))) {
        throw new Error('One of the required arguments are not specified');
    }

    const { temp } = this.units;
    const t = tempConvert(this.temp, temp, 'c');

    const index = (isCorrect(this.dewPoint) && !isCorrect(this.humidity))
        ? func(t, tempConvert(this.dewPoint, temp, 'c'), { dewPoint: true })
        : func(t, this.humidity);

    return tempConvert(index, 'c', this._units.temp, this.round);
}

class Feels extends BaseFeels {
    constructor(opts) {
        super();
        this.setOptions(opts);
        this._methods = {
            HI: 'heatIndex',
            HI_CA: 'humidex',
            WCI: 'windChill',
        };
    }

    setOptions(opts = {}) {
        this.units = unitsFormat(opts.units);
        this.temp = opts.temp;
        this.speed = opts.speed || 0;
        this.humidity = opts.humidity;
        this.dewPoint = opts.dewPoint;
        this.wvp = opts.wvp;
        this.round = opts.round;
        this._units = {
            temp: this.units.temp,
            speed: this.units.speed,
        };
        return this;
    }

    like(methods = ['HI', 'HI_CA', 'WCI']) {
        if (typeof methods === 'string') {
            const method = this._methods[methods.toUpperCase()];
            if (method) {
                return this[method]();
            }
            throw new RangeError(`Methods must be one of: ${Object.keys(this._methods).join(', ')}`);
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
                    throw new RangeError(`Methods must be one of: ${Object.keys(this._methods).join(', ')}`);
                }
            }

            if (!count) {
                throw new Error('No valid methods for these values');
            }
            return Feels.tempConvert(like / count, '', '', this.round);
        }
        return this.like(['HI', 'HI_CA', 'WCI']);
    }

    heatIndex() { // HI
        return apparentTemp.call(this, Feels.tempConvert, Feels.heatIndex);
    }

    humidex() { // HI_CA
        return apparentTemp.call(this, Feels.tempConvert, Feels.humidex);
    }

    windChill() { // WCI
        if (!isCorrect(this.temp, this.speed)) {
            throw new Error('One of the required arguments are not specified');
        }
        const { temp, speed } = this.units;
        const u = this._units.temp;
        const t = Feels.tempConvert(this.temp, temp, 'c');
        const s = Feels.speedConvert(this.speed, speed, 'mps');

        return Feels.tempConvert(Feels.windChill(t, s), 'c', u, this.round);
    }
}

export default Feels;
