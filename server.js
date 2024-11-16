const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const consumerKey = 'N9cFAJYC2UPzNhfMSS5eF5xUnFEPD0fQb3YmsJ22DbtsDkno';
const consumerSecret = '5DNcjA2rDWAyDsZ0y5jduzmau38IG6IPBGpvY8Krab3wOTFNKrF7FouUM7B6Qz15';
const shortcode = '174379'; 
const passkey = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';
const callbackUrl = 'https://9635-102-217-172-58.ngrok-free.app/mpesa-callback';  
//chttps://d529-102-217-172-58.ngrok-free.app/mpesa-callback
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

// Initiate STK Push
app.post('/initiate-payment', async (req, res) => {
  const { phoneNumber, plan, planPrice } = req.body;
  const token = await generateAccessToken();
  const generateTimestamp = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
  
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  };
  const timestamp = generateTimestamp();
  console.log(timestamp); // e.g., "20241028150616"
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
    // Log the response from Safaricom
    console.log('STK Push Response:', data); 

    res.status(200).json({ message: 'Payment initiated', data });
  } catch (error) {
    console.error('Error initiating payment:', error.response.data); // Log detailed error
    res.status(500).json({ message: 'Failed to initiate payment', error: error.response.data });
  }
});

// Callback URL to handle M-Pesa response
app.post('/mpesa-callback', (req, res) => {
  console.log('Callback URL was called!');
  console.log('Request Headers:', JSON.stringify(req.headers, null, 2));
  //console.log('Request Body:', JSON.stringify(req.body, null, 2));
  console.log('Raw M-Pesa Callback Request:', JSON.stringify(req.body, null, 2));

  const { Body } = req.body;
  if (Body?.stkCallback?.ResultCode === 0) {
    console.log(`Payment Successful!`);
    const details = Body.stkCallback.CallbackMetadata.Item;
    const amount = details.find(item => item.Name === 'Amount')?.Value;
    const receipt = details.find(item => item.Name === 'MpesaReceiptNumber')?.Value;
    console.log(`Amount: KES ${amount}, Receipt: ${receipt}`);
  } else {
    console.log(`Payment Failed with ResultCode: ${Body?.stkCallback?.ResultCode}`);
  }

  res.status(200).json({ message: 'Callback received successfully' });
});




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
