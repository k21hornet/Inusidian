import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './page/Login';
import PrivateRoute from './components/PrivateRoute';
import Home from './page/Home';
import Register from './page/Register';
import Deck from './page/Deck';

function App() {

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<PrivateRoute><Home /></PrivateRoute>}/>
          <Route path='/login' element={<Login/>} />
          <Route path='/register' element={<Register/>}/>
          <Route path='/deck/:id' element={<PrivateRoute><Deck /></PrivateRoute>}/>
        </Routes>
      </Router>
    </div>
  )
}

export default App
