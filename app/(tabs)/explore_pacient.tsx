import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Footer from '@/components/Footer';

interface Patient {
    first_name: string;
    last_name: string;
}

export default function HomeScreen() {
    const router = useRouter();
    const [patient, setPatient] = useState<Patient | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPatient = async () => {
            try {
                const userId = await AsyncStorage.getItem('userId'); // Get the user ID from AsyncStorage
                if (!userId) {
                    router.push('/');
                    return;
                }

                const response = await axios.get(`http://192.168.1.130:8080/api/v1/patient/${userId}`);
                setPatient(response.data); // Set the patient data
            } catch (error) {
                console.error('Error fetching patient data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPatient();
    }, []);

    if (loading) {
        return (
            <View style={styles.container}>
                <Text style={{ fontSize: 18, color: '#00BFFF' }}>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header Section */}
            <View style={styles.header}>
                <Image
                    source={require('@/assets/images/image.png')}
                    style={styles.avatar}
                />
                <Text style={styles.welcomeText}>
                    Hello, {patient?.first_name || 'User'}!
                </Text>
            </View>

            {/* Features Grid */}
            <View style={styles.grid}>
                {/* Prescriptions */}
                <TouchableOpacity
                    style={styles.featureItem}
                    onPress={() => router.push('/prescriptions')}
                >
                    <Image
                        source={require('@/assets/images/prescription.png')}
                        style={styles.featureIcon}
                    />
                    <Text style={styles.featureLabel}>Prescriptions</Text>
                </TouchableOpacity>

                {/* Appointments */}
                <TouchableOpacity
                    style={styles.featureItem}
                    onPress={() => router.push('/appointments')}
                >
                    <Image
                        source={require('@/assets/images/appointments.png')}
                        style={styles.featureIcon}
                    />
                    <Text style={styles.featureLabel}>Appointments</Text>
                </TouchableOpacity>

                {/* Profile */}
                <TouchableOpacity
                    style={styles.featureItem}
                    onPress={() => router.push('/profile')}
                >
                    <Image
                        source={require('@/assets/images/profile.png')}
                        style={styles.featureIcon}
                    />
                    <Text style={styles.featureLabel}>Profile</Text>
                </TouchableOpacity>
            </View>

            {/* Footer */}
            <Footer />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    header: {
        alignItems: 'center',
        marginTop: 20,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    welcomeText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 20,
    },
    featureItem: {
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
    },
    featureIcon: {
        width: 60,
        height: 60,
        marginBottom: 8,
    },
    featureLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
    },
    footer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    footerText: {
        fontSize: 12,
        color: '#00BFFF',
        marginTop: 5,
        fontWeight: 'bold',
    },
});

