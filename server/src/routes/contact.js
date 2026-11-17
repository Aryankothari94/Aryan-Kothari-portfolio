import express from 'express';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';
import { ContactMessage } from '../models/ContactMessage.js';

const router = express.Router();

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many contact requests. Please wait a few minutes and try again.' },
});

const contactValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required.')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters.'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required.')
    .isEmail()
    .withMessage('Please enter a valid email address.')
    .normalizeEmail(),
  body('subject')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 150 })
    .withMessage('Subject cannot exceed 150 characters.'),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required.')
    .isLength({ min: 10, max: 3000 })
    .withMessage('Message must be between 10 and 3000 characters.'),
];

function escapeHtml(str = '') {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

async function sendContactEmail({ name, email, subject, message }) {
  const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, CONTACT_RECEIVER_EMAIL } =
    process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    return { configured: false, sent: false };
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 587),
    secure: SMTP_SECURE === 'true',
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  const safeSubject = subject || 'Portfolio Inquiry';

  await transporter.sendMail({
    from: `"Portfolio Contact" <${SMTP_USER}>`,
    to: CONTACT_RECEIVER_EMAIL || SMTP_USER,
    replyTo: email,
    subject: `[Portfolio] ${safeSubject} — ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nSubject: ${safeSubject}\n\n${message}`,
    html: `
      <div style="font-family: sans-serif; line-height: 1.6; color: #111;">
        <h2 style="margin-bottom: 8px;">New Portfolio Contact Message</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(safeSubject)}</p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 16px 0;" />
        <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
      </div>
    `,
  });

  return { configured: true, sent: true };
}

router.post('/', contactLimiter, contactValidation, async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const errors = result.array();
    const fieldErrors = {};
    for (const err of errors) {
      if (err.path && !fieldErrors[err.path]) {
        fieldErrors[err.path] = err.msg;
      }
    }
    return res.status(400).json({
      error: errors[0]?.msg || 'Validation failed.',
      errors,
      fieldErrors,
    });
  }

  const { name, email, subject, message } = req.body;
  const dbReady = mongoose.connection.readyState === 1;

  let saved = false;
  let dbError = null;
  if (dbReady) {
    try {
      await ContactMessage.create({ name, email, subject, message });
      saved = true;
    } catch (error) {
      dbError = error.message;
      console.error('[Contact] MongoDB write failed:', error.message);
    }
  }

  let emailed = false;
  let emailConfigured = false;
  let emailError = null;
  try {
    const emailOutcome = await sendContactEmail({ name, email, subject, message });
    emailConfigured = emailOutcome.configured;
    emailed = emailOutcome.sent;
  } catch (error) {
    emailConfigured = true;
    emailError = error.message;
    console.error('[Contact] Nodemailer delivery failed:', error.message);
  }

  // Fail only if configured delivery/storage targets all failed
  if ((dbReady && !saved && !emailConfigured) || (dbReady && !saved && emailConfigured && !emailed) || (!dbReady && emailConfigured && !emailed)) {
    return res.status(502).json({
      error: 'Unable to store or deliver your message right now. Please try again or email directly.',
      details: { dbError, emailError },
    });
  }

  return res.status(201).json({
    success: true,
    saved,
    emailed,
    warning:
      saved && emailConfigured && !emailed
        ? 'Message saved to database, but email notification could not be sent.'
        : undefined,
    message: 'Message received.',
  });
});

export default router;
