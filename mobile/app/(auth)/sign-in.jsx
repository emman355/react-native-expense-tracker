import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { KeyboardAvoidingView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useState } from 'react'
import { emailRegex } from '../../lib/utils'
import AuthWrapper from '../../components/AuthWrapper'
import { isIOS } from '../../constants/platform'
import { useHeaderHeight } from '@react-navigation/elements'
import { styles } from '../../assets/styles/auth.styles'
import { Image } from 'expo-image'
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from '../../constants/colors'

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()
  const height = useHeaderHeight();

  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

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

  return (
    <KeyboardAvoidingView
      behavior={isIOS ? "padding" : "height"}
      keyboardVerticalOffset={isIOS ? 64 : height}
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
        </View>
      </AuthWrapper>
    </KeyboardAvoidingView>

  )
}