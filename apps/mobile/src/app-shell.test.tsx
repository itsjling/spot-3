// oxlint's `jest/no-confusing-set-timeout` mis-fires on every `jest.fn()` call
// because the matcher only sees `jest.*` and assumes it could be `jest.setTimeout`.
/* eslint-disable jest/no-confusing-set-timeout */
import { describe, expect, it, jest } from "@jest/globals";
import { render, screen, userEvent } from "@testing-library/react-native";

import { AppShell } from "@/src/app-shell";
import type { SavedItem } from "@/src/app-shell";

describe("appShell", () => {
  it("shows sign-in instead of the saved-items home for signed-out users", () => {
    render(<AppShell session={{ status: "signed-out" }} />);

    expect(
      screen.getByRole("header", { name: "Sign in to Spot" })
    ).toBeOnTheScreen();
    expect(
      screen.queryByRole("header", { name: "Saved spots" })
    ).not.toBeOnTheScreen();
  });

  it("requests a magic link and shows a check-email state", async () => {
    const user = userEvent.setup();
    const requestMagicLink = jest
      .fn<(email: string) => Promise<void>>()
      .mockResolvedValue();

    render(
      <AppShell
        session={{ status: "signed-out" }}
        auth={{ requestMagicLink }}
      />
    );

    await user.type(screen.getByLabelText("Email"), "friend@example.com");
    await user.press(screen.getByRole("button", { name: "Send magic link" }));

    expect(requestMagicLink).toHaveBeenCalledWith("friend@example.com");
    await expect(
      screen.findByRole("header", { name: "Check your email" })
    ).resolves.toBeOnTheScreen();
  });

  it("shows the alpha disclosure before home for signed-in users who have not completed onboarding", () => {
    render(
      <AppShell
        session={{
          onboardingCompleted: false,
          status: "signed-in",
          user: { email: "friend@example.com" },
        }}
      />
    );

    expect(
      screen.getByRole("header", { name: "Alpha disclosure" })
    ).toBeOnTheScreen();
    expect(
      screen.getByText(/saved links and text may be reviewed/iu)
    ).toBeOnTheScreen();
    expect(
      screen.queryByRole("header", { name: "Saved spots" })
    ).not.toBeOnTheScreen();
  });

  it("lets a signed-in user continue past disclosure and skip location permission", async () => {
    const user = userEvent.setup();
    const requestLocationPermission = jest.fn<() => void>();

    render(
      <AppShell
        session={{
          onboardingCompleted: false,
          status: "signed-in",
          user: { email: "friend@example.com" },
        }}
        location={{ requestPermission: requestLocationPermission }}
      />
    );

    await user.press(screen.getByRole("button", { name: "Continue" }));

    expect(
      screen.getByRole("header", { name: "Improve place matching" })
    ).toBeOnTheScreen();

    await user.press(screen.getByRole("button", { name: "Not now" }));

    expect(requestLocationPermission).not.toHaveBeenCalled();
    expect(
      screen.getByRole("header", { name: "Save from anywhere" })
    ).toBeOnTheScreen();
  });

  it("completes onboarding from the share-sheet education step", async () => {
    const user = userEvent.setup();
    const completeOnboarding = jest.fn();

    render(
      <AppShell
        session={{
          onboardingCompleted: false,
          status: "signed-in",
          user: { email: "friend@example.com" },
        }}
        onboarding={{ complete: completeOnboarding }}
      />
    );

    await user.press(screen.getByRole("button", { name: "Continue" }));
    await user.press(screen.getByRole("button", { name: "Not now" }));
    await user.press(screen.getByRole("button", { name: "Start saving" }));

    expect(completeOnboarding).toHaveBeenCalledTimes(1);
  });

  it("shows the empty saved-items home with settings and no tab bar for onboarded users", () => {
    render(
      <AppShell
        session={{
          onboardingCompleted: true,
          status: "signed-in",
          user: { email: "friend@example.com" },
        }}
      />
    );

    expect(
      screen.getByRole("header", { name: "Saved spots" })
    ).toBeOnTheScreen();
    expect(screen.getByText("No spots yet")).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "Settings" })).toBeOnTheScreen();
    expect(screen.queryByTestId("bottom-tab-bar")).not.toBeOnTheScreen();
  });

  it("lets an onboarded user paste a source and immediately see a pending saved item", async () => {
    const user = userEvent.setup();
    const createFromPaste = jest.fn<(source: string) => Promise<SavedItem>>();
    createFromPaste.mockResolvedValue({
      id: "capture-1",
      primaryText: "example.com",
      secondaryText: "https://example.com/spots/lilia",
      status: "pending",
    });

    render(
      <AppShell
        capture={{ createFromPaste, savedItems: [] }}
        session={{
          onboardingCompleted: true,
          status: "signed-in",
          user: { email: "friend@example.com" },
        }}
      />
    );

    await user.type(
      screen.getByLabelText("Paste a link or text"),
      "https://example.com/spots/lilia"
    );
    await user.press(screen.getByRole("button", { name: "Save" }));

    expect(createFromPaste).toHaveBeenCalledWith(
      "https://example.com/spots/lilia"
    );
    await expect(screen.findByText("example.com")).resolves.toBeOnTheScreen();
    expect(screen.getByText("Pending")).toBeOnTheScreen();
    expect(screen.queryByText("No spots yet")).not.toBeOnTheScreen();
  });

  it("does not create a capture for blank pasted content", async () => {
    const user = userEvent.setup();
    const createFromPaste = jest.fn<(source: string) => Promise<SavedItem>>();

    render(
      <AppShell
        capture={{ createFromPaste, savedItems: [] }}
        session={{
          onboardingCompleted: true,
          status: "signed-in",
          user: { email: "friend@example.com" },
        }}
      />
    );

    await user.type(screen.getByLabelText("Paste a link or text"), "   ");
    await user.press(screen.getByRole("button", { name: "Save" }));

    expect(createFromPaste).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Paste a link or text first"
    );
    expect(screen.getByText("No spots yet")).toBeOnTheScreen();
  });
});
