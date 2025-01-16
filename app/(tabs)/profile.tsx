import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';
import Footer from '@/components/Footer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

interface Profile {
    id: number;
    first_name: string;
    last_name: string;
    dob: string;
    email: string;
    health_id: number;
    age: number;
}

export default function ProfileScreen() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userId = await AsyncStorage.getItem('userId'); // Get the logged-in user's ID
                if (!userId) {
                    router.push('/'); // Redirect to login if user ID is missing
                    return;
                }

                const response = await axios.get(`http://192.168.1.130:8080/api/v1/patient/${userId}`);
                setProfile(response.data);
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('userId'); // Clear the stored user ID
            router.push('/'); // Redirect to the login page
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading profile...</Text>
            </View>
        );
    }

    if (!profile) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.subtitle}>No profile data available</Text>
            </View>
        );
    }

    return (
        <View style={styles.mainContainer}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <Image
                        source={require('@/assets/images/image.png')}
                        style={styles.avatar}
                    />
                    <Text style={styles.title}>Your Profile</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.infoText}>
                        <Text style={styles.label}>First Name: </Text>{profile.first_name}
                    </Text>
                    <Text style={styles.infoText}>
                        <Text style={styles.label}>Last Name: </Text>{profile.last_name}
                    </Text>
                    <Text style={styles.infoText}>
                        <Text style={styles.label}>Date of Birth: </Text>{profile.dob}
                    </Text>
                    <Text style={styles.infoText}>
                        <Text style={styles.label}>E-mail: </Text>{profile.email}
                    </Text>
                    <Text style={styles.infoText}>
                        <Text style={styles.label}>Health Card Number: </Text>{profile.health_id}
                    </Text>
                    <Text style={styles.infoText}>
                        <Text style={styles.label}>Age: </Text>{profile.age}
                    </Text>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Edit Profile</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.redButton} onPress={handleLogout}>
                    <Text style={styles.buttonText}>Log out</Text>
                </TouchableOpacity>
            </ScrollView>
            <Footer />
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    avatar: {
        width: 200,
        height: 200,
        borderRadius: 50,
        marginBottom: 10,
    },
    header: {
        alignItems: 'center',
        marginTop: 20,
    },
    container: {
        padding: 20,
        backgroundColor: '#fff',
        flexGrow: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    loadingText: {
        fontSize: 18,
        color: '#00BFFF',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 40,
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 5,
        color: '#555',
    },
    card: {
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    infoText: {
        fontSize: 16,
        marginBottom: 10,
        color: '#555',
    },
    label: {
        fontWeight: 'bold',
        color: '#333',
    },
    button: {
        marginTop: 20,
        backgroundColor: '#00BFFF',
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    redButton: {
        marginTop: 20,
        backgroundColor: '#ff0000',
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
        width: '50%',
        alignSelf: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
