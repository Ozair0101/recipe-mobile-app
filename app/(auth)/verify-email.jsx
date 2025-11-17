import { View, Text, KeyboardAvoidingView, ScrollView, Platform, Alert, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useSignUp } from '@clerk/clerk-expo'
import { authStyles } from '../../assets/styles/auth.styles'
import { COLORS } from '../../constants/colors'
import { Image } from 'expo-image'

const VerifyEmail = ({ email, onBack }) => {
  const { isLoaded, signUp, setActive } = useSignUp()
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)

  const handleVerification = async () => {
    if (!isLoaded) return
    setLoading(true)

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({ code })

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId })
      } else {
        Alert.alert("Error", "Verification failed. Please try again!");
        console.log(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (error) {
      Alert.alert("Error", error?.errors?.[0]?.message || "Verification failed!")
      console.error(error)
    } finally {
      setLoading(false)
    }

  }
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
          {/* image view */}
          <View style={authStyles.imageContainer}>
            <Image
              source={require("../../assets/images/i3.png")}
              style={authStyles.image}
              contentFit="contain"
            />
          </View>

          {/* Tilte */}
          <Text style={authStyles.title}>Verify Email</Text>
          <Text style={authStyles.description}>We&apos;ve sent a verification code to your {email}</Text>

          {/*  */}
          <View style={authStyles.formContainer}>
            <TextInput
              style={authStyles.textInput}
              placeholder="Enter your Code"
              placeholderTextColor={COLORS.textLight}
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              autoCapitalize="none"
            />
          </View>

          {/* Submit button */}
          <TouchableOpacity
            style={[authStyles.authButton, loading && authStyles.buttonDisabled]}
            onPress={handleVerification}
            disabled={loading}
            activeOpacity={0.8}>
            <Text style={authStyles.buttonText}>
              {loading ? "Verifying..." : "Verify Email"}
            </Text>
          </TouchableOpacity>

          {/* Sign up Link */}
          <TouchableOpacity style={authStyles.linkContainer}
            onPress={onBack}>
            <Text style={authStyles.linkText}>
              <Text style={authStyles.link}>
                Go Back to Sign Up
              </Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}

export default VerifyEmail