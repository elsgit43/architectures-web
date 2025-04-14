// src/Pages/profile.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Profil } from "./profile";
import Cookies from "js-cookie";

jest.mock('js-cookie');

describe("Profil component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (Cookies.get as jest.Mock).mockReset();
        global.fetch = jest.fn();
        delete (window as any).location;
        (window as any).location = { reload: jest.fn(), assign: jest.fn() };
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("1. Affiche le formulaire de connexion si non connecté", () => {
        (Cookies.get as jest.Mock).mockReturnValue(undefined);

        render(<Profil />);

        expect(screen.getByText(/Connexion/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Pseudo/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Mot de passe/i)).toBeInTheDocument();
    });

    test("2. Connexion réussie avec pseudo et mot de passe", async () => {
        (Cookies.get as jest.Mock).mockReturnValue(undefined);
        const mockSet = jest.spyOn(Cookies, "set");
        const mockReload = jest.spyOn(window.location, "reload").mockImplementation(() => {});

        global.fetch = jest.fn().mockResolvedValueOnce({
            ok: true,
            json: async () => ({ token: "fake-token" }),
        }) as jest.Mock;

        render(<Profil />);
        fireEvent.change(screen.getByPlaceholderText(/pseudo/i), { target: { value: "user" } });
        fireEvent.change(screen.getByPlaceholderText(/mot de passe/i), { target: { value: "pass" } });

        fireEvent.click(screen.getByText(/Se connecter/i));

        await waitFor(() => {
            expect(mockSet).toHaveBeenCalledWith("token", "fake-token", expect.any(Object));
            expect(mockReload).toHaveBeenCalled();
        });
    });

    test("3. Connexion échouée affiche un message d'erreur", async () => {
        (Cookies.get as jest.Mock).mockReturnValue(undefined);

        global.fetch = jest.fn().mockResolvedValueOnce({
            ok: false,
            json: async () => ({ message: "Identifiants incorrects" }),
        }) as jest.Mock;

        render(<Profil />);
        fireEvent.change(screen.getByPlaceholderText(/pseudo/i), { target: { value: "user" } });
        fireEvent.change(screen.getByPlaceholderText(/mot de passe/i), { target: { value: "wrongpass" } });
        fireEvent.click(screen.getByText(/Se connecter/i));

        expect(await screen.findByText(/Erreur: Identifiants incorrects/i)).toBeInTheDocument();
    });

    test("4. Connexion échoue à cause d'une erreur réseau", async () => {
        (Cookies.get as jest.Mock).mockReturnValue(undefined);

        global.fetch = jest.fn().mockImplementationOnce(() => {
            throw new Error("Network error");
        });

        render(<Profil />);
        fireEvent.change(screen.getByPlaceholderText(/pseudo/i), { target: { value: "user" } });
        fireEvent.change(screen.getByPlaceholderText(/mot de passe/i), { target: { value: "pass" } });
        fireEvent.click(screen.getByText(/Se connecter/i));

        await waitFor(() => {
            expect(screen.getByText(/Erreur lors de la connexion/i)).toBeInTheDocument();
        });
    });

    test("5. Affiche les infos utilisateur si connecté", async () => {
        (Cookies.get as jest.Mock).mockReturnValue("fake-token");

        global.fetch = jest.fn().mockResolvedValueOnce({
            ok: true,
            json: async () => ({ username: "JohnDoe" }),
        }) as jest.Mock;

        render(<Profil />);
        expect(await screen.findByText(/Bienvenue JohnDoe/i)).toBeInTheDocument();
    });

    test("6. Affiche une alerte si token expiré (Unauthorized)", async () => {
        (Cookies.get as jest.Mock).mockReturnValue("fake-token");

        const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});
        const removeMock = jest.spyOn(Cookies, "remove").mockImplementation(() => {});
        const reloadMock = jest.spyOn(window.location, "reload").mockImplementation(() => {});

        // Mock fetch pour le chargement du profil (Unauthorized)
        global.fetch = jest.fn().mockResolvedValueOnce({
            ok: false,
            status: 401,
            json: async () => ({ title: "Unauthorized" }),
        }) as jest.Mock;

        render(<Profil />);

        await waitFor(() => {
            expect(alertMock).toHaveBeenCalledWith("Votre session a expiré, veuillez vous reconnecter");
        });
        expect(removeMock).toHaveBeenCalledWith("token");
        expect(reloadMock).toHaveBeenCalled();
    });

    test("7. Bouton déconnexion fonctionne", async () => {
        (Cookies.get as jest.Mock).mockReturnValue("fake-token");

        // Simuler une réponse réussie pour le chargement initial du profil
        global.fetch = jest.fn()
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ username: "TestUser" })
            })
            // Simuler une réponse réussie pour la déconnexion
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({})
            });

        const removeMock = jest.spyOn(Cookies, "remove").mockImplementation(() => {});
        const reloadMock = jest.spyOn(window.location, "reload").mockImplementation(() => {});

        render(<Profil />);

        // Attendre que le bouton soit disponible
        const button = await screen.findByText(/Se déconnecter/i);
        fireEvent.click(button);

        await waitFor(() => {
            expect(removeMock).toHaveBeenCalledWith("token");
            expect(reloadMock).toHaveBeenCalled();
        }, { timeout: 2000 });
    });
});
