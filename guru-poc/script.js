// Property Data
const properties = [
    {
        id: 1,
        title: "Skyline Luxury Penthouse",
        type: "Flat",
        location: "Worli, Mumbai",
        city: "Mumbai",
        price: 85000000,
        priceDisplay: "₹8.5 Cr",
        bhk: "4 BHK",
        area: "3,200 sq.ft",
        bathrooms: 4,
        parking: "3 Cars",
        status: "Ready to Move",
        image: "assets/luxury_flat_1784784073143.jpg"
    },
    {
        id: 2,
        title: "Banjara Hills Royal Villa",
        type: "House",
        location: "Banjara Hills, Hyderabad",
        city: "Hyderabad",
        price: 120000000,
        priceDisplay: "₹12.0 Cr",
        bhk: "5 BHK",
        area: "6,500 sq.ft",
        bathrooms: 6,
        parking: "4 Cars",
        status: "Ready to Move",
        image: "assets/independent_house_1784784084731.jpg"
    },
    {
        id: 3,
        title: "Whitefield Premium Plot",
        type: "Plot",
        location: "Whitefield, Bengaluru",
        city: "Bengaluru",
        price: 25000000,
        priceDisplay: "₹2.5 Cr",
        bhk: "N/A",
        area: "2,400 sq.ft",
        bathrooms: "N/A",
        parking: "N/A",
        status: "New Launch",
        image: "assets/residential_plot_1784784094280.jpg"
    },
    {
        id: 4,
        title: "Vasant Vihar Independent Floor",
        type: "Flat",
        location: "Vasant Vihar, Delhi",
        city: "Delhi",
        price: 45000000,
        priceDisplay: "₹4.5 Cr",
        bhk: "3 BHK",
        area: "2,100 sq.ft",
        bathrooms: 3,
        parking: "2 Cars",
        status: "Under Construction",
        image: "assets/luxury_flat_1784784073143.jpg"
    },
    {
        id: 5,
        title: "Juhu Sea View Apartment",
        type: "Flat",
        location: "Juhu, Mumbai",
        city: "Mumbai",
        price: 150000000,
        priceDisplay: "₹15.0 Cr",
        bhk: "5 BHK",
        area: "4,500 sq.ft",
        bathrooms: 5,
        parking: "4 Cars",
        status: "Ready to Move",
        image: "assets/luxury_flat_1784784073143.jpg"
    },
    {
        id: 6,
        title: "Koregaon Park Bungalow",
        type: "House",
        location: "Koregaon Park, Pune",
        city: "Pune",
        price: 75000000,
        priceDisplay: "₹7.5 Cr",
        bhk: "4 BHK",
        area: "4,000 sq.ft",
        bathrooms: 4,
        parking: "2 Cars",
        status: "Ready to Move",
        image: "assets/independent_house_1784784084731.jpg"
    }
];

let compareList = [];
const MAX_COMPARE = 3;

// DOM Elements
const propertiesGrid = document.getElementById('properties-grid');
const noResults = document.getElementById('no-results');
const searchBtn = document.getElementById('search-btn');
const resetFiltersBtn = document.getElementById('reset-filters');
const locationSelect = document.getElementById('location-select');
const typeSelect = document.getElementById('type-select');
const budgetSelect = document.getElementById('budget-select');

const compareDrawer = document.getElementById('compare-drawer');
const compareCount = document.getElementById('compare-count');
const compareItemsContainer = document.getElementById('compare-items-container');
const btnCompareAction = document.getElementById('btn-compare-action');
const btnCompareClose = document.getElementById('btn-compare-close');

const compareModal = document.getElementById('compare-modal');
const compareModalBody = document.getElementById('compare-modal-body');
const btnModalClose = document.getElementById('btn-modal-close');

// Render Property Cards
function renderProperties(data) {
    propertiesGrid.innerHTML = '';
    
    if (data.length === 0) {
        propertiesGrid.classList.add('hidden');
        noResults.classList.remove('hidden');
        return;
    }
    
    propertiesGrid.classList.remove('hidden');
    noResults.classList.hidden = true;
    noResults.classList.add('hidden');

    data.forEach(prop => {
        const isCompared = compareList.some(item => item.id === prop.id);
        const typeClass = prop.type.toLowerCase();
        
        const card = document.createElement('div');
        card.className = 'property-card';
        card.innerHTML = `
            <div class="card-image-wrapper">
                <span class="card-badge ${typeClass}">${prop.type}</span>
                <button class="btn-compare-add ${isCompared ? 'active' : ''}" onclick="toggleCompare(${prop.id})" title="${isCompared ? 'Remove from compare' : 'Add to compare'}">
                    <i class="ri-scales-3-line"></i>
                </button>
                <img src="${prop.image}" alt="${prop.title}" loading="lazy">
            </div>
            <div class="card-content">
                <div class="card-price">${prop.priceDisplay}</div>
                <h3 class="card-title" title="${prop.title}">${prop.title}</h3>
                <div class="card-location">
                    <i class="ri-map-pin-line"></i> ${prop.location}
                </div>
                <div class="card-meta">
                    <div><i class="ri-hotel-bed-line"></i> ${prop.bhk}</div>
                    <div><i class="ri-layout-masonry-line"></i> ${prop.area}</div>
                </div>
            </div>
        `;
        propertiesGrid.appendChild(card);
    });
}

