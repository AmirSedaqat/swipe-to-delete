import { useState } from "react";
import { Dimensions, Platform, StyleSheet, Switch } from "react-native";
import Animated, {
    interpolateColor,
    useAnimatedStyle,
    useDerivedValue,
    withTiming,
} from "react-native-reanimated";

const ThemeColors = {
    dark: {
        background: "#1e1e1e",
        circle: "#252525",
        text: "#f8f8f8",
    },
    light: {
        background: "#f8f8f8",
        circle: "#ddd",
        text: "#1e1e1e",
    },
};

const SWITCH_TRACK_COLOR = {
    true: "rgba(127, 0, 255,0.2)",
    false: "rgba(0,0,0,.1)",
};

export default function App() {
    type Themes = "light" | "dark";
    const [theme, setTheme] = useState<Themes>("light");

    const progress = useDerivedValue(() => {
        return theme === "dark"
            ? withTiming(1, { duration: 700 })
            : withTiming(0, { duration: 700 });
    });

    const rStyle = useAnimatedStyle(() => {
        const bgColorInterpolate = interpolateColor(
            progress.value,
            [0, 1],
            [ThemeColors.light.background, ThemeColors.dark.background]
        );

        return { backgroundColor: bgColorInterpolate };
    });

    const rCircleStyle = useAnimatedStyle(() => {
        const bgColorCircleInterpolate = interpolateColor(
            progress.value,
            [0, 1],
            [ThemeColors.light.circle, ThemeColors.dark.circle]
        );

        return { backgroundColor: bgColorCircleInterpolate };
    });

    const rTextStyle = useAnimatedStyle(() => {
        const colorInterpolate = interpolateColor(
            progress.value,
            [0, 1],
            [ThemeColors.light.text, ThemeColors.dark.text]
        );

        return { color: colorInterpolate };
    });

    return (
        <Animated.View style={[styles.container, rStyle]}>
            <Animated.Text style={[styles.text, rTextStyle]}>
                THEME
            </Animated.Text>

            <Animated.View style={[styles.circle, rCircleStyle]}>
                <Switch
                    style={
                        Platform.OS === "android"
                            ? { transform: [{ scale: 1.3 }] }
                            : null
                    }
                    value={theme === "dark"}
                    onValueChange={(toggle) => {
                        setTheme(toggle ? "dark" : "light");
                    }}
                    trackColor={SWITCH_TRACK_COLOR}
                    thumbColor={"violet"}
                />
            </Animated.View>
        </Animated.View>
    );
}

const CIRCLE_SIZE = Dimensions.get("window").width * 0.7;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    circle: {
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: CIRCLE_SIZE / 2,

        // Shadow for iOS
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.39,
        shadowRadius: 8.3,
        //Shadow For Android
        elevation: 13,
    },
    text: {
        fontSize: 50,
        marginBottom: 40,
        color: "white",
        fontWeight: "800",
        letterSpacing: 6,
    },
});
