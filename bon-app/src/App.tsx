import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './Pages/home';
import { Favorites } from './Pages/favorites';
import { Profil } from './Pages/profile';
import { Recipe } from './Pages/recipe';
import { Layout } from './Layout';

function App() {
  return(
    <Router> 
      <Routes>
        <Route element={<Layout/>}>
          <Route path="/" element={<Home/>}/>
          <Route path="/favorites" element={<Favorites/>}/>
          <Route path="/profile" element={<Profil/>}/>
          <Route path="/recipe/:id" element={<Recipe/>}/>
        </Route>
      </Routes>
    </Router>
  )
}

export default App;
