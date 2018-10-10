const Buffer = require("safe-buffer").Buffer;
const Keygrip = require("keygrip");
const keys = require("../../config/keys");

module.exports = User => {
  const sessionObj = {
    passport: {
      user: User._id.toString()
    }
  };

  const sessionString = Buffer.from(JSON.stringify(sessionObj)).toString(
    "base64"
  );

  const keygrip = new Keygrip([keys.cookieKey]);
  const sig = keygrip.sign("session=" + sessionString);

  return {
    session: sessionString,
    sig
  };
};
