import { config } from "dotenv";

config();

const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER,
  TWILIO_WHATSAPP_NUMBER,
  SENDGRID_API_KEY,
  FROM_EMAIL
} = process.env;

// NOTE: This file is written to work once you run `npm install` and have the
// required packages installed. It is safe to keep in the repo as a template.

export async function sendSms(to: string, body: string) {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
    console.warn("Twilio credentials missing; skipping SMS");
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const twilio = require("twilio")(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

  await twilio.messages.create({
    body,
    from: TWILIO_PHONE_NUMBER,
    to
  });
}

export async function sendWhatsApp(to: string, body: string) {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP_NUMBER) {
    console.warn("Twilio WhatsApp credentials missing; skipping WhatsApp");
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const twilio = require("twilio")(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

  await twilio.messages.create({
    body,
    from: `whatsapp:${TWILIO_WHATSAPP_NUMBER}`,
    to: `whatsapp:${to}`
  });
}

export async function sendEmail(to: string, subject: string, html: string) {
  if (!SENDGRID_API_KEY || !FROM_EMAIL) {
    console.warn("SendGrid config missing; skipping email");
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const sgMail = require("@sendgrid/mail");
  sgMail.setApiKey(SENDGRID_API_KEY);

  await sgMail.send({
    to,
    from: FROM_EMAIL,
    subject,
    html
  });
}
