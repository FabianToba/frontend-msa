import React, { useState } from 'react';
import { StyleSheet, TextInput, View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [dob, setDob] = useState('');
    const [healthId, setHealthId] = useState('');
    const router = useRouter();

    const handleRegister = async () => {
        if (!firstName || !lastName || !email || !password || !dob || !healthId) {
            Alert.alert('Error', 'Please fill out all fields.');
            return;
        }

        // Validate the DOB format
        const dobRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
        if (!dobRegex.test(dob)) {
            Alert.alert('Error', 'Invalid date format. Use YYYY-MM-DD.');
            return;
        }

        try {
            const url = 'http://192.168.1.130:8080/api/v1/patient/register';
            const payload = {
                first_name: firstName,
                last_name: lastName,
                email,
                password,
                dob,
                health_id: parseInt(healthId, 10),
            };

            console.log('Registering with payload:', payload);

            const response = await axios.post(url, payload);

            console.log('Registration response:', response.data);
            Alert.alert('Success', `Welcome!`);
            router.push('/(tabs)/explore_pacient');
        } catch (error) {
            // @ts-ignore
            console.error('Error during registration:', error.response?.data || error.message);

            Alert.alert(
                'Registration failed',
                // @ts-ignore
                error.response?.data?.message || 'An error occurred. Please try again.'
            );
        }
    };


    return (
        <View style={styles.container}>
            <Image
                source={require('@/assets/images/cross.png')}
                style={styles.logo}
            />
            <Text style={styles.title}>SANTA FABGHICILIA</Text>
            <Text style={styles.label}>First Name</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter first name"
                value={firstName}
                onChangeText={setFirstName}
            />
            <Text style={styles.label}>Last Name</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter last name"
                value={lastName}
                onChangeText={setLastName}
            />
            <Text style={styles.label}>E-mail</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter e-mail address"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />
            <Text style={styles.label}>Password</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Text style={styles.label}>Date of Birth (YYYY-MM-DD)</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter DOB"
                value={dob}
                onChangeText={setDob}
            />
            <Text style={styles.label}>Health ID</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter health ID"
                value={healthId}
                onChangeText={setHealthId}
                keyboardType="numeric"
            />
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/')}>
                <Text style={styles.signUpText}>Already have an account? Login</Text>
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
        marginTop: 10,
    },
});
