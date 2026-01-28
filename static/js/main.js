document.getElementById("contactForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const message = document.getElementById("message").value;

    const responseMsg = document.getElementById("responseMsg");

    try {
        const res = await fetch("/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                phone: phone,
                message: message
            })
        });

        const data = await res.json();

        if (res.ok) {
            responseMsg.innerText = "Message sent successfully";
            responseMsg.style.color = "green";
            document.getElementById("contactForm").reset();
        } else {
            responseMsg.innerText = data.message || "Error occurred";
            responseMsg.style.color = "red";
        }

    } catch (err) {
        responseMsg.innerText = "Server error";
        responseMsg.style.color = "red";
    }
});
