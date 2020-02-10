const fs = require('fs');

const nanoid = require('nanoid');

const readFile = (fileName) => {
    return new Promise(((resolve, reject) => {
        fs.readFile(fileName, 'UTF-8', (err, data) => {
            if (err) {
                reject(err);
            } else resolve(data);
        })
    }))
};

const writeFile = (path, data) => {
  return new Promise(((resolve, reject) => {
      fs.writeFile(path, data, (err => {
          if(err) {
              reject(err);
          } else resolve();
      }));
  }));
};

let data = [];

module.exports = {

    async init() {
        try {
            const fileData = await readFile('./db.json');
            data = JSON.parse(fileData+'');
        } catch (e) { data = [] }
    },

    async addNewMessage(messageData) {
        messageData.id = nanoid();
        messageData.datetime = new Date().toISOString();
        data.unshift(messageData);

        this.save();
    },

    async save() {
        if(data.length > 30) data.splice(-1, 1);

        const content = JSON.stringify(data, null, 2);
        await writeFile('./db.json', content);
    },

    getLastMessages(dateTime) {
        const index = data.findIndex(item => item.datetime === dateTime);
        return data.slice(0, index);
    },

    getMessages() {
     return data;
    }

};