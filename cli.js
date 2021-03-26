#!/usr/bin/env node

const command = process.argv[2];
const kill = require('kill-port');

switch(command) {
    case 'start':
        const path = require('path');
        const spawn = require('child_process').spawn;

        // kill port in case it is running
        kill('7071', 'tcp');

        const bin = path.resolve(path.join(path.dirname(__filename), '..', 'azure-functions-core-tools/bin'));
        spawn(bin + '/func', ['start', '--javascript', '--cors=*'], {
            cwd: path.dirname(__filename),
            detached: true
        });
        console.log('Return to Work API running on http://localhost:7071');
        process.exit(0);
        break;
    case 'stop':
        kill('7071', 'tcp');
        process.exit(0);
        break;
};
