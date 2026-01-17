import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import ExpoCheckbox from 'expo-checkbox'
import colors from '../utils/colors'

export default function Checkbox({ text = '', value = false, onValueChange }) {
    return (
        <TouchableOpacity style={styles.view} onPress={onValueChange}>
            <ExpoCheckbox
                value={value}
                onValueChange={onValueChange}
                color={colors.primary_light}
            />
            <Text style={styles.text}>{text}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    view: {
        flexDirection: 'row',
        backgroundColor: colors.primary_light,
        padding: 10,
        borderRadius: 12,
    },
    text: {
        marginLeft: 10,
        fontSize: 20,
        fontWeight: 200,
        color: colors.primary_darken,
    },
})
