import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Alert,
    TouchableOpacity,
    Image,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { useRouter } from 'expo-router';

interface Doctor {
    id: number;
    firstName: string;
    lastName: string;
    specialization: string;
    availableHours: string[];
}

export default function AddAppointmentScreen() {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<string>('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await axios.get('http://192.168.1.130:8080/api/v1/doctor');
                setDoctors(response.data);
            } catch (error) {
                console.error('Error fetching doctors:', error);
                Alert.alert('Error', 'Failed to fetch doctors.');
            }
        };

        fetchDoctors();
    }, []);

    const handleDoctorChange = (doctorId: number) => {
        setSelectedDoctorId(doctorId);
        const doctor = doctors.find((doc) => doc.id === doctorId);

        if (doctor) {
            const slots = doctor.availableHours.flatMap((slot) => {
                const [day, time] = slot.split(' ');
                const [startTime, endTime] = time.split('-');
                return [
                    `${day} ${startTime}`,
                    `${day} ${endTime}`,
                ];
            });
            setAvailableSlots(slots);
        } else {
            setAvailableSlots([]);
        }

        setSelectedSlot('');
    };

    const handleDateChange = (event: any, date?: Date) => {
        if (date) {
            setSelectedDate(date);
        }
        setShowDatePicker(false); // Close the date picker after selecting a date
    };

    const handleSubmit = async () => {
        if (!selectedDoctorId || !selectedDate || !selectedSlot) {
            Alert.alert('Error', 'Please fill out all fields.');
            return;
        }

        const payload = {
            date: selectedDate.toISOString().split('T')[0], // Format the date
            time: selectedSlot.split(' ')[1], // Extract the time part
            status: 'SCHEDULED',
            patient: { id: 1 }, // Replace with the actual patient ID
            doctor: { id: selectedDoctorId }, // Selected doctor ID
        };

        console.log('Booking appointment payload:', payload);

        try {
            const response = await axios.post('http://192.168.1.130:8080/api/v1/appointment', payload);

            if (response.status === 201 || response.status === 200) {
                Alert.alert('Success', 'Appointment successfully booked!');
                router.push('/(tabs)/appointments');
            } else {
                console.error('Unexpected response:', response);
                Alert.alert('Error', 'Failed to book the appointment.');
            }
        } catch (error) {
            // @ts-ignore
            console.error('Error booking appointment:', error.response?.data || error.message);

            Alert.alert(
                'Error',
                // @ts-ignore
                error.response?.data?.message || 'An error occurred while booking the appointment.'
            );
        }
    };

    return (
        <View style={styles.container}>
            <Image source={require('@/assets/images/cross.png')} style={styles.logo} />
            <Text style={styles.title}>Add Appointment</Text>

            <Text style={styles.label}>Select Doctor</Text>
            <Picker
                selectedValue={selectedDoctorId}
                onValueChange={(itemValue) => handleDoctorChange(Number(itemValue))}
                style={styles.picker}
            >
                <Picker.Item label="Select a doctor" value={null} />
                {doctors.map((doctor) => (
                    <Picker.Item
                        key={doctor.id}
                        label={`Dr. ${doctor.firstName} ${doctor.lastName}`}
                        value={doctor.id}
                    />
                ))}
            </Picker>

            <Text style={styles.label}>Select Date</Text>
            <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
            >
                <Text style={styles.dateButtonText}>
                    {selectedDate ? selectedDate.toDateString() : 'Choose a date'}
                </Text>
            </TouchableOpacity>
            {showDatePicker && (
                <DateTimePicker
                    value={selectedDate || new Date()}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                    minimumDate={new Date()}
                />
            )}

            <Text style={styles.label}>Select Time Slot</Text>
            <Picker
                selectedValue={selectedSlot}
                onValueChange={(itemValue) => setSelectedSlot(itemValue)}
                style={styles.picker}
            >
                <Picker.Item label="Select a time slot" value="" />
                {availableSlots.map((slot, index) => (
                    <Picker.Item key={index} label={slot} value={slot} />
                ))}
            </Picker>

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Book Appointment</Text>
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
    picker: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: '#f9f9f9',
        marginBottom: 20,
    },
    dateButton: {
        width: '100%',
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: '#f9f9f9',
        marginBottom: 20,
    },
    dateButtonText: {
        color: '#333',
    },
    button: {
        backgroundColor: '#00BFFF',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
        width: '100%',
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
