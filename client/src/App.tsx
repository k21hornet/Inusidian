import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import DeckPage from './pages/DeckPage';
import CardPage from './pages/CardPage';
import UserPage from './pages/UserPage';
import DuePage from './pages/DuePage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import HomePage from './pages/HomePage';

function App() {

  return (
    <div className="h-full">
      <Router>
        <Routes>
          <Route path='/' element={<PrivateRoute><HomePage /></PrivateRoute>}/>
          <Route path='/signin' element={<SignInPage/>} />
          <Route path='/signup' element={<SignUpPage/>}/>
          <Route path='/deck/:id' element={<PrivateRoute><DeckPage /></PrivateRoute>}/>
          <Route path='/deck/:id/review' element={<PrivateRoute><DuePage /></PrivateRoute>}/>
          <Route path='/card/:id' element={<PrivateRoute><CardPage /></PrivateRoute>}/>
          <Route path='/user' element={<PrivateRoute><UserPage /></PrivateRoute>}/>
        </Routes>
      </Router>
    </div>
  )
}

export default App
