import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import Button from './Button'
import colors from '../utils/colors'

interface WelcomeScreenProps {
    onStart?: () => void
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <MaterialCommunityIcons
                    name="map-marker-path"
                    size={100}
                    color={colors.primary}
                />
                <Text style={styles.title}>Rutas</Text>
                <Text style={styles.subtitle}>
                    Consulta las rutas de transporte sobre el mapa y encuentra
                    la tuya.
                </Text>
            </View>
            <Button
                text="Comenzar"
                style={styles.button}
                onPress={onStart}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary_light,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 40,
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '30%',
    },
    title: {
        fontSize: 36,
        fontWeight: '600',
        color: colors.primary_darken,
        marginVertical: 10,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        color: colors.primary_darken,
        marginHorizontal: 30,
    },
    button: {
        backgroundColor: colors.primary_dark,
    },
})
