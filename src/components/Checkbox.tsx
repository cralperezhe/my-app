import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import ExpoCheckbox from 'expo-checkbox'
import colors from '../utils/colors'

interface CheckboxProps {
    text?: string
    value?: boolean
    onValueChange?: () => void
    color?: string
}

export default function Checkbox({
    text = '',
    value = false,
    onValueChange,
    color = colors.primary_light,
}: CheckboxProps) {
    return (
        <TouchableOpacity
            style={[styles.view, { backgroundColor: color }]}
            onPress={onValueChange}
        >
            <ExpoCheckbox
                value={value}
                onValueChange={onValueChange}
                color={color}
            />
            <Text style={styles.text}>{text}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    view: {
        flexDirection: 'row',
        padding: 10,
        borderRadius: 12,
    },
    text: {
        marginLeft: 10,
        fontSize: 20,
        fontWeight: '200',
        color: 'white',
    },
})
