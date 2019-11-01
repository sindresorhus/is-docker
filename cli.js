#!/usr/bin/env node

'use strict';

const api = require('.');

if (!api()) {
	process.exit(1);
}
