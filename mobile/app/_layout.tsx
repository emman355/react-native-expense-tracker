import { ClerkProvider } from '@clerk/clerk-expo'
import * as WebBrowser from 'expo-web-browser';
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { Slot } from 'expo-router'
import SafeScreen from '@/components/SafeScreen'
import { CLERK_PUBLISHABLE_KEY } from "../constants/api"
import { StatusBar } from 'expo-status-bar';

WebBrowser.maybeCompleteAuthSession();

export default function RootLayout() {
  if (!CLERK_PUBLISHABLE_KEY) {
    throw new Error("Missing Clerk Publishable Key!");
  }

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={CLERK_PUBLISHABLE_KEY}>
      <SafeScreen>
        <Slot />
      </SafeScreen>
      <StatusBar style="dark" />
    </ClerkProvider>
  )
}
