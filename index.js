const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
require('dotenv').config();

app.use(cors());
// Body parser middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// POST route to handle form submission
app.post('/send-mail', async (req, res) => {
    let { firstName, lastName, email, phoneNumber, message } = req.body;
  
    // Create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL, 
        pass: process.env.PASSWORD
      }
    });

  // Setup email data
  let mailOptions = {
    from: `${email}`,
    to:  process.env.EMAIL,
    subject: 'New Contact Form Submission', // Subject line
    text: `You have a new contact form submission from:
    First Name: ${firstName}
    Last Name: ${lastName}
    Email: ${email}
    Phone Number: ${phoneNumber}
    Message: ${message}`, // Plain text body
    html: `<b>You have a new contact form submission from:</b>
    <br>First Name: ${firstName}
    <br>Last Name: ${lastName}
    <br>Email: ${email}
    <br>Phone Number: ${phoneNumber}
    <br>Message: ${message}` // HTML body
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    res.send('Email sent successfully');
  } catch (error) {
    console.log(error);
    res.send('Failed to send email');
  }
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
