import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

// Mocks pour fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  })
) as jest.Mock;

describe("App component", () => {
  it("renders without crashing", () => {
    render(<App />); // Pas besoin de MemoryRouter ici

    // Ajoute tes assertions ici
    expect(screen.getByText(/bon app/i)).toBeInTheDocument();
  });
});