// Filter Logic
function filterProperties() {
    const loc = locationSelect.value;
    const type = typeSelect.value;
    const budget = parseInt(budgetSelect.value) || 'All';

    const filtered = properties.filter(prop => {
        const matchLoc = loc === 'All' || prop.city === loc;
        const matchType = type === 'All' || prop.type === type;
        const matchBudget = budget === 'All' || prop.price <= budget;
        return matchLoc && matchType && matchBudget;
    });

    renderProperties(filtered);
    
    // Scroll to properties
    document.getElementById('properties').scrollIntoView({ behavior: 'smooth' });
}

// Compare Logic
window.toggleCompare = function(id) {
    const prop = properties.find(p => p.id === id);
    if (!prop) return;

    const index = compareList.findIndex(item => item.id === id);
    
    if (index > -1) {
        // Remove
        compareList.splice(index, 1);
    } else {
        // Add
        if (compareList.length >= MAX_COMPARE) {
            alert(`You can only compare up to ${MAX_COMPARE} properties at a time.`);
            return;
        }
        compareList.push(prop);
    }

    updateCompareUI();
    // Re-render current filtered view to update compare button states
    const loc = locationSelect.value;
    const type = typeSelect.value;
    const budget = parseInt(budgetSelect.value) || 'All';
    const filtered = properties.filter(p => {
        return (loc === 'All' || p.city === loc) && 
               (type === 'All' || p.type === type) && 
               (budget === 'All' || p.price <= budget);
    });
    renderProperties(filtered);
};

window.removeFromCompare = function(id) {
    const index = compareList.findIndex(item => item.id === id);
    if (index > -1) {
        compareList.splice(index, 1);
        updateCompareUI();
        filterProperties(); // refresh main view buttons
    }
}

function updateCompareUI() {
    compareCount.textContent = compareList.length;
    
    if (compareList.length > 0) {
        compareDrawer.classList.add('show');
    } else {
        compareDrawer.classList.remove('show');
        compareModal.classList.add('hidden');
    }

    btnCompareAction.disabled = compareList.length < 2;

    compareItemsContainer.innerHTML = '';
    
    // Render selected items
    compareList.forEach(prop => {
        const div = document.createElement('div');
        div.className = 'compare-item-mini';
        div.innerHTML = `
            <img src="${prop.image}" alt="Thumb">
            <div>
                <h4>${prop.title}</h4>
                <p>${prop.priceDisplay}</p>
            </div>
            <button class="btn-remove-compare" onclick="removeFromCompare(${prop.id})">
                <i class="ri-close-line"></i>
            </button>
        `;
        compareItemsContainer.appendChild(div);
    });

    // Render placeholders
    for (let i = compareList.length; i < MAX_COMPARE; i++) {
        const ph = document.createElement('div');
        ph.className = 'compare-placeholder';
        ph.innerHTML = `Add property ${i+1}`;
        compareItemsContainer.appendChild(ph);
    }
}

function showCompareModal() {
    compareModalBody.innerHTML = '';
    
    const table = document.createElement('div');
    table.className = 'comparison-table';
    
    compareList.forEach(prop => {
        const col = document.createElement('div');
        col.className = 'comparison-column';
        col.innerHTML = `
            <img src="${prop.image}" class="comp-img" alt="${prop.title}">
            <div class="comp-details">
                <h3>${prop.title}</h3>
                <div class="comp-price">${prop.priceDisplay}</div>
                
                <div class="comp-row">
                    <span class="comp-label">Type</span>
                    <span class="comp-value">${prop.type}</span>
                </div>
                <div class="comp-row">
                    <span class="comp-label">City</span>
                    <span class="comp-value">${prop.city}</span>
                </div>
                <div class="comp-row">
                    <span class="comp-label">Location</span>
                    <span class="comp-value">${prop.location}</span>
                </div>
                <div class="comp-row">
                    <span class="comp-label">Configuration</span>
                    <span class="comp-value">${prop.bhk}</span>
                </div>
                <div class="comp-row">
                    <span class="comp-label">Area</span>
                    <span class="comp-value">${prop.area}</span>
                </div>
                <div class="comp-row">
                    <span class="comp-label">Bathrooms</span>
                    <span class="comp-value">${prop.bathrooms}</span>
                </div>
                <div class="comp-row">
                    <span class="comp-label">Parking</span>
                    <span class="comp-value">${prop.parking}</span>
                </div>
                <div class="comp-row">
                    <span class="comp-label">Status</span>
                    <span class="comp-value">${prop.status}</span>
                </div>
            </div>
        `;
        table.appendChild(col);
    });
    
    compareModalBody.appendChild(table);
    compareModal.classList.remove('hidden');
}

// Event Listeners
searchBtn.addEventListener('click', filterProperties);

resetFiltersBtn.addEventListener('click', () => {
    locationSelect.value = 'All';
    typeSelect.value = 'All';
    budgetSelect.value = 'All';
    renderProperties(properties);
});

btnCompareAction.addEventListener('click', showCompareModal);

btnCompareClose.addEventListener('click', () => {
    compareDrawer.classList.remove('show');
});

btnModalClose.addEventListener('click', () => {
    compareModal.classList.add('hidden');
});

// Filter links in navbar
document.querySelectorAll('.filter-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const type = e.target.getAttribute('data-filter');
        typeSelect.value = type;
        locationSelect.value = 'All';
        budgetSelect.value = 'All';
        filterProperties();
    });
});

// Initialize
renderProperties(properties);
