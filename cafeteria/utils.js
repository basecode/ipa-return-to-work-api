const TIMESLOTS_ALL_DURATION = 40;
const TIMESLOTS_MINUTES = 5;
const TIMESLOTS_MS = 1000 * 60 * TIMESLOTS_MINUTES;

const findNearestTimeslot = (timestamp) => new Date(Math.round(timestamp / TIMESLOTS_MS) * TIMESLOTS_MS).getTime();
const randBetween = (start, end) => Math.floor(Math.random() * start) + end;

// consts
exports.consts = Object.freeze({
    TIMESLOTS_ALL_DURATION,
    TIMESLOTS_MINUTES
});

exports.availableSpots = (userAgent) => (currentValue, index) => {
    const now = userAgent.includes('it-tests') ? new Date(+userAgent.substring(11)).getTime() : new Date().getTime();
    const from = findNearestTimeslot(now + TIMESLOTS_MS * index);
    const to = findNearestTimeslot(now + TIMESLOTS_MS * (index + 1));
    return { from, to, free: true, owner: null };
};

exports.overwriteWithRandomSpots = (users) => {
    return (currentValue, index, array) => {
        return currentValue.free && (index === 0 || index === 4) ? {
            ...currentValue,
            ...{ free: false, owner: '987654' }
        } : currentValue;
    }
};

exports.overwriteWithOldStateSpot = (oldStateSpots) => (currentValue) => {
    const oldSpot = oldStateSpots.find(spot => currentValue.from === spot.from);
    return oldSpot && currentValue.from === oldSpot.from ? oldSpot : currentValue;
};

exports.overwriteWithRequestedSpot = (from, owner) => (currentValue) => {
    return currentValue.from === from ? {
        ...currentValue,
        ...{ free: false, owner }
    } : currentValue;
};
