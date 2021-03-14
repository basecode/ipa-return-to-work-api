const requestUtils = require('../src/requestutils');
const cafeteriaUtils = require('./utils');

module.exports = async function (context, req) {
    context.res =  requestUtils.wrapper(req, (req, oldState) => {
        switch (req.method) {
            case 'GET':
                return {
                    cafeteria_spots: [...Array(cafeteriaUtils.consts.TIMESLOTS_ALL_DURATION / cafeteriaUtils.consts.TIMESLOTS_MINUTES)]
                        .map(cafeteriaUtils.availableSpots(req.headers['user-agent']))
                        .map(cafeteriaUtils.overwriteWithOldStateSpot(oldState.cafeteria_spots))
                        .map(cafeteriaUtils.overwriteWithRandomSpots(['12', '123']))
                    };
            case 'POST':
                return {
                    cafeteria_spots: [...Array(cafeteriaUtils.consts.TIMESLOTS_ALL_DURATION / cafeteriaUtils.consts.TIMESLOTS_MINUTES)]
                        .map(cafeteriaUtils.availableSpots(req.headers['user-agent']))
                        .map(cafeteriaUtils.overwriteWithOldStateSpot(oldState.cafeteria_spots))
                        .map(cafeteriaUtils.overwriteWithRequestedSpot(req.body.spot_request_from, oldState.userId))
                    };
        };
    });
}
