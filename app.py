import os
from flask import Flask, request, jsonify, render_template

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app = Flask(
    __name__,
    template_folder=os.path.join(BASE_DIR, "templates"),
    static_folder=os.path.join(BASE_DIR, "static")
)

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

    print("NEW LEAD")
    print("Name:", name)
    print("Phone:", phone)
    print("Message:", message)
    print("-------------")

    return jsonify({
        "status": "success",
        "message": "Lead received"
    }), 200


if __name__ == "__main__":
    app.run()

