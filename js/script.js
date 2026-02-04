$(document).ready(function () {

    // --- Theme Switching Logic ---
    function applyTheme(theme) {
        $('body').removeClass('dark-theme blue-theme green-theme');
        if (theme && theme !== 'light') {
            $('body').addClass(theme);
        }
        localStorage.setItem('siteTheme', theme);
        $('#themeSelector').val(theme);
    }

    // Load saved theme on startup
    const savedTheme = localStorage.getItem('siteTheme') || 'light';
    applyTheme(savedTheme);

    // Event listener for theme change
    $('#themeSelector').on('change', function () {
        const selectedTheme = $(this).val();
        applyTheme(selectedTheme);
    });

    // --- Authentication Logic ---
    function checkAuth() {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            $('.guest-only').addClass('d-none');
            $('.user-only').removeClass('d-none');
            $('#navUserName').text(user.name);
            $('#navUserEmail').text(user.email);
        } else {
            $('.guest-only').removeClass('d-none');
            $('.user-only').addClass('d-none');
        }
    }

    // Run auth check on load
    checkAuth();

    // Logout Handler
    $('#logoutBtn').click(function (e) {
        e.preventDefault();
        localStorage.removeItem('user');
        alert('Logged out successfully!');
        window.location.href = 'login.html';
    });

    // --- Menu Page Logic (AJAX + XML) ---
    if ($('#menu-container').length) {
        loadMenuData();
    }

    function loadMenuData() {
        $.ajax({
            type: "GET",
            url: "xml/menu.xml",
            dataType: "xml",
            success: function (xml) {
                renderMenu(xml);
            },
            error: function () {
                $('#menu-container').html('<div class="alert alert-danger">Error loading menu data. Please ensure you are running this on a web server (not file://).</div>');
            }
        });
    }

    function renderMenu(xml) {
        const container = $('#menu-container');
        container.empty();

        // Store all items for search
        window.menuItems = [];
        window.allDishes = []; // Store all dishes for restoration

        $(xml).find('item').each(function () {
            const id = $(this).find('id').text();
            const name = $(this).find('name').text();
            const category = $(this).find('category').text();
            const price = $(this).find('price').text();
            const image = $(this).find('image').text();
            const description = $(this).find('description').text();

            // New fields
            const city = $(this).find('city').text();
            const area = $(this).find('area').text();
            const restaurant = $(this).find('restaurant').text();

            const item = { id, name, category, price, image, description, city, area, restaurant };
            window.menuItems.push(item);
            window.allDishes.push(item);

            // Initially render nothing or all? 
            // Request says: "expected results are all the dish from avadh dining hall display"
            // So we should probably show all initially or wait for filter?
            // Let's show all initially for better UX, filtered later.
            const card = createCardHTML(name, category, price, image, description);
            container.append(card);
        });

        // Populate City Dropdown
        populateCityDropdown();
    }

    // --- Dropdown Logic ---
    function populateCityDropdown() {
        const cities = [...new Set(window.menuItems.map(item => item.city))].sort();
        const citySelect = $('#citySelect');

        citySelect.html('<option value="">Select City</option>');
        cities.forEach(city => {
            citySelect.append(`<option value="${city}">${city}</option>`);
        });
    }

    // Event Listener for City
    $('#citySelect').on('change', function () {
        const selectedCity = $(this).val();
        $('#areaSelect').html('<option value="">Select Area</option>').prop('disabled', true);
        $('#restaurantSelect').html('<option value="">Select Restaurant</option>').prop('disabled', true);

        if (selectedCity) {
            const areas = [...new Set(window.menuItems
                .filter(item => item.city === selectedCity)
                .map(item => item.area))].sort();

            const areaSelect = $('#areaSelect');
            areas.forEach(area => {
                areaSelect.append(`<option value="${area}">${area}</option>`);
            });
            areaSelect.prop('disabled', false);
        }
        filterMenu();
    });

    // Event Listener for Area
    $('#areaSelect').on('change', function () {
        const selectedCity = $('#citySelect').val();
        const selectedArea = $(this).val();

        $('#restaurantSelect').html('<option value="">Select Restaurant</option>').prop('disabled', true);

        if (selectedCity && selectedArea) {
            const restaurants = [...new Set(window.menuItems
                .filter(item => item.city === selectedCity && item.area === selectedArea)
                .map(item => item.restaurant))].sort();

            const restaurantSelect = $('#restaurantSelect');
            restaurants.forEach(rest => {
                restaurantSelect.append(`<option value="${rest}">${rest}</option>`);
            });
            restaurantSelect.prop('disabled', false);
        }
        filterMenu();
    });

    // Event Listener for Restaurant
    $('#restaurantSelect').on('change', function () {
        filterMenu();
    });

    function filterMenu() {
        const city = $('#citySelect').val();
        const area = $('#areaSelect').val();
        const restaurant = $('#restaurantSelect').val();

        const container = $('#menu-container');
        container.empty();

        const filteredItems = window.menuItems.filter(item => {
            return (!city || item.city === city) &&
                (!area || item.area === area) &&
                (!restaurant || item.restaurant === restaurant);
        });

        if (filteredItems.length === 0) {
            container.html('<div class="col-12 text-center text-muted">No items found for this selection.</div>');
        } else {
            filteredItems.forEach(item => {
                container.append(createCardHTML(item.name, item.category, item.price, item.image, item.description));
            });
        }
    }

    function createCardHTML(name, category, price, image, description) {
        return `
            <div class="col-md-4 mb-4 menu-item" data-name="${name.toLowerCase()}" data-category="${category.toLowerCase()}">
                <div class="card h-100 shadow-sm">
                    <img src="${image}" class="card-img-top" alt="${name}" style="height: 200px; object-fit: cover;">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <h5 class="card-title mb-0">${name}</h5>
                            <span class="badge bg-primary">$${price}</span>
                        </div>
                        <h6 class="card-subtitle mb-2 text-muted">${category}</h6>
                        <p class="card-text">${description}</p>
                        <button class="btn btn-outline-primary btn-sm w-100 btn-add-cart">Add to Cart</button>
                    </div>
                </div>
            </div>
        `;
    }

    // --- Search Functionality (Existing text search adapted) ---
    $('#searchInput').on('keyup', function () {
        const value = $(this).val().toLowerCase();
        // Search matches within CURRENTLY visible items (filtered by dropdowns)
        $('.menu-item').filter(function () {
            $(this).toggle($(this).data('name').indexOf(value) > -1 || $(this).data('category').indexOf(value) > -1)
        });
    });

    // --- Online Order Logic ---

    // Platform Selection
    $('#platformSelect').on('change', function () {
        if ($(this).val()) {
            populateOnlineCityDropdown();
            $('#onlineCitySelect').prop('disabled', false);
            $('#online-order-container').html('<div class="col-12 text-center text-muted">Please select a location and restaurant.</div>');
        } else {
            $('#onlineCitySelect').prop('disabled', true).val('');
            $('#onlineAreaSelect').prop('disabled', true).val('');
            $('#onlineRestaurantSelect').prop('disabled', true).val('');
            $('#online-order-container').html('<div class="col-12 text-center text-muted">Select a platform to start ordering.</div>');
        }
    });

    function populateOnlineCityDropdown() {
        // Reuse data from window.menuItems (contains all XML data)
        const cities = [...new Set(window.menuItems.map(item => item.city))].sort();
        const citySelect = $('#onlineCitySelect');

        citySelect.html('<option value="">Select City</option>');
        cities.forEach(city => {
            citySelect.append(`<option value="${city}">${city}</option>`);
        });
    }

    // Online City Selection
    $('#onlineCitySelect').on('change', function () {
        const selectedCity = $(this).val();
        $('#onlineAreaSelect').html('<option value="">Select Area</option>').prop('disabled', true);
        $('#onlineRestaurantSelect').html('<option value="">Select Restaurant</option>').prop('disabled', true);
        $('#online-order-container').html('<div class="col-12 text-center text-muted">Please select an area.</div>');

        if (selectedCity) {
            const areas = [...new Set(window.menuItems
                .filter(item => item.city === selectedCity)
                .map(item => item.area))].sort();

            const areaSelect = $('#onlineAreaSelect');
            areas.forEach(area => {
                areaSelect.append(`<option value="${area}">${area}</option>`);
            });
            areaSelect.prop('disabled', false);
        }
    });

    // Online Area Selection
    $('#onlineAreaSelect').on('change', function () {
        const selectedCity = $('#onlineCitySelect').val();
        const selectedArea = $(this).val();
        $('#onlineRestaurantSelect').html('<option value="">Select Restaurant</option>').prop('disabled', true);
        $('#online-order-container').html('<div class="col-12 text-center text-muted">Please select a restaurant.</div>');

        if (selectedCity && selectedArea) {
            const restaurants = [...new Set(window.menuItems
                .filter(item => item.city === selectedCity && item.area === selectedArea)
                .map(item => item.restaurant))].sort();

            const restaurantSelect = $('#onlineRestaurantSelect');
            restaurants.forEach(rest => {
                restaurantSelect.append(`<option value="${rest}">${rest}</option>`);
            });
            restaurantSelect.prop('disabled', false);
        }
    });

    // Online Restaurant Selection
    $('#onlineRestaurantSelect').on('change', function () {
        renderOnlineMenu();
    });

    function renderOnlineMenu() {
        const city = $('#onlineCitySelect').val();
        const area = $('#onlineAreaSelect').val();
        const restaurant = $('#onlineRestaurantSelect').val();

        const container = $('#online-order-container');
        container.empty();

        if (city && area && restaurant) {
            const filteredItems = window.menuItems.filter(item =>
                item.city === city && item.area === area && item.restaurant === restaurant
            );

            if (filteredItems.length === 0) {
                container.html('<div class="col-12 text-center text-muted">No dishes found for this restaurant.</div>');
            } else {
                filteredItems.forEach(item => {
                    container.append(createOnlineOrderCard(item));
                });
            }
        }
    }

    function createOnlineOrderCard(item) {
        return `
            <div class="col-md-4 mb-4">
                <div class="card h-100 shadow-sm border-0">
                    <img src="${item.image}" class="card-img-top" alt="${item.name}" style="height: 200px; object-fit: cover;">
                    <div class="card-body">
                         <div class="d-flex justify-content-between align-items-center mb-2">
                            <h5 class="card-title mb-0">${item.name}</h5>
                            <span class="badge bg-success">$${item.price}</span>
                        </div>
                        <p class="card-text small text-muted">${item.description}</p>
                        <button class="btn btn-primary w-100 btn-order-online" 
                            data-name="${item.name}" 
                            data-city="${item.city}" 
                            data-area="${item.area}" 
                            data-restaurant="${item.restaurant}">
                            Order Now
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // Handle Online Order Click
    $(document).on('click', '.btn-order-online', function () {
        const platform = $('#platformSelect').val();
        const dishName = $(this).data('name');
        const city = $(this).data('city');
        const area = $(this).data('area');
        const restaurant = $(this).data('restaurant');

        const message = `Order Details:\nPlatform: ${platform}\nCity: ${city}\nArea: ${area}\nRestaurant: ${restaurant}\nDish: ${dishName}\n\nThank you for your order!`;

        console.log("--- New Order Placed ---");
        console.log("Platform:", platform);
        console.log("City:", city);
        console.log("Area:", area);
        console.log("Restaurant:", restaurant);
        console.log("Dish:", dishName);

        alert(message);
    });

    // Handle 'Add to Cart' Click
    $(document).on('click', '.btn-add-cart', function () {
        alert("Add to cart successfully");
    });


    // --- Form Validation ---

    // Register Form
    $('#registerForm').submit(function (e) {
        e.preventDefault();
        let valid = true;
        const name = $('#fullName').val();
        const email = $('#email').val();
        const password = $('#password').val();
        const confirmPassword = $('#confirmPassword').val();

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            valid = false;
        }

        if (valid) {
            // Simulate saving user
            alert("Registration Successful! Please login.");
            window.location.href = 'login.html';
        }
    });

    // Login Form
    $('#loginForm').submit(function (e) {
        e.preventDefault();
        const email = $('#email').val();
        const password = $('#password').val();

        if (email && password) {
            // Create dummy user object
            const user = {
                name: email.split('@')[0], // Use part of email as name for demo
                email: email
            };

            // Save to localStorage
            localStorage.setItem('user', JSON.stringify(user));

            alert("Login Successful!");
            window.location.href = 'index.html';
        } else {
            alert("Please fill in all fields.");
        }
    });
});
