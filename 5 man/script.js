
const products = {
    jasmine: {
        name: "Jasmine Rice",
        image: "images/jasmine.jpg",
        description: "Fragrant, soft, and slightly sticky when cooked. Ideal for daily meals and Asian cuisine. Known for its delicate floral aroma.",
        pricePerKilo: 55,
        benefits: [
            { icon: "🌸", text: "Subtle Floral Aroma" },
            { icon: "☁️", text: "Soft, Fluffy Texture" },
            { icon: "🏅", text: "Premium Quality" },
            { icon: "🍚", text: "Versatile Cooking" }
        ]
    },
    black: {
        name: "Black Rice",
        image: "images/black.jpg",
        description: "A nutritious whole-grain rice with a rich nutty flavor, chewy texture, and a distinctive dark color.",
        pricePerKilo: 80,
        benefits: [
            { icon: "🌰", text: "Rich Nutty Flavor" },
            { icon: "💚", text: "Nutrient Rich" },
            { icon: "🏅", text: "Premium Quality" },
            { icon: "🥗", text: "Healthy Meal Option" }
        ]
    },
    grain: {
        name: "Grain Rice",
        image: "images/grain.jpg",
        description: "Wholesome grain rice with a natural taste and satisfying texture. Perfect for everyday family meals at an affordable price.",
        pricePerKilo: 42,
        benefits: [
            { icon: "🌾", text: "Natural Grain" },
            { icon: "🍃", text: "Natural Flavor" },
            { icon: "💰", text: "Budget Friendly" },
            { icon: "🍚", text: "Everyday Cooking" }
        ]
    },
    glutinous: {
        name: "Glutinous Rice",
        image: "images/glutinous.jpg",
        description: "Sticky rice with a soft and chewy texture. Perfect for traditional Filipino delicacies, kakanin, and desserts.",
        pricePerKilo: 75,
        benefits: [
            { icon: "🍡", text: "Perfect for Kakanin" },
            { icon: "☁️", text: "Soft, Sticky Texture" },
            { icon: "🏅", text: "Premium Quality" },
            { icon: "🍰", text: "Dessert Favorite" }
        ]
    },
    kuhako: {
        name: "Kuhako Rice",
        image: "images/kuhako.jpg",
        description: "A versatile rice variety suitable for everyday meals and different cooking styles. Reliable quality for homes and businesses.",
        pricePerKilo: 75,
        benefits: [
            { icon: "🌱", text: "Quality Grains" },
            { icon: "☁️", text: "Soft Texture" },
            { icon: "🏅", text: "Premium Quality" },
            { icon: "🍚", text: "Everyday Cooking" }
        ]
    }
};


// -----------------------------------------------------
// PART 2: PRODUCTS PAGE - clicking a card updates details
// -----------------------------------------------------

// Turn a number into a peso price, for example 1375 -> "₱1,375"
function formatPrice(amount) {
    return "₱" + amount.toLocaleString("en-PH");
}

// Fill the details panel with the chosen product
function showProduct(productKey) {
    const product = products[productKey];
    if (!product) {
        return; // unknown key, do nothing
    }

    // Name, image and description
    document.getElementById("detail-name").textContent = product.name;
    document.getElementById("detail-image").src = product.image;
    document.getElementById("detail-image").alt = product.name;
    document.getElementById("detail-description").textContent = product.description;

    // Prices: 25kg and 50kg sacks are calculated from the price per kilo
    document.getElementById("detail-price-kilo").textContent = formatPrice(product.pricePerKilo);
    document.getElementById("detail-price-25").textContent = formatPrice(product.pricePerKilo * 25);
    document.getElementById("detail-price-50").textContent = formatPrice(product.pricePerKilo * 50);

    // The Inquire Now button in the panel opens the contact page for this rice
    document.getElementById("detail-inquire").href = "contact.html?product=" + productKey;

    // "Why Choose This Rice?" heading
    document.getElementById("detail-why").textContent = "Why Choose " + product.name + "?";

    // Four benefits (icon + text)
    for (let i = 0; i < 4; i++) {
        document.getElementById("benefit-icon-" + (i + 1)).textContent = product.benefits[i].icon;
        document.getElementById("benefit-text-" + (i + 1)).textContent = product.benefits[i].text;
    }

    // Active state: remove it from every card, then add it to the chosen one
    const cards = document.querySelectorAll(".product-card");
    cards.forEach(function (card) {
        card.classList.remove("active");
        if (card.dataset.product === productKey) {
            card.classList.add("active");
        }
    });
}

// Fade the panel out, change the content, then fade back in
function changeProduct(productKey) {
    const panel = document.getElementById("product-details");
    panel.classList.add("fade");

    setTimeout(function () {
        showProduct(productKey);
        panel.classList.remove("fade");
    }, 250);
}

// Only run this part if we are on the products page
const productCards = document.querySelectorAll(".product-card");

if (productCards.length > 0) {
    // Make every card clickable
    productCards.forEach(function (card) {
        card.addEventListener("click", function () {
            changeProduct(card.dataset.product);
        });
    });

    // Inquire Now buttons: go to the contact page with the product name
    const inquireButtons = document.querySelectorAll(".inquire-btn");
    inquireButtons.forEach(function (button) {
        button.addEventListener("click", function (event) {
            event.stopPropagation(); // do not also trigger the card click
            const card = button.closest(".product-card");
            const key = card ? card.dataset.product : button.dataset.product;
            window.location.href = "contact.html?product=" + key;
        });
    });

    // If the link was product.html?product=black, open that product.
    // Otherwise show Jasmine Rice first.
    const params = new URLSearchParams(window.location.search);
    const requested = params.get("product");
    showProduct(products[requested] ? requested : "jasmine");
}


// -----------------------------------------------------
// PART 3: CONTACT PAGE - form and product inquiry
// -----------------------------------------------------
const contactForm = document.getElementById("contact-form");

if (contactForm) {
    // If we came from an Inquire Now button, fill in the message
    const params = new URLSearchParams(window.location.search);
    const requested = params.get("product");
    if (products[requested]) {
        document.getElementById("contact-message").value =
            "Hello, I would like to inquire about " + products[requested].name + ".";
    }

    contactForm.addEventListener("submit", function (event) {
        event.preventDefault(); // stay on the page (no server yet)
        const note = document.getElementById("contact-note");
        note.textContent = "Thank you! Your message was received. We will contact you soon.";
        contactForm.reset();
    });
}


// -----------------------------------------------------
// PART 4: ACCOUNTS AND USER PROFILES (saved in the browser)
// -----------------------------------------------------
// Demo storage using localStorage. Passwords are stored as plain text here,
// so connect a real database/server before going live.
const USERS_KEY = "rice_users";
const SESSION_KEY = "rice_session";

function getUsers() {
    try {
        return JSON.parse(localStorage.getItem(USERS_KEY)) || {};
    } catch (e) {
        return {};
    }
}

function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getCurrentUsername() {
    return localStorage.getItem(SESSION_KEY);
}

function getCurrentUser() {
    const name = getCurrentUsername();
    const users = getUsers();
    return name && users[name] ? users[name] : null;
}

// Every account has a profile. This makes sure one always exists.
function newProfile(username) {
    return {
        displayName: username,
        email: "",
        phone: "",
        address: ""
    };
}

function formatDate(isoString) {
    if (!isoString) {
        return "—";
    }
    return new Date(isoString).toLocaleString("en-PH", {
        year: "numeric", month: "short", day: "numeric",
        hour: "numeric", minute: "2-digit"
    });
}

// Header: replace the "Login" button with the user's profile link
const headerLoginBtn = document.querySelector('header a.btn[href="login.html"]');
if (headerLoginBtn && getCurrentUser()) {
    const user = getCurrentUser();
    headerLoginBtn.href = "profile.html";
    headerLoginBtn.textContent = "👤 " + (user.profile.displayName || user.username);
}

const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");

