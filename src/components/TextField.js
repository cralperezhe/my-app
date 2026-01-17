import { StyleSheet, TextInput } from 'react-native'
import colors from '../utils/colors'

export default function TextField({
    value = '',
    placeholder = '',
    onChangeText,
    style,
}) {
    return (
        <TextInput
            style={[styles.input, style]}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
        />
    )
}

const styles = StyleSheet.create({
    input: {
        backgroundColor: colors.primary_light,
        marginHorizontal: 15,
        paddingLeft: 10,
        borderRadius: 8,
        height: 50,
        color: colors.primary_darken,
    },
})
