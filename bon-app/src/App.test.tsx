import React from "react";
import { render, screen } from "@testing-library/react";
import { Recipe } from "./Pages/recipe";
import { MemoryRouter } from "react-router-dom";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ id: "123" }),
}));

// On évite les appels API réels en mockant fetch
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({
        name: "Pizza",
        description: "Une pizza délicieuse",
        cook_time: 20,
        cost: 10,
        image_url: "",
        prep_time: 15,
        servings: 2,
        when_to_eat: "Dîner",
        instructions: "1. Faire ceci\n2. Faire cela",
      }),
  })
) as jest.Mock;

describe("Recipe component", () => {
  it("affiche 'Chargement...' au début", () => {
    render(
      <MemoryRouter>
        <Recipe />
      </MemoryRouter>
    );

    expect(screen.getByText(/Chargement/i)).toBeInTheDocument();
  });
});
