import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { Searchbar } from "./Searchbar";

describe("Searchbar Component", () => {
    beforeEach(() => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve([
                        { id: "1", name: "Recipe 1" },
                        { id: "2", name: "Recipe 2" },
                    ]),
            })
        ) as jest.Mock;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("renders search input and icon", () => {
        render(
            <Router>
                <Searchbar />
            </Router>
        );

        expect(screen.getByPlaceholderText("Type to search")).toBeInTheDocument();
        expect(screen.getByRole("img")).toBeInTheDocument(); // Assuming FaSearch renders an <img> element
    });

    test("displays loading state", async () => {
        render(
            <Router>
                <Searchbar />
            </Router>
        );

        expect(screen.getByText("Chargement...")).toBeInTheDocument();
        await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    });

    test("displays recipes after fetching", async () => {
        render(
            <Router>
                <Searchbar />
            </Router>
        );

        await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
        expect(screen.getByText("Recipe 1")).toBeInTheDocument();
        expect(screen.getByText("Recipe 2")).toBeInTheDocument();
    });

    test("filters recipes based on input", async () => {
        render(
            <Router>
                <Searchbar />
            </Router>
        );

        await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

        const input = screen.getByPlaceholderText("Type to search");
        fireEvent.change(input, { target: { value: "Recipe 1" } });

        await waitFor(() => {
            expect(screen.getByText("Recipe 1")).toBeInTheDocument();
            expect(screen.queryByText("Recipe 2")).not.toBeInTheDocument();
        });
    });

    test("displays error message on fetch failure", async () => {
        global.fetch = jest.fn(() =>
            Promise.reject(new Error("Erreur lors de la récupération des données"))
        ) as jest.Mock;

        render(
            <Router>
                <Searchbar />
            </Router>
        );

        await waitFor(() =>
            expect(screen.getByText("Erreur : Erreur lors de la récupération des données")).toBeInTheDocument()
        );
    });

    test("displays no recipes found message when no matches", async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve([]),
            })
        ) as jest.Mock;

        render(
            <Router>
                <Searchbar />
            </Router>
        );

        await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
        expect(screen.getByText("Aucune recette trouvée.")).toBeInTheDocument();
    });
});