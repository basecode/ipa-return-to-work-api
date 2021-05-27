const requestUtils = require('../src/requestutils');
const cafeteriaUtils = require('../cafeteria/utils');
const users = require('../src/users');

module.exports = async function (context, req) {
    context.res =  requestUtils.wrapper(req, (req, oldState) => {
        return {
            userId: users[req.body.code].id,
            userName: users[req.body.code].name,
            seat: users[req.body.code].seat,
            cafeteria_spots: [...Array(cafeteriaUtils.consts.TIMESLOTS_ALL_DURATION / cafeteriaUtils.consts.TIMESLOTS_MINUTES)]
              .map(cafeteriaUtils.availableSpots(req.headers['user-agent']))
              .map(cafeteriaUtils.overwriteWithRandomSpots(['12', '123']))
        };
    });
}

