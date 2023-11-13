import { Client, Account, Databases, Storage, Query, ID } from "appwrite";

const APPWRITE_ENDPOINT = "https://cloud.appwrite.io/v1";
const APPWRITE_PROJECT_ID = "651d3c69a64ff45996fa";
const APPWRITE_DATABASE_ID = "651d3c7c4f33d867a2a0";
const APPWRITE_COLLECTION_ID = "65518ad68b8491b76792";

const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID); // Replace with your project ID

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

export {
  client,
  account,
  databases,
  storage,
  ID,
  Query,
  APPWRITE_DATABASE_ID,
  APPWRITE_COLLECTION_ID,
};
