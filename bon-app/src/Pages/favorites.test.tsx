// src/Pages/favorites.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router-dom';
import { Favorites } from './favorites';
import Cookies from 'js-cookie';
import defaultImage from '../assets/default-image.png';

jest.mock('js-cookie');
const mockFetch = jest.fn();

let originalFetch: typeof fetch; // Type explicite pour originalFetch

beforeAll(() => {
  originalFetch = global.fetch;
  global.fetch = mockFetch;
});

afterAll(() => {
  global.fetch = originalFetch;
});

describe('Favorites Component', () => {

  beforeEach(() => {
    mockFetch.mockReset(); // Réinitialise le mock avant chaque test
    (Cookies.get as jest.Mock).mockReset(); // Réinitialise le mock de Cookies.get
  });


  it('affiche un message de chargement', () => {
    (Cookies.get as jest.Mock).mockReturnValue('fake-token');
    mockFetch.mockImplementationOnce(() => new Promise(() => {}));

    render(<BrowserRouter><Favorites /></BrowserRouter>);

    expect(screen.getByText(/Chargement/i)).toBeInTheDocument();
  });

  it("affiche une erreur si l'utilisateur n'est pas connecté", async () => {
    (Cookies.get as jest.Mock).mockReturnValue(undefined);

    render(<BrowserRouter><Favorites /></BrowserRouter>);

    await waitFor(() => expect(screen.getByText(/vous devez être connecté/i)).toBeInTheDocument());
  });

  it('affiche les recettes favorites', async () => {
    (Cookies.get as jest.Mock).mockReturnValue('fake-token');
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ([{ recipe: { id: '1', name: 'Recette 1', description: 'Description 1', image_url: 'image1.jpg' } }]),
    });

    render(
      <MemoryRouter initialEntries={['/favorites']}>
        <Routes>
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/recipe/:id" element={<div>Page recette</div>} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText(/Recette 1/i)).toBeInTheDocument());
  });

  it('gère les erreurs de récupération des données', async () => {
    (Cookies.get as jest.Mock).mockReturnValue('fake-token');
    mockFetch.mockRejectedValueOnce(new Error('Erreur API'));

    render(<BrowserRouter><Favorites /></BrowserRouter>);

    await waitFor(() => expect(screen.getByText(/Erreur : Erreur API/i)).toBeInTheDocument());
  });

  it("affiche un message si l'utilisateur n'a pas de favoris", async () => {
    (Cookies.get as jest.Mock).mockReturnValue('fake-token');
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => [] });

    render(<BrowserRouter><Favorites /></BrowserRouter>);

    await waitFor(() => {
      expect(screen.queryByText(/Vous n'avez pas encore de favoris/i)).toBeInTheDocument();
    });  });

  it('redirige vers /profile si Unauthorized', async () => {
    (Cookies.get as jest.Mock).mockReturnValue('fake-token');
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ title: 'Unauthorized' }),
    });

    Object.defineProperty(window, 'location', {
      writable: true,
      value: { assign: jest.fn() },
    }); // Mock window.location avant le rendu

    render(<BrowserRouter><Favorites /></BrowserRouter>);

    await waitFor(() => expect(window.location.assign).toHaveBeenCalledWith('/profile'));
  });

  it('affiche l\'image par défaut si aucune image n\'est disponible', async () => {
    (Cookies.get as jest.Mock).mockReturnValue('fake-token');
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ([{ recipe: { id: '1', name: 'Recette 1', description: 'Description 1', image_url: null } }]),
    });

    render(
      <MemoryRouter initialEntries={['/favorites']}>
        <Routes>
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/recipe/:id" element={<div>Page recette</div>} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      const image = screen.getByRole('img', { name: 'Recette 1' });
      expect(image.getAttribute('src')).toContain(defaultImage);
    });
  });
});