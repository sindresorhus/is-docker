import test from 'ava';
import esmock from 'esmock';

test('detects Docker via /.dockerenv', async t => {
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

	t.true(isDocker.default());
});

test('detects Docker via /proc/self/cgroup', async t => {
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

	t.true(isDocker.default());
});

test('detects Docker via /proc/self/mountinfo', async t => {
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

	t.true(isDocker.default());
});

test('not inside Docker container', async t => {
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

	t.false(isDocker.default());
});

test('caching works correctly', async t => {
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
	t.true(isDocker.default());
	t.is(statSyncCallCount, 1);
	t.is(readFileSyncCallCount, 1);

	// Second call - should use cache
	t.true(isDocker.default());
	t.is(statSyncCallCount, 1); // Should not increase
	t.is(readFileSyncCallCount, 1); // Should not increase
});
