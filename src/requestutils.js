const jwt = require('jsonwebtoken');
const state = require('./state');
const PSEUDO_SECRET = '2990ed47-e890-4c16-80b3-85043abcf2bd';
const FORBIDDEN_403 = {
    status: 403,
    body: 'Your link is not valid anymore. Please check your E-Mail inbox for a valid link.'
};
const INTERNAL_500 = {
    status: 500,
    body: 'Internal error. Please contact Adobe’s Employee Resource Center.'
};

const hasCodeOrSession = (req) => {
    return req.headers.session || req.body.code;
};

const verifyAndEncodePayloadFromSession = (req) => {
    return jwt.verify(req.headers.session, PSEUDO_SECRET);
};

const createSessionWithNewState = (req, oldState, newState) => {
    const mergedState = state.mergeState(oldState, newState);
    const expiration = Math.floor(Date.now() / 1000) + (60 * 60 * 24); //24h
    const claims = {
        sub: mergedState.userId,
        iss: req.headers.referer || req.headers['user-agent'],
        permissions: 'questionnaire,seat,cafeteria'
    };
    return {
        status: 200,
        body: jwt.sign({ ...claims, ...mergedState, exp: expiration }, PSEUDO_SECRET)
    }
};

const exceptionResponse = (exception) => {
    if (['TokenExpiredError', 'JsonWebTokenError'].includes(exception.name)) {
        return FORBIDDEN_403;
    } else {
        return INTERNAL_500;
    }
};

module.exports = ({
    wrapper(req, businessLogic) {
        try {
            // session logic with initial password
            if (req.body && req.body.code) {
                const oldState = state.consts.DEFAULT_STATE;
                const newState = businessLogic(req, oldState);
                return createSessionWithNewState(req, oldState, newState);
            }
            // session logic with session jwt
            if (req.headers.session) {
                const oldState = verifyAndEncodePayloadFromSession(req);
                const newState = businessLogic(req, oldState);
                return createSessionWithNewState(req, oldState, newState);
            }
            return FORBIDDEN_403;
        } catch(e) {
            return exceptionResponse(e);
        }

    }
});
