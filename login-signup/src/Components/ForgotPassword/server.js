const express = require('express');
const nodemailer = require('nodemailer');
const crypto = require('crypto'); // For generating tokens
const User = require('./models/User'); // Path to your User model

const app = express();
app.use(express.json());

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'hdm.support@gmail.com',
    pass: 'yourpassword' // You should use environment variables or OAuth2 for security
  }
});

app.post('/api/users/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ where: { email } });

  if (!user) {
    return res.status(404).send({ message: 'User not found.' });
  }

  const token = crypto.randomBytes(20).toString('hex');
  const expires = Date.now() + 3600000; // 1 hour

  // Update user with reset token and expiration
  await User.update({ resetPasswordToken: token, resetPasswordExpires: expires }, { where: { email } });

  // Send email
  const mailOptions = {
    from: 'hdm.support@gmail.com',
    to: email,
    subject: 'Password Reset Request',
    text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
          `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
          `http://localhost:3000/reset-password/${token}\n\n` + // Adjust URL as needed
          `If you did not request this, please ignore this email and your password will remain unchanged.\n`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).send({ message: 'Error sending email' });
    } else {
      console.log('Email sent: ' + info.response);
      return res.send({ message: 'Email sent successfully' });
    }
  });
});

// Other routes and middleware...

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
