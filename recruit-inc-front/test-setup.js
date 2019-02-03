/**
 * Setup Adapter between React 16 and Enzyme
 * code from: https://medium.com/@mateuszsokola/configuring-react-16-jest-enzyme-typescript-7122e1a1e6e8
 */
const enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');

enzyme.configure({ adapter: new Adapter() });
