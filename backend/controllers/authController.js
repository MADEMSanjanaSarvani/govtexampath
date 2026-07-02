const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

/**
 * Generate a JWT token with user payload.
 */
const generateToken = (user, rememberMe = false) => {
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: rememberMe ? '30d' : '7d' }
  );
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 */
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'A user with this email already exists.',
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    console.error('Register error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error during registration.',
    });
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 */
const login = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    // Find user and include password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.',
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.',
      });
    }

    // Generate token (30d if rememberMe, else 7d)
    const token = generateToken(user, !!rememberMe);

    res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error during login.',
    });
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/profile
 */
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Get profile error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error fetching profile.',
    });
  }
};

/**
 * @desc    Update user profile (name, avatar)
 * @route   PUT /api/auth/profile
 */
const updateProfile = async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const updateData = {};

    if (name !== undefined) updateData.name = name;
    if (avatar !== undefined) updateData.avatar = avatar;

    const user = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
      message: 'Profile updated successfully.',
    });
  } catch (error) {
    console.error('Update profile error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error updating profile.',
    });
  }
};

/**
 * @desc    Send password reset email
 * @route   POST /api/auth/forgot-password
 */
const forgotPassword = async (req, res) => {
  try {
    const hasBrevoSmtp = process.env.BREVO_SMTP_USER && process.env.BREVO_SMTP_PASS;
    const hasGmail = process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD;
    const hasBrevoApi = !!process.env.BREVO_API_KEY;
    if (!hasBrevoSmtp && !hasGmail && !hasBrevoApi) {
      return res.status(500).json({
        success: false,
        error: 'Email service is not configured. Please contact support.',
      });
    }

    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // Return success even if user not found to prevent email enumeration
      return res.status(200).json({
        success: true,
        message: 'If an account with that email exists, a reset link has been sent.',
      });
    }

    // Generate reset token (JWT with 1 hour expiry)
    const resetToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Build reset URL
    const clientUrl = process.env.CLIENT_URL || 'https://govtexampath.com';
    const resetUrl = `${clientUrl}/reset-password?token=${resetToken}`;
    const rawName = (user.name || 'there').split(' ')[0];
    const firstName = rawName.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

    const emailHtml = `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <div style="background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
          <div style="width: 56px; height: 56px; background: rgba(255,255,255,0.2); border-radius: 16px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
            <span style="color: white; font-weight: bold; font-size: 28px;">G</span>
          </div>
          <h1 style="color: white; margin: 0; font-size: 26px;">Password Reset Request</h1>
          <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 15px;">We received a request to reset your password</p>
        </div>
        <div style="padding: 30px; color: #374151;">
          <p style="font-size: 16px; line-height: 1.6;">Hi ${firstName},</p>
          <p style="font-size: 15px; line-height: 1.7;">We received a request to reset the password for your GovtExamPath account. Click the button below to set a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #4f46e5, #7c3aed); color: white; padding: 14px 36px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 15px;">Reset Your Password</a>
          </div>
          <div style="background: #fef3c7; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <p style="margin: 0; font-size: 13px; color: #92400e; text-align: center;">
              This link will expire in <strong>1 hour</strong>. If you didn't request a password reset, you can safely ignore this email.
            </p>
          </div>
          <p style="font-size: 13px; color: #6b7280; line-height: 1.6; margin-top: 20px;">
            If the button above doesn't work, copy and paste the following URL into your browser:
          </p>
          <p style="font-size: 12px; color: #4f46e5; word-break: break-all;">${resetUrl}</p>
        </div>
        <div style="background: #f9fafb; padding: 20px 30px; text-align: center; border-radius: 0 0 12px 12px; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0; font-size: 12px; color: #9ca3af;">GovtExamPath &middot; New Delhi, India &middot; <a href="https://govtexampath.com" style="color: #6b7280;">govtexampath.com</a></p>
        </div>
      </div>
    `;

    const configuredFrom = process.env.EMAIL_FROM;
    const senderEmail = configuredFrom || process.env.BREVO_SMTP_USER || 'no-reply@govtexampath.com';
    let emailSent = false;

    // 1. Try Brevo REST API first (HTTPS/443 — always reachable, no port issues)
    if (!emailSent && process.env.BREVO_API_KEY) {
      try {
        console.log(`[ForgotPassword] Trying Brevo REST API → ${user.email}`);
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          signal: AbortSignal.timeout(15000),
          headers: {
            'accept': 'application/json',
            'api-key': process.env.BREVO_API_KEY,
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            sender: { name: 'GovtExamPath', email: senderEmail },
            to: [{ email: user.email, name: user.name || user.email }],
            subject: 'Password Reset Request - GovtExamPath',
            htmlContent: emailHtml,
          }),
        });
        if (response.ok) {
          console.log(`[ForgotPassword] Sent via Brevo REST API to ${user.email}`);
          emailSent = true;
        } else {
          const errText = await response.text();
          console.warn(`[ForgotPassword] Brevo REST API failed (${response.status}):`, errText);
        }
      } catch (e) {
        console.warn('[ForgotPassword] Brevo REST API error:', e.message);
      }
    }

    // 2. Try Gmail SMTP
    if (!emailSent && process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      try {
        const nodemailer = require('nodemailer');
        console.log(`[ForgotPassword] Trying Gmail SMTP → ${user.email}`);
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
          connectionTimeout: 10000,
          socketTimeout: 10000,
          greetingTimeout: 10000,
        });
        await transporter.sendMail({
          from: `"GovtExamPath" <${process.env.GMAIL_USER}>`,
          to: user.email,
          subject: 'Password Reset Request - GovtExamPath',
          html: emailHtml,
        });
        console.log(`[ForgotPassword] Sent via Gmail SMTP to ${user.email}`);
        emailSent = true;
      } catch (e) {
        console.warn('[ForgotPassword] Gmail SMTP error:', e.message);
      }
    }

    // 3. Try Brevo SMTP
    if (!emailSent && process.env.BREVO_SMTP_USER && process.env.BREVO_SMTP_PASS) {
      try {
        const nodemailer = require('nodemailer');
        const fromAddress = configuredFrom || process.env.BREVO_SMTP_USER;
        console.log(`[ForgotPassword] Trying Brevo SMTP → ${user.email}`);
        const transporter = nodemailer.createTransport({
          host: 'smtp-relay.brevo.com',
          port: 587,
          secure: false,
          auth: { user: process.env.BREVO_SMTP_USER, pass: process.env.BREVO_SMTP_PASS },
          connectionTimeout: 10000,
          socketTimeout: 10000,
          greetingTimeout: 10000,
        });
        await transporter.sendMail({
          from: `"GovtExamPath" <${fromAddress}>`,
          to: user.email,
          subject: 'Password Reset Request - GovtExamPath',
          html: emailHtml,
        });
        console.log(`[ForgotPassword] Sent via Brevo SMTP to ${user.email}`);
        emailSent = true;
      } catch (e) {
        console.warn('[ForgotPassword] Brevo SMTP error:', e.message);
      }
    }

    if (!emailSent) {
      throw new Error('All email methods failed.');
    }

    res.status(200).json({
      success: true,
      message: 'If an account with that email exists, a reset link has been sent.',
    });
  } catch (error) {
    console.error('Forgot password error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to send reset email. Please try again later.',
    });
  }
};

