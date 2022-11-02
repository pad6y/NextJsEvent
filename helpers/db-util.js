import { MongoClient } from 'mongodb';

export async function connectDatabase() {
  const client = await MongoClient.connect(process.env.mongodbURL);
  return client;
}

export async function insertDocument(client, collection, document) {
  const db = client.db();
  const result = await db.collection(collection).insertOne(document);

  return result;
}

export async function getFilteredEvents(client, collection, filter, sort) {
  const db = client.db();
  const foundComments = await db
    .collection(collection)
    .find()
    .filter(filter)
    .sort(sort)
    .toArray();

  return foundComments;
}
