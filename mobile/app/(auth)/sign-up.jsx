import { useState } from 'react'
import {
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { Ionicons } from "@expo/vector-icons";
import { styles } from '../../assets/styles/auth.styles'
import { COLORS } from '../../constants/colors';
import { Image } from 'expo-image'
import { isIOS } from "../../constants/platform"
import { useHeaderHeight } from '@react-navigation/elements'

// Only import if not web
import { emailRegex } from '../../lib/utils';
import AuthWrapper from '../../components/AuthWrapper';

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()
  const height = useHeaderHeight();

  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [pendingVerification, setPendingVerification] = useState(false)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  const onSignUpPress = async () => {
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

    if (!isLoaded) return;
    try {
      await signUp.create({ emailAddress, password })
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      setPendingVerification(true)
      setError(""); // clear error on success
    } catch (err) {
      // Clerk errors usually come in `err.errors`
      if (err.errors && err.errors.length > 0) {
        setError(err.errors[0].message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  }

  const onVerifyPress = async () => {
    if (!isLoaded) return;
    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({ code })
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        setError(""); // clear error on success
        router.replace('/')
      } else {
        setError(JSON.stringify(signUpAttempt, null, 2))
      }
    } catch (err) {
      setError(err.errors[0].message || "Something went wrong. Please try again.");
    }
  }

  if (pendingVerification) {
    return (
      <View style={styles.verificationContainer}>
        <Text style={styles.verificationTitle}>Verify your email</Text>
        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name='alert-circle' size={20} color={COLORS.expense} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => setError("")}>
              <Ionicons name='close' size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>
        ) : null}
        <TextInput
          style={[styles.verificationInput, error && styles.errorInput]}
          value={code}
          placeholder="Enter your verification code"
          placeholderTextColor="#9A8478"
          onChangeText={setCode}
        />
        <TouchableOpacity onPress={onVerifyPress} style={styles.button}>
          <Text style={styles.buttonText}>Verify</Text>
        </TouchableOpacity>
      </View>
    )
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
            source={require("../../assets/images/revenue-i2.png")}
            style={styles.illustration}
            contentFit="contain"
          />
        </View>

        <Text style={styles.title}>Create Account</Text>

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
            onChangeText={setEmailAddress}
          />
          <TextInput
            style={[styles.input, error && styles.errorInput]}
            value={password}
            placeholderTextColor="#9A8478"
            placeholder="Enter password"
            secureTextEntry
            onChangeText={setPassword}
          />
          <TouchableOpacity style={styles.button} onPress={onSignUpPress}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.linkText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </AuthWrapper>
    </KeyboardAvoidingView>
  )
}