/**
 * @desc    Reset password using token
 * @route   POST /api/auth/reset-password
 */
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    // Verify the reset token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired reset token.',
      });
    }

    // Reject if the password was already changed after this token was issued (single-use enforcement)
    const existingUser = await User.findById(decoded.id).select('passwordChangedAt');
    if (!existingUser) {
      return res.status(404).json({ success: false, error: 'User not found.' });
    }
    if (existingUser.passwordChangedAt && decoded.iat * 1000 < existingUser.passwordChangedAt.getTime()) {
      return res.status(400).json({
        success: false,
        error: 'This reset link has already been used. Please request a new one.',
      });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update the user's password and stamp passwordChangedAt to invalidate this and prior tokens
    const user = await User.findByIdAndUpdate(decoded.id, {
      password: hashedPassword,
      passwordChangedAt: new Date(),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Password has been reset successfully.',
    });
  } catch (error) {
    console.error('Reset password error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error resetting password.',
    });
  }
};

/**
 * @desc    Logout user (stateless JWT - confirm success)
 * @route   POST /api/auth/logout
 */
const logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
};

/**
 * @desc    Sign in / sign up with Google
 * @route   POST /api/auth/google
 */
const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ success: false, error: 'Google credential is required.' });
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      return res.status(500).json({ success: false, error: 'Google auth not configured on server.' });
    }

    const client = new OAuth2Client(clientId);
    const ticket = await client.verifyIdToken({ idToken: credential, audience: clientId });
    const payload = ticket.getPayload();

    const { sub: googleId, email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        user.provider = user.provider === 'local' ? 'local' : 'google';
        if (picture && !user.avatar) user.avatar = picture;
        await user.save();
      }
    } else {
      user = await User.create({
        name,
        email,
        googleId,
        provider: 'google',
        avatar: picture || '',
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    console.error('Google login error:', error.message);
    const msg = error.message?.includes('audience')
      ? 'Client ID mismatch between frontend and backend. Check GOOGLE_CLIENT_ID on Render matches REACT_APP_GOOGLE_CLIENT_ID in GitHub Secrets.'
      : error.message?.includes('Token used too late')
      ? 'Google token expired. Please try again.'
      : 'Google authentication failed. Check server logs for details.';
    res.status(401).json({ success: false, error: msg });
  }
};

/**
 * @desc    Sign in with Google using OAuth authorization code (for WebView/redirect flow)
 * @route   POST /api/auth/google/code
 */
const googleCodeLogin = async (req, res) => {
  try {
    const { code, redirect_uri } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, error: 'Authorization code is required.' });
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      return res.status(500).json({ success: false, error: 'Google auth not fully configured on server.' });
    }

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok) {
      console.error('Google token exchange error:', tokenData);
      return res.status(401).json({ success: false, error: 'Failed to exchange authorization code.' });
    }

    const client = new OAuth2Client(clientId);
    const ticket = await client.verifyIdToken({ idToken: tokenData.id_token, audience: clientId });
    const payload = ticket.getPayload();

    const { sub: googleId, email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        user.provider = user.provider === 'local' ? 'local' : 'google';
        if (picture && !user.avatar) user.avatar = picture;
        await user.save();
      }
    } else {
      user = await User.create({
        name,
        email,
        googleId,
        provider: 'google',
        avatar: picture || '',
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    console.error('Google code login error:', error.message);
    const msg = error.message?.includes('audience')
      ? 'Client ID mismatch between frontend and backend. Check GOOGLE_CLIENT_ID on Render matches REACT_APP_GOOGLE_CLIENT_ID in GitHub Secrets.'
      : error.message?.includes('Token used too late')
      ? 'Google token expired. Please try again.'
      : 'Google authentication failed. Check server logs for details.';
    res.status(401).json({ success: false, error: msg });
  }
};

module.exports = {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  forgotPassword,
  resetPassword,
  googleLogin,
  googleCodeLogin,
};
