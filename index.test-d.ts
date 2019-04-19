import {expectType} from 'tsd';
import isDocker = require('.');

expectType<boolean>(isDocker());
