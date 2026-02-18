# Krishi-Link: Smart Logistics for Indian Agriculture 🚜🌾

**Krishi-Link** is a modern logistics platform prototype designed to bridge the gap between farmers and transport drivers. It aims to reduce post-harvest losses, optimize supply chains, and minimize CO2 emissions by efficiently matching farmer loads with returning empty trucks ("Dead Miles").

## 🎥 Project Demo Video
[![Krishi-Link Demo]](https://www.youtube.com/watch?v=jFMc5KHcsjE)

## 🌟 Key Features

### 1. 🧑‍🌾 For Farmers (The Dashboard)
- ****Multilingual Support****: Real-time **English/Hindi** toggle for accessibility across diverse agricultural regions.
- **Logistics Calculator**: Calculate potential savings by using Krishi-Link instead of traditional transport.
- **Weather Integrated Advisory**: Smart weather alerts (Rain, Wind, Heat) based on source village to optimize harvest transport.
- **Real-time Agri-Advisories**: Company-sponsored alerts (Weather, Pests, Tech Tips) from trusted partners like Bayer and Jain Irrigation.
- **WhatsApp Integration**: Share booking receipts directly to WhatsApp for easy record-keeping and coordination.
- **Dynamic Route Pricing**: Real-time price estimation based on weight (kg) and distance (km).
- **Mandi-Specific Market Prices**: Live crop rates that update dynamically based on the selected destination Mandi.
- **Request Booking**: Seamlessly place pickup requests that get broadcasted to nearby drivers.
- **Government Schemes**: A centralized aggregator for the latest agricultural support schemes and subsidies.
- **B2B Quote Marketplace**: View and respond to open bulk procurement requests from buyers with competitive offers.
- **Voice Command Support**: Hands-free voice input for accessibility (supports English/Hindi) across stories and forms.

### 2. 🏨 For B2B Buyers (Wholesale Portal)
- **Direct Procurement**: Secure portal for hotels and retail chains to source directly from verified FPOs.
- **Logistics Integration**: "Ex-Farm" vs "Delivered" pricing with real-time freight estimation.
- **Sustainability (ESG) Tracking**: Carbon mileage reduction and CO2 savings metrics per product listing.
- **FPO Digital Showcase**: Detailed FPO profiles with member counts, verified trust badges, and audit compliance reports.
- **Request Bulk Quote**: Functional inquiry system for large-scale custom procurement contracts (connects to Farmer Marketplace).
- **Payment Transparency**: Dedicated history section to track orders and secure **Escrow Status**.
- **Order Verification**: Integrated **QR Code Scanner** to verify deliveries at the destination.

### 3. 🚛 For Drivers (The Matcher)
- **Gamification & Badges**: Earn achievements like **"CO2 Warrior"**, **"Speedy Delivery"**, and **"Pro Driver"** based on job performance.
- **Dead Mile Monetization**: Turn empty return trips into profitable hauls with a dedicated **Dead Mile Toggle**.
- **Split Load Feature**: Share large B2B loads with a partner driver to optimize capacity and earnings.
- **B2B Contracts Tab**: Access premium, verified bulk loads with higher rates.
- **Smart Matching**: View available loads filtered by route and proximity with **Exclusive Load Locking** (once accepted, a load is hidden from others).
- **QR Verification**: Built-in QR scanner to verify bookings at pickup points.
- **Earnings Tracker**: Visualize potential earnings and track completed job history.

### 4. 🏛️ For Ministry/Admin (The Dashboard)
- **Live Procurement Pipeline**: Real-time view of active contracts, buyer-farmer connections, and delivery status.
- **Sustainability Audit**: Metrics for Direct Sourcing Adoption, Carbon Footprint reduction, and Logistics Optimization.
- **Escrow Liquidity Index**: Financial health monitoring of the platform's secure payment pipeline.

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

### **2. B2B Buyer (Amber Tab)**
- **Action**: Use the "B2B Buyer" button to access the organizational login.
- **Flow**: Direct Procurement -> **Order Sample** -> View **Procurement History** to track escrow.

### **3. Driver (Purple Tab)**
- **Action**: Register/Login as a Driver.
- **Flow**: Toggle "Online" -> Accept Load -> Complete Work -> View History.

### **4. Admin (Blue Tab)**
- **Action**: Click "Ministry Login".
- **Flow**: Monitor **Escrow Pipeline** -> View ESG Analytics -> Track Fleet.

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
- **Anand** 
