//Change this to your backend
const backendUrl2 = "https://cheese-backend2.onrender.com";
async function news() {
    const info = document.getElementById("newsletter-email");

    const userData = {
        email: info.value.trim(),
    };

    try {
        const res2 = await fetch(`${backendUrl2}/news`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData)
        });
        const result = await res2.json();
        console.log("Added to news", result);
        document.getElementById('newsletter-message').style.display = 'block';
    } catch (err) {
        console.error("Error saving user info:", err);
    }
}

window.addEventListener("load", async () => {
    try {
        await fetch(`${backendUrl2}/ping`);
        console.log("Backend ping successful — service is awake.");
    } catch (err) {
        console.warn("Backend ping failed. Service may be asleep or unreachable.");
    }
});


const form = document.getElementById('newsletter-form');
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await news();
    form.reset();
});

