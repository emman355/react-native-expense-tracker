import "dotenv/config"

export default {
  expo: {
    name: "expense-tracker",
    slug: "expense-tracker",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/expense-tracker-icon.png",
    scheme: "mobile",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.earevalo355.expensetrackerapp",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/images/expense-tracker-icon.png",
        backgroundImage: "./assets/images/expense-tracker-icon.png",
        monochromeImage: "./assets/images/expense-tracker-icon.png",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: "com.earevalo355.expensetrackerapp",
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/expense-tracker-icon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/expense-tracker-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            backgroundColor: "#000000",
          },
        },
      ],
      "expo-secure-store",
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: "0f75ab2b-60f7-4c7f-ab30-bea9f8ab8715",
      },
      publishableKey: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
      api_url: process.env.EXPO_PUBLIC_API_URL,
    },
    owner: "earevalo355",
  },
}
