// src/Pages/favorites.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Favorites } from './favorites';
import Cookies from 'js-cookie';

jest.mock('js-cookie');

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('Favorites Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('affiche un message de chargement', () => {
    (Cookies.get as jest.Mock).mockReturnValue('fake-token');
    mockFetch.mockImplementationOnce(() => new Promise(() => {}));

    render(
      <BrowserRouter>
        <Favorites />
      </BrowserRouter>
    );

    expect(screen.getByText(/Chargement/i)).toBeInTheDocument();
  });

  it("affiche une erreur si l'utilisateur n'est pas connecté", async () => {
    (Cookies.get as jest.Mock).mockReturnValue(undefined);

    render(
      <BrowserRouter>
        <Favorites />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/vous devez être connecté/i)).toBeInTheDocument();
    });
  });
});
