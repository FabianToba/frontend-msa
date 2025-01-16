import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Modal,
    Alert,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Footer from '@/components/Footer';

interface Medicine {
    id: number;
    name: string;
    dosage: string;
    timesPerDay: number;
}

interface Patient {
    id: number;
    first_name: string;
    last_name: string;
    health_id: number;
}

interface Doctor {
    id: number;
    firstName: string;
    lastName: string;
    specialization: string;
    availableHours: string[];
}

interface Prescription {
    id: number;
    date: string;
    patient: Patient;
    doctor: Doctor;
    medicines: Medicine[];
}

export default function PrescriptionsScreen() {
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

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

    const handleMoreDetails = (prescription: Prescription) => {
        setSelectedPrescription(prescription);
        setModalVisible(true);
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
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => handleMoreDetails(prescription)}
                            >
                                <Text style={styles.buttonText}>More Details</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>
            )}

            <Footer />

            {/* Modal for displaying prescription details */}
            {selectedPrescription && (
                <Modal
                    visible={modalVisible}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <ScrollView contentContainerStyle={styles.modalContent}>
                            <Text style={styles.modalTitle}>Prescription Details</Text>
                            <Text style={styles.modalText}>ID: {selectedPrescription.id}</Text>
                            <Text style={styles.modalText}>Date: {selectedPrescription.date}</Text>

                            <Text style={styles.modalSubtitle}>Patient Details</Text>
                            <Text style={styles.modalText}>Name: {selectedPrescription.patient.first_name} {selectedPrescription.patient.last_name}</Text>
                            <Text style={styles.modalText}>Health ID: {selectedPrescription.patient.health_id}</Text>

                            <Text style={styles.modalSubtitle}>Doctor Details</Text>
                            <Text style={styles.modalText}>Name: Dr. {selectedPrescription.doctor.firstName} {selectedPrescription.doctor.lastName}</Text>
                            <Text style={styles.modalText}>Specialization: {selectedPrescription.doctor.specialization}</Text>

                            <Text style={styles.modalSubtitle}>Medicines</Text>
                            {selectedPrescription.medicines.map((medicine) => (
                                <Text
                                    key={medicine.id}
                                    style={styles.modalText}
                                >
                                    - {medicine.name}: {medicine.dosage}, {medicine.timesPerDay} times/day
                                </Text>
                            ))}

                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.closeButtonText}>Close</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </Modal>
            )}
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
    modalContainer: {
        flex: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 10,
        marginTop: 60,
        padding: 40,
        width: '90%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    modalSubtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 15,
    },
    modalText: {
        fontSize: 16,
        marginBottom: 5,
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: '#ff0026',
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
