import { Navigate, Route, Routes } from 'react-router-dom';

import Navigation from './components/Navigation/Navigation';
import Dashboard from './pages/Dashboard/Dashboard';
import ReportarTicket from './pages/ReportarTicket/ReportarTicket';
import TicketList from './pages/TicketList/TicketList';

function App() {
  return (
    <div className="app-layout">
      <Navigation />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/reportar"
            element={<ReportarTicket />}
          />

          <Route
            path="/tickets"
            element={<TicketList />}
          />

          <Route
            path="*"
            element={<Navigate to="/dashboard" replace />}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;