import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './page/Login';
import PrivateRoute from './components/PrivateRoute';
import Home from './page/Home';
import Register from './page/Register';
import Deck from './page/Deck';
import Card from './page/Card';
import User from './page/User';
import Due from './page/Due';

function App() {

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<PrivateRoute><Home /></PrivateRoute>}/>
          <Route path='/login' element={<Login/>} />
          <Route path='/register' element={<Register/>}/>
          <Route path='/deck/:id' element={<PrivateRoute><Deck /></PrivateRoute>}/>
          <Route path='/deck/:id/review' element={<PrivateRoute><Due /></PrivateRoute>}/>
          <Route path='/card/:id' element={<PrivateRoute><Card /></PrivateRoute>}/>
          <Route path='/user' element={<PrivateRoute><User /></PrivateRoute>}/>
        </Routes>
      </Router>
    </div>
  )
}

export default App
