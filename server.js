const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

function normalizeText(value, fallback = '') {
  if (typeof value !== 'string') {
    return fallback;
  }

  const cleaned = value.trim();
  return cleaned || fallback;
}

function getGreeting(recipient) {
  const byRecipient = {
    Manager: 'Dear Manager,',
    Colleague: 'Hi there,',
    Client: 'Dear Client,',
    Recruiter: 'Dear Recruiter,',
    Professor: 'Dear Professor,',
    Other: 'Hello,'
  };

  return byRecipient[recipient] || 'Hello,';
}

function getClosing(tone) {
  const closingByTone = {
    Professional: 'Best regards,',
    Casual: 'Thanks,',
    Friendly: 'Take care,',
    Formal: 'Sincerely,',
    Urgent: 'Regards,'
  };

  return closingByTone[tone] || 'Best regards,';
}

function buildEmailSubject(emailType, recipient) {
  const subjectType = normalizeText(emailType, 'Email');
  const target = normalizeText(recipient, 'Team');
  return `${subjectType} for ${target}`;
}

function buildEmailBody({ emailType, recipient, tone, length, additionalDetails }) {
  const type = normalizeText(emailType, 'Email');
  const recipientName = normalizeText(recipient, 'Team');
  const toneName = normalizeText(tone, 'Professional');
  const lengthName = normalizeText(length, 'Medium');
  const details = normalizeText(additionalDetails, 'I would like to share an update with you.');

  const greeting = getGreeting(recipientName);
  const opening = {
    Professional: `I hope you are doing well. I am writing regarding the ${type.toLowerCase()} request and would appreciate your consideration.`,
    Casual: `Hope you're doing well. I wanted to reach out about the ${type.toLowerCase()} and share a quick update.`,
    Friendly: `I hope all is well. I wanted to follow up regarding the ${type.toLowerCase()} and keep things moving smoothly.`,
    Formal: `I trust you are well. I am writing to formally address the ${type.toLowerCase()} and provide the necessary details.`,
    Urgent: `I hope you can review this promptly. This ${type.toLowerCase()} requires attention and I would appreciate your timely response.`
  }[toneName] || `I hope you are doing well. I am contacting you regarding the ${type.toLowerCase()} and would appreciate your support.`;

  const bodyLength = {
    Short: 'I would appreciate your time and attention to this matter.',
    Medium: `The key point is that ${details}. I believe this is a reasonable request and would be grateful for your consideration.`,
    Long: `The details are as follows: ${details}. I believe this approach is appropriate and would appreciate the opportunity to discuss it further if needed. I am happy to provide any additional information or clarification that may be helpful.`
  }[lengthName] || `I would appreciate your time and attention to this matter.`;

  const closing = getClosing(toneName);

  return [
    greeting,
    '',
    opening,
    '',
    bodyLength,
    '',
    'Thank you for your time and consideration.',
    '',
    closing,
    'Your Name'
  ].join('\n');
}

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running successfully.' });
});

app.post('/api/generate', (req, res) => {
  try {
    const payload = req.body || {};

    const emailType = normalizeText(payload.emailType, '');
    const recipient = normalizeText(payload.recipient, '');
    const tone = normalizeText(payload.tone, 'Professional');
    const length = normalizeText(payload.length, 'Medium');
    const additionalDetails = normalizeText(payload.additionalDetails, '');

    if (!emailType || !recipient || !additionalDetails) {
      return res.status(400).json({
        error: 'Email type, recipient, and additional details are required.'
      });
    }

    const subject = buildEmailSubject(emailType, recipient);
    const body = buildEmailBody({
      emailType,
      recipient,
      tone,
      length,
      additionalDetails
    });

    return res.json({ subject, body });
  } catch (error) {
    return res.status(500).json({
      error: 'Something went wrong while generating the email.'
    });
  }
});

app.use(express.static(path.join(__dirname)));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }

  return res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(5000, () => {
  console.log(`Server running on http://localhost:${5000}`);
});
