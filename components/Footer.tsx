import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function Footer() {
    return (
        <View style={styles.footer}>
            <Image
                source={require('@/assets/images/cross.png')} // Replace with your image path
                style={styles.logo}
            />
            <Text style={styles.footerText}>SANTA FABGHICILIA</Text>
        </View>
    );
}

const styles = StyleSheet.create({
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
    logo: {
        width: 100,
        height: 100,
        marginBottom: 5,
    },
});
