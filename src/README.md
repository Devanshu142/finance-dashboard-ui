# Finance Dashboard UI

## Overview
A responsive finance dashboard built with React, Vite, Tailwind CSS, Recharts, and Lucide React.

This project allows users to:
- view financial summaries
- explore transactions
- understand spending patterns
- interact with a simple role-based interface

The project is frontend-only and uses mock data with localStorage persistence.

## Features
- Summary cards for Total Balance, Income, Expenses, and Current Role
- Balance Trend chart
- Spending Breakdown chart
- Income vs Expense chart
- Transactions table with:
  - search
  - filter by type
  - filter by category
  - sorting
- Role-based UI:
  - Viewer: read-only access
  - Admin: can add, edit, and delete transactions
- Insights section
- Dark mode
- Export to CSV and JSON
- Empty state handling
- LocalStorage persistence

## Tech Stack
- React
- Vite
- Tailwind CSS
- Recharts
- Lucide React

## Project Structure
src/
- App.jsx
- main.jsx
- index.css

## How to Run
1. Install dependencies:
   npm install

2. Start the development server:
   npm run dev

3. Open the local URL shown in the terminal.

## Approach
- Built the UI using reusable sections and clean layout patterns
- Managed application state with React hooks:
  - useState
  - useMemo
  - useEffect
- Used localStorage to persist transactions across refreshes
- Used Recharts for data visualization
- Added role simulation on the frontend for demonstration

## Notes
- This project does not use a backend
- Role-based access is simulated in the UI
- Transaction data is mock data stored in localStorage

## Future Improvements
- Backend/API integration
- Authentication
- Real user accounts
- Pagination for large transaction lists
- More advanced analytics and reporting
- Better mobile interactions