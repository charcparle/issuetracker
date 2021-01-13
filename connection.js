require('dotenv').config();
const { MongoClient } = require('mongodb');

async function main(callback) {
    const URI = process.env.DB; // Declare MONGO_URI in your .env file
    const client = new MongoClient(URI, { useNewUrlParser: true, useUnifiedTopology: true});
    console.log("this is inside connection.js-main");
    try {
        // Connect to the MongoDB cluster
        await client.connect();
        console.log('Connection to the Atlas Cluster is successful!');
        // Make the appropriate DB calls
        await callback(client);

    } catch (e) {
        // Catch any errors
        console.error(e);
        throw new Error('Unable to Connect to Database')
    }
}

module.exports = main;