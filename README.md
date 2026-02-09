# Krishi-Link: Smart Logistics for Indian Agriculture 🚜🌾

**Krishi-Link** is a modern logistics platform prototype designed to bridge the gap between farmers and transport drivers. It aims to reduce post-harvest losses, optimize supply chains, and minimize CO2 emissions by efficiently matching farmer loads with returning empty trucks ("Dead Miles").

## 🌟 Key Features

### 1. 🧑‍🌾 For Farmers (The Calculator)
- **Logistics Calculator**: Calculate potential savings by using Krishi-Link instead of traditional transport.
- **Dynamic Route Pricing**: Real-time price estimation based on weight (kg) and distance (km).
- **Request Booking**: Seamlessly place pickup requests that get broadcasted to nearby drivers.

### 2. 🚛 For Drivers (The Matcher)
- **Dead Mile Monetization**: Turn empty return trips into profitable hauls.
- **Smart Matching**: View available loads filtered by route and proximity.
- **Offline Mode**: Drivers can toggle their availability status to manage their shifts.
- **QR Verification**: Built-in QR scanner to verify bookings at pickup points.
- **Earnings Tracker**: Visualize potential earnings and track completed job history.

### 3. 🏛️ For Ministry/Admin (The Dashboard)
- **Real-Time Analytics Graph**: Dynamic weekly impact graph that updates instantly as orders are placed.
- **Live Operations Feed**: Track active orders, assigned drivers, and fleet status in real-time.
- **Dynamic Metrics**: Live Average Savings and Total Trip counters based on real platform data.
- **User Registry**: Comprehensive database of registered farmers and drivers with detailed activity logs.

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite)
- **Styling**: Tailwind CSS, Lucide React (Icons)
- **Animations**: Framer Motion
- **Charts/Data**: Recharts, React-CountUp
- **State Management**: Context API + LocalStorage Persistence
- **Utilities**: clsx, tailwind-merge

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Anand2k29/Krishi-Link.git
    cd Krishi-Link
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

4.  **Open in Browser**
    Visit `http://localhost:5173` to view the app.

---

## 👤 User Roles & Login

The prototype features a role-based login system. Use the following credentials or register new users:

### **1. Farmer (Green Tab)**
- **Action**: Register/Login as a Farmer.
- **Flow**: Calculate savings -> **Book Now** -> Scan QR (visible after booking) to complete.

### **2. Driver (Purple Tab)**
- **Action**: Register/Login as a Driver.
- **Flow**: Toggle "Online" -> Accept Load -> Complete Work -> View History.

### **3. Admin (Blue Tab)**
- **Action**: Click "Ministry Login".
- **Flow**: View Live Graph -> Monitor Fleet Status -> Review History.

---

## 📱 Mobile First Design
The application is fully responsive, designed with a "Mobile-First" approach to ensure usability for farmers and drivers on the go.

---

## 📄 License
This project is a prototype developed for **Innovit Hackathon 2026** by **Team Zenith**.

### 👥 Team Members
- **Jyotasana** (Project Lead)
- **Arpita**
- **Partha**
- **Anand** (Developer)
