import fs from 'node:fs';

let isDockerCached;

function hasDockerEnv() {
	try {
		fs.statSync('/.dockerenv');
		return true;
	} catch {
		return false;
	}
}

function hasDockerCGroup() {
	try {
		return fs.readFileSync('/proc/self/cgroup', 'utf8').includes('docker');
	} catch {
		return false;
	}
}

function hasDockerMountInfo() {
	try {
		const mountinfo = fs.readFileSync('/proc/self/mountinfo', 'utf8');
		return mountinfo.includes('/docker/containers/') || mountinfo.includes('/docker/buildkit/');
	} catch {
		return false;
	}
}

export default function isDocker() {
	isDockerCached ??= hasDockerEnv() || hasDockerCGroup() || hasDockerMountInfo();
	return isDockerCached;
}
