import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Home } from '../Pages/home';

global.fetch = jest.fn();

const mockRecipes = [
  {
    id: '1',
    name: 'Spaghetti Bolo',
    description: 'Un bon plat de pâtes',
    image_url: 'https://example.com/image.jpg',
  },
  {
    id: '2',
    name: 'Salade César',
    description: 'Fraîche et croquante',
    image_url: 'https://example.com/salade.jpg',
  },
];

describe('Home', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('affiche le texte de chargement initial', () => {
    (fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    expect(screen.getByText(/Chargement/i)).toBeInTheDocument();
  });

  it('affiche une erreur si la requête échoue', async () => {
    (fetch as jest.Mock).mockRejectedValue(new Error('Erreur réseau'));

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    await waitFor(() =>
      expect(screen.getByText(/Erreur : Erreur réseau/i)).toBeInTheDocument()
    );
  });

  it('affiche les recettes correctement', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockRecipes,
    });

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    for (const recipe of mockRecipes) {
      await waitFor(() =>
        expect(screen.getByText(recipe.name)).toBeInTheDocument()
      );
      expect(screen.getByText(recipe.description)).toBeInTheDocument();
      expect(screen.getByAltText(recipe.name)).toHaveAttribute(
        'src',
        recipe.image_url
      );
    }
  });

  it("affiche un message si aucune recette n'est retournée", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => null,
    });

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    await waitFor(() =>
      expect(screen.getByText(/Aucune recette trouvée/i)).toBeInTheDocument()
    );
  });
});
