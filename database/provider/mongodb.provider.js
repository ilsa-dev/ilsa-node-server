const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';
const dbName = 'outlet-project';
const collectionName = process.env.NODE_ENV === 'development' ? 'dev-documents' : 'documents';

let _collection = null;

_getCollection = () => {
    return new Promise((resolve, reject) => {
        if(!_collection){
            MongoClient.connect(url, function(err, client) {
                _collection = client.db(dbName).collection(collectionName);
                resolve(_collection);
            });
        } else{
            resolve (_collection);
        }
    });
};

insertDocuments = async (documents) => {

    var collection = await _getCollection();

    documents.forEach( doc => {
        doc._systemHeader.serverCreatedDate = Date.now();
        doc._systemHeader.serverUpdatedDate = Date.now();
    });

    return new Promise(function(resolve, reject){

        collection.insertMany(documents, function(err, result) {
            if(err){
                return reject(err);
            }
            // assert.equal(docs.length, result.result.n);
            // assert.equal(docs.length, result.ops.length);
            resolve(result);
        });

    });
};

updateDocument = async (filter, updates, upsert, multi, password) => {

    updates = JSON.parse(JSON.stringify(updates)); //clone updates so it won't affect the original

    standardizeQuery(filter);

    // do not update _systemHeader if not upsert
    if (!upsert && updates._systemHeader) {
        delete updates._systemHeader;
    }

    if(updates._){
        delete updates._; // remove the util info that might have been returned from a query. See api.js for more info.
    }

    if(!password && updates.password){ // always remove password editing if it isn't a password edit
        delete updates.password; // remove attempts to update password improperly
    }

    var collection = await _getCollection();

    //updates['_systemHeader.serverUpdatedDate'] = Date.now();

    return new Promise(function(resolve, reject){

        const options = {};

        if(upsert){
            options.upsert = upsert;
        }

        if(multi){
            options.multi = multi;
        }

        collection.update(filter, { $set : updates}, options, function(err, result) {
            if(err){
                return reject(err);
            }
            resolve(result);
        });

    });

};

removeDocument = async (documentId) => {
    
    var collection = await _getCollection();

    return new Promise(function(resolve, reject){

        const options = {};

        collection.update({'_systemHeader.documentId' : documentId}, { $set : {'_systemHeader.deleted' : true}}, options, function(err, result) {
            if(err){
                return reject(err);
            }
            resolve(result);
        });

    });

};

findDocuments = async (query, sort) => {

    standardizeQuery(query);

    var collection = await _getCollection();

    return new Promise(function (resolve, reject) {
        let cursor = collection.find(query, {'_id' : false});
        if(sort){
            cursor = cursor.sort(sort);
        }
        cursor.toArray(function(err, docs) {
            if(err){
                reject(err);
            }else {

                for (const doc of docs) {
                    delete doc._id;
                }

                resolve(docs);
            }
        });
    })

};

countDocuments = async (query) => {

    standardizeQuery(query);

    const collection = await _getCollection();

    return collection.find(query, {'_id' : false}).count();

};

function standardizeQuery (query) {
    query['_systemHeader.deleted'] = { $ne : true };
    query['_systemHeader.currentVersion'] = true;
}

module.exports = { insertDocuments, updateDocument, findDocuments, countDocuments, removeDocument };