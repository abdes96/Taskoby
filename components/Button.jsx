import { Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";

const COLORS = {
  white: "#FFFFFF",
  black: "#222222",
  primary: "#62D2C3",
  secondary: "#62D2C3",
  grey: "#CCCCCC",
};

const Button = (props) => {
  const filledBgColor = props.color || COLORS.primary;
  const outlinedColor = COLORS.white;
  const bgColor = props.bgColor || props.filled ? filledBgColor : outlinedColor;
  const textColor = props.filled ? COLORS.white : COLORS.black;

  return (
    <TouchableOpacity
      style={{
        ...styles.button,
        ...{ backgroundColor: bgColor },
        ...props.style,
      }}
      onPress={props.onPress}
    >
      <Text style={{ ...styles.text, fontSize: 20, ...{ color: textColor } }}>
        {props.title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingBottom: 16,
    paddingVertical: 10,
    borderColor: COLORS.white,
    width: "100%",
    borderWidth: 1,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontFamily: "Poppins",
    fontWeight: "bold",
  },
});
export default Button;
