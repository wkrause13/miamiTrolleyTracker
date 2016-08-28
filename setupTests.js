'use strict';

require('babel-register');
require('babel-polyfill');
require('react-native-mock/mock');
require('isomorphic-fetch');

let chai = require('chai');
let chaiAsPromised = require('chai-as-promised');
let chaiImmutable = require('chai-immutable');
let sinon = require('sinon');
let sinonChai = require('sinon-chai');


chai.expect;
chai.use(sinonChai);
chai.use(chaiImmutable);
chai.use(chaiAsPromised);

global.expect = chai.expect;
global.should = chai.should();
global.sinon = sinon;
