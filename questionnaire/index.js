const requestUtils = require('../src/requestutils');

module.exports = async function (context, req) {
    context.res =  requestUtils.wrapper(req, (req, oldState) => {
        return {
            questionnaire_result: !req.body.contactLast14Days &&
                !req.body.selfQuarantine &&
                !req.body.symptomsLast14Days &&
                req.body.requestedWorkplace
        };
    });
}
