# Bot Frontend

A modern React-based frontend application for the Bot project, built with React, Tailwind CSS, and other modern web technologies.

## 🚀 Features

- Modern React-based user interface
- Responsive design with Tailwind CSS
- Form handling with @tailwindcss/forms
- Toast notifications with react-hot-toast
- Date handling with date-fns
- Country/State/City selection with country-state-city
- HTML parsing capabilities with html-react-parser
- Icon support with lucide-react

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## 🛠️ Installation

1. Clone the repository:

```bash
git clone [repository-url]
cd secretecho-frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory and add your environment variables:

```env
REACT_APP_API_URL=your_api_url_here
```

## 🚀 Development

To start the development server:

```bash
npm run dev
```

This will start the development server at `http://localhost:3000`.

## 🏗️ Building for Production

To create a production build:

```bash
npm run build
```

To serve the production build:

```bash
npm start
```

```bash
npm test
```

## 📁 Project Structure

```
ca-bot-frontend/
├── public/              # Static files
├── src/                 # Source files
│   ├── components/      # React components
│   ├── context/         # React context providers
│   ├── App.js          # Main application component
│   ├── index.js        # Application entry point
│   └── index.css       # Global styles
├── .env                # Environment variables
├── .env.development    # Development environment variables
├── package.json        # Project dependencies and scripts
└── tailwind.config.js  # Tailwind CSS configuration
```

## 🛠️ Technologies Used

- React 18
- Tailwind CSS
- React Router DOM
- Axios for API calls
- React Hot Toast for notifications
- Date-fns for date manipulation
- Country-State-City for location selection
- HTML React Parser for HTML parsing
- Lucide React for icons
