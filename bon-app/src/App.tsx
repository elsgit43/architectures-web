import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './Layout';
import { Suspense, lazy } from 'react';

// Lazy loading des pages
const Home = lazy(() => import('./Pages/home'));
const Favorites = lazy(() => import('./Pages/favorites'));
const Profil = lazy(() => import('./Pages/profile'));
const Recipe = lazy(() => import('./Pages/recipe'));

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Chargement...</div>}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/profile" element={<Profil />} />
            <Route path="/recipe/:id" element={<Recipe />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
