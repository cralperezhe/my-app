import { Modal as ReactModal } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

interface ModalProps {
    children?: React.ReactNode
    visible?: boolean
    closeModal?: () => void
    style?: object
}

export default function Modal({
    children,
    visible = false,
    closeModal,
    style,
}: ModalProps) {
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
