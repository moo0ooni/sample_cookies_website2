document.addEventListener('DOMContentLoaded', () => {
    // Card Hover Effects
    const cards = document.querySelectorAll('.cookie-card');
    const cartOverlay = document.querySelector('.cart-overlay');
    const cartContainer = document.querySelector('.cart-container');
    const cartItems = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.cart-summary p');
    const checkoutBtn = document.querySelector('.checkout-btn');

    let cart = [];

    cards.forEach(card => {
        // Hover effects
        card.addEventListener('mouseover', () => {
            card.style.transform = 'scale(1.05)';
        });

        card.addEventListener('mouseout', () => {
            card.style.transform = 'scale(1)';
        });

        // Add to Cart functionality
        const addToCartBtn = card.querySelector('.add-to-cart');
        addToCartBtn.addEventListener('click', () => {
            const flavor = card.dataset.flavor;
            const price = parseFloat(card.querySelector('.price').textContent.replace('$', '').split(' ')[0]);
            
            // Check if item already in cart
            const existingItem = cart.find(item => item.flavor === flavor);
            
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({
                    flavor: flavor,
                    price: price,
                    quantity: 1
                });
            }

            updateCart();
        });
    });

    // Navigation Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Cart Functionality
    function updateCart() {
        // Clear existing cart items
        cartItems.innerHTML = '';

        // Populate cart
        cart.forEach((item, index) => {
            const cartItemElement = document.createElement('div');
            cartItemElement.classList.add('cart-item');
            cartItemElement.innerHTML = `
                <span>${item.flavor}</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
                <div class="quantity-controls">
                    <button class="decrease-qty" data-index="${index}">-</button>
                    <span>${item.quantity}</span>
                    <button class="increase-qty" data-index="${index}">+</button>
                    <button class="remove-item" data-index="${index}">🗑️</button>
                </div>
            `;
            cartItems.appendChild(cartItemElement);
        });

        // Calculate and update total
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = `Total: $${total.toFixed(2)}`;

        // Add event listeners for quantity controls
        document.querySelectorAll('.decrease-qty').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.dataset.index;
                if (cart[index].quantity > 1) {
                    cart[index].quantity--;
                } else {
                    cart.splice(index, 1);
                }
                updateCart();
            });
        });

        document.querySelectorAll('.increase-qty').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.dataset.index;
                cart[index].quantity++;
                updateCart();
            });
        });

        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.dataset.index;
                cart.splice(index, 1);
                updateCart();
            });
        });
    }

    // Order Now and View Cart Buttons
    document.querySelector('.order-btn').addEventListener('click', () => {
        cartOverlay.style.display = 'flex';
    });

    // Close cart when clicking outside
    cartOverlay.addEventListener('click', (e) => {
        if (e.target === cartOverlay) {
            cartOverlay.style.display = 'none';
        }
    });

    // Checkout functionality (just a placeholder)
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        alert('Thank you for your order! We will process it shortly.');
        cart = [];
        updateCart();
        cartOverlay.style.display = 'none';
    });

    // Contact Form Submission
    const contactForm = document.querySelector('.contact-form form');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for your message! We will get back to you soon.');
        contactForm.reset();
    });

    // Initial page load animations
    window.addEventListener('load', () => {
        const sections = document.querySelectorAll('section');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, { threshold: 0.1 });

        sections.forEach(section => {
            observer.observe(section);
        });
    });
});

// Styles for animations (can be moved to CSS)
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }

    section {
        opacity: 0;
        transition: opacity 0.5s ease, transform 0.5s ease;
    }

    section.fade-in {
        animation: fadeIn 0.8s forwards;
    }

    .cart-overlay {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.5);
        justify-content: center;
        align-items: center;
        z-index: 1100;
    }

    .cart-container {
        background-color: white;
        width: 90%;
        max-width: 500px;
        padding: 20px;
        border-radius: 10px;
        max-height: 70%;
        overflow-y: auto;
    }

    .cart-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        border-bottom: 1px solid #eee;
    }

    .quantity-controls {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .quantity-controls button {
        background-color: #f4a460;
        color: white;
        border: none;
        padding: 5px 10px;
        border-radius: 3px;
        cursor: pointer;
    }
`;
document.head.appendChild(style);