const admin = require("firebase-admin");
const { collectionNames } = require("../consts/common");

const getCollectionRef = (collectionName) => {
  return admin.firestore().collection(collectionName);
};

const getUsersTokens = async () => {
  let query = getCollectionRef(collectionNames.usersTokens);
  const collectionData = [];

  try {
    const querySnapshot = await query.get();

    if (!querySnapshot.empty) {
      querySnapshot.docs.forEach((documentSnapshot) => {
        if (documentSnapshot.exists) {
          collectionData.push(documentSnapshot.data());
        }
      });
    }
  } catch (error) {
    console.log("error", error);
  }

  return collectionData;
};

const getCollectionData = async (collectionName) => {
  let query = getCollectionRef(collectionName);
  const collectionData = [];

  try {
    const querySnapshot = await query.get();

    if (!querySnapshot.empty) {
      querySnapshot.docs.forEach((documentSnapshot) => {
        if (documentSnapshot.exists) {
          collectionData.push(documentSnapshot);
        }
      });
    }
  } catch (error) {
    console.log("error", error);
  }

  return collectionData;
};

const updateUserData = async (newUsersInfo, oldUsersInfo) => {
  const collectionRef = getCollectionRef(collectionNames.usersData);
  const handledOldUsers = {}

  const result = await Promise.allSettled(
    newUsersInfo.map(async (newInfo) => {
      const oldData = oldUsersInfo.find(
        (oldData) => oldData.data().name === newInfo.name
      );

      if (oldData) {
        await oldData.ref.update(newInfo);
        handledOldUsers[newInfo.name] = true;
      } else {
        await collectionRef.add(newInfo);
      }
    })
  );

  if (Object.keys(handledOldUsers).length !== oldUsersInfo) {
    await Promise.allSettled(
      oldUsersInfo
      .filter(oldData => !handledOldUsers[oldData.data().name])
      .map((oldData) => oldData.ref.update({isStale: true}))
      )
  }

  return result
};

module.exports = {
  getCollectionData,
  getUsersTokens,
  updateUserData,
};
