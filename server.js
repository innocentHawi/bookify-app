const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const crypto = require('crypto');

const { Databases, Client, Query } = require('node-appwrite');
const client = new Client();
const databases = new Databases(client);
client
  .setEndpoint('https://cloud.appwrite.io/v1') // Replace with your Appwrite endpoint
  .setProject('66c8bc06002caf87f1a2') // Replace with your project ID
  .setKey('standard_307369e091cdeb09b7a3317c22c6f96a52efa21460d91d84ee8567bf456ffa0f59ac1e70427913fd35a95091d6e808dd08cd112317cf8175cc7f7dd41c8f9d65531f12e8a2bba1c6422cceb984a91d4e9e66be5ad563df79dd70da6a13e7ac7f5000c4004fb2a6d70fab41856061496d41432207e421c20e9cecaa92463d39b8'); // Replace with a server-side API key

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// M-Pesa credentials
const consumerKey = 'N9cFAJYC2UPzNhfMSS5eF5xUnFEPD0fQb3YmsJ22DbtsDkno';
const consumerSecret = '5DNcjA2rDWAyDsZ0y5jduzmau38IG6IPBGpvY8Krab3wOTFNKrF7FouUM7B6Qz15';
const shortcode = '174379';
const passkey = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';
const callbackUrl = 'https://39a6-102-217-172-58.ngrok-free.app/mpesa-callback';

// Generate M-Pesa Access Token
const generateAccessToken = async () => {
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
  try {
    const { data } = await axios.get(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      { headers: { Authorization: `Basic ${auth}` } }
    );
    return data.access_token;
  } catch (error) {
    console.error('Error generating access token:', error);
    throw error;
  }
};

// Generate timestamp for M-Pesa API
const generateTimestamp = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
};

// Function to check payment status
const checkPaymentStatus = async (checkoutRequestID, readerId, currentStatus) => {
  const token = await generateAccessToken();
  const timestamp = generateTimestamp();
  const password = Buffer.from(shortcode + passkey + timestamp).toString('base64');

  const payload = {
    BusinessShortCode: shortcode,
    Password: password,
    Timestamp: timestamp,
    CheckoutRequestID: checkoutRequestID,
  };

  try {
    const { data } = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query',
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log('Payment Status Response:', data);

    // Check if payment was successful and current status is false
    if (data.ResultCode === '0' && !currentStatus) {
      console.log('Payment was successful.');
      console.log('Reader ID:', readerId);

      try {
        // Step 1: Fetch the document using readerId
        const response = await databases.listDocuments(
          '66c8bd92002b04344a22', // Database ID
          '66cf1e9e000fb1575f61', // Collection ID
          [Query.equal('readerId', readerId)]
        );

        const document = response.documents[0]; // Get the first matching document
        if (!document) {
          console.error('Document not found for the given readerId.');
          return;
        }

        const documentId = document.$id; // Extract the document ID
        console.log(`Found document ID: ${documentId}`);

        // Step 2: Update the subscription status using the document ID
        await databases.updateDocument(
          '66c8bd92002b04344a22', // Database ID
          '66cf1e9e000fb1575f61', // Collection ID
          documentId, // Use the fetched document ID
          { subscriptionStatus: true }
        );

        console.log('Subscription status updated successfully in Appwrite.');
      } catch (fetchError) {
        console.error('Error fetching document or updating subscription status:', fetchError.message);
      }
    } else {
      console.log(`Payment failed with ResultCode: ${data.ResultCode}, Message: ${data.ResultDesc}`);
    }
  } catch (error) {
    console.error('Error checking payment status:', error.response?.data || error.message);
  }
};


// Initiate STK Push
app.post('/initiate-payment', async (req, res) => {
  const { phoneNumber, plan, planPrice, readerId, subscriptionStatus   } = req.body;
  console.log('Reader ID received in backend:', readerId);
  console.log('Current Subscription Status:', subscriptionStatus);

  const token = await generateAccessToken();
  const timestamp = generateTimestamp();
  const password = Buffer.from(shortcode + passkey + timestamp).toString('base64');

  const payload = {
    BusinessShortCode: shortcode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: planPrice,
    PartyA: phoneNumber,
    PartyB: shortcode,
    PhoneNumber: phoneNumber,
    CallBackURL: callbackUrl,
    AccountReference: 'Bookify Subscription',
    TransactionDesc: `Subscription for ${plan}`,
  };

  try {
    const { data } = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log('STK Push Response:', data);
    const checkoutRequestID = data.CheckoutRequestID;

    // Poll for status after 10 seconds (adjust the time as needed)
    setTimeout(() => checkPaymentStatus(checkoutRequestID, readerId, subscriptionStatus), 30000);

    res.status(200).json({ message: 'Payment initiated', data });
  } catch (error) {
    console.error('Error initiating payment:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to initiate payment', error: error.response?.data });
  }
});

// Callback URL to handle M-Pesa response
app.post('/mpesa-callback', (req, res) => {
  console.log('Callback URL was called!');
  console.log('Headers:', req.headers);
  console.log('Body:', JSON.stringify(req.body, null, 2));

  const { Body } = req.body;
  if (Body?.stkCallback?.ResultCode === 0) {
    console.log('Payment Successful!');
    const details = Body.stkCallback.CallbackMetadata.Item;
    const amount = details.find(item => item.Name === 'Amount')?.Value;
    const receipt = details.find(item => item.Name === 'MpesaReceiptNumber')?.Value;
    console.log(`Amount: KES ${amount}, Receipt: ${receipt}`);
  } else {
    console.log(`Payment Failed with ResultCode: ${Body?.stkCallback?.ResultCode}`);
  }

  res.status(200).json({ message: 'Callback received successfully' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
