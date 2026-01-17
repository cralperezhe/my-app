import { Modal as ReactModal } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Modal({
    children,
    visible = false,
    closeModal,
    style,
}) {
    return (
        <ReactModal
            animationType="slide"
            visible={visible}
            onRequestClose={closeModal}
            presentationStyle="fullScreen"
            style={style}
        >
            <SafeAreaView>{children}</SafeAreaView>
        </ReactModal>
    )
}
