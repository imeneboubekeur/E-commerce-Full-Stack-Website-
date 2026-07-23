const pool = require('../database/database');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { sendResetEmail } = require("../serving/emailService");
const crypto = require("crypto");


// SIGNUP Route
// ========================================
exports.signUp= async (req, res) => {
  try {
    const { email, password, confirmPassword, name } = req.body;

    // Validation
    if (!email || !password || !confirmPassword || !name) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    if (!email.includes('@')) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Check if user exists
    const userExists = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create user
    const result = await pool.query(
       `INSERT INTO users (email, password, name, role) 
   VALUES ($1, $2, $3, $4) 
   RETURNING id, email, name, role`,
  [email.toLowerCase(), hashedPassword, name.trim(), 'user']
    );

    const user = result.rows[0];

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email,role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Signup successful!',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role:user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Signup failed', error: error.message });
  }
}
// LOGIN 
exports.login=async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const result = await pool.query(
      'SELECT id, email, password, name,role FROM users WHERE email = $1',
      [email.toLowerCase()]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = result.rows[0];
    // Compare passwords
    const passwordMatch = await bcryptjs.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email,role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === "production", 
   maxAge: 7 * 24 * 60 * 60 * 1000

  });
    res.status(200).json({
      message: 'Login successful!',
      
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role:user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
}


// GET Current User (Protected Route)

exports.getCurrentUser = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, name, phone, image_url, address FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
}


// UPDATE Profile (Protected Route)

exports.updateProfile1 = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const userId = req.user.id;

    const result = await pool.query(
      'UPDATE users SET name = COALESCE($1, name), phone = COALESCE($2, phone), address = COALESCE($3, address), updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING id, email, name, phone, address',
      [name || null, phone || null, address || null, userId]
    );

    res.json({
      message: 'Profile updated successfully!',
      user: result.rows[0]
    });
  } catch (error) {
    res.status(400).json({ message: 'Error updating profile', error: error.message });
  }
}

// ========================================
// LOGOUT (Frontend handles this)
// ========================================
exports.logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // true in production (HTTPS)
    });

    return res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);

    return res.status(500).json({
      message: "Logout failed",
    });
  }

}

exports.getMe = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, phone, address, image_url, role FROM users WHERE id = $1",
      [req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.updateProfile = async (req, res) => {
  try {
    const { name, email, address } = req.body;
if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }
    
    const imageUrl = req.file.path;
    const imagePublicId = req.file.filename;
    const result = await pool.query(
      `
      UPDATE users
      SET 
        name = COALESCE($1, name),
        email = COALESCE($2, email),
        address = COALESCE($3, address),
        image_url = COALESCE($4, image_url),

        updated_at = NOW()
      WHERE id = $5
      RETURNING id, name, email, address
      `,
      [name, email,address,imageUrl, req.user.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await pool.query(
      "SELECT password FROM users WHERE id = $1",
      [req.user.id]
    );

    if (!user.rows.length) {
      return res.status(404).json({ error: "User not found" });
    }

    const valid = await bcryptjs.compare(
      currentPassword,
      user.rows[0].password
    );

    if (!valid) {
      return res.status(400).json({ error: "Incorrect current password" });
    }

    const hashedPassword = await bcryptjs.hash(newPassword, 10);

    await pool.query(
      `
      UPDATE users
      SET password = $1, updated_at = NOW()
      WHERE id = $2
      `,
      [hashedPassword, req.user.id]
    );

    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const result = await pool.query(
      "SELECT id, email FROM users WHERE email = $1",
      [email.toLowerCase()]
    );

    // Don't reveal whether the email exists
    if (result.rows.length === 0) {
      return res.json({
        message:
          "If an account with that email exists, a password reset link has been sent.",
      });
    }

    const user = result.rows[0];

    // Generate secure random token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash the token before saving
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Token expires in 30 minutes
    const expiry = new Date(Date.now() + 30 * 60 * 1000);

    await pool.query(
      `
      UPDATE users
      SET
        reset_token = $1,
        reset_token_expiry = $2
      WHERE id = $3
      `,
      [hashedToken, expiry, user.id]
    );

    const resetLink =
      `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await sendResetEmail("iboubekeur72@gmail.com", resetLink);

    res.json({
      message:
        "If an account with that email exists, a password reset link has been sent.",
    });

  } catch (err) {

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password, confirmPassword } = req.body;

    if (!token || !password || !confirmPassword) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    // Hash the received token
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Find user with this token
    const result = await pool.query(
      `
      SELECT id
      FROM users
      WHERE
        reset_token = $1
        AND reset_token_expiry > NOW()
      `,
      [hashedToken]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        message: "Invalid or expired reset link",
      });
    }

    const user = result.rows[0];

    // Hash new password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Update password and remove reset token
    await pool.query(
      `
      UPDATE users
      SET
        password = $1,
        reset_token = NULL,
        reset_token_expiry = NULL,
        updated_at = NOW()
      WHERE id = $2
      `,
      [hashedPassword, user.id]
    );

    res.json({
      message: "Password has been reset successfully",
    });

  } catch (err) {

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};