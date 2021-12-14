require('dotenv').config()
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { handleUserData } = require('./controllers/user')

admin.initializeApp();

exports.addMessage = functions.https.onRequest(handleUserData);

// exports.addMessageSchedule = functions.pubsub.schedule('0 1 * * *').onRun(handleUserData);
