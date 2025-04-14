import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Favorites } from './favorites';

global.fetch = jest.fn();

describe('Favorites Component', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should display a loading message while fetching data', () => {
        (fetch as jest.Mock).mockResolvedValueOnce(new Promise(() => {}));

        render(
            <Router>
                <Favorites />
            </Router>
        );

        expect(screen.getByText(/Chargement.../i)).toBeInTheDocument();
    });

    it('should display an error message if the fetch fails', async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
        });

        render(
            <Router>
                <Favorites />
            </Router>
        );

        await waitFor(() => {
            expect(screen.getByText(/Erreur : Erreur lors de la récupération des données/i)).toBeInTheDocument();
        });
    });

    it('should display a message if there are no favorite recipes', async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => [],
        });

        render(
            <Router>
                <Favorites />
            </Router>
        );

        await waitFor(() => {
            expect(screen.getByText(/Vous n'avez pas encore de favoris/i)).toBeInTheDocument();
        });
    });

    it('should display favorite recipes if data is fetched successfully', async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => [
                {
                    recipe: {
                        id: '1',
                        name: 'Recipe 1',
                        description: 'Delicious recipe 1',
                        image_url: 'https://example.com/image1.jpg',
                    },
                },
                {
                    recipe: {
                        id: '2',
                        name: 'Recipe 2',
                        description: 'Delicious recipe 2',
                        image_url: 'https://example.com/image2.jpg',
                    },
                },
            ],
        });

        render(
            <Router>
                <Favorites />
            </Router>
        );

        await waitFor(() => {
            expect(screen.getByText(/Consultez ici vos favoris/i)).toBeInTheDocument();
            expect(screen.getByText(/Recipe 1/i)).toBeInTheDocument();
            expect(screen.getByText(/Recipe 2/i)).toBeInTheDocument();
        });
    });
});
