const test = require('ava');
const fetch = require('node-fetch');
const jsonwebtoken = require('jsonwebtoken');

const NOW = new Date('Sun Mar 14 2021 13:21:06 GMT+0100 (CET)').getTime();
const PORT = '7071';
const HTTP_API_ENDPOINT = `http://localhost:${PORT}/api`;
const PSEUDO_SECRET = '2990ed47-e890-4c16-80b3-85043abcf2bd';
const DEFAULT_SPOTS = [
    { from: 1615724400000, to: 1615724700000, free: false, owner: '987654'},
    { from: 1615724700000, to: 1615725000000, free: true, owner: null},
    { from: 1615725000000, to: 1615725300000, free: true, owner: null},
    { from: 1615725300000, to: 1615725600000, free: true, owner: null},
    { from: 1615725600000, to: 1615725900000, free: false, owner: '987654'},
    { from: 1615725900000, to: 1615726200000, free: true, owner: null},
    { from: 1615726200000, to: 1615726500000, free: true, owner: null},
    { from: 1615726500000, to: 1615726800000, free: true, owner: null}
];

const request = async (path, method, body = '', userHeaders = {}) => {
    const headers = Object.assign({ 'Content-Type': 'application/json', 'user-agent': `it-tests - ${NOW}` }, userHeaders);
    const response = await fetch(`${HTTP_API_ENDPOINT}${path}`, { method, body: body ? JSON.stringify(body) : null, headers});
    return await response.text();
};
test.serial.before(async t => {
    const checkConnection = async () => {
        try {
            const response = await fetch(`${HTTP_API_ENDPOINT}/healthcheck`, { method: 'HEAD'});
            if (response.status === 404) {
                return await checkConnection();
            }
        } catch(e) {
            return await checkConnection();
        }
    }
    return await checkConnection();
});

test.serial('login anonymous', async t => {
    const jwt = await request('/login', 'POST', { code: '1111111' });
    const payloadDecoded = jsonwebtoken.verify(jwt, PSEUDO_SECRET);
    t.is(payloadDecoded.userId, '11111');
    t.is(payloadDecoded.userName, 'Anonymous');
    t.is(payloadDecoded.questionnaire_result, false);
    t.is(payloadDecoded.seat, '122');
    t.is(payloadDecoded.location, 'Basel');
    t.deepEqual(payloadDecoded.cafeteria_spots, DEFAULT_SPOTS)
});

test.serial('login Tatyana', async t => {
    const jwt = await request('/login', 'POST', { code: '3827393' });
    const payloadDecoded = jsonwebtoken.verify(jwt, PSEUDO_SECRET);
    t.is(payloadDecoded.userId, '27372');
    t.is(payloadDecoded.userName, 'Tatyana');
    t.is(payloadDecoded.questionnaire_result, false);
    t.is(payloadDecoded.seat, '122');
    t.is(payloadDecoded.location, 'Basel');
    t.deepEqual(payloadDecoded.cafeteria_spots, DEFAULT_SPOTS)
});

test.serial('login Tobias', async t => {
    const jwt = await request('/login', 'POST', { code: '9388282' });
    const payloadDecoded = jsonwebtoken.verify(jwt, PSEUDO_SECRET);
    t.is(payloadDecoded.userId, '27373');
    t.is(payloadDecoded.userName, 'Tobias');
    t.is(payloadDecoded.questionnaire_result, false);
    t.is(payloadDecoded.seat, '122');
    t.is(payloadDecoded.location, 'Basel');
    t.deepEqual(payloadDecoded.cafeteria_spots, DEFAULT_SPOTS)
});

test.serial('questionnaire happy path', async t => {
    const session = jsonwebtoken.sign({
        userId: 'my-user-id',
        userName: 'my-user-name',
        questionnaire_result: false,
        seat: 'iii',
        location: 'my-location',
        cafeteria_spots: DEFAULT_SPOTS
    }, PSEUDO_SECRET);
    
    const jwt = await request('/questionnaire', 'POST', {
        contactLast14Days: false,
        selfQuarantine: false,
        symptomsLast14Days: false,
        requestedWorkplace: true
    }, { session });
    
    const payloadDecoded = jsonwebtoken.verify(jwt, PSEUDO_SECRET);
    t.is(payloadDecoded.userId, 'my-user-id',);
    t.is(payloadDecoded.userName, 'my-user-name');
    t.is(payloadDecoded.questionnaire_result, true);
    t.is(payloadDecoded.seat, 'iii');
    t.is(payloadDecoded.location, 'my-location');
    t.deepEqual(payloadDecoded.cafeteria_spots, DEFAULT_SPOTS)
});

