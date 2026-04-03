# Lumina Gadgets Inventory Pro 🚀

An advanced, AI-powered inventory management and sales dashboard designed to streamline operations, track stock, and process sales efficiently. Built with modern web technologies, it features an intuitive user interface and intelligent aides like an AI Chatbot and a Global Voice Assistant.

---

## ✨ Key Features

*   📊 **Interactive Dashboard:** Get a bird's-eye view of your business metrics and overall inventory health.
*   📦 **Inventory Management:** Effortlessly add new products, update stock levels individually, or perform bulk updates.
*   💳 **Sales Terminal:** A dedicated interface to handle transactions, automatically reducing stock and logging sales.
*   💬 **AI Chatbot:** An integrated AI assistant to query inventory statuses, answer product questions, and provide data-driven insights.
*   🎙️ **Global Voice Assistant:** Hands-free voice commands to add products, delete items, or update stock on the fly from any page.
*   📱 **Fully Responsive:** Beautifully crafted layouts that work seamlessly across desktop, tablet, and mobile devices.

## 🛠️ Technology Stack

*   **Frontend Framework:** [React 18](https://reactjs.org/)
*   **Build Tool:** [Vite](https://vitejs.dev/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** Custom CSS / Utility classes (TailwindCSS)
*   **AI Integration:** AI Studio / Gemini APIs

## 🚀 Running Locally

**Prerequisites:** Node.js (v18 or higher recommended)

1.  **Clone the repository** (if you haven't already):
    ```bash
    git clone https://github.com/your-username/lumina-gadgets-inventory-pro.git
    cd lumina-gadgets-inventory-pro
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Set the appropriate API keys for the AI integration.
    Create or edit `.env.local` and add:
    ```env
    GEMINI_API_KEY=your_gemini_api_key_here
    ```

4.  **Start the development server:**
    ```bash
    npm run dev
    ```

5.  **Open the app:**
    Navigate to `http://localhost:5173` (or the port Vite provides) in your web browser.

## 📁 Project Structure

```text
├── src/
│   ├── components/      # Reusable UI components (Sidebar, Dashboard, etc.)
│   ├── services/        # API and external service integrations
│   ├── App.tsx          # Main application component and routing logic
│   ├── constants.ts     # Initial states and global constants
│   ├── types.ts         # TypeScript interfaces and type definitions
│   └── index.tsx        # React entry point
├── public/              # Static assets
└── package.json         # Project dependencies and deployment scripts
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check out the [issues page](../../issues).

## 📄 License

This project is open-sourced and available under the [MIT License](LICENSE).
>>>>>>> 9c4ad35 (Initial commit - Lumina Pro Stock Management Prototype)
