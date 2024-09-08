import { Account, Avatars, Client, Databases, ID, Query } from 'react-native-appwrite';

export const config = {
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
    .setPlatform(config.platform) // Your application ID or bundle ID.

    const account = new Account(client);
    const avatars = new Avatars(client);
    const databases = new Databases(client);

export const createUser = async (email, password, username) => {
   try {
    const newAccount = await account.create(
        ID.unique(),
        email,
        password,
        username
    )

    if(!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username)

    await signIn2(email, password);

    const newUser = await databases.createDocument(
        config.databaseId,
        config.publisherCollectionId,
        ID.unique(),
        {
            publisherId: newAccount.$id,
            email,
            username,
            avatar: avatarUrl
        }
    )

    return newUser;
   } catch (error) {
    console.log(error);
    throw new Error(error);
   }
}

export const createUserReader = async (email, password, username) => {
    try {
     const newAccount = await account.create(
         ID.unique(),
         email,
         password,
         username
     )
 
     if(!newAccount) throw Error;
 
     const avatarUrl = avatars.getInitials(username)
 
     await signIn(email, password);
 
     const newUser = await databases.createDocument(
         config.databaseId,
         config.readerCollectionId,
         ID.unique(),
         {
             readerId: newAccount.$id,
             email,
             username,
             avatar: avatarUrl
         }
     )
 
     return newUser;
    } catch (error) {
     console.log(error);
     throw new Error(error);
    }
 }

export const signIn = async (email, password) => {
    try {
        // Delete all existing sessions for the current user
        await account.deleteSessions();

        const session = await account.createEmailPasswordSession(email, password);

        return session;
    } catch (error) {
        throw new Error(error);
    }
}

export const signIn2 = async (email, password) => {
    try {
        // Delete all existing sessions for the current user
        //await account.deleteSessions();

        const session = await account.createEmailPasswordSession(email, password);

        return session;
    } catch (error) {
        throw new Error(error);
    }
}

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();

        if(!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            config.databaseId,
            config.publisherCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )

        if(!currentUser) throw Error;

        return currentUser.documents[0];
    } catch (error) {
        console.log(error);
    }
}

export const getAllBooks = async () => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            booksCollectionId
        )

        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}

export const getLatestBooks = async () => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            booksCollectionId,
            [Query.orderDesc('$createdAt'), Query.limit(7)]
        )

        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}

export const searchBooks = async (query) => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            booksCollectionId,
            [Query.search('title', query)]
        )

        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}