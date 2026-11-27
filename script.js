const books = [
  {
    title: "The Quiet Between",
    author: "Mara Ellis",
    price: 16.99,
    category: "Fiction",
    color: ["#e7b594", "#bb725e"],
    badge: "READER FAVORITE"
  },
  {
    title: "A Brief History of Everything",
    author: "Dr. Leon Park",
    price: 21.50,
    category: "Science",
    color: ["#b6d2cf", "#4b8390"]
  },
  {
    title: "The Everyday Inventor",
    author: "Riley Chen",
    price: 18.00,
    category: "Technology",
    color: ["#a9b5d5", "#606e9d"]
  },
  {
    title: "Small Steps, Big Dreams",
    author: "Nina Williams",
    price: 19.25,
    category: "Biography",
    color: ["#e8c99a", "#b9814c"]
  },
  {
    title: "The Last Lantern",
    author: "June Holloway",
    price: 17.50,
    category: "Mystery",
    color: ["#b8c2ad", "#5a705e"],
    badge: "NEW"
  },
  {
    title: "Letters from the Fog",
    author: "Theo Mercer",
    price: 15.75,
    category: "Mystery",
    color: ["#b6c4d2", "#596e82"],
    badge: "NEW"
  },
  {
    title: "The Midnight Archive",
    author: "Amara Finch",
    price: 20.00,
    category: "Mystery",
    color: ["#d2b4a2", "#8a5e5c"],
    badge: "NEW"
  }
];

const bookGrid = document.querySelector("#book-grid");
const searchInput = document.querySelector("#book-search");
const categoryFilter = document.querySelector("#category-filter");
const emptyState = document.querySelector("#empty-state");
const cartCount = document.querySelector("#cart-count");
const contactForm = document.querySelector("#contact-form");
const formFeedback = document.querySelector("#form-feedback");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector("#nav-links");
let cartItems = 0;

function createCover(book) {
  const title = book.title.toUpperCase().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const [light, dark] = book.color;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="440" viewBox="0 0 360 440">
    <defs><linearGradient id="cover" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${light}"/><stop offset="1" stop-color="${dark}"/></linearGradient></defs>
    <rect width="360" height="440" fill="url(#cover)"/>
    <circle cx="280" cy="90" r="95" fill="#ffffff" opacity=".12"/>
    <path d="M0 330 Q110 250 220 335 T440 300 V440 H0Z" fill="#ffffff" opacity=".12"/>
    <path d="M40 42h280" stroke="#fff" stroke-opacity=".55" stroke-width="2"/>
    <text x="180" y="185" text-anchor="middle" fill="#fffdf5" font-family="Georgia,serif" font-size="25" font-weight="bold">${title}</text>
    <path d="M125 222h110" stroke="#f8e7ae" stroke-width="3"/>
    <text x="180" y="390" text-anchor="middle" fill="#fffdf5" font-family="Arial,sans-serif" font-size="13" letter-spacing="3">${book.author.toUpperCase()}</text>
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function renderBooks() {
  const query = searchInput.value.trim().toLowerCase();
  const selectedCategory = categoryFilter.value;
  const visibleBooks = books.filter((book) => {
    const matchesTitle = book.title.toLowerCase().includes(query);
    const matchesCategory = selectedCategory === "all" || book.category.toLowerCase() === selectedCategory;
    return matchesTitle && matchesCategory;
  });

  bookGrid.innerHTML = visibleBooks.map((book) => `
    <article class="book-card">
      <div class="cover-wrap">
        <img class="book-cover" src="${createCover(book)}" alt="Cover of ${book.title} by ${book.author}" loading="lazy">
        ${book.badge ? `<span class="book-badge">${book.badge}</span>` : ""}
      </div>
      <div class="book-info">
        <span class="book-category">${book.category}</span>
        <h3 title="${book.title}">${book.title}</h3>
        <p class="book-author">by ${book.author}</p>
        <div class="book-bottom">
          <span class="book-price">$${book.price.toFixed(2)}</span>
          <button class="add-button" type="button" data-title="${book.title}" aria-label="Add ${book.title} to cart">Add to cart +</button>
        </div>
      </div>
    </article>
  `).join("");
  emptyState.hidden = visibleBooks.length > 0;
}

searchInput.addEventListener("input", renderBooks);
categoryFilter.addEventListener("change", renderBooks);

document.querySelectorAll(".category-pill").forEach((button) => {
  button.addEventListener("click", () => {
    categoryFilter.value = button.dataset.category;
    renderBooks();
    document.querySelector("#books").scrollIntoView({ behavior: "smooth" });
  });
});

bookGrid.addEventListener("click", (event) => {
  const button = event.target.closest(".add-button");
  if (!button) return;
  cartItems += 1;
  cartCount.textContent = cartItems;
  button.textContent = "Added ✓";
  button.setAttribute("aria-label", `${button.dataset.title} added to cart`);
  window.setTimeout(() => {
    if (button.isConnected) {
      button.textContent = "Add to cart +";
      button.setAttribute("aria-label", `Add ${button.dataset.title} to cart`);
    }
  }, 1200);
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formFeedback.textContent = "";
  if (!contactForm.reportValidity()) return;

  formFeedback.textContent = "Thanks for your note! Your message is ready to send.";
  contactForm.reset();
});

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  navLinks.classList.toggle("is-open", !isExpanded);
});

navLinks.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menuToggle.setAttribute("aria-expanded", "false");
    navLinks.classList.remove("is-open");
  }
});

renderBooks();
