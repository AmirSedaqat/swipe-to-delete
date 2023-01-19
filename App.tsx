import { ScrollView, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";

import React, { useState, useCallback } from "react";
import ListItem from "./components/ListItem";

const TITLES = [
    "Learning TypeScript Course 👾",
    "Learning React Native Course 💙",
    "Learning Reanimated 2 Course 👽",
    "Learning React Navigation Course 🎩",
];

export interface TaskInterface {
    title: string;
    index: number;
}
const Tasks: TaskInterface[] = TITLES.map((title, index) => ({ title, index }));
const BACKGROUND_COLOR = "#FAFBFF";
const App = () => {
    // States
    const [tasks, setTasks] = useState(Tasks);
    console.log(tasks);

    //LOGIC Remove from State with Dismiss Task
    const onDismiss = useCallback((task: TaskInterface) => {
        setTasks((tasks) => tasks.filter((item) => item.index !== task.index));
    }, []);
    //LOGIC Remove from State with Dismiss Task

    return (
        <GestureHandlerRootView style={styles.container}>
            <StatusBar style="auto" />

            <Text style={styles.title}>Tasks</Text>

            <ScrollView>
                {tasks.map((task) => (
                    <ListItem
                        key={task.index}
                        task={task}
                        onDismiss={onDismiss}
                    />
                ))}
            </ScrollView>
        </GestureHandlerRootView>
    );
};

export default App;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BACKGROUND_COLOR,
    },
    title: {
        fontSize: 50,
        marginVertical: 10,
        padding: 15,
    },
});
