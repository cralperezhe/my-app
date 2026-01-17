import ExpoCheckbox from "expo-checkbox";
import { StyleSheet, Text, View } from "react-native";
import colors from "../utils/colors";

export default function Checkbox({ text = "", value = false, onValueChange }) {
  return (
    <View style={styles.view}>
      <ExpoCheckbox
        value={value}
        onValueChange={onValueChange}
        color={colors.primary}
      />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  view: { flexDirection: "row" },
  text: { marginLeft: 10 },
});
