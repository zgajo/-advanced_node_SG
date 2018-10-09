const mongoose = require("mongoose");
const redis = require("redis");
const redisUrl = "redis://127.0.0.1:6379";
const client = redis.createClient(redisUrl);
const util = require("util");

client.hget = util.promisify(client.hget);
const exec = mongoose.Query.prototype.exec;

// Using cache function to say on which queries to run cache
mongoose.Query.prototype.cache = async function(options = {}) {
  this.useCache = true;

  this.hashKey = JSON.stringify(options.key || "");

  return this;
};

mongoose.Query.prototype.exec = async function() {
  if (!this.useCache) {
    return exec.apply(this, arguments);
  }

  // Podaci o  queryu koji se trenutno izvršava
  // this.getQuery()
  // Podatak o modelu/collectionu nad kojim se query trenutno izvršava
  // this.mongooseCollection.name

  const key = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collection: this.mongooseCollection.name
    })
  );

  const cachedValue = await client.hget(this.hashKey, key);

  if (cachedValue) {
    console.log("FROM REDIS", cachedValue);

    const doc = JSON.parse(cachedValue);

    // Mongoose expects to receive back mongoose model
    return Array.isArray(doc)
      ? doc.map(d => new this.model(d))
      : new this.model(doc);
  }

  const result = await exec.apply(this, arguments);

  client.hset(this.hashKey, key, JSON.stringify(result), "EX", 10);

  return result;
};

module.exports = {
  clearHash(hashKey) {
    client.del(JSON.stringify(hashKey));
  }
};
