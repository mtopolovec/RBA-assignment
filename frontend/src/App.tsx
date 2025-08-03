import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ClientCards from './components/ClientCard';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/client/:oib/cards" element={<ClientCards />} />
      </Routes>
    </Router>
  );
}

export default App;
