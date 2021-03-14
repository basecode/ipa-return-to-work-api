exports.consts = Object.freeze({
    DEFAULT_STATE: {
        userId: '',
        userName: '',
        questionnaire_result: false,
        seat: '123',
        location: 'Basel',
        cafeteria_spots: []
    }
});

exports.mergeState = (oldState, newState) => ({
    ...oldState,
    ...newState
});
