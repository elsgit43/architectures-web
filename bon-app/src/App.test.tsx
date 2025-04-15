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
  it("renders without crashing", async () => {
    render(<App />);

    const heading = await screen.findByText(/bon app/i);
    expect(heading).toBeInTheDocument();
  });
});
