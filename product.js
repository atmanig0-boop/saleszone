
const API_URL = 'https://fakestoreapi.com/products';

let allProducts = [];
let currentPage = 1;
const productsPerPage = 8;
let filteredProducts = [];

function debug(message) {
    console.log(`[DEBUG] ${message}`);
}

async function loadProducts() {
    try {
        debug('Starting to load products...');
        const productsContainer = document.getElementById('products-container');
        productsContainer.innerHTML = '<div class="loading">Loading products...</div>';
        
        debug('Fetching from API: ' + API_URL);
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        allProducts = await response.json();
        filteredProducts = [...allProducts];
        
        debug(`Loaded ${allProducts.length} products`);
        
        displayProducts();
        setupPagination();
        setupEventListeners();
        
    } catch (error) {
        console.error('Error loading products:', error);
        document.getElementById('products-container').innerHTML = 
            '<div class="loading error">Failed to load products. Please try again later.<br><small>Error: ' + error.message + '</small></div>';
        
        useSampleProducts();
    }
}

function useSampleProducts() {
    debug('Using sample products as fallback');
    allProducts = [
        {
            id: 1,
            title: "Fjallraven Backpack",
            price: 109.95,
            description: "Your perfect pack for everyday use and walks in the forest.",
            category: "men's clothing",
            image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
            rating: { rate: 3.9, count: 120 }
        },
        {
            id: 2,
            title: "Mens Casual Premium Slim Fit T-Shirts",
            price: 22.3,
            description: "Slim-fitting style, contrast raglan long sleeve.",
            category: "men's clothing",
            image: "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg",
            rating: { rate: 4.1, count: 259 }
        },
        {
            id: 3,
            title: "Mens Cotton Jacket",
            price: 55.99,
            description: "Great outerwear jackets for Spring/Autumn/Winter.",
            category: "men's clothing",
            image: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg",
            rating: { rate: 4.7, count: 500 }
        },
        {
            id: 4,
            title: "Mens Casual Slim Fit",
            price: 15.99,
            description: "The color could be slightly different between monitors.",
            category: "men's clothing",
            image: "https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg",
            rating: { rate: 2.1, count: 430 }
        },
        {
            id: 5,
            title: "Gold & Silver Dragon Bracelet",
            price: 695,
            description: "From our Legends Collection.",
            category: "jewelery",
            image: "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg",
            rating: { rate: 4.6, count: 400 }
        },
        {
            id: 6,
            title: "Solid Gold Petite Micropave",
            price: 168,
            description: "Satisfaction Guaranteed.",
            category: "jewelery",
            image: "https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_.jpg",
            rating: { rate: 3.9, count: 70 }
        },
        {
            id: 7,
            title: "White Gold Plated Princess",
            price: 9.99,
            description: "Classic Created Wedding Engagement Solitaire Diamond.",
            category: "jewelery",
            image: "https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_.jpg",
            rating: { rate: 3, count: 400 }
        },
        {
            id: 8,
            title: "Pierced Owl Rose Gold Plated Stainless Steel",
            price: 10.99,
            description: "Rose Gold Plated Double Flared Tunnel Plug Earrings.",
            category: "jewelery",
            image: "https://fakestoreapi.com/img/51UDEzMJVpL._AC_UL640_QL65_ML3_.jpg",
            rating: { rate: 1.9, count: 100 }
        },
        {
            id: 9,
            title: "WD 2TB Elements Portable External Hard Drive",
            price: 64,
            description: "USB 3.0 and USB 2.0 Compatibility",
            category: "electronics",
            image: "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg",
            rating: { rate: 3.3, count: 203 }
        },
        {
            id: 10,
            title: "SanDisk SSD PLUS 1TB Internal SSD",
            price: 109,
            description: "Easy upgrade for faster boot up, shutdown, application loading.",
            category: "electronics",
            image: "https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg",
            rating: { rate: 2.9, count: 470 }
        }
    ];
    
    filteredProducts = [...allProducts];
    displayProducts();
    setupPagination();
    setupEventListeners();
}

function setupEventListeners() {
    debug('Setting up event listeners');
    
    const searchBtn = document.getElementById('search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', filterProducts);
    }
    
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') filterProducts();
        });
    }
    
    const categorySelect = document.getElementById('category-select');
    if (categorySelect) {
        categorySelect.addEventListener('change', filterProducts);
    }
    
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', filterProducts);
    }
    
    const prevPageBtn = document.getElementById('prev-page');
    if (prevPageBtn) {
        prevPageBtn.addEventListener('click', prevPage);
    }
    
    const nextPageBtn = document.getElementById('next-page');
    if (nextPageBtn) {
        nextPageBtn.addEventListener('click', nextPage);
    }
}

function displayProducts() {
    debug('Displaying products');
    const productsContainer = document.getElementById('products-container');
    
    if (!productsContainer) {
        debug('ERROR: products-container not found!');
        return;
    }
    
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToShow = filteredProducts.slice(startIndex, endIndex);
    
    debug(`Showing products ${startIndex + 1} to ${endIndex} of ${filteredProducts.length}`);
    
    if (!productsToShow || productsToShow.length === 0) {
        productsContainer.innerHTML = '<div class="loading">No products found. Try a different search.</div>';
        return;
    }
    
    productsContainer.innerHTML = productsToShow.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.title}" onerror="this.src='https://via.placeholder.com/300x200?text=Product+Image'">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title.length > 50 ? product.title.substring(0, 50) + '...' : product.title}</h3>
                <div class="product-category">${product.category}</div>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="add-to-cart" onclick="addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

function filterProducts() {
    debug('Filtering products');
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const category = document.getElementById('category-select').value;
    const sortBy = document.getElementById('sort-select').value;
    
    filteredProducts = [...allProducts];
    
    if (searchTerm) {
        debug(`Searching for: ${searchTerm}`);
        filteredProducts = filteredProducts.filter(product => 
            product.title.toLowerCase().includes(searchTerm) || 
            (product.description && product.description.toLowerCase().includes(searchTerm))
        );
    }
    
    if (category !== 'all') {
        debug(`Filtering by category: ${category}`);
        filteredProducts = filteredProducts.filter(product => 
            product.category.toLowerCase() === category.toLowerCase()
        );
    }
    
    if (sortBy === 'price-low') {
        debug('Sorting by price: low to high');
        filteredProducts.sort((a, b) => a.price - b.price);
            filteredProducts.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name') {
        debug('Sorting by name: A to Z');
        filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
    }
    
    debug(`Found ${filteredProducts.length} products after filtering`);
    
    currentPage = 1;
    displayProducts();
    setupPagination();
}

function setupPagination() {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const pageInfo = document.getElementById('page-info');
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    
    debug(`Setting up pagination: ${totalPages} total pages, current page: ${currentPage}`);
    
    if (pageInfo) {
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    }
    
    if (prevBtn) {
        prevBtn.disabled = currentPage === 1;
    }
    
    if (nextBtn) {
        nextBtn.disabled = currentPage === totalPages || totalPages === 0;
    }
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        displayProducts();
        setupPagination();
    }
}

function nextPage() {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        displayProducts();
        setupPagination();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    debug('DOM Content Loaded - Initializing products page');
    loadProducts();
});

