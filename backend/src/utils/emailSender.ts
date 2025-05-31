import nodemailer from 'nodemailer';

// Create a transporter for sending emails using Gmail (can be replaced with other services)
const transporter = nodemailer.createTransport({
  service: 'gmail',  // Can use other email services (Mailgun, SendGrid, etc.)
  auth: {
    user: process.env.EMAIL_USER,  // Your email address
    pass: process.env.EMAIL_PASS,  // Your email password or app-specific password
  },
});

// Function to send reminder email
export const sendReminderEmail = async (userEmail: string, habitTitle: string) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,  // Sender's email address
      to: userEmail,                 // Recipient's email address
      subject: `Reminder: ${habitTitle} is pending!`,  // Subject
      text: `Hey! You have a pending habit: ${habitTitle}. Don't forget to complete it today!`,  // Email body
    };

    await transporter.sendMail(mailOptions);
    console.log(`Reminder email sent to ${userEmail}`);
  } catch (error) {
    console.error('Error sending reminder email:', error);
  }
};
