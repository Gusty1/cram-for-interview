import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AntDesign, Entypo, Ionicons } from "react-native-vector-icons";
import {
  MD3DarkTheme,
  MD3LightTheme,
  adaptNavigationTheme,
  PaperProvider,
} from "react-native-paper";
import useStore from "../store/index";
import HomeScreen from "./screens/HomeScreen";
import FavoriteScreen from "./screens/FavoriteScreen";
import SettingScreen from "./screens/SettingScreen";

const { LightTheme } = adaptNavigationTheme({
  reactNavigationLight: MD3LightTheme,
});
const { DarkTheme } = adaptNavigationTheme({
  reactNavigationDark: MD3DarkTheme,
});

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Stack Navigator for Home
const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

// Stack Navigator for Favorite
const FavoriteStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="FavoriteScreen"
        component={FavoriteScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const SettingStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SettingScreen"
        component={SettingScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

// BottomTabs 用於切換底部導航選項
const BottomTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          headerShown: true,
          headerTitle: "面試抱佛腳",
          title: "首頁",
          headerTitleAlign: "center",
          tabBarIcon: ({ color, size }) => (
            <Entypo name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="FavoriteTab"
        component={FavoriteStack}
        options={{
          headerShown: true,
          title: "收藏",
          headerTitleAlign: "center",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="heart" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="SettingTab"
        component={SettingStack}
        options={{
          headerShown: true,
          title: "設定",
          headerTitleAlign: "center",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-sharp" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { setting, getSetting } = useStore();
  if (!setting) getSetting();
  let theme = {};
  if (setting && setting.darkMode) theme = DarkTheme;
  else theme = LightTheme;

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer theme={theme}>
        <BottomTabs />
      </NavigationContainer>
    </PaperProvider>
  );
};

export default AppNavigator;
