import emails
from emails.template import JinjaTemplate
from app.core.config import settings
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def send_email(email_to: str, subject_template: str = "", html_template: str = "", context: dict = {}):
    if settings.USE_MOCK_EMAIL:
        logger.info(f"MOCK EMAIL SENT TO {email_to}")
        logger.info(f"Subject: {subject_template}")
        logger.info(f"Context: {context}")
        return

    message = emails.Message(
        subject=JinjaTemplate(subject_template),
        html=JinjaTemplate(html_template),
        mail_from=(settings.EMAILS_FROM_NAME, settings.EMAILS_FROM_EMAIL),
    )
    smtp_options = {"host": settings.SMTP_HOST, "port": settings.SMTP_PORT}
    if settings.SMTP_USER:
        smtp_options["user"] = settings.SMTP_USER
    if settings.SMTP_PASSWORD:
        smtp_options["password"] = settings.SMTP_PASSWORD

    response = message.send(to=email_to, render=context, smtp=smtp_options)
    logger.info(f"send email result: {response}")


def send_otp_email(email_to: str, otp_code: str):
    subject = "Your iStore Verification Code"
    html_content = f"""
    <html>
        <body>
            <h1>Verify your account</h1>
            <p>Your 6-digit verification code is: <strong>{otp_code}</strong></p>
            <p>This code will expire in 10 minutes.</p>
        </body>
    </html>
    """
    send_email(email_to, subject, html_content, {"otp_code": otp_code})


def send_reset_password_email(email_to: str, otp_code: str):
    subject = "Reset Your iStore Password"
    html_content = f"""
    <html>
        <body>
            <h1>Password Reset Request</h1>
            <p>Your 6-digit verification code is: <strong>{otp_code}</strong></p>
            <p>This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
        </body>
    </html>
    """
    send_email(email_to, subject, html_content, {"otp_code": otp_code})
