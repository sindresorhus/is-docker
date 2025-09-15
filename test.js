import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import esmock from 'esmock';

test('detects Docker via /.dockerenv', async () => {
	const isDocker = await esmock('./index.js', {
		'node:fs': {
			statSync(path) {
				if (path === '/.dockerenv') {
					return {};
				}

				throw new Error('ENOENT');
			},
			readFileSync() {
				throw new Error('ENOENT');
			},
		},
	});

	assert.equal(isDocker.default(), true);
});

test('detects Docker via /proc/self/cgroup', async () => {
	const isDocker = await esmock('./index.js', {
		'node:fs': {
			statSync() {
				throw new Error('ENOENT');
			},
			readFileSync(path) {
				if (path === '/proc/self/cgroup') {
					return 'xxx docker yyyy';
				}

				throw new Error('ENOENT');
			},
		},
	});

	assert.equal(isDocker.default(), true);
});

test('detects Docker via /proc/self/mountinfo', async () => {
	const isDocker = await esmock('./index.js', {
		'node:fs': {
			statSync() {
				throw new Error('ENOENT');
			},
			readFileSync(path) {
				if (path === '/proc/self/mountinfo') {
					return '1234 24 0:6 /docker/containers/abc123/hostname /etc/hostname rw,nosuid';
				}

				if (path === '/proc/self/cgroup') {
					return '0::/'; // Cgroups v2 format
				}

				throw new Error('ENOENT');
			},
		},
	});

	assert.equal(isDocker.default(), true);
});

test('not inside Docker container', async () => {
	const isDocker = await esmock('./index.js', {
		'node:fs': {
			statSync() {
				throw new Error('ENOENT');
			},
			readFileSync() {
				throw new Error('ENOENT');
			},
		},
	});

	assert.equal(isDocker.default(), false);
});

test('caching works correctly', async () => {
	let statSyncCallCount = 0;
	let readFileSyncCallCount = 0;

	const isDocker = await esmock('./index.js', {
		'node:fs': {
			statSync() {
				statSyncCallCount++;
				throw new Error('ENOENT');
			},
			readFileSync(path) {
				readFileSyncCallCount++;
				if (path === '/proc/self/cgroup') {
					return 'xxx docker yyyy';
				}

				throw new Error('ENOENT');
			},
		},
	});

	// First call
	assert.equal(isDocker.default(), true);
	assert.equal(statSyncCallCount, 1);
	assert.equal(readFileSyncCallCount, 1);

	// Second call - should use cache
	assert.equal(isDocker.default(), true);
	assert.equal(statSyncCallCount, 1); // Should not increase
	assert.equal(readFileSyncCallCount, 1); // Should not increase
});
