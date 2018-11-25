module.exports = {
  publicRuntimeConfig: {
    // Will be available on both server and client
    BACK_END_URL: process.env.BACK_END_URL || 'http://localhost:6969',
  },
};
