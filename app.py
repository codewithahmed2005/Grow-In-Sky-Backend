import os
from flask import Flask, request, jsonify, render_template
import smtplib
from email.message import EmailMessage

# ---------- PATH SETUP ----------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app = Flask(
    __name__,
    template_folder=os.path.join(BASE_DIR, "templates"),
    static_folder=os.path.join(BASE_DIR, "static")
)

# ---------- EMAIL CONFIG ----------
EMAIL_ADDRESS = "codewithahmed2005@gmail.com"      # apna outlook email
EMAIL_PASSWORD = "Ahmed@2504"     # outlook password
RECEIVER_EMAIL = "bila772882@gmail.com"     # jahan lead mile

# ---------- ROUTES ----------
@app.route("/")
def home():
    return render_template("index.html")


@app.route("/contact", methods=["POST"])
def contact():
    if not request.is_json:
        return jsonify({
            "status": "error",
            "message": "JSON required"
        }), 400

    data = request.get_json()

    name = data.get("name")
    phone = data.get("phone")
    message = data.get("message")

    if not name or not phone or not message:
        return jsonify({
            "status": "error",
            "message": "All fields required"
        }), 400

    # ---- LOG (DEBUG) ----
    print("NEW LEAD")
    print("Name:", name)
    print("Phone:", phone)
    print("Message:", message)
    print("-------------")

    # ---------- EMAIL SEND ----------
    try:
        msg = EmailMessage()
        msg["Subject"] = "New GIS Website Lead"
        msg["From"] = EMAIL_ADDRESS
        msg["To"] = RECEIVER_EMAIL

        msg.set_content(
            f"New Lead Received\n\n"
            f"Name: {name}\n"
            f"Phone: {phone}\n"
            f"Message: {message}"
        )

        with smtplib.SMTP("smtp.office365.com", 587) as server:
            server.starttls()
            server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
            server.send_message(msg)

    except Exception as e:
        print("EMAIL ERROR:", e)
        return jsonify({
            "status": "error",
            "message": "Failed to send email"
        }), 500

    return jsonify({
        "status": "success",
        "message": "Message sent successfully"
    }), 200


if __name__ == "__main__":
    app.run()
