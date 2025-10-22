import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Transactions } from './pages/Transactions';
import { CashFlow } from './pages/CashFlow';
import { Accounts } from './pages/Accounts';
import { Investments } from './pages/Investments';
import { Categories } from './pages/Categories';
import { Recurrings } from './pages/Recurrings';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="cash-flow" element={<CashFlow />} />
          <Route path="accounts" element={<Accounts />} />
          <Route path="investments" element={<Investments />} />
          {/* Placeholder routes */}
          <Route path="goals" element={<div className="p-8 text-white">Goals coming soon</div>} />
          <Route path="categories" element={<Categories />} />
          <Route path="recurrings" element={<Recurrings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
