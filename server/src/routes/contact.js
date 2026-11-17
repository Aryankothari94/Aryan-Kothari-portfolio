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
  message: { error: 'Too many requests, please try again later.' },
});

const contactValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('subject').optional().trim().isLength({ max: 150 }),
  body('message').trim().notEmpty().withMessage('Message is required').isLength({ max: 3000 }),
];

async function sendContactEmail({ name, email, subject, message }) {
  const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, CONTACT_RECEIVER_EMAIL } =
    process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    return false;
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 587),
    secure: SMTP_SECURE === 'true',
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Portfolio Contact" <${SMTP_USER}>`,
    to: CONTACT_RECEIVER_EMAIL || SMTP_USER,
    replyTo: email,
    subject: `[Portfolio] ${subject || 'New Inquiry'} — ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
  });

  return true;
}

router.post('/', contactLimiter, contactValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, subject, message } = req.body;

  try {
    let saved = false;
    if (mongoose.connection.readyState === 1) {
      await ContactMessage.create({ name, email, subject, message });
      saved = true;
    }

    const emailed = await sendContactEmail({ name, email, subject, message });

    return res.status(201).json({
      success: true,
      saved,
      emailed,
      message: 'Message received.',
    });
  } catch (error) {
    console.error('[Contact] Error handling message:', error.message);
    return res.status(500).json({ error: 'Failed to process contact request.' });
  }
});

export default router;

