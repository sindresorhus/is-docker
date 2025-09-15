# is-docker

> Check if the process is running inside a Docker container

## Install

```sh
npm install is-docker
```

## Usage

```js
import isDocker from 'is-docker';

if (isDocker()) {
	console.log('Running inside a Docker container');
}
```

## CLI

```sh
$ is-docker
```

Exits with code 0 if inside a Docker container and 2 if not.

```sh
$ is-docker && echo "Running in Docker" || echo "Not running in Docker"
```

## Related

- [is-inside-container](https://github.com/sindresorhus/is-inside-container) - Check if the process is running inside a container
