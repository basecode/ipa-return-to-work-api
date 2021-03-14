#!/usr/bin/env node

const command = process.argv[2];

switch(command) {
    case 'start':
        const path = require('path');
        const spawn = require('child_process').spawn;

        const bin = path.resolve(path.join(path.dirname(__filename), '..', 'azure-functions-core-tools/bin'));
        process.env.ipaReturnToWorkApiProcess = spawn(bin + '/func', ['start', '--javascript'], {
            cwd: path.dirname(__filename),
            detached: true
        });
        break;
    case 'stop':
        const kill = require('kill-port');
        kill('7071', 'tcp');
        break;
};
