import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Transactions } from './pages/Transactions';
import { CashFlow } from './pages/CashFlow';
import { Accounts } from './pages/Accounts';
import { Investments } from './pages/Investments';
import { Categories } from './pages/Categories';
import { Recurrings } from './pages/Recurrings';
import { Insights } from './pages/Insights';
import { Goals } from './pages/Goals';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

function AppContent() {
  useKeyboardShortcuts();

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="cash-flow" element={<CashFlow />} />
        <Route path="accounts" element={<Accounts />} />
        <Route path="investments" element={<Investments />} />
        <Route path="categories" element={<Categories />} />
        <Route path="recurrings" element={<Recurrings />} />
        <Route path="insights" element={<Insights />} />
        <Route path="goals" element={<Goals />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
