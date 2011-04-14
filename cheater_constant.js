var statusMap = {
    initializing: {val: 1, desc: 'initializing'},
    starting: {val: 2, desc: 'starting'},
    started: {val: 3, desc: 'started'},
    loggingIn: {val: 4, desc: 'logging in'},
    loggedIn: {val: 5, desc: 'logged in'},
    heartbeating: {val: 6, desc: 'heartbeating'},
    heartbeatingRetrying: {val: 7, desc: 'heartbeating retrying'},
    heartbeatingFailed: {val: 8, desc: 'heartbeating failed'},
    heartbeatingRetryFailed: {val: 9, desc: 'heartbeating retry failed'},
    loggingOut: {val: 10, desc: 'logging out'},
    loggedOut: {val: 11, desc: 'logged out'},
    loggingInRetrying: {val: 12, desc: 'logging in retrying'},
    loggingInRetryFailed: {val: 13, desc: 'logging in retry failed'},
    stopping: {val: 14, desc: 'stopping'},
    stopped: {val: 15, desc: 'stopped'}
};

exports.statusMap = statusMap;
