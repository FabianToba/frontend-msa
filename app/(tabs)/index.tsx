import React, { useState } from 'react';
import { StyleSheet, TextInput, View, Text, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = async () => {
        try {
            console.log('Attempting login with:', { email, password });

            // Make a login request to the backend
            const response = await axios.post(
                `http://192.168.1.130:8080/api/v1/patient/login`,
                null,
                {
                    params: { email, password },
                }
            );

            // Log the user data
            const userData = response.data;
            console.log('Login successful:', userData);

            // Store user ID in AsyncStorage
            await AsyncStorage.setItem('userId', userData.id.toString());

            // Show a success message
            alert('Login successful!');

            // Redirect to a dashboard or home page
            router.push('/(tabs)/explore_pacient');
        } catch (error) {
            // @ts-ignore
            console.error('Error during login:', error.response?.data || error.message);

            // Show an error message
            alert('Invalid email or password. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <Image
                source={require('@/assets/images/cross.png')}
                style={styles.logo}
            />
            <Text style={styles.title}>SANTA FABGHICILIA</Text>

            <Text style={styles.label}>E-mail</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter e-mail address"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/register')}>
                <Text style={styles.signUpText}>New here? Sign up</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#fff',
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#00BFFF',
        marginBottom: 30,
    },
    label: {
        alignSelf: 'flex-start',
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 5,
        color: '#333',
    },
    input: {
        width: '100%',
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
        backgroundColor: '#f9f9f9',
    },
    button: {
        backgroundColor: '#00BFFF',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
        width: '100%',
        alignItems: 'center',
        marginBottom: 15,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    signUpText: {
        fontSize: 14,
        color: '#00BFFF',
        textDecorationLine: 'underline',
    },
});