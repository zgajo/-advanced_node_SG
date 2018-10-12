const AWS = require("aws-sdk");
const uuid = require("uuid/v1");
const keys = require("../config/keys");
const requireLogin = require("../middlewares/requireLogin");

const s3 = new AWS.S3({
  accessKeyId: keys.accessKeyId,
  secretAccessKey: keys.secretAccessKey,
  region: "eu-central-1",
  signatureVersion: "v4"
});

module.exports = app => {
  app.get("/api/upload/", requireLogin, async (req, res) => {
    const key = `${req.user.id}/${uuid()}.jpeg`;

    s3.getSignedUrl(
      "putObject",
      {
        Bucket: "my-blog-bucket-darko",
        ContentType: "image/jpeg",
        Key: key
      },
      function(err, url) {
        console.log("The URL is", url);
        res.send({ key, url });
      }
    );
  });
};
