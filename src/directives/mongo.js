const MongoClient = require("mongodb").MongoClient;
const mongoConfig = require("./../../config/mongo_config.json");

class MongroDriver {
  constructor() {
    this.client = null;
    this.env = mongoConfig.environment;
    this.url = mongoConfig[this.env].uri;
    this.dbName = mongoConfig[this.env].db;
    this.indexing = mongoConfig.indexing;
    this.recordsLimit = 100;
    this.dbInit();
  }
  dbInit() {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          let client = new MongoClient(this.url, {});
          await client.connect().catch((e) => {
            console.error("connect error", e);
          });
          this.client = client;
          resolve(client);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }
  createDB() {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          let newDB = this.client.db(this.dbName);
          this.collections.forEach(async (name, i) => {
            let newColl = await newDB.createCollection(name)
            if (newColl !== undefined) await this.createIndexing(newColl, name)
            if (this.collections.length - 1 == i) resolve(true);
          });
        } catch (error) {
          reject(error);
        }
      })()
    });
  }
  checkDBExits() {
    return new Promise((res, rej) => {
      (async () => {
        let databasesList = await this.client
          .db()
          .admin()
          .listDatabases({ nameOnly: true })
          .catch((error) => {
            console.log("checkDBExits", error);
          });
        let found = 0;
        databasesList.databases.forEach((db) => {
          if (this.dbName == db.name) found = 1;
        });
        res(found);

      })()
    });
  }
  createIndexing(collection, collectionName) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          Object.keys(this.indexing[collectionName]).forEach(async (key) => {
            await collection.createIndex(key)
          })

          resolve(true);
        } catch (error) {
          reject(error);
        }
      })()
    });
  }
  isConnected() {
    try {
      return (
        !!this.client &&
        !!this.client.topology &&
        this.client.topology.isConnected()
      );
    } catch (error) {
      return false;
    }
  }

  insert(data = {}, collectionName = "", options = {}) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          if (!this.isConnected()) await this.dbInit();
          const db = this.client.db(this.dbName);
          const collection = db.collection(collectionName);
          let result = await collection.insertOne(data);
          resolve(result?.insertedId + "");
        } catch (error) {
          console.log(" insert query ", error);
          reject(error);
        }
      })()
    });
  }

  insertMany(data = {}, collectionName = "", options = {}) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          if (!this.isConnected()) await this.dbInit();
          const db = this.client.db(this.dbName);
          const collection = db.collection(collectionName);
          collection.insertMany(data, { ordered: false }, (err, result) => {
            if (err) reject(err);
            resolve(result?.result.ok);
          });
        } catch (error) {
          reject(error);
        }
      })()
    });
  }
  updateMany(query = {}, data = {}, collectionName = "", options = {}) {

    return new Promise((resolve, reject) => {
      (async () => {
        try {
          if (!this.isConnected()) await this.dbInit();
          const db = this.client.db(this.dbName);
          const collection = db.collection(collectionName);

          collection.updateMany(
            query,
            { $set: data },
            { upsert: true },
            (err, result) => {
              if (err) reject(err);
              resolve(result?.["result"]["ok"]);
            }
          );
        } catch (error) {
          console.log("update Error", error);
          reject(error);
        }
      })()
    });
  }
  update(query = {}, data = {}, collectionName = "", options = {}) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          if (!this.isConnected()) await this.dbInit();
          const db = this.client.db(this.dbName);
          const collection = db.collection(collectionName);

          let result = await collection.updateOne(query, { $set: data }, { upsert: true });
          resolve(result);
        } catch (error) {
          console.log("update Error", error);
          reject(error);
        }
      })()
    });
  }
  regExp(str) {
    return new RegExp(str, "i");
  }
  findOne(query, collectionName, extra = {}) {
    return new Promise((resolve, reject) => {
      (async () => {
        let options = {};
        if (extra.projection) {
          options.projection = extra.projection;
        } else {
          options.projection = null;
        }
        const db = await this.client.db(this.dbName);
        const collection = db.collection(collectionName);
        let findOne = await collection.findOne(query, options);
        resolve(findOne || {});
      })()
    });
  }
  find(query, collectionName, options = {}) {
    return new Promise((resolve, reject) => {
      (async () => {
        if (!this.isConnected()) await this.dbInit();
        const db = this.client.db(this.dbName);
        const collection = db.collection(collectionName);
        let projection = (typeof options['projection'] === 'object') ? options['projection'] : {};
        let sort = (typeof options['sort'] === 'object') ? options['sort'] : {};
        let limit = (typeof options['limit'] === 'number') ? options['limit'] : this.recordsLimit;
        let skip = (typeof options['skip'] === 'number') ? options['skip'] : 0;
        let findData = await collection.find(query, { projection, limit, skip, sort }).toArray();
        resolve(findData);
      })()
    });
  }

  count(searchQuery, collectionName) {
    return new Promise((resolve, reject) => {
      (async () => {
        if (!this.isConnected()) await this.dbInit();
        const db = this.client.db(this.dbName);
        const collection = db.collection(collectionName);
        collection.countDocuments(searchQuery).then((count) => {
          resolve(count);
        });
      })()
    });
  }
  findAll(searchQuery, collectionName, options = {}) {

    return this.count(searchQuery, collectionName).then(res => {
      return this.findAllData(searchQuery, collectionName, options, res);
    })

  }
  sleep(ms) {
    return new Promise((resolve) => { setTimeout(() => { resolve(true) }, ms); })
  }
  async findAllSubscribe(searchQuery, collectionName, options, CB, sleepSec = 2000) {

    try {

      let projection = (typeof options['projection'] === 'object') ? options['projection'] : {};
      let sort = (typeof options['sort'] === 'object') ? options['sort'] : {};
      let getTotalCount = await this.count(searchQuery, collectionName);
      const limit = 100;
      let maxpage = getTotalCount / limit;
      let skip = 0;
      maxpage = (Math.ceil(maxpage));
      CB({
        type: 'start',
        for: collectionName,
        data: [],
      })
      for (let j = 0; j < maxpage; j++) {
        skip = j * limit;
        const records = await this.find(searchQuery, collectionName, { projection, limit, skip, sort })

        CB({
          type: 'data',
          for: collectionName,
          data: records
        });

        await this.sleep(sleepSec || 2000);

        if (records.length == 0) {
          CB({
            type: 'end',
            for: collectionName,
            data: [],
          })
        }
      }
    } catch (error) {
      console.log('Error ---- ', error)
    }

  }

  findAllData(searchQuery, collectionName, options, count) {
    return new Promise((resolve, reject) => {
      (async () => {
        if (count == 0) resolve([]);
        if (!this.isConnected()) await this.dbInit();
        const db = this.client.db(this.dbName);
        const collection = db.collection(collectionName);
        let projection = (typeof options['projection'] === 'object') ? options['projection'] : {};
        let sort = (typeof options['sort'] === 'object') ? options['sort'] : {};
        let getTotalCount = count;
        const limit = 100;
        let maxpage = getTotalCount / limit;
        let docsResponse = [];
        let skip = 0;
        maxpage = (Math.ceil(maxpage));
        for (let j = 1; j <= maxpage; j++) {
          if (j > 1) {
            skip = (parseInt(j) * parseInt(limit)) - parseInt(limit);
          } else {
            skip = 0;
          }
          let response = collection.find(searchQuery, { projection, limit, skip, sort });
          let toArr = await response.toArray()
          docsResponse.push(toArr);

        }
        resolve(docsResponse);
      })()
    });

  }

  delete(searchQuery, collectionName) {
    return new Promise((resolve, reject) => {
      (async () => {
        if (!this.isConnected()) await this.dbInit();
        const db = this.client.db(this.dbName);
        const collection = db.collection(collectionName);

        collection.deleteMany(
          searchQuery,
          (err, result) => {
            if (err) reject(err);
            resolve(true);
          }
        );

      })()
    });
  }

  processArregateData(aggCursor) {
    return new Promise((resolve, reject) => {
      (async () => {
        let processedData = [];
        await aggCursor.forEach(res => {
          processedData.push(res);

        });
        resolve(processedData);
      })()
    });
  }

  aggregate(pipeLine = [], collectionName = '') {
    return new Promise((resolve, reject) => {
      (async () => {
        if (!this.isConnected()) await this.dbInit();
        const db = this.client.db(this.dbName);
        const collection = db.collection(collectionName);
        const aggCursor = collection.aggregate(pipeLine);
        let pdata = await this.processArregateData(aggCursor);
        resolve(pdata);
      })()
    });
  }

  createIndex(index = {}, collectionName = "", options = {}) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          if (!this.isConnected()) await this.dbInit();
          const db = this.client.db(this.dbName);
          const collection = db.collection(collectionName);

          collection.createIndex(index, options).then((indexes) => {
            resolve(indexes);
          });
        } catch (error) {
          reject(error);
        }
      })()
    });
  }

  getIndex(collectionName, options = {}) {
    return new Promise((resolve, reject) => {
      (async () => {
        if (!this.isConnected()) await this.dbInit();
        const db = this.client.db(this.dbName);

        db.collection("students")
          .getIndexes()
          .then((indexes) => {
          });
      })()
    });
  }
  async randomID(collectionName = "", field = "uniqueId", length = 6) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const generateId = () => {
      let result = '';
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };

    try {
      if (!this.isConnected()) await this.dbInit();
      const db = this.client.db(this.dbName);
      const collection = db.collection(collectionName);

      let newId;
      let exists = true;

      while (exists) {
        newId = generateId();
        exists = await collection.findOne({ [field]: newId });
      }

      return newId;
    } catch (error) {
      console.error("randomID error:", error);
      throw error;
    }
  }
  async generateOrderID(collectionName = "", field = "uniqueId", prefix = "SAK") {
    try {
      if (!this.isConnected()) await this.dbInit();
      const db = this.client.db(this.dbName);
      const collection = db.collection(collectionName);

      const latestDoc = await collection
        .find({ [field]: { $regex: `^${prefix}-\\d+$` } })
        .sort({ 'createdAt': -1 })
        .limit(1)
        .toArray();

      let nextNumber = 1;

      if (latestDoc.length > 0) {
        const latestId = latestDoc[0][field];
        const parts = latestId.split("-");
        const number = parseInt(parts[1], 10);
        nextNumber = number + 1;
      }

      return `${prefix}-${nextNumber}`;
    } catch (error) {
      console.error("randomID error:", error);
      throw error;
    }
  }

};
module.exports = MongroDriver;
