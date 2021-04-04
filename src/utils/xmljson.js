// xmlTool.js
const xml2js = require('xml2js');

export const xml2json = str => {
  return new Promise((resolve, reject) => {
    const parseString = xml2js.parseString;
    parseString(str, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

export const json2xml = obj => {
  const builder = new xml2js.Builder();
  return builder.buildObject(obj);
};
