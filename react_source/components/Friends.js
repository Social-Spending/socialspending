import * as globals from "../utils/globals.js";
import { StyleSheet, Text, View, Image, TouchableHighlight } from "react-native";
import { useState, useEffect } from "react";
import { Link } from "expo-router";

const LoadingGif = require("../assets/images/loading/loading-blue-block-64.gif");

export default function Friends(props) {
  const [activeTab, setActiveTab] = useState("YourFriends");

  const renderContent = () => {
    switch (activeTab) {
      case "YourFriends":
        return <DisplayYourFriendsContent/>
      case "FriendRequests":
        return <DisplayFriendRequestsContent/>
      case "AddFriend":
        return <DisplayAddFriendContent/>
      default:
        return null;
    }
  };

  const renderTab = (tabKey, tabText) => (
    <TouchableHighlight
      key={tabKey}
      style={[styles.label, activeTab === tabKey && styles.activeLabel]}
      onPress={() => setActiveTab(tabKey)}
      underlayColor="transparent"
    >
      <Text style={[globals.styles.h2, styles.labelText]}>{tabText}</Text>
    </TouchableHighlight>
  );

  return (
    <View style={styles.groups}>
      <View style={styles.tabsContainer}>
        {renderTab("YourFriends", "Your friends")}
        {renderTab("FriendRequests", "Friend requests")}
        {renderTab("AddFriend", "Add friend")}
      </View>

      <View style={styles.separator}></View>

      {renderContent()}

    </View>
  );
}


const DisplayYourFriendsContent = () => (
  <View>
    <Text>Hello from YourFriends!</Text>
    {/* TODO */}
  </View>
);


const DisplayFriendRequestsContent = () => (
  <View>
    <Text>Hello from FriendRequests!</Text>
    {/* TODO */}
  </View>
);


const DisplayAddFriendContent = () => (
  <View>
    <Text>Hello from AddFriend!</Text>
    {/*TODO */}
  </View>
);

const styles = StyleSheet.create({
  groups: {
    width: "70vw",
    minHeight: "20em",
    height: "35vw",
    backgroundColor: globals.COLOR_BEIGE,
    minWidth: "20em",
    shadowColor: globals.COLOR_BLACK,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    elevation: 11,
    justifyContent: "flex-start",
    alignItems: "center",
    overflow: "hidden"
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  label: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: globals.COLOR_LIGHT_BLUE,
    borderRadius: 5,
    marginRight: 5,
  },
  activeLabel: {
    backgroundColor: globals.COLOR_BLUE,
  },
  labelText: {
    color: globals.COLOR_BLACK,
  },
  separator: {
    alignSelf: "center",
    height: 1,
    width: "97%",
    padding: "10",
    backgroundColor: globals.COLOR_GRAY,
  },
});