test.serial('questionnaire one is wrong', async t => {
    const session = jsonwebtoken.sign({
        userId: 'my-user-id',
        userName: 'my-user-name',
        questionnaire_result: false,
        seat: 'iii',
        location: 'my-location',
        cafeteria_spots: DEFAULT_SPOTS
    }, PSEUDO_SECRET);
    
    const jwt = await request('/questionnaire', 'POST', {
        contactLast14Days: true,
        selfQuarantine: false,
        symptomsLast14Days: false,
        requestedWorkplace: true
    }, { session });
    
    const payloadDecoded = jsonwebtoken.verify(jwt, PSEUDO_SECRET);
    t.is(payloadDecoded.userId, 'my-user-id',);
    t.is(payloadDecoded.userName, 'my-user-name');
    t.is(payloadDecoded.questionnaire_result, false);
    t.is(payloadDecoded.seat, 'iii');
    t.is(payloadDecoded.location, 'my-location');
    t.deepEqual(payloadDecoded.cafeteria_spots, DEFAULT_SPOTS)
});

test.serial('cafeteria get', async t => {
    const session = jsonwebtoken.sign({
        userId: 'my-user-id',
        userName: 'my-user-name',
        questionnaire_result: true,
        seat: 'iii',
        location: 'my-location',
        cafeteria_spots: DEFAULT_SPOTS
    }, PSEUDO_SECRET);
    
    const jwt = await request('/cafeteria', 'GET', null, { session });
    
    const payloadDecoded = jsonwebtoken.verify(jwt, PSEUDO_SECRET);
    t.is(payloadDecoded.userId, 'my-user-id',);
    t.is(payloadDecoded.userName, 'my-user-name');
    t.is(payloadDecoded.questionnaire_result, true);
    t.is(payloadDecoded.seat, 'iii');
    t.is(payloadDecoded.location, 'my-location');
    t.deepEqual(payloadDecoded.cafeteria_spots, DEFAULT_SPOTS)
});

test.serial('cafeteria post', async t => {
    const session = jsonwebtoken.sign({
        userId: '27372',
        userName: 'Tatyana',
        questionnaire_result: true,
        seat: 'iii',
        location: 'my-location',
        cafeteria_spots: DEFAULT_SPOTS
    }, PSEUDO_SECRET);
    
    const jwt = await request('/cafeteria', 'POST', { spot_request_from: 1615724700000 }, { session });
    
    const payloadDecoded = jsonwebtoken.verify(jwt, PSEUDO_SECRET);
    t.is(payloadDecoded.userId, '27372');
    t.is(payloadDecoded.userName, 'Tatyana');
    t.is(payloadDecoded.questionnaire_result, true);
    t.is(payloadDecoded.seat, 'iii');
    t.is(payloadDecoded.location, 'my-location');
    t.deepEqual(payloadDecoded.cafeteria_spots, [
        { from: 1615724400000, to: 1615724700000, free: false, owner: '987654'},
        { from: 1615724700000, to: 1615725000000, free: false, owner: '27372'},
        { from: 1615725000000, to: 1615725300000, free: true, owner: null},
        { from: 1615725300000, to: 1615725600000, free: true, owner: null},
        { from: 1615725600000, to: 1615725900000, free: false, owner: '987654'},
        { from: 1615725900000, to: 1615726200000, free: true, owner: null},
        { from: 1615726200000, to: 1615726500000, free: true, owner: null},
        { from: 1615726500000, to: 1615726800000, free: true, owner: null}
    ])
});

test.after( async () => {
    const kill = require('kill-port');
    await kill(PORT, 'tcp');
});
