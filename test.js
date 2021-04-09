import fs from 'fs';
import path from 'path';
import test from 'ava';
import sinon from 'sinon';

test('inside a Docker container (.dockerenv test)', t => {
	delete require.cache[path.join(__dirname, 'index.js')];
	const isDocker = require('.');

	fs.statSync = sinon.stub(fs, 'statSync');
	fs.statSync.withArgs('/.dockerenv').returns({});
	t.true(isDocker());
	fs.statSync.restore();
});

test('inside a Docker container (cgroup test)', t => {
	delete require.cache[path.join(__dirname, 'index.js')];
	const isDocker = require('.');

	fs.statSync = sinon.stub(fs, 'statSync');
	fs.statSync.withArgs('/.dockerenv').throws('ENOENT, no such file or directory \'/.dockerinit\'');

	fs.readFileSync = sinon.stub(fs, 'readFileSync');
	fs.readFileSync.withArgs('/proc/self/cgroup', 'utf8').returns('xxx docker yyyy');

	t.true(isDocker());

	fs.readFileSync.restore();
	fs.statSync.restore();
});

test('not inside a Docker container', t => {
	delete require.cache[path.join(__dirname, 'index.js')];
	const isDocker = require('.');

	fs.statSync = sinon.stub(fs, 'statSync');
	fs.statSync.withArgs('/.dockerenv').throws('ENOENT, no such file or directory \'/.dockerinit\'');

	t.false(isDocker());

	fs.statSync.restore();
});
