const { Account, Avatars, Client, Databases, ID, Query, Storage, Functions } = require('node-appwrite');

const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.ijk.bookify',
    projectId: '66c8bc06002caf87f1a2',
    databaseId: '66c8bd92002b04344a22',
    publisherCollectionId: '66c8be6a00260d3b457c',
    booksCollectionId: '66c8be9a00098329f046',
    readerCollectionId: '66cf1e9e000fb1575f61',
    storageId: '66c8c1f9001a7ba4fe7c'
}

const {
    endpoint,
    platform,
    projectId,
    databaseId,
    publisherCollectionId,
    booksCollectionId,
    readerCollectionId,
    storageId,
} = config;

// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(config.endpoint) // Your Appwrite Endpoint
    .setProject(config.projectId) // Your project ID
    .setKey('standard_307369e091cdeb09b7a3317c22c6f96a52efa21460d91d84ee8567bf456ffa0f59ac1e70427913fd35a95091d6e808dd08cd112317cf8175cc7f7dd41c8f9d65531f12e8a2bba1c6422cceb984a91d4e9e66be5ad563df79dd70da6a13e7ac7f5000c4004fb2a6d70fab41856061496d41432207e421c20e9cecaa92463d39b8') // Server-side API key

    const account = new Account(client);
    const avatars = new Avatars(client);
    const databases = new Databases(client);
    const storage = new Storage(client);

    const functions = new Functions(client);


/**
 * Fetch subscription status using readerId
 * @param {string} readerId - The ID of the reader entity
 * @returns {boolean|null} - Returns true or false for subscription status, or null if not found
 */

const getCurrentUserR = async () => {
    try {
        const currentAccount = await account.get();
        //console.log("Current Account:", currentAccount);

        const currentUser = await databases.listDocuments(
            config.databaseId,
            config.readerCollectionId,
            [Query.equal('readerId', currentAccount.$id)]
        );

        if(!currentUser) throw Error;
        console.log("subsciprtion status:", currentUser.documents[0]?.subscriptionStatus);
        return currentUser.documents[0];
    } catch (error) {
        //console.error("Error fetching reader document:", error.message);
        throw error;
    }
};

const fetchSubscriptionStatus = async (readerId) => {
    try {
        const response = await databases.listDocuments(
            '66c8bd92002b04344a22',
            '66cf1e9e000fb1575f61',
            [Query.equal('readerId', readerId)]
        );

        // If no document is found, assume the user is not subscribed
        if (response.documents.length > 0) {
            // If the document is found, return the subscription status
            return response.documents[0].subscriptionStatus;
          } else {
            return null; // No document found for the readerId
          }
    } catch (error) {
        console.error("Error fetching subscription status:", error.message);
        return false; // Return false if there is an error
    }
};

module.exports = { config, client, functions, fetchSubscriptionStatus, getCurrentUserR };