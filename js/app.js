// Product Data
const products = {
    apparel: [
        {
            id: 'A1',
            name: "Men's Orange Ram Navami T-Shirt",
            desc: "Premium quality saffron t-shirt with elegant 'Shriram' typography, perfect for rallies.",
            img: "images/mens_orange_tshirt.jpg"
        },
        {
            id: 'A2',
            name: "Men's White Ram Navami Kurtis",
            desc: "Classic white kurti with subtle orange borders and Ram symbol.",
            img: "images/mens_white_shirt.jpg"
        },
        {
            id: 'A3',
            name: "Women's Saffron Print T-Shirt",
            desc: "Comfortable and stylish women's t-shirt dedicated to Ram Navami.",
            img: "images/womens_tshirt.jpg"
        }
    ],
    flags: [
        {
            id: 'F1',
            name: "Large Bhagwa Dhwaj",
            desc: "Traditional orange temple flag with 'Om' or Hanuman ji printed. (3x5 ft)",
            img: "images/bhagwa_dhwaj_flag.jpg"
        },
        {
            id: 'F2',
            name: "Mahavir Flag / Bajrangbali Flag",
            desc: "Triangular orange flag perfect for vehicles or home rooftops.",
            img: "images/mahavir_flag.jpg"
        },
        {
            id: 'F3',
            name: "Ram Navami Saffron Balloons (Pack of 50)",
            desc: "Decorate your local pandal or home with these premium balloons.",
            img: "images/balloons.jpg"
        }
    ],
    puja: [
        {
            id: 'P1',
            name: "Complete Ram Navami Puja Thali Set",
            desc: "Brass thali including diya, incense holder, kumkum, and more.",
            img: "images/puja_thali.jpg"
        },
        {
            id: 'P2',
            name: "Premium Agarbatti & Dhoop Combo",
            desc: "Divine fragrance to purify your home during the auspicious days.",
            img: "images/agarbatti.jpg"
        },
        {
            id: 'P3',
            name: "Ram Charit Manas Book (Hindi)",
            desc: "Holy scripture for reading during Ram Navami.",
            img: "images/ram_book.jpg"
        }
    ]
};

// State
let cart = JSON.parse(localStorage.getItem('ramnavami-cart')) || [];
const WHATSAPP_NUMBER = "917381065506";

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartIcon();
    initParticles();
});

// Render Products
function renderProducts() {
    const apparelGrid = document.getElementById('apparel-grid');
    const flagsGrid = document.getElementById('flags-grid');
    const pujaGrid = document.getElementById('puja-grid');

    const createCardHTML = (product) => `
        <div class="product-card">
            <div class="product-img-wrap">
                <img src="${product.img}" alt="${product.name}" onerror="this.onerror=null; this.src='https://via.placeholder.com/400x400/ff9933/ffffff?text=Image+Needed'">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-desc">${product.desc}</p>
                <div class="product-action">
                    <button class="add-btn" onclick="addToCart('${product.id}', '${product.name.replace(/'/g, "\\'")}')">Add to Cart</button>
                </div>
            </div>
        </div>
    `;

    apparelGrid.innerHTML = products.apparel.map(createCardHTML).join('');
    flagsGrid.innerHTML = products.flags.map(createCardHTML).join('');
    pujaGrid.innerHTML = products.puja.map(createCardHTML).join('');
}

// Cart Logic
function addToCart(id, name) {
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ id, name, qty: 1 });
    }
    saveCart();

    // Provide feedback
    const btn = event.target;
    btn.innerHTML = 'Added <i class="fas fa-check"></i>';
    btn.style.background = 'var(--whatsapp-green)';
    btn.style.borderColor = 'var(--whatsapp-green)';
    btn.style.color = 'white';

    setTimeout(() => {
        btn.innerHTML = 'Add to Cart';
        btn.style = '';
    }, 2000);
}

function saveCart() {
    localStorage.setItem('ramnavami-cart', JSON.stringify(cart));
    updateCartIcon();
    renderCart(); // If open
}

function updateCartIcon() {
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    document.getElementById('cart-count').innerText = count;
}

function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');

    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');

    if (sidebar.classList.contains('active')) {
        renderCart();
    }
}

function renderCart() {
    const container = document.getElementById('cart-items-container');
    const totalEl = document.getElementById('cart-total-count');

    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding: 2rem 0; color: #888;">Your cart is empty.</p>';
        totalEl.innerText = '0';
        return;
    }

    let totalItems = 0;
    container.innerHTML = cart.map((item, index) => {
        totalItems += item.qty;
        return `
        <div class="cart-item">
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div class="qty-controls">
                    <button class="qty-btn" onclick="updateQty(${index}, -1)">-</button>
                    <span>${item.qty}</span>
                    <button class="qty-btn" onclick="updateQty(${index}, 1)">+</button>
                </div>
            </div>
            <button class="remove-btn" onclick="removeItem(${index})"><i class="fas fa-trash"></i></button>
        </div>
        `;
    }).join('');

    totalEl.innerText = totalItems;
}

function updateQty(index, change) {
    if (cart[index].qty + change > 0) {
        cart[index].qty += change;
    } else {
        cart.splice(index, 1);
    }
    saveCart();
}

function removeItem(index) {
    cart.splice(index, 1);
    saveCart();
}

// WhatsApp Checkout logic
function checkoutWhatsApp() {
    if (cart.length === 0) {
        alert("Your cart is empty! Please add some items.");
        return;
    }

    let message = "Jay Shree Ram! 🙏\n\nI would like to order the following items from your website:\n\n";

    cart.forEach((item, index) => {
        message += `${index + 1}. ${item.name} (Qty: ${item.qty})\n`;
    });

    message += "\nPlease let me know the total price and payment details.\nThank you!";

    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

    // Open WhatsApp
    window.open(whatsappURL, '_blank');
}

// Mobile Menu
function toggleMobileMenu() {
    document.querySelector('.nav-links').classList.toggle('active');
}

// Particles JS Init
function initParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS("particles-js", {
            "particles": {
                "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
                "color": { "value": ["#FF671F", "#FFD700", "#ffffff"] },
                "shape": { "type": "circle" },
                "opacity": { "value": 0.8, "random": true },
                "size": { "value": 4, "random": true },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#FF8F54",
                    "opacity": 0.4,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 3,
                    "direction": "none",
                    "random": true,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": { "enable": true, "mode": "grab" },
                    "onclick": { "enable": true, "mode": "push" },
                    "resize": true
                },
                "modes": {
                    "grab": { "distance": 140, "line_linked": { "opacity": 1 } },
                    "push": { "particles_nb": 4 }
                }
            },
            "retina_detect": true
        });
    }
}
