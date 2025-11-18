import { View, Text, Alert, KeyboardAvoidingView, ScrollView, TextInput, TouchableOpacity, Platform } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router'
import { useSignUp } from '@clerk/clerk-expo'
import { authStyles } from "../../assets/styles/auth.styles"
import { COLORS } from '../../constants/colors'
import { Ionicons } from '@expo/vector-icons'
import { Image } from "expo-image"
import VerifyEmail from './verify-email'

const SignUpScreen = () => {
  const router = useRouter()
  const { isLoaded, signUp, setActive } = useSignUp();
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [pendingVerification, setPendingVerification] = useState(false)

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill all Fields")
      return
    }

    if (password.length < 6 || email.length < 6) {
      Alert.alert("Error", "Password and Email must be at least 6 characters long")
      return
    }

    if (!isLoaded) return
    setLoading(true)

    try {
      const signUpAttempt = await signUp.create({
        emailAddress: email,
        password: password
      })

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" })

      setPendingVerification(true)

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId })
      } else {
        Alert.alert("Error", "Sign up failed. Please try again!");
        console.log(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (error) {
      const clerkMessage = error?.errors?.[0]?.message;

      if (clerkMessage && clerkMessage.toLowerCase().includes("data breach")) {
        Alert.alert(
          "Weak / Breached Password",
          "For your security, this password has been found in a data breach. Please choose a strong, unique password that you haven't used elsewhere."
        );
      } else {
        Alert.alert("Error", clerkMessage || "Sign up failed! Please try again.");
      }

      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (pendingVerification) return <VerifyEmail email={email} onBack={() => setPendingVerification(false)} />

  return (
    <View style={authStyles.container}>
      <KeyboardAvoidingView
        style={authStyles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >

        <ScrollView
          contentContainerStyle={authStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={authStyles.imageContainer}>
            <Image
              source={require("../../assets/images/i2.png")}
              style={authStyles.image}
              contentFit="contain"
            />
          </View>

          <Text style={authStyles.title}>Create Account</Text>

          <View style={authStyles.formContainer}>
            {/* Email input */}
            <View style={authStyles.inputContainer}>
              <TextInput
                style={authStyles.textInput}
                placeholder="Enter your Email"
                placeholderTextColor={COLORS.textLight}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Password input */}
            <View style={authStyles.inputContainer}>
              <TextInput
                style={authStyles.textInput}
                placeholder="Enter your Password"
                placeholderTextColor={COLORS.textLight}
                value={password}
                onChangeText={setPassword}
                keyboardType="default"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />

              <TouchableOpacity style={authStyles.eyeButton} onPress={() => { setShowPassword(!showPassword) }}>
                <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={28} color={COLORS.textLight} />
              </TouchableOpacity>
            </View>

            {/* Submit button */}
            <TouchableOpacity
              style={[authStyles.authButton, loading && authStyles.buttonDisabled]}
              onPress={handleSignUp}
              disabled={loading}
              activeOpacity={0.8}>
              <Text style={authStyles.buttonText}>
                {loading ? "Signing Up..." : "Sign Up"}
              </Text>
            </TouchableOpacity>

            {/* Sign up Link */}
            <TouchableOpacity style={authStyles.linkContainer}
              onPress={() => { router.back() }}>
              <Text style={authStyles.linkText}>
                Already have an account? <Text style={authStyles.link}>Sign in</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

      </KeyboardAvoidingView>
    </View>
  )
}

export default SignUpScreen