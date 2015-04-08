'use strict';
var fs = require('fs');
var isDocker;

function check() {
	try {
		fs.statSync('/.dockerinit');
		return true;
	} catch (err) {
		return false;
	}
}

module.exports = function () {
	if (isDocker === undefined) {
		isDocker = check();
	}

	return isDocker;
};
