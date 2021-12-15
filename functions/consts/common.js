const collectionNames = {
  usersTokens: "usersTokens",
  usersData: "usersData",
};

const defaultScope = [
  "https://www.googleapis.com/auth/plus.me",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

const googleConfig = {
  clientId: process.env.clientId,
  clientSecret: process.env.clientSecret,
  redirect: process.env.redirect,
};

module.exports = {
  collectionNames,
  defaultScope,
  googleConfig
};
