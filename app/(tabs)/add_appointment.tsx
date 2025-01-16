import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';

interface Doctor {
    id: number;
    firstName: string;
    lastName: string;
    specialization: string;
    availableHours: string[];
}

export default function AddAppointmentScreen() {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await axios.get(
                    'http://192.168.1.130:8080/api/v1/doctors'
                );
                setDoctors(response.data);
            } catch (error) {
                console.error('Error fetching doctors:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();
    }, []);

    const handleDoctorSelection = (doctorId: number) => {
        const selected = doctors.find((doc) => doc.id === doctorId);
        setSelectedDoctor(selected || null);

        if (selected) {
            const slots = selected.availableHours.map((slot) => {
                const [day, time] = slot.split(' ');
                return `${day}: ${time}`;
            });
            setAvailableSlots(slots);
        } else {
            setAvailableSlots([]);
        }
        setSelectedSlot(null);
        setSelectedDate(null);
    };

    const handleDateChange = (event: any, date?: Date) => {
        if (date) {
            setSelectedDate(date);
        }
    };

    const handleSubmit = async () => {
        if (!selectedDoctor || !selectedSlot || !selectedDate) {
            alert('Please fill all fields before submitting.');
            return;
        }

        try {
            const appointmentData = {
                doctorId: selectedDoctor.id,
                date: selectedDate.toISOString().split('T')[0],
                time: selectedSlot.split(': ')[1], // Extract time from slot
            };

            const response = await axios.post(
                'http://192.168.1.130:8080/api/v1/appointment',
                appointmentData
            );

            if (response.status === 201) {
                alert(
                    `Appointment successfully booked with Dr. ${selectedDoctor.firstName} ${selectedDoctor.lastName}!`
                );
            } else {
                alert(
                    'There was an error booking the appointment. Please try again.'
                );
            }
        } catch (error) {
            console.error('Error booking appointment:', error);
            alert('Could not book the appointment. Please try again.');
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Book an Appointment</Text>

            <Text style={styles.label}>Select Doctor</Text>
            <Picker
                selectedValue={selectedDoctor?.id?.toString() || ''}
                onValueChange={(itemValue: string) => handleDoctorSelection(Number(itemValue))}
                style={styles.picker}
            >
                <Picker.Item label="Select a Doctor" value="" />
                {doctors.map((doctor) => (
                    <Picker.Item
                        key={doctor.id}
                        label={`Dr. ${doctor.firstName} ${doctor.lastName} - ${doctor.specialization}`}
                        value={doctor.id.toString()} // Use string here
                    />
                ))}
            </Picker>

            {selectedDoctor && (
                <>
                    <Text style={styles.label}>Select Date</Text>
                    <DateTimePicker
                        value={selectedDate || new Date()}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                        minimumDate={new Date()}
                        style={styles.datePicker}
                    />

                    <Text style={styles.label}>Select Available Slot</Text>
                    <Picker
                        selectedValue={selectedSlot || ''}
                        onValueChange={(itemValue: string) =>
                            setSelectedSlot(itemValue)
                        }
                        style={styles.picker}
                    >
                        <Picker.Item label="Select a Slot" value="" />
                        {availableSlots.map((slot, index) => (
                            <Picker.Item key={index} label={slot} value={slot} />
                        ))}
                    </Picker>
                </>
            )}

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Book Appointment</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 18,
        color: '#00BFFF',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    picker: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 20,
        backgroundColor: '#f9f9f9',
    },
    datePicker: {
        marginVertical: 10,
    },
    button: {
        marginTop: 20,
        backgroundColor: '#00BFFF',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
