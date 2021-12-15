
const serializeUsersData = async (data) => {
  return data.map((userData) => ({
    name: userData.resourceName,
    emails: userData.emailAddresses?.map((email) => email.value),
  }));
};



module.exports = {
  serializeUsersData,
};
