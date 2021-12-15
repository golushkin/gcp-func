require('dotenv').config()
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { handleUserData, getUserTokens, getAuthUrl } = require('./controllers/user')

admin.initializeApp();

exports.refreshUsersData = functions.https.onRequest(handleUserData);

exports.getUserTokens = functions.https.onRequest(getUserTokens);
exports.getAuthUrl = functions.https.onRequest(getAuthUrl);

exports.refreshUsersDataSchedule = functions.pubsub.schedule('every day 01:00').onRun(() => {
    console.log('pubsub')
    return null
});
