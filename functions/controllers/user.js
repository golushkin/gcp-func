const { getCollectionData, updateUserData, addTokenInfo } = require("../services/firestore");
const { getUsersData, createConnection, getConnectionUrl } = require("../services/people");
const { collectionNames } = require("../consts/common");

const handleUserData = async (req, res) => {
  const usersData = await getUsersData();

  const data = await getCollectionData(collectionNames.usersData);
  const updateResult = await updateUserData(usersData, data);

  res.json({
    result: `${
      updateResult.filter((result) => result.status === "fulfilled").length
    } users have been updated`,
  });
};

const getUserTokens = async (req, res) => {
  const { code } = req.query;

  const auth = createConnection();

  if (code) {    
      const data = await auth.getToken(code);
      const tokens = data.tokens;
      const tokenInfo = await auth.getTokenInfo(tokens.access_token)
      console.log(tokenInfo)
      
      await addTokenInfo(tokenInfo.email, tokens)

      res.sendStatus(200)
    
  } else {
   
    res.redirect(getConnectionUrl(auth))
  }
};

module.exports = {
  handleUserData,
  getUserTokens,
};
