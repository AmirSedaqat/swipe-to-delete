import { Dimensions, StyleSheet, Text } from "react-native";
import React from "react";
import { TaskInterface } from "../App";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";

interface ListItemProps {
    task: TaskInterface;
    onDismiss?: (task: TaskInterface) => void;
}
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

const ListItem: React.FC<ListItemProps> = ({ task, onDismiss }) => {
    // Shared Values
    const translateX = useSharedValue(0);
    const itemHeight = useSharedValue(LIST_ITEM_HEIGHT);
    const marginVertical = useSharedValue(10);
    const opacity = useSharedValue(1);
    // Shared Values
    const { width: SCREEN_WIDTH } = Dimensions.get("window");
    const TRANSLATE_X_TRESHOLD = -SCREEN_WIDTH * 0.3;
    const gesture = Gesture.Pan()
        .onUpdate((event) => {
            translateX.value = event.translationX;
        })
        .onEnd(() => {
            if (translateX.value < TRANSLATE_X_TRESHOLD) {
                translateX.value = withTiming(-SCREEN_WIDTH);
                itemHeight.value = withTiming(0);
                marginVertical.value = withTiming(0);
                opacity.value = withTiming(0, undefined, (isFinished) => {
                    if (isFinished && onDismiss) {
                        runOnJS(onDismiss)(task);
                    }
                });
            } else {
                translateX.value = withTiming(0);
            }
        });

    // Animated Styles
    const rStyle = useAnimatedStyle(() => ({
        transform: [
            {
                translateX: translateX.value,
            },
        ],
    }));
    const rItemContainer = useAnimatedStyle(() => ({
        width: Math.abs(translateX.value) + 20,
    }));

    const rTaskContainer = useAnimatedStyle(() => {
        return {
            height: itemHeight.value,
            marginVertical: marginVertical.value,
            opacity: opacity.value,
        };
    });
    // Animated Styles
    return (
        <Animated.View style={[styles.taskContainer, rTaskContainer]}>
            <Animated.View style={[styles.iconContainer, rItemContainer]}>
                <FontAwesome
                    name="trash-o"
                    size={LIST_ITEM_HEIGHT * 0.5}
                    color="white"
                    style={{ right: "10%", paddingHorizontal: 10 }}
                />
            </Animated.View>
            <GestureDetector gesture={gesture}>
                <Animated.View style={[styles.task, rStyle]}>
                    <Text style={styles.taskTitle}>{task.title}</Text>
                </Animated.View>
            </GestureDetector>
        </Animated.View>
    );
};

export default ListItem;

const LIST_ITEM_HEIGHT = 70;

const styles = StyleSheet.create({
    taskContainer: {
        width: "100%",
        alignItems: "center",
    },
    task: {
        justifyContent: "center",
        width: "90%",
        height: LIST_ITEM_HEIGHT,
        backgroundColor: "#fff",
        elevation: 5,
        paddingLeft: 20,
        borderRadius: 12,
    },
    taskTitle: {
        fontSize: 15,
    },
    iconContainer: {
        right: "5%",
        backgroundColor: "red",
        height: LIST_ITEM_HEIGHT,
        position: "absolute",
        justifyContent: "center",
        alignItems: "flex-end",
        borderTopRightRadius: 12,
        borderBottomRightRadius: 12,
    },
});
