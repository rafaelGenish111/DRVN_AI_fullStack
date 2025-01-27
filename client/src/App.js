import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import DesignPanel from './pages/DesignPanel';
import Dashboard from './pages/Dashboard';
import { DesignProvider } from './context/DesignContext';

const operatorId = '9DvovMak0D'

function App() {

  return (
    <DesignProvider>
      <Router>
        <Routes>
          <Route path='/' element={<Home operatorId={operatorId} />} />
          <Route path='/design-panel' element={<DesignPanel />} />
          <Route path='/dashboard' element={<Dashboard />} />
        </Routes>
      </Router>
    </DesignProvider>
  );
}

export default App;
