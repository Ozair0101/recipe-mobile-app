import { View, Text, Alert, Platform, ScrollView, KeyboardAvoidingView, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router'
import { useSignIn } from '@clerk/clerk-expo'
import { authStyles } from "../../assets/styles/auth.styles"
import { Image } from 'expo-image'
import { COLORS } from '../../constants/colors'
import { Ionicons } from '@expo/vector-icons'

const SignInScreen = () => {

  const router = useRouter();

  const { signIn, setActive, isLoaded } = useSignIn();
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill all Fields")
      return
    }

    if (!isLoaded) return
    setLoading(true)

    try {
      const signInAttempt = await signIn.create({
        identifier: email,
        password
      })

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId })
      } else {
        Alert.alert("Error", "Sign in failed. Please try again!");
        console.log(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (error) {
      Alert.alert("Error", error?.errors?.[0]?.message || "Sign in failed!")
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
          <View style={authStyles.imageContainer}>
            <Image
              source={require("../../assets/images/i1.png")}
              style={authStyles.image}
              contentFit="contain"
            />

            <Text style={authStyles.title}>Welcome Back</Text>
            {/* Form Container */}
            <View style={authStyles.formContainer}>
              {/* Email Input */}
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
              {/* Password Input */}
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
                onPress={handleSignIn}
                disabled={loading}
                activeOpacity={0.8}>
                <Text style={authStyles.buttonText}>
                  {loading ? "Signing In..." : "Sign In"}
                </Text>
              </TouchableOpacity>

              {/* Sign up Link */}
              <TouchableOpacity style={authStyles.linkContainer}
              onPress={()=>{router.push("/(auth)/sign-up")}}>
                <Text style={authStyles.linkText}>
                  Don't have an account? <Text style={authStyles.link}>Sign up</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}

export default SignInScreen