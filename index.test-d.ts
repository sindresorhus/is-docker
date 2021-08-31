import {expectType} from 'tsd';
import isDocker from './index.js';

expectType<boolean>(isDocker());
