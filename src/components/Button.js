import { Dimensions, StyleSheet, Text, TouchableOpacity } from 'react-native'
import colors from '../utils/colors'

const { width: windowWidth } = Dimensions.get('window')

export default function Button({ text = '', style, onPress }) {
    return (
        <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
            <Text style={styles.text}>{text}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        width: windowWidth * 0.4,
        margin: 10,
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        backgroundColor: colors.primary,
    },
    text: {
        color: 'white',
        fontWeight: '300',
    },
})
