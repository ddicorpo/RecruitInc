/**
 * Removing animation warnings
 * code from: https://medium.com/@mateuszsokola/configuring-react-16-jest-enzyme-typescript-7122e1a1e6e8
 */
global.requestAnimationFrame = function(callback) {
  setTimeout(callback, 0);
};
