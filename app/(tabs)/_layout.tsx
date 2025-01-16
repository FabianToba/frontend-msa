import { Stack } from 'expo-router';
import React from 'react';

export default function AppLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false, // Hide headers for all screens
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    title: 'Home', // Title for the home screen
                }}
            />
            <Stack.Screen
                name="explore"
                options={{
                    title: 'Explore', // Title for the explore screen
                }}
            />
        </Stack>
    );
}
