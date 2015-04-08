'use strict';
var fs = require('fs');
var path = require('path');
var test = require('ava');
var sinon = require('sinon');

test('inside a Docker container', function (t) {
	delete require.cache[path.join(__dirname, 'index.js')];
	var isDocker = require('./');
	fs.statSync = sinon.stub(fs, 'statSync');
	fs.statSync.withArgs('/.dockerinit').returns({});
	t.assert(isDocker());
	fs.statSync.restore();
	t.end();
});

test('not inside a Docker container', function (t) {
	delete require.cache[path.join(__dirname, 'index.js')];
	var isDocker = require('./');
	fs.statSync = sinon.stub(fs, 'statSync');
	fs.statSync.withArgs('/.dockerinit').throws('ENOENT, no such file or directory \'/.dockerinit\'');
	t.assert(!isDocker());
	fs.statSync.restore();
	t.end();
});
