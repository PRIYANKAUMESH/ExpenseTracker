
# 💰 Pennywise – Personal Expense Tracker

A responsive Personal Expense Tracker built using React.js that helps users manage their daily income and expenses, monitor spending habits, track monthly budgets, and analyze financial activities through interactive charts.

## 🚀 Project Overview

Pennywise is a frontend-based expense management application developed using React.js. Users can register, log in, add income and expenses, update existing transactions, delete transactions, and view their financial summaries through a dashboard.

The application uses browser LocalStorage to persist user information, login sessions, and transaction records.

## ✨ Features

### 1. User Authentication
- User registration with form validation.
- Login and logout functionality.
- Prevent duplicate email registration.
- Protected routes for authenticated users.
- Separate transaction records for each user.
- Persistent login session using LocalStorage.

### 2. Dashboard
- Total balance overview.
- Total income calculation.
- Total expense calculation.
- Total transaction count.
- Recent transaction history.
- Monthly income and expense summary.
- Interactive financial charts.
- Monthly savings calculation.

### 3. Transaction Management (CRUD Operations)
- Add new income and expense transactions.
- Edit existing transactions.
- Automatically populate existing data when editing.
- Update transaction details without creating duplicate records.
- Delete transactions with confirmation.
- Validate transaction details.
- Automatically update dashboard summaries and charts.

### 4. Search and Filtering
- Search transactions by title.
- Filter by income or expense.
- Filter transactions by category.
- Filter by date.
- Sort transactions by date and amount.

### 5. Budget Management
- Set a monthly spending budget.
- Monitor monthly expenses.
- Display budget progress.
- Show a warning when spending reaches 80% of the budget.

### 6. Data Persistence
- Save user information in LocalStorage.
- Save transactions separately for each user.
- Maintain login sessions.
- Preserve transaction data after page refresh.
- Retain data after closing and reopening the browser using the same browser profile.

### 7. Data Visualization
- Expense category breakdown using a Doughnut Chart.
- Monthly income vs expense comparison using a Bar Chart.
- Dynamic chart updates based on transactions.

### 8. Additional Features
- Export transaction records to CSV.
- Responsive user interface.
- Reusable React components.
- Form validation and notifications.
- Mobile-friendly navigation.

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Application structure |
| CSS3 | Styling |
| JavaScript (ES6+) | Application logic |
| Bootstrap 5 | Responsive UI |
| React.js | Frontend development |
| React Hooks | State and lifecycle management |
| Context API | Global state management |
| React Router | Navigation and routing |
| Chart.js | Data visualization |
| LocalStorage | Client-side data persistence |
| Vite | Development and build tool |
| Git & GitHub | Version control |

## 📂 Project Structure

```text
expense-tracker/
│
├── public/
│
├── src/
│   ├── components/
│   │   ├── AppLayout.jsx
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── SummaryCard.jsx
│   │   ├── TransactionForm.jsx
│   │   ├── TransactionList.jsx
│   │   ├── ExpenseChart.jsx
│   │   └── IncomeExpenseChart.jsx
│   │
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── ExpenseContext.jsx
│   │
│   ├── pages/
│   │   ├── Register.jsx
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Transactions.jsx
│   │   └── Analytics.jsx
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## ⚙️ Installation and Setup

### Prerequisites

Make sure you have installed:

- Node.js
- npm
- Visual Studio Code

### Step 1: Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/expense-tracker.git
```

### Step 2: Navigate to the Project Folder

```bash
cd expense-tracker
```

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Start the Development Server

```bash
npm run dev
```

### Step 5: Open in Browser

Open the local URL displayed in your terminal. Usually:

```text
http://localhost:5173
```

## 📊 Application Workflow

1. Register a new account.
2. Log in using your registered credentials.
3. Access the dashboard.
4. Add income and expense transactions.
5. View your financial summary.
6. Edit or delete existing transactions.
7. Search and filter transaction records.
8. Analyze spending through charts.
9. Set a monthly budget.
10. Export transaction records as CSV.
11. Log out and log in again to access your saved data.

## 💾 LocalStorage Implementation

The application uses browser LocalStorage to maintain data between sessions.

The following data is stored:

- Registered user information.
- Current login session.
- Individual user transaction records.
- Monthly budget information.

Transactions are stored separately for each user to prevent data from different accounts from being mixed.

**Note:** LocalStorage is browser-specific. Data remains available after restarting the computer when using the same browser profile and application origin, provided browser data has not been cleared.

## 🔐 Security Note

This project is developed as a frontend portfolio and learning project.

Authentication and data storage are handled using browser LocalStorage. Passwords stored in LocalStorage are not secure.

For production applications, authentication and sensitive financial information should be handled using a secure backend, database, and proper authorization mechanisms.

## 🎯 Learning Outcomes

Through this project, I practiced:

- Building reusable React components.
- Managing application state using React Hooks.
- Implementing Context API.
- Creating protected routes using React Router.
- Implementing CRUD operations.
- Handling controlled forms and validation.
- Using JavaScript array methods such as `map()`, `filter()`, and `reduce()`.
- Persisting application data using LocalStorage.
- Creating interactive charts.
- Building responsive layouts using Bootstrap.
- Organizing a React project using reusable components and separate folders.

## 👩‍💻 Author

**Priyanka Umesh Chigari**

- GitHub: https://github.com/YOUR_USERNAME
- LinkedIn: https://linkedin.com/in/priyankachigari

---

⭐ If you find this project useful, feel free to star the repository!
