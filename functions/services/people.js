const { google } = require("googleapis");
const {
  googleConfig,
  defaultScope
} = require("../consts/common");
const { errors } = require("../consts/errors");
const { serializeUsersData } = require("../utils/helper");
const { getUsersTokens } = require("./firestore");

function createConnection() {
  return new google.auth.OAuth2(
    googleConfig.clientId,
    googleConfig.clientSecret,
    googleConfig.redirect
  );
}

function getConnectionUrl(auth) {
  return auth.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: defaultScope
  });
}

function getGooglePeopleApi(auth) {
  return google.people({ version: "v1", auth });
}

async function getGoogleAccountData(userTokens) {
  const auth = createConnection();
  auth.setCredentials(userTokens);

  try {
    const googlePeople = getGooglePeopleApi(auth);
    const usersData = await googlePeople.people.get({
      resourceName: "people/me",
      personFields: "emailAddresses",
    });  

    return usersData.data;
  } catch (error) {
    console.log('error', error)
    return null;
  }
}


const getUsersDataWithApi = async (usersTokens) => {
  // todo: add queue
  const usersDataWithApi = [];

  await Promise.allSettled(
    usersTokens.map(async (userTokens) => {
      const res = await getGoogleAccountData(userTokens);
      if (res) {
        usersDataWithApi.push(res);
      } 
    })
  );

  return usersDataWithApi;
};

const getUsersData = async () => {
  const tokens = await getUsersTokens();

  if (!tokens.length) {
    throw new Error(errors.usersTokensEmpty);
  }

  const usersDataWithApi = await getUsersDataWithApi(tokens);
  return serializeUsersData(usersDataWithApi);
};


module.exports = {
    getUsersData,
    createConnection,
    getConnectionUrl,
    getGooglePeopleApi
};
