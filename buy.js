//Change this to your backend 1
const backendUrl = "https://cheese-backend-x01h.onrender.com";
function order(){
    window.location.href="buy.html"
}

function shippingcost(){
    return 5.20
}
async function cost(){
    try {
        const response = await fetch('products.json');
        const products = await response.json();
        let total_price = 0;
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const items = [];

        if (cart.length === 0) {
            return { error: "Nothing in your basket" };
        }

        cart.forEach(item => {
            const product = products.find(p => p.id === item.id);
            if (!product) return;

            let product_price = product.price * item.quantity;
            product_price = Math.ceil(product_price * 100) / 100;

            items.push({
                id: product.id,
                name: product.name,
                quantity: item.quantity,
                unit_price: product.price,
                total_price: product_price
            });

            total_price += product_price;
        });

        const shipping = shippingcost();
        total_price += shipping;

        const info = JSON.parse(localStorage.getItem("userInfo"));
        if (!info || !info.name || !info.contact || !info.address) {
            window.location.href = "personal_info.html";
            return;
        }
        let card_payment;
        if (info.address.country == "United Kingdom"){
            card_payment = (total_price * 0.019) + 0.2;
        }else{
            card_payment = (total_price * 0.0325) + 0.2;
        }
        card_payment = Math.ceil(card_payment * 100) / 100;
        total_price += card_payment;
        

        const result = {
            items,
            shipping: shipping,
            card_fee: card_payment,
            total: Math.ceil(total_price * 100) / 100
        };

        return result;

    } catch (err) {
        console.error(err);
        return { error: "Failed to load basket data" };
    }
}


async function buy() {
    const data2 = await cost();
    
    const cart = data2.items.map(item => ({
        name: item.name,
        price: item.unit_price,
        quantity: item.quantity
    }));

    cart.push(
        { name: "Shipping", price: data2.shipping, quantity: 1 },
        { name: "Card Fee", price: data2.card_fee, quantity: 1 }
    );

    // --- Create checkout session ---
    try {
        const res = await fetch(`${backendUrl}/create-session`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cart })
        });
        const sessionData = await res.json();
        if (sessionData.url) {
            window.location = sessionData.url;
        } else {
            alert("Error: " + sessionData.error);
        }
    } catch (err) {
        alert("Checkout issue. Try again in a few seconds.");
        console.error(err);
    }

    
}

window.addEventListener("load", async () => {
    try {
        await fetch(`${backendUrl}/ping`);
        console.log("Backend ping successful — service is awake.");
    } catch (err) {
        console.warn("Backend ping failed. Service may be asleep or unreachable.");
    }
});