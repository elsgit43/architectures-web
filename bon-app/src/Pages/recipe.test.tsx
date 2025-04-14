import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { Recipe } from "./recipe";
import Cookies from "js-cookie";
jest.mock("js-cookie");

beforeEach(() => {
  // On mock `fetch` en Jest pur
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          name: "Salade",
          description: "Test",
          cook_time: 10,
          prep_time: 5,
          cost: 2,
          image_url: "",
          servings: 2,
          when_to_eat: "Midi",
          instructions: "Mélange tout",
        }),
    })
  ) as jest.Mock;
});

test("affiche le nom de la recette", async () => {
  render(
    <MemoryRouter initialEntries={["/recipes/1"]}>
      <Routes>
        <Route path="/recipes/:id" element={<Recipe />} />
      </Routes>
    </MemoryRouter>
  );

  expect(await screen.findByText("Salade")).toBeInTheDocument();
});

test("affiche une erreur si la récupération échoue", async () => {
  (fetch as jest.Mock).mockResolvedValueOnce({ ok: false });

  render(
    <MemoryRouter initialEntries={["/recipes/1"]}>
      <Routes>
        <Route path="/recipes/:id" element={<Recipe />} />
      </Routes>
    </MemoryRouter>
  );

  expect(await screen.findByText(/Erreur :/i)).toBeInTheDocument();
});

test("affiche l'image par défaut si aucune image n'est fournie", async () => {
  render(
    <MemoryRouter initialEntries={["/recipes/1"]}>
      <Routes>
        <Route path="/recipes/:id" element={<Recipe />} />
      </Routes>
    </MemoryRouter>
  );

  const image = await screen.findByRole("img");
  expect(image).toHaveAttribute("src", expect.stringContaining("default-image"));
});

test("ajoute aux favoris si isFavorite est vrai", async () => {
  (Cookies.get as jest.Mock).mockReturnValue("fake-token");

  (fetch as jest.Mock)
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        name: "Salade",
        description: "Test",
        cook_time: 10,
        prep_time: 5,
        cost: 2,
        image_url: "",
        servings: 2,
        when_to_eat: "Midi",
        instructions: "Mélange tout",
      }),
    })
    .mockResolvedValueOnce({ ok: true, json: async () => [] }) // check favorite
    .mockResolvedValueOnce({ ok: true }); // POST

  render(
    <MemoryRouter initialEntries={["/recipes/1"]}>
      <Routes>
        <Route path="/recipes/:id" element={<Recipe />} />
      </Routes>
    </MemoryRouter>
  );

  const button = await screen.findByRole("button", { name: /Ajouter aux favoris/i });
  button.click();

  // Attend le toggle
  await new Promise(r => setTimeout(r, 100));

  expect(fetch).toHaveBeenCalledWith(
    expect.stringContaining("/favorites?recipeID=1"),
    expect.objectContaining({ method: "POST" })
  );
});

test("supprime des favoris si isFavorite devient faux", async () => {
  (Cookies.get as jest.Mock).mockReturnValue("fake-token");

  // 1ère requête : chargement de la recette
  (fetch as jest.Mock)
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        name: "Salade",
        description: "Test",
        cook_time: 10,
        prep_time: 5,
        cost: 2,
        image_url: "",
        servings: 2,
        when_to_eat: "Midi",
        instructions: "Mélange tout",
      }),
    })
    // 2ème requête : vérifie que la recette est dans les favoris
    .mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { recipe: { id: "1" } } // indique que c’est un favori
      ],
    })
    // 3ème requête : suppression via DELETE
    .mockResolvedValueOnce({ ok: true });

  render(
    <MemoryRouter initialEntries={["/recipes/1"]}>
      <Routes>
        <Route path="/recipes/:id" element={<Recipe />} />
      </Routes>
    </MemoryRouter>
  );

  const button = await screen.findByRole("button", { name: /Ajouter aux favoris/i });

  // 1er clic → retire des favoris (isFavorite passe de true à false)
  button.click();

  await new Promise((r) => setTimeout(r, 100));

  expect(fetch).toHaveBeenCalledWith(
    expect.stringContaining("/favorites?recipeID=1"),
    expect.objectContaining({ method: "DELETE" })
  );
});


test("affiche une alerte si utilisateur non connecté et clique sur favoris", async () => {
  const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});
  (Cookies.get as jest.Mock).mockReturnValue(undefined);

  render(
    <MemoryRouter initialEntries={["/recipes/1"]}>
      <Routes>
        <Route path="/recipes/:id" element={<Recipe />} />
      </Routes>
    </MemoryRouter>
  );

  const button = await screen.findByRole("button", { name: /Ajouter aux favoris/i });
  button.click();

  await new Promise((r) => setTimeout(r, 100));

  expect(alertMock).toHaveBeenCalledWith("Veuillez vous connecter pour ajouter une recette aux favoris");
  alertMock.mockRestore();
});