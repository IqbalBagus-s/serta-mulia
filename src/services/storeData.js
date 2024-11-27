const { Firestore } = require('@google-cloud/firestore');
 
async function storeData(id, data) {
  const db = new Firestore({
    projectId: 'eastern-period-442803-d2', // pastikan project ID benar
    keyFilename: '/mnt/d/Downloads/eastern-period-442803-d2-9eade08bc3cd.json'    // path ke file kredensial
  });
 
  const predictCollection = db.collection('prediction');
  return predictCollection.doc(id).set(data);
}
 
module.exports = storeData;