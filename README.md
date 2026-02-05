# 🍽️ DineXpress - Smart Restaurant System

Welcome to **DineXpress**, a modern, responsive, and interactive restaurant website designed to provide a seamless dining experience. This project demonstrates a frontend-heavy web application using XML for data storage and jQuery for dynamic interactions.

## 📖 Table of Contents
- [About the Project](#about-the-project)
- [Key Features](#key-features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [How to Run](#how-to-run)
- [Usage Guide](#usage-guide)

## 🧐 About the Project
DineXpress is a simulated restaurant management and ordering system. It allows users to browse menus, filter dishes by location (City/Area/Restaurant), and place mock orders. The application features a dynamic theme switcher, user authentication simulation, and a responsive design suitable for desktops and mobile devices.

## ✨ Key Features
*   **Dynamic Menu System**: Fetches menu data efficiently from an XML file (`menu.xml`).
*   **Advanced Search & Filter**:
    *   **3-Level Filtering**: Filter restaurants by **City** → **Area** → **Restaurant**.
    *   **Text Search**: Instantly search for dishes by name or category.
*   **Theme Customization**: Switch between **Light**, **Dark**, **Blue**, and **Green** themes with persistence (saved in browser).
*   **User Accounts (Mock)**:
    *   **Registration & Login**: Sign up and log in simulations.
    *   **Guest vs User View**: Different navigation options based on login status.
*   **Mock Ordering**: Add items to cart or "Order Online" via simulated Swiggy/Zomato integrations.
*   **Responsive Design**: Built with Bootstrap 5 for a mobile-first approach.
*   **Feedback System**: A dedicated page for user feedback.

## 🛠 Technologies Used
*   **HTML5**: Structure and semantic markup.
*   **CSS3**: Custom styling and layout.
*   **Bootstrap 5.3**: Responsive grid system and UI components.
*   **JavaScript (ES6+)**: Application logic.
*   **jQuery 3.6.0**: DOM manipulation and AJAX handling.
*   **XML**: Data storage for menu items (acting as a lightweight database).

## 📂 Project Structure
```text
Fenal_S4/
├── css/
│   └── style.css       # Custom styles for themes and components
├── js/
│   └── script.js       # Main logic (Auth, XML parsing, Filtering)
├── xml/
│   └── menu.xml        # Data source for restaurants and dishes
├── index.html          # specific Home page
├── menu.html           # Menu listing with advanced search
├── login.html          # User login page
├── register.html       # User registration page
├── about.html          # About Us information
├── contact.html        # Contact details
├── feedback.html       # User feedback form
└── README.md           # Project documentation
```

## ⚙️ Prerequisites
Because this project uses **AJAX** to fetch XML data, browsers will block the request due to CORS (Cross-Origin Resource Sharing) policies if you open the `index.html` file directly (i.e., `file://` protocol).

**You must run this project on a local web server.**

### Recommended Tools:
*   **VS Code Live Server Extension** (Easiest)
*   Python HTTP Server (`python -m http.server`)
*   XAMPP / WAMP / MAMP

## 🚀 How to Run

### Method 1: Using VS Code Live Server (Recommended)
1.  Open the project folder (`Fenal_S4`) in **VS Code**.
2.  Install the **Live Server** extension interaction.
3.  Right-click on `index.html` and select **"Open with Live Server"**.
4.  The project will launch in your default browser at `http://127.0.0.1:5500`.

### Method 2: Python Simple HTTP Server
1.  Open your terminal/command prompt.
2.  Navigate to the project directory:
    ```bash
    cd "path/to/Fenal_S4"
    ```
3.  Run the server:
    ```bash
    # Python 3
    python -m http.server 8000
    ```
4.  Open your browser and go to `http://localhost:8000`.

## 📖 Usage Guide

1.  **Home**: Start at `index.html` to see the welcome screen.
2.  **Themes**: Use the dropdown in the navbar to change the look and feel of the site.
3.  **Authentication**:
    *   Go to **Register** to create a dummy account.
    *   Go to **Login** to sign in.
    *   Once logged in, your name appears in the navbar.
4.  **Explore Menu**:
    *   Navigate to **Menu & Search**.
    *   Use the **City** dropdown to start filtering locations.
    *   Select an **Area** and then a **Restaurant** to see specific dishes.
    *   Or, use the **Search Bar** to find "Paneer", "Pizza", etc. across all loaded items.
5.  **Order**: Click "Order Now" on items to simulate an external platform order (Swiggy/Zomato).