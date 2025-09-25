import { ClerkProvider } from '@clerk/clerk-expo'
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { Slot } from 'expo-router'
import SafeScreen from '@/components/SafeScreen'
import Constants from "expo-constants";

const clerkPublishableKey =
  Constants?.expoConfig?.extra?.clerkPublishableKey ||
  process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function RootLayout() {
  if (!clerkPublishableKey) {
    throw new Error("Missing Clerk Publishable Key!");
  }

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={clerkPublishableKey}>
      <SafeScreen>
        <Slot />
      </SafeScreen>
    </ClerkProvider>
  )
}
