import fs from 'fs';
import path from 'path';
import test from 'ava';
import sinon from 'sinon';

test('inside a Docker container', t => {
	delete require.cache[path.join(__dirname, 'index.js')];
	const isDocker = require('./');
	fs.statSync = sinon.stub(fs, 'statSync');
	fs.statSync.withArgs('/.dockerinit').returns({});
	t.true(isDocker());
	fs.statSync.restore();
});

test('not inside a Docker container', t => {
	delete require.cache[path.join(__dirname, 'index.js')];
	const isDocker = require('./');
	fs.statSync = sinon.stub(fs, 'statSync');
	fs.statSync.withArgs('/.dockerinit').throws('ENOENT, no such file or directory \'/.dockerinit\'');
	t.false(isDocker());
	fs.statSync.restore();
});
