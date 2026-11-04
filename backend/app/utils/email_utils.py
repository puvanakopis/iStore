import smtplib
from email.message import EmailMessage
import logging
from typing import Dict, Any
from app.core.config import settings

logger = logging.getLogger(__name__)


def _log_fallback_otp(email_to: str, subject: str, otp: str):
    msg = (
        f"\n============================================================\n"
        f"[iStore OTP - EMAIL DELIVERY FAILED]\n"
        f"Recipient : {email_to}\n"
        f"Subject   : {subject}\n"
        f"OTP Code  : >>> {otp} <<< (Valid for 10 minutes)\n"
        f"Action    : Use this OTP to proceed while resolving SMTP credentials.\n"
        f"============================================================"
    )
    logger.warning(msg)
    print(msg)


def send_email(email_to: str, subject: str = "", html_content: str = "", context: Dict[str, Any] = {}):
    otp = context.get("otp_code")

    if settings.USE_MOCK_EMAIL:
        msg = (
            f"\n============================================================\n"
            f"[MOCK EMAIL - USE_MOCK_EMAIL=True]\n"
            f"To        : {email_to}\n"
            f"Subject   : {subject}\n"
            f"OTP Code  : >>> {otp} <<<\n"
            f"============================================================"
        )
        logger.info(msg)
        print(msg)
        return

    if not settings.SMTP_HOST or not settings.SMTP_PORT:
        logger.warning(
            f"SMTP is not configured (SMTP_HOST / SMTP_PORT missing). "
            f"Email to {email_to} was not sent."
        )
        if otp:
            _log_fallback_otp(email_to, subject, otp)
        return

    msg = EmailMessage()
    msg["Subject"] = subject
    from_name = settings.EMAILS_FROM_NAME or "iStore"
    from_email = settings.EMAILS_FROM_EMAIL or settings.SMTP_USER or "noreply@istore.com"
    msg["From"] = f"{from_name} <{from_email}>"
    msg["To"] = email_to
    msg.set_content(html_content, subtype="html")

    server = None
    try:
        port = int(settings.SMTP_PORT)
        if port == 465:
            server = smtplib.SMTP_SSL(settings.SMTP_HOST, port, timeout=12)
        else:
            server = smtplib.SMTP(settings.SMTP_HOST, port, timeout=12)
            server.ehlo()
            server.starttls()
            server.ehlo()

        if settings.SMTP_USER and settings.SMTP_PASSWORD:
            clean_password = settings.SMTP_PASSWORD.replace(" ", "").strip()
            server.login(settings.SMTP_USER.strip(), clean_password)

        server.send_message(msg)
        logger.info(f"Email successfully sent to {email_to}")

    except smtplib.SMTPAuthenticationError as e:
        logger.error(
            f"SMTP Authentication Error ({e.smtp_code}): Username or password rejected by {settings.SMTP_HOST}. "
            f"For Gmail (smtp.gmail.com), ensure 2-Step Verification is ON and generate a 16-character "
            f"Google App Password from https://myaccount.google.com/apppasswords, NOT your normal Google password."
        )
        if otp:
            _log_fallback_otp(email_to, subject, otp)

    except smtplib.SMTPServerDisconnected as e:
        logger.error(
            f"SMTP connection unexpectedly closed by {settings.SMTP_HOST}:{settings.SMTP_PORT}. "
            f"Note: Gmail automatically closes the socket when credentials are invalid (535 BadCredentials). "
            f"Please verify SMTP_USER ('{settings.SMTP_USER}') matches the Google account that generated the "
            f"16-character App Password for SMTP_PASSWORD in backend/.env."
        )
        if otp:
            _log_fallback_otp(email_to, subject, otp)

    except Exception as e:
        logger.error(f"Failed to send email to {email_to}: {type(e).__name__}: {str(e)}")
        if otp:
            _log_fallback_otp(email_to, subject, otp)

    finally:
        if server:
            try:
                server.quit()
            except Exception:
                pass


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
