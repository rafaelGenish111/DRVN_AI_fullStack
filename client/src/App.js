import './App.css';
import { ThemeProvider } from '@mui/material/styles';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './pages/Home';
import theme from './theme/theme';


function App() {
  return (
    <ThemeProvider theme={theme}>

    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
      </Routes>
   </Router>
    </ThemeProvider>
  );
}

export default App;
