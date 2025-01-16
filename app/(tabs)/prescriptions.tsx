import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Footer from '@/components/Footer';

interface Medicine {
    name: string;
    dosage: string;
}

interface Prescription {
    id: number;
    date: string;
    medicines: Medicine[];
}

export default function PrescriptionsScreen() {
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPrescriptions = async () => {
            try {
                const userId = await AsyncStorage.getItem('userId');
                if (!userId) {
                    console.error('No user ID found in AsyncStorage');
                    setPrescriptions([]);
                    return;
                }

                const response = await axios.get(
                    `http://192.168.1.130:8080/api/v1/prescription/patient/${userId}`
                );

                if (response.data && Array.isArray(response.data)) {
                    setPrescriptions(response.data);
                } else {
                    console.error('Unexpected API Response:', response.data);
                    setPrescriptions([]);
                }
            } catch (error) {
                console.error('Error fetching prescriptions:', error);
                setPrescriptions([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPrescriptions();
    }, []);

    const handleAddPrescription = () => {
        console.log('Add Prescription button clicked');
        // Navigate to Add Prescription Page or Handle the Logic
    };

    return (
        <View style={styles.mainContainer}>
            <Text style={styles.title}>Your Prescriptions</Text>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Loading prescriptions...</Text>
                </View>
            ) : prescriptions.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.subtitle}>No prescriptions available</Text>
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.container}>
                    {prescriptions.map((prescription) => (
                        <View key={prescription.id} style={styles.card}>
                            <Text style={styles.cardTitle}>{`Prescription ID: ${prescription.id || 'N/A'}`}</Text>
                            <Text style={styles.subtitle}>{`Date: ${prescription.date || 'N/A'}`}</Text>
                            <Text style={styles.subtitle}>Medicines:</Text>
                            {prescription.medicines && prescription.medicines.length > 0 ? (
                                prescription.medicines.map((medicine, index) => (
                                    <Text key={index} style={styles.medicineText}>
                                        - {medicine.name || 'Unknown Medicine'}: {medicine.dosage || 'No Dosage'}
                                    </Text>
                                ))
                            ) : (
                                <Text style={styles.medicineText}>No medicines listed</Text>
                            )}
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => console.log(`More details for prescription ${prescription.id}`)}
                            >
                                <Text style={styles.buttonText}>More Details</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>
            )}

            {/* Add Prescription Button */}
            <TouchableOpacity style={styles.addButton} onPress={handleAddPrescription}>
                <Text style={styles.addButtonText}>Add Prescription</Text>
            </TouchableOpacity>

            <Footer />
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#fff',
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
    emptyContainer: {
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
        marginBottom: 10,
        marginTop: 40,
        textAlign: 'center',
        color: '#333',
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
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 5,
        color: '#555',
    },
    medicineText: {
        fontSize: 14,
        color: '#333',
    },
    button: {
        marginTop: 10,
        backgroundColor: '#00BFFF',
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    addButton: {
        backgroundColor: '#00BFFF',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginHorizontal: 20,
        marginBottom: 100, // Adjust this value to place the button above the Footer
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

