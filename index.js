'use strict';
var fs = require('fs');
var isDocker;

function check() {
	try {
		fs.statSync('/.dockerinit');
		fs.statSync('/.dockerenv');
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
