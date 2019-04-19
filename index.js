'use strict';
const fs = require('fs');

let isDocker;

function hasDockerEnv() {
	try {
		fs.statSync('/.dockerenv');
		return true;
	} catch (_) {
		return false;
	}
}

function hasDockerCGroup() {
	try {
		return (
			fs.readFileSync('/proc/self/cgroup', 'utf8').indexOf('docker') !== -1
		);
	} catch (_) {
		return false;
	}
}

function check() {
	return hasDockerEnv() || hasDockerCGroup();
}

module.exports = () => {
	if (isDocker === undefined) {
		isDocker = check();
	}

	return isDocker;
};
