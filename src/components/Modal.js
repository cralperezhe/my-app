import { Modal as ReactModal } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function Modal({ children, visible = false, closeModal }) {
  const insets = useSafeAreaInsets();

  return (
    <ReactModal
      animationType="slide"
      visible={visible}
      onRequestClose={closeModal}
      presentationStyle="fullScreen"
    >
      <SafeAreaView
        style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      >
        {children}
      </SafeAreaView>
    </ReactModal>
  );
}
