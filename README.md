# React Native Expense Tracker

A mobile and backend monorepo for an **Expense Tracker** application built with React Native (mobile) and Node/Express (backend).  
Track your income, expenses, and generate analytics, all in one app.

---

## 🧩 Repository Structure

react-native-expense-tracker/
├── backend/ # Node / Express REST API
├── mobile/ # React Native / Expo mobile app
├── README.md
└── .gitignore

yaml
Copy code

- **backend/**: server-side API, database logic, authentication, endpoints  
- **mobile/**: the mobile front-end application consuming the API  
- **.gitignore**: ignores node_modules, build artifacts, environment files, etc.  

---

## 📦 Features

- Add, edit, delete income & expense entries  
- Categorize transactions (e.g. Food, Transport, Bills)  
- View transaction history  
- Analytics & charts (e.g. monthly spending)  
- Sync data between backend and mobile  
- Offline support / local persistence (if implemented)  
- User authentication (if implemented)  

---

## ⚙️ Setup & Installation

### Prerequisites

- Node.js (v14+ recommended)  
- npm or yarn  
- Expo CLI (if using Expo for mobile)  
- A database (e.g. MongoDB, PostgreSQL) or any configured in backend  

### Backend Setup

1. Go to the backend folder  
   ```bash
   cd backend
Install dependencies

bash
Copy code
npm install
# or
yarn install
Setup environment variables
Create a .env file (or use .env.example) and include variables like:

ini
Copy code
PORT=3000
DB_URI=<your-database-connection-string>
JWT_SECRET=<your-secret-key>
Run backend server

bash
Copy code
npm start
# or
yarn start
The backend should now run (e.g. at http://localhost:3000)

Mobile Setup
Go to the mobile folder

bash
Copy code
cd mobile
Install dependencies

bash
Copy code
npm install
# or
yarn install
Update API endpoint
In your mobile app’s config (e.g. .env or a constants file), set the backend base URL (for development, maybe http://localhost:3000 or your local IP).

Start the mobile app

bash
Copy code
expo start
# or
npm start
# or
yarn start
Launch on simulator or physical device (via Expo)

🛠 Usage Examples
Add a transaction
Through your mobile UI, hit “Add Transaction,” choose type (Expense / Income), category, amount, date, and save.

View analytics
See charts or graphs summarizing performance (monthly totals, category breakdowns).

Sync / fetch data
Mobile app should fetch data from the backend’s REST endpoints (e.g. GET /transactions, POST /transactions).

💡 Contributing
If you’d like to contribute:

Fork the repository

Create a branch: git checkout -b feature/your-feature

Make changes & commit: git commit -m "Add my feature"

Push branch: git push origin feature/your-feature

Open a Pull Request

Please make sure your changes are tested and match the coding style.

📝 Notes & TODOs
Add error handling & form validation

Improve offline support & data caching

Add user roles / advanced permissions

Unit & integration tests

UI polish & animations

📞 Contact

For questions or suggestions, feel free to reach out:
📧 earevalo355@gmail.com
