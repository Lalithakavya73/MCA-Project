require('dotenv').config(); 
const express = require('express'); 
const cors = require('cors'); 
const mongoose = require('mongoose'); 
const bodyParser = require('body-parser'); 
const twilio = require('twilio'); 
const app = express(); 
app.use(cors()); 
app.use(bodyParser.json()); 
 
//      MongoDB Connection 
mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
}).then(() => console.log("     MongoDB Connected")) 
  .catch(err => console.error("    MongoDB Error:", err)); 
 
//      User Schema 
const userSchema = new mongoose.Schema({ 
  email: String, 
  password: String, 
  phone: String, 
  role: { 
    type: String, 
    default: 'user' // 'user' or 'owner' 
  } 
}); 
const User = mongoose.model("User", userSchema); 
 
//      Twilio Setup 
const accountSid = process.env.TWILIO_ACCOUNT_SID; 
const authToken = process.env.TWILIO_AUTH_TOKEN; 
const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID; 
const client = twilio(accountSid, authToken); 
 
//      Send OTP 
app.post('/send-otp', async (req, res) => { 
  const { phone } = req.body; 
  try { 
    const verification = await client.verify.v2 
      .services(serviceSid) 
      .verifications 
      .create({ to: phone, channel: 'sms' }); 
 
    console.log('     OTP Sent:', verification.sid); 
    res.json({ success: true }); 
  } catch (error) { 
    console.error('    OTP Send Error:', error.message); 
    res.json({ success: false, error: error.message }); 
  } 
}); 
 
//      Verify OTP & Register User 
app.post('/verify-otp', async (req, res) => { 
  const { phone, otp, email, password } = req.body; 
 
  try { 
    const verificationCheck = await client.verify.v2 
      .services(serviceSid) 
      .verificationChecks 
      .create({ to: phone, code: otp }); 
 
    if (verificationCheck.status === 'approved') { 
      let user = await User.findOne({ phone }); 
 
      const role = email === "owner@admin.com" ? "owner" : "user"; 
 
      if (!user) { 
        user = new User({ email, password, phone, role }); 
      } else { 
        user.email = email; 
        user.password = password; 
        user.role = role; 
      } 
 
      await user.save(); 
      console.log("     User Registered or Updated:", email); 
 
      res.json({ success: true }); 
    } else { 
      res.json({ success: false, error: "Invalid OTP" }); 
    } 
  } catch (error) { 
    console.error('    OTP Verify Error:', error.message); 
    res.json({ success: false, error: error.message }); 
  } 
}); 
 
//      Login 
app.post('/login', async (req, res) => { 
  const { username, password } = req.body; 
  try { 
    const user = await User.findOne({ 
      $or: [{ email: username }, { phone: username }], 
      password 
    }); 
 
    if (user) { 
      res.json({ success: true, role: user.role }); 
    } else { 
      res.json({ success: false, error: "Invalid credentials" }); 
    } 
  } catch (error) { 
    console.error('    Login Error:', error.message); 
    res.json({ success: false, error: "Server error" }); 
  } 
}); 
 
//      Start Server 
app.listen(3000, () => { 
  console.log('     Server running on http://localhost:3000'); 
}); 