import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './page/Login';
import PrivateRoute from './components/PrivateRoute';
import Home from './page/Home';

function App() {

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<PrivateRoute><Home /></PrivateRoute>}/>
          <Route path='/login' element={<Login/>} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
