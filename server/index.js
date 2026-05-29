// Entry point for backward compatibility with Render start command
// Render runs 'cd server && node index.js' by default.
const app = require('./dist/index').default || require('./dist/index');
module.exports = app;
