const { getCollectionData, updateUserData } = require("../services/firestore");
const { getUsersData } = require("../services/people");
const { collectionNames } = require("../consts/common");


const handleUserData = async (req, res) => {
  const usersData = await getUsersData();
  console.log('usersData', usersData)
  const data = await getCollectionData(collectionNames.usersData);
  const updateResult = await updateUserData(usersData, data);

  res.json({ result: `${updateResult.filter(result => result.status === 'fulfilled').length} users have been updated` });
};

module.exports = {
  handleUserData,
};
