import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

type AppSession =
  | { status: "signed-out" }
  | {
      status: "signed-in";
      user?: { email: string };
      onboardingCompleted?: boolean;
    };

interface AppShellProps {
  session: AppSession;
  auth?: {
    requestMagicLink(email: string): Promise<void>;
  };
  capture?: {
    createFromPaste(source: string): Promise<SavedItem>;
    savedItems: SavedItem[];
  };
  location?: {
    requestPermission(): Promise<void> | void;
  };
  onboarding?: {
    complete(): void;
  };
}

export interface SavedItem {
  id: string;
  primaryText: string;
  secondaryText?: string;
  status: "pending";
}

type OnboardingStep = "disclosure" | "location" | "share-sheet";

export const AppShell = ({
  session,
  auth,
  capture,
  location,
  onboarding,
}: AppShellProps) => {
  const [email, setEmail] = useState("");
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [onboardingStep, setOnboardingStep] =
    useState<OnboardingStep>("disclosure");
  const [pasteSource, setPasteSource] = useState("");
  const [pasteError, setPasteError] = useState<string | null>(null);
  const [savedItems, setSavedItems] = useState<SavedItem[]>(
    capture?.savedItems ?? []
  );

  if (session.status === "signed-out") {
    if (magicLinkSent) {
      return (
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          <View style={{ gap: 16, padding: 24 }}>
            <Text accessibilityRole="header">Check your email</Text>
            <Text selectable>
              Use the link we sent to finish signing in to Spot.
            </Text>
          </View>
        </ScrollView>
      );
    }

    return (
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={{ gap: 16, padding: 24 }}>
          <Text accessibilityRole="header">Sign in to Spot</Text>
          <TextInput
            accessibilityLabel="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={setEmail}
            placeholder="you@example.com"
            value={email}
          />
          <Pressable
            accessibilityRole="button"
            onPress={async () => {
              await auth?.requestMagicLink(email.trim());
              setMagicLinkSent(true);
            }}
          >
            <Text>Send magic link</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  if (!session.onboardingCompleted) {
    if (onboardingStep === "location") {
      return (
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          <View style={{ gap: 16, padding: 24 }}>
            <Text accessibilityRole="header">Improve place matching</Text>
            <Text selectable>
              Location helps Spot bias place matching near you. You can skip
              this for the alpha.
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={async () => {
                await location?.requestPermission();
                setOnboardingStep("share-sheet");
              }}
            >
              <Text>Enable Location</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => setOnboardingStep("share-sheet")}
            >
              <Text>Not now</Text>
            </Pressable>
          </View>
        </ScrollView>
      );
    }

    if (onboardingStep === "share-sheet") {
      return (
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          <View style={{ gap: 16, padding: 24 }}>
            <Text accessibilityRole="header">Save from anywhere</Text>
            <Text selectable>
              For now, paste a link or text into Spot. The share extension comes
              after the paste alpha.
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => onboarding?.complete()}
            >
              <Text>Start saving</Text>
            </Pressable>
          </View>
        </ScrollView>
      );
    }

    return (
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={{ gap: 16, padding: 24 }}>
          <Text accessibilityRole="header">Alpha disclosure</Text>
          <Text selectable>
            During this TestFlight alpha, saved links and text may be reviewed
            by the developer to debug place extraction.
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => setOnboardingStep("location")}
          >
            <Text>Continue</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <View style={{ gap: 16, padding: 24 }}>
        <Pressable accessibilityRole="button">
          <Text>Settings</Text>
        </Pressable>
        <Text accessibilityRole="header">Saved spots</Text>
        <TextInput
          accessibilityLabel="Paste a link or text"
          multiline
          onChangeText={setPasteSource}
          placeholder="Paste a link or text"
          value={pasteSource}
        />
        <Pressable
          accessibilityRole="button"
          onPress={async () => {
            const source = pasteSource.trim();
            if (!source) {
              setPasteError("Paste a link or text first");
              return;
            }

            const savedItem = await capture?.createFromPaste(source);
            if (savedItem) {
              setSavedItems((currentItems) => [savedItem, ...currentItems]);
              setPasteSource("");
              setPasteError(null);
            }
          }}
        >
          <Text>Save</Text>
        </Pressable>
        {pasteError ? (
          <Text accessibilityRole="alert" selectable>
            {pasteError}
          </Text>
        ) : null}
        {savedItems.length === 0 ? (
          <Text selectable>No spots yet</Text>
        ) : (
          savedItems.map((item) => (
            <View key={item.id}>
              <Text selectable>{item.primaryText}</Text>
              {item.secondaryText ? (
                <Text selectable>{item.secondaryText}</Text>
              ) : null}
              <Text selectable>Pending</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};
