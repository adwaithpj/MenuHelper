# 🍽️ Menu Helper

> **Your AI-powered dining companion that instantly finds and explains any dish from restaurant menus**

A beautiful, fast, and intelligent chatbot built with Next.js that revolutionizes how you explore restaurant menus. No more endless scrolling or googling unknown dishes – just ask and discover!

[![Next.js](https://img.shields.io/badge/Next.js-15.3.1-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.0.0-blue?style=flat-square&logo=react)](https://reactjs.org)
[![Google GenAI](https://img.shields.io/badge/Google_GenAI-Powered-green?style=flat-square&logo=google)](https://ai.google.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com)

## ✨ Features

-   🤖 **AI-Powered Chat**: Instant dish recommendations and detailed explanations
-   📸 **Smart Menu Reading**: Upload menu images with OCR powered by Tesseract.js
-   ⚡ **Lightning Fast**: Optimized with Next.js Turbopack for instant responses
-   🎨 **Beautiful UI**: Modern, responsive design with smooth animations
-   🌓 **Dark/Light Mode**: Seamless theme switching for any preference
-   📱 **Mobile Friendly**: Perfect experience on all devices
-   🔍 **Detailed Insights**: Get cooking methods, ingredients, and cultural context

## 🚀 Quick Start

### Prerequisites

-   **Node.js** 18.0 or later
-   **npm** or **yarn** package manager
-   **Google AI API Key** (for GenAI functionality)

### Installation

1. **Clone the repository**

    ```bash
    git clone https://github.com/yourusername/menu-helper.git
    cd menu-helper/client
    ```

2. **Install dependencies**

    ```bash
    npm install
    # or
    yarn install
    ```

3. **Set up environment variables**

    ```bash
    # Create .env.local file
    GOOGLE_AI_API_KEY=your_google_ai_api_key_here
    ```

4. **Run the development server**

    ```bash
    npm run dev
    # or
    yarn dev
    ```

5. **Open your browser**

    Navigate to [http://localhost:3000](http://localhost:3000) and start exploring! 🎉

## 🛠️ Tech Stack

| Technology       | Purpose             | Version |
| ---------------- | ------------------- | ------- |
| **Next.js**      | React Framework     | 15.3.1  |
| **React**        | UI Library          | 19.0.0  |
| **Google GenAI** | AI Chat Engine      | 0.12.0  |
| **Tesseract.js** | OCR for Menu Images | 4.1.1   |
| **Tailwind CSS** | Styling             | 4.0     |
| **Radix UI**     | UI Components       | Latest  |
| **Lucide React** | Icons               | 0.503.0 |

## 💡 How It Works

1. **Upload or Type**: Share a menu photo or type your question
2. **AI Analysis**: Our GenAI processes the menu and understands your preferences
3. **Instant Results**: Get dish recommendations with detailed explanations
4. **Learn More**: Discover cooking methods, ingredients, and cultural background

## 📁 Project Structure

```
client/
├── src/
│   ├── app/
│   │   ├── page.js          # Main application page
│   │   ├── layout.js        # App layout and providers
│   │   ├── providers.jsx    # Theme and context providers
│   │   └── api/             # API routes
│   ├── components/
│   │   ├── Chat.jsx         # Main chat interface
│   │   ├── InputArea.jsx    # Message input component
│   │   ├── Header.jsx       # App header with branding
│   │   ├── ModeToggle.jsx   # Dark/light mode switch
│   │   ├── TypingAnimation.jsx # Smooth typing effects
│   │   ├── WelcomeText.jsx  # Onboarding component
│   │   └── ui/              # Reusable UI components
│   ├── lib/                 # Utility functions
│   └── utils/               # Helper functions
├── public/                  # Static assets
└── package.json            # Dependencies and scripts
```

## 🎯 Commands

| Command         | Description                             |
| --------------- | --------------------------------------- |
| `npm run dev`   | Start development server with Turbopack |
| `npm run build` | Build for production                    |
| `npm run start` | Start production server                 |
| `npm run lint`  | Run ESLint for code quality             |

## 🌟 Key Features Explained

### 🤖 Smart AI Chat

-   Powered by Google's latest GenAI models
-   Context-aware conversations about food and menus
-   Personalized recommendations based on preferences

### 📸 Menu Image Recognition

-   Upload photos of physical or digital menus
-   OCR extracts text with high accuracy
-   AI understands menu structure and dishes

### 🎨 Modern UI/UX

-   Responsive design that works everywhere
-   Smooth animations and micro-interactions
-   Clean, intuitive interface focused on conversation

### ⚡ Performance Optimized

-   Next.js 15 with Turbopack for faster development
-   Optimized image loading and lazy loading
-   Efficient state management and caching

## 🤝 Contributing

We welcome contributions! Please feel free to submit issues and pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

-   Google AI for powerful GenAI capabilities
-   Vercel for Next.js and hosting platform
-   Tesseract.js team for OCR functionality
-   Radix UI for accessible components

---

<div align="center">

**Made with ❤️ for food lovers everywhere**

[Report Bug](https://github.com/adwaithpj/MenuHelper/issues) • [Request Feature](https://github.com/adwaithpj/MenuHelper/issues) • [Documentation](https://github.com/adwaithpj/MenuHelper/wiki)

</div>
