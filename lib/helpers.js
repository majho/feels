const tempFormat = (temp) => {
    if (temp === 'f' || temp === 'fahrenheit') {
        return 'f';
    } if (temp === 'k' || temp === 'kelvin') {
        return 'k';
    }
    return 'c';
};

const speedFormat = (speed) => {
    if (speed === 'mph' || speed === 'mi/h') {
        return 'mph';
    } if (['kmh', 'kph', 'kmph', 'km/h'].includes(speed)) {
        return 'kph';
    }
    return 'mps';
};

export const isCorrect = (...args) => (
    args.every((arg) => arg != null && Number.isFinite(arg))
);

export const unitsFormat = (units) => {
    if (!units) {
        return {
            temp: 'c',
            speed: 'mps',
        };
    }

    const temp = (units.temp) ? units.temp.toLowerCase() : 'c';
    const speed = (units.speed) ? units.speed.toLowerCase() : 'mps';

    return { temp: tempFormat(temp), speed: speedFormat(speed) };
};

export const tempConvert = (temp, from, to) => {
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
        return (to === 'f')
            ? (temp * 1000 * (9 / 5) + 32 * 1000) / 1000
            : (temp * 1000 + 273.15 * 1000) / 1000;
    }
    if (from === 'f') {
        return (to === 'c')
            ? ((temp - 32) * 1000 * (5 / 9)) / 1000
            : ((temp + 459.67) * 1000 * (5 / 9)) / 1000;
    }
    return (to === 'c') // k
        ? (temp * 1000 - 273.15 * 1000) / 1000
        : (temp * 1000 * (9 / 5) - 459.67 * 1000) / 1000;
};

export const speedConvert = (speed, from, to) => {
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
        return (to === 'mph') ? speed / 0.44704 : speed * 3.6;
    }
    if (from === 'mph') {
        return (to === 'mps') ? speed * 0.44704 : speed * 1.609344;
    }
    return (to === 'mps') ? speed / 3.6 : speed / 1.609344; // kph
};