if (loginForm && signupForm) {
    // Already logged in? Go straight to the profile.
    if (getCurrentUser()) {
        window.location.href = "profile.html";
    }

    // "Sign Up" link: show the sign up form
    document.getElementById("show-signup").addEventListener("click", function (event) {
        event.preventDefault();
        loginForm.classList.add("hidden");
        signupForm.classList.remove("hidden");
    });

    // "Login" link: show the login form
    document.getElementById("show-login").addEventListener("click", function (event) {
        event.preventDefault();
        signupForm.classList.add("hidden");
        loginForm.classList.remove("hidden");
    });

    // Login: check the account, then open the user's profile
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const note = document.getElementById("login-note");
        const username = document.getElementById("login-username").value.trim();
        const password = document.getElementById("login-password").value;
        const users = getUsers();
        const user = users[username];

        if (!user || user.password !== password) {
            note.textContent = "Wrong username or password.";
            note.classList.add("error");
            return;
        }

        // Make sure the profile exists, then record this login
        if (!user.profile) {
            user.profile = newProfile(username);
        }
        user.loginCount = (user.loginCount || 0) + 1;
        user.lastLogin = new Date().toISOString();
        users[username] = user;
        saveUsers(users);
        localStorage.setItem(SESSION_KEY, username);

        note.classList.remove("error");
        note.textContent = "Welcome back! Opening your profile...";
        window.location.href = "profile.html";
    });

    // Sign up: check passwords, then create the account and its profile
    signupForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const note = document.getElementById("signup-note");
        const username = document.getElementById("signup-username").value.trim();
        const password = document.getElementById("signup-password").value;
        const repeat = document.getElementById("signup-repeat").value;
        const users = getUsers();

        if (password !== repeat) {
            note.textContent = "Passwords do not match.";
            note.classList.add("error");
        } else if (users[username]) {
            note.textContent = "That username is already taken.";
            note.classList.add("error");
        } else {
            users[username] = {
                username: username,
                password: password,
                createdAt: new Date().toISOString(),
                lastLogin: null,
                loginCount: 0,
                profile: newProfile(username)
            };
            saveUsers(users);
            note.textContent = "Account created! You can now log in.";
            note.classList.remove("error");
            signupForm.reset();
        }
    });
}


// -----------------------------------------------------
// PART 5: PROFILE PAGE
// -----------------------------------------------------
const profileForm = document.getElementById("profile-form");

if (profileForm) {
    const user = getCurrentUser();

    // Not logged in: send to the login page
    if (!user) {
        window.location.href = "login.html";
    } else {
        const shownName = user.profile.displayName || user.username;

        document.getElementById("profile-avatar").textContent = shownName.charAt(0).toUpperCase();
        document.getElementById("profile-title").textContent = shownName;
        document.getElementById("profile-username").textContent = "@" + user.username;
        document.getElementById("stat-member").textContent = formatDate(user.createdAt);
        document.getElementById("stat-last").textContent = formatDate(user.lastLogin);
        document.getElementById("stat-count").textContent = user.loginCount || 0;

        document.getElementById("profile-name").value = user.profile.displayName || "";
        document.getElementById("profile-email").value = user.profile.email || "";
        document.getElementById("profile-phone").value = user.profile.phone || "";
        document.getElementById("profile-address").value = user.profile.address || "";

        // Save changes
        profileForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const users = getUsers();
            const me = users[user.username];
            me.profile = {
                displayName: document.getElementById("profile-name").value.trim() || user.username,
                email: document.getElementById("profile-email").value.trim(),
                phone: document.getElementById("profile-phone").value.trim(),
                address: document.getElementById("profile-address").value.trim()
            };
            saveUsers(users);
            document.getElementById("profile-title").textContent = me.profile.displayName;
            document.getElementById("profile-avatar").textContent = me.profile.displayName.charAt(0).toUpperCase();
            const headerBtn = document.querySelector('header a.btn[href="profile.html"]');
            if (headerBtn) {
                headerBtn.textContent = "👤 " + me.profile.displayName;
            }
            document.getElementById("profile-note").textContent = "Profile saved.";
        });

        // Logout
        document.getElementById("logout-btn").addEventListener("click", function () {
            localStorage.removeItem(SESSION_KEY);
            window.location.href = "login.html";
        });
    }
}
