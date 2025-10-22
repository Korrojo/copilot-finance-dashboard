# Copilot Finance Dashboard

A modern, elegant financial dashboard built with React, TypeScript, Vite, and Tailwind CSS. Emulates the beautiful UI/UX of Copilot Money app.

![Dashboard Preview](https://via.placeholder.com/800x400?text=Dashboard+Preview)

## Features

- 🎨 **Modern Dark Theme** - Beautiful dark UI matching Copilot Money's aesthetic
- 📊 **Interactive Dashboard** - Real-time financial data visualization
- 💰 **Multi-Page Navigation** - Dashboard, Transactions, Cash Flow, Accounts, and more
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- ⚡ **Fast Performance** - Built with Vite for lightning-fast development
- 🎯 **Type-Safe** - Full TypeScript support

## Tech Stack

- **Frontend Framework:** React 18
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **Charts:** Recharts
- **Icons:** Lucide React

## Project Structure

```
copilot-finance-dashboard/
├── src/
│   ├── components/
│   │   ├── layout/          # Layout components (Sidebar, Header, etc.)
│   │   ├── ui/              # Reusable UI components
│   │   └── charts/          # Chart components
│   ├── pages/               # Page components
│   │   ├── Dashboard.tsx
│   │   ├── Transactions.tsx
│   │   ├── CashFlow.tsx
│   │   ├── Accounts.tsx
│   │   └── ...
│   ├── types/               # TypeScript type definitions
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Utility functions
│   ├── data/                # Financial data (JSON)
│   ├── App.tsx              # Main app component
│   └── main.tsx             # Entry point
├── public/                  # Static assets
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 20.19+ or 22.12+ (or 21.x will work with warnings)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/copilot-finance-dashboard.git
   cd copilot-finance-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:5173](http://localhost:5173)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Pages

- **Dashboard** - Overview of financial health, budget tracking, assets/debt
- **Transactions** - Detailed transaction list with filters and search
- **Cash Flow** - Income vs spending visualization
- **Accounts** - View all connected accounts and balances
- **Investments** - Portfolio tracking and performance
- **Categories** - Budget management by category
- **Recurrings** - Manage recurring transactions and subscriptions
- **Goals** - Financial goals tracking

## Data Structure

The app uses a JSON data file (`src/data/financial_data.json`) with the following structure:

```typescript
{
  monthly_spending: MonthlySpending[];
  category_spending: CategorySpending[];
  merchant_spending: MerchantSpending[];
  account_spending: AccountSpending[];
  transactions?: Transaction[];
}
```

## Customization

### Adding Your Own Data

Replace the data in `src/data/financial_data.json` with your own financial data exported from Copilot Finance or any other source.

### Theming

Modify the color scheme in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      dark: {
        bg: '#0a0e1a',
        surface: '#141824',
        // ... customize colors
      }
    }
  }
}
```

## Development Roadmap

### Phase 1: Foundation ✅
- [x] Dark theme UI
- [x] Sidebar navigation
- [x] Page routing
- [x] Basic dashboard layout

### Phase 2: Core Features (In Progress)
- [ ] Real data integration
- [ ] Interactive charts (Recharts)
- [ ] Transaction list with filters
- [ ] Budget tracking
- [ ] Search functionality

### Phase 3: Advanced Features
- [ ] Account detail pages
- [ ] Cash flow analysis
- [ ] Recurring transaction management
- [ ] Goals tracking
- [ ] Export functionality (PDF, CSV)
- [ ] Dark/Light theme toggle

### Phase 4: Polish
- [ ] Animations and transitions
- [ ] Mobile responsive improvements
- [ ] Loading states
- [ ] Error handling
- [ ] Unit tests

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Acknowledgments

- Design inspiration from [Copilot Money](https://copilot.money/)
- Built with modern web technologies

---

**Note:** This is a personal finance dashboard template. Make sure to keep your financial data secure and never commit sensitive information to version control.
