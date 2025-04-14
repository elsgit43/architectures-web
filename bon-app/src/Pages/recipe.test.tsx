import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { Recipe } from "./recipe";

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
