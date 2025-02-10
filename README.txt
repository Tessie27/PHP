This project is a simple career application form where users can submit their details and upload a resume. The information is sent to the admin's email via PHP.

Features
Form Fields: Collects First Name, Last Name, Mobile Number, Email, and Resume (PDF/DOC).
Email Notification: Sends the form data and resume to the admin's email.
File Upload: Supports PDF, DOC, and DOCX file uploads.
Requirements
PHP 7.0 or higher
SMTP server for sending emails (e.g., Gmail, SendGrid)
Installation
Clone the Repository

bash
Copy
Edit
git clone https://github.com/Tessie27/career-application-form.git
cd career-application-form
Set Up PHPMailer

If you're using Composer:

bash
Copy
Edit
composer require phpmailer/phpmailer
If you're not using Composer, download PHPMailer from GitHub and include it in your project.

Configure SMTP

Update the SMTP settings in submit_form.php:

php
Copy
Edit
$mail->isSMTP();
$mail->Host = 'smtp.example.com';  // Replace with your SMTP server
$mail->Username = 'your-email@example.com'; // Your SMTP username
$mail->Password = 'your-email-password';   // Your SMTP password
Upload Files to Your Server

Upload index.html, style.css, submit_form.php, and any other necessary files to your server.

Set Folder Permissions

Ensure the uploads/ directory is writable:

bash
Copy
Edit
chmod 777 uploads/
Usage
Users fill out the form and upload a resume.
The form submits the data to submit_form.php.
The admin gets an email with the applicant’s details and resume.
Troubleshooting
No Email: Check SMTP settings and ensure the server can send emails.

File Uploads: Ensure the uploads/ directory is writable.

PHP Errors: Enable error reporting by adding this to the top of submit_form.php:

php
Copy
Edit
ini_set('display_errors', 1);
error_reporting(E_ALL);
This simplified README focuses on the key points for setting up and using the form. You can expand it further if needed!