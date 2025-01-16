import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Footer from '@/components/Footer';
import {router, useRouter} from 'expo-router';

interface Appointment {
    id: number;
    date: string;
    time: string;
    status: string;
    doctor: {
        firstName: string;
        lastName: string;
    };
}

export default function AppointmentsScreen() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const userId = await AsyncStorage.getItem('userId');
                if (!userId) {
                    console.error('No user ID found in AsyncStorage');
                    setAppointments([]);
                    return;
                }

                const response = await axios.get(
                    `http://192.168.1.130:8080/api/v1/appointment/patient/${userId}`
                );

                if (response.data && Array.isArray(response.data)) {
                    setAppointments(response.data);
                } else {
                    console.error('Unexpected API Response:', response.data);
                    setAppointments([]);
                }
            } catch (error) {
                console.error('Error fetching appointments:', error);
                setAppointments([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    const handleCancelAppointment = async (appointmentId: number) => {
        try {
            const response = await axios.put(
                `http://192.168.1.130:8080/api/v1/appointment/${appointmentId}`,
                { id: appointmentId, status: 'CANCELLED' } // Update the status of this appointment
            );

            if (response.status === 200) {
                // Update the local state to reflect the cancelled appointment
                setAppointments((prevAppointments) =>
                    prevAppointments.map((appointment) =>
                        appointment.id === appointmentId
                            ? { ...appointment, status: 'CANCELLED' }
                            : appointment
                    )
                );
                Alert.alert('Success', `The appointment ${appointmentId} has been cancelled.`);
            } else {
                console.error('Failed to cancel the appointment:', response);
                Alert.alert('Error', 'Failed to cancel the appointment. Please try again.');
            }
        } catch (error) {
            console.error('Error during appointment cancellation:', error);
            Alert.alert('Error', 'An error occurred while cancelling the appointment.');
        }
    };

    return (
        <View style={styles.mainContainer}>
            <Text style={styles.title}>Your Appointments</Text>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Loading appointments...</Text>
                </View>
            ) : appointments.length === 0 ? (
                <View style={styles.loadingContainer}>
                    <Text style={styles.subtitle}>No appointments available</Text>
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.container}>
                    {appointments.map((appointment) => (
                        <View key={appointment.id} style={styles.card}>
                            <Text style={styles.cardTitle}>{`Appointment ID: ${appointment.id || 'N/A'}`}</Text>
                            <View style={styles.row}>
                                <Text style={styles.label}>Date:</Text>
                                <Text style={styles.value}>{appointment.date || 'N/A'}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Time:</Text>
                                <Text style={styles.value}>{appointment.time || 'N/A'}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Status:</Text>
                                <Text style={styles.value}>{appointment.status || 'N/A'}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Doctor:</Text>
                                <Text style={styles.value}>
                                    {appointment.doctor?.firstName || 'Unknown'} {appointment.doctor?.lastName || ''}
                                </Text>
                            </View>
                            <TouchableOpacity
                                style={
                                    appointment.status === 'COMPLETED' || appointment.status === 'CANCELLED'
                                        ? [styles.button, styles.disabledButton]
                                        : styles.button
                                }
                                disabled={appointment.status === 'COMPLETED' || appointment.status === 'CANCELLED'}
                                onPress={() => handleCancelAppointment(appointment.id)}
                            >
                                <Text
                                    style={
                                        appointment.status === 'COMPLETED' || appointment.status === 'CANCELLED'
                                            ? [styles.buttonText, styles.disabledButtonText]
                                            : styles.buttonText
                                    }
                                >
                                    Cancel Appointment
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>
            )}

            {/* Add Appointment Button */}
            <TouchableOpacity style={styles.addButton}
                              onPress={() => router.push('/add_appointment')}>
                <Text style={styles.addButtonText}>Add Appointment</Text>
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
    loadingText: {
        fontSize: 18,
        color: '#00BFFF',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 20,
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
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    label: {
        fontWeight: 'bold',
        color: '#555',
    },
    value: {
        color: '#00BFFF',
    },
    button: {
        marginTop: 10,
        backgroundColor: '#ff0026',
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: '#d3d3d3',
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 5,
        color: '#555',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    disabledButtonText: {
        color: '#a9a9a9',
    },
    addButton: {
        backgroundColor: '#00BFFF',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginHorizontal: 20,
        marginBottom: 100,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
