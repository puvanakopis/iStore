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

    if settings.SMTP_PORT == 587:
        smtp_options["tls"] = True
    elif settings.SMTP_PORT == 465:
        smtp_options["ssl"] = True

    if settings.SMTP_USER:
        smtp_options["user"] = settings.SMTP_USER
    if settings.SMTP_PASSWORD:
        smtp_options["password"] = settings.SMTP_PASSWORD

    response = message.send(to=email_to, render=context, smtp=smtp_options)
    logger.info(f"send email result: {response}")



BASE_STYLE = """
<style>
    body {
        margin: 0;
        padding: 0;
        background-color: #f5f5f7;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        color: #1d1d1f;
    }

    .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 40px 20px;
    }

    .card {
        background: #ffffff;
        border-radius: 18px;
        padding: 40px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.08);
        text-align: center;
    }

    .brand {
        font-size: 20px;
        font-weight: 600;
        letter-spacing: -0.5px;
        margin-bottom: 30px;
    }

    .title {
        font-size: 24px;
        font-weight: 700;
        margin-bottom: 10px;
    }

    .subtitle {
        font-size: 15px;
        color: #6e6e73;
        margin-bottom: 30px;
        line-height: 1.5;
    }

    .otp-box {
        display: inline-block;
        padding: 18px 32px;
        font-size: 28px;
        font-weight: 700;
        letter-spacing: 6px;
        background: #f5f5f7;
        border-radius: 12px;
        margin: 20px 0;
    }

    .note {
        font-size: 13px;
        color: #86868b;
        margin-top: 25px;
        line-height: 1.6;
    }

    .footer {
        margin-top: 30px;
        font-size: 12px;
        color: #a1a1a6;
    }
</style>
"""


def send_otp_email(email_to: str, otp_code: str):
    subject = "Your iStore Verification Code"

    html_content = f"""
    <html>
    <head>{BASE_STYLE}</head>
    <body>
        <div class="container">
            <div class="card">
                <div class="brand">iStore</div>

                <div class="title">Verify your account</div>
                <div class="subtitle">
                    Use the verification code below to complete your sign-in process.
                </div>

                <div class="otp-box">{otp_code}</div>

                <div class="note">
                    This code will expire in <b>10 minutes</b>.<br/>
                    If you did not request this, you can safely ignore this email.
                </div>

                <div class="footer">
                    © iStore. All rights reserved.
                </div>
            </div>
        </div>
    </body>
    </html>
    """

    send_email(email_to, subject, html_content, {"otp_code": otp_code})


def send_reset_password_email(email_to: str, otp_code: str):
    subject = "Reset Your iStore Password"

    html_content = f"""
    <html>
    <head>{BASE_STYLE}</head>
    <body>
        <div class="container">
            <div class="card">
                <div class="brand">iStore</div>

                <div class="title">Password Reset Request</div>
                <div class="subtitle">
                    We received a request to reset your password. Use the code below to continue.
                </div>

                <div class="otp-box">{otp_code}</div>

                <div class="note">
                    This code will expire in <b>10 minutes</b>.<br/>
                    If you did not request a password reset, ignore this email or secure your account immediately.
                </div>

                <div class="footer">
                    iStore Security Team
                </div>
            </div>
        </div>
    </body>
    </html>
    """

    send_email(email_to, subject, html_content, {"otp_code": otp_code})