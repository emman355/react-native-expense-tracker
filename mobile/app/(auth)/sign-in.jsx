import { useSignIn, useSSO } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { KeyboardAvoidingView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useCallback, useEffect, useState } from 'react'
import { emailRegex } from '../../lib/utils'
import * as WebBrowser from 'expo-web-browser'
import * as AuthSession from 'expo-auth-session'
import AuthWrapper from '../../components/AuthWrapper'
import { isAndroid, isIOS } from '../../constants/platform'
import { useHeaderHeight } from '@react-navigation/elements'
import { styles } from '../../assets/styles/auth.styles'
import { Image } from 'expo-image'
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from '../../constants/colors'
import GoogleIcon from '../../components/GoogleIcon'

export const useWarmUpBrowser = () => {
  useEffect(() => {
    // Preloads the browser for Android devices to reduce authentication load time
    // See: https://docs.expo.dev/guides/authentication/#improving-user-experience
    if (isAndroid.OS !== 'android') return
    void WebBrowser.warmUpAsync()
    return () => {
      // Cleanup: closes browser when component unmounts
      void WebBrowser.coolDownAsync()
    }
  }, [])
}

export default function Page() {
  useWarmUpBrowser()
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()
  const height = useHeaderHeight();

  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')


  // Use the `useSSO()` hook to access the `startSSOFlow()` method
  const { startSSOFlow } = useSSO()

  const handleGoogleSignIn = useCallback(async () => {
    try {
      // Start the authentication process by calling `startSSOFlow()`
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: 'oauth_custom_google',
        // For web, defaults to current path
        // For native, you must pass a scheme, like AuthSession.makeRedirectUri({ scheme, path })
        // For more info, see https://docs.expo.dev/versions/latest/sdk/auth-session/#authsessionmakeredirecturioptions
        redirectUrl: AuthSession.makeRedirectUri(),
      })

      // If sign in was successful, set the active session
      if (createdSessionId) {
        setActive({
          session: createdSessionId,
          navigate: async ({ session }) => {
            if (session?.currentTask) {
              // Check for tasks and navigate to custom UI to help users resolve them
              // See https://clerk.com/docs/guides/development/custom-flows/overview#session-tasks
              console.log(session?.currentTask)
              return
            }

            router.push('/')
          },
        })
      } else {
        // If there is no `createdSessionId`,
        // there are missing requirements, such as MFA
        // Use the `signIn` or `signUp` returned from `startSSOFlow`
        // to handle next steps
      }
    } catch (err) {
      // See https://clerk.com/docs/guides/development/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    // frontend validation
    if (!emailAddress || !password) {
      setError("Please fill in all fields!");
      return;
    }

    // simple regex for email validation
    if (!emailRegex.test(emailAddress)) {
      setError("Please enter a valid email address!");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters!");
      return;
    }
    if (!isLoaded) return

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })
      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        setError("");
        router.replace('/')
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        // console.error(JSON.stringify(signInAttempt, null, 2))
        setError(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err) {
      setError(err.errors[0].message || "Something went wrong. Please try again.");
    }
  }

  // Handle any pending authentication sessions
  WebBrowser.maybeCompleteAuthSession()

  return (
    <KeyboardAvoidingView
      behavior={isIOS ? "padding" : "height"}
      keyboardVerticalOffset={isIOS ? 20 : height}
      style={styles.keyboardView}
    >
      <AuthWrapper>
        {/* IMAGE CONTAINER */}
        <View style={styles.imageContainer}>
          <Image
            source={require("../../assets/images/revenue-i4.png")}
            style={styles.illustration}
            contentFit="contain"
          />
        </View>

        <Text style={styles.title}>Welcome Back</Text>

        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name='alert-circle' size={20} color={COLORS.expense} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => setError("")}>
              <Ionicons name='close' size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>
        ) : null}

        <View style={styles.formContainer}>
          <TextInput
            style={[styles.input, error && styles.errorInput]}
            autoCapitalize="none"
            value={emailAddress}
            placeholderTextColor="#9A8478"
            placeholder="Enter email"
            onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
          />
          <TextInput
            style={[styles.input, error && styles.errorInput]}
            value={password}
            placeholderTextColor="#9A8478"
            placeholder="Enter password"
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
          />

          <TouchableOpacity style={styles.button} onPress={onSignInPress}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Don&apos;t have an account?</Text>
            <Link href="/sign-up" asChild>
              <TouchableOpacity>
                <Text style={styles.linkText}>Sign Up</Text>
              </TouchableOpacity>
            </Link>
          </View>
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Text style={styles.linkText}>or</Text>
          </View>
          <View style={styles.googleButtonContainer}>
            <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
              <GoogleIcon />
              <Text style={styles.googleButtonText}>Sign in with Google</Text>
            </TouchableOpacity>
          </View>
        </View>

      </AuthWrapper>
    </KeyboardAvoidingView>
  )
}