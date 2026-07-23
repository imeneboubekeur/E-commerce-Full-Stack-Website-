const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendResetEmail = async (email, resetLink) => {
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Reset your password",
    html: `
      <h2>Password Reset</h2>

      <p>You requested a password reset.</p>

      <p>
        <a href="${resetLink}">
          Reset Password
        </a>
      </p>

      <p>This link expires in 30 minutes.</p>

      <p>If you didn't request this, ignore this email.</p>
    `,
  });
};

module.exports = { sendResetEmail };