//Nothing in this file
async function loadProducts(container, options = { featuredOnly: false, overrideProducts: null }) {
    const url = 'products.json';
    try {
        let products = await (await fetch(url)).json();

        if (options.overrideProducts) {
            products = options.overrideProducts;
        } else if (options.featuredOnly) {
            products = products.filter(p => p.featured);
        }
        if (products.length === 0) {
            container.innerHTML = '<p style="text-align:center; font-size:18px; color:#555;">Sorry, no products found.</p>';
            return;
        }

        container.innerHTML = '';

        products.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.className = 'product';
            if (!product.in_stock) productDiv.classList.add('out-of-stock');

            productDiv.style.cursor = 'pointer';
            productDiv.addEventListener('click', () => {
                window.location.href = `product.html?id=${product.id}`;
            });

            const displayImage = Array.isArray(product.image) ? product.image[0] : product.image;

            productDiv.innerHTML = `
                ${!product.in_stock ? '<span class="out-of-stock-text">Out of Stock</span>' : ''}
                <img src="${displayImage}" alt="${product.name}">
                <h3>${product.name}</h3>
                <div class="price">£${product.price.toFixed(2)}</div>
                <p>${product.description}</p>
                <button ${!product.in_stock ? 'disabled' : ''}>Add to Basket</button>
            `;

            const button = productDiv.querySelector('button');
            button.addEventListener('click', (event) => {
                event.stopPropagation();

                let cart = JSON.parse(localStorage.getItem('cart')) || [];

                const existingItem = cart.find(item => item.id === product.id);
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cart.push({ id: product.id, quantity: 1 });
                }

                localStorage.setItem('cart', JSON.stringify(cart));

                console.log(`${product.name} added to basket`);
                alert(`${product.name} added to basket`)
                const loadingBox = document.createElement("div");

            });

            container.appendChild(productDiv);

        });

    } catch (error) {
        console.error('Error loading products:', error);
        container.innerHTML = '<p>Failed to load products. Please try again later.</p>';
    }
}
