import * as globals from "../utils/globals.js";
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Modal } from "react-native";
import { useState, useEffect } from "react";
import { Link } from "expo-router";

const LoadingGif = require("../assets/images/loading/loading-blue-block-64.gif");

export default function Friends(props) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [friendName, setFriendName] = useState("");

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const sendFriendRequest = () => {
    /*TODO Add logic to send friend requests
     * For now, just console.log that any non-empty name friend request was successfully sent
     * Maybe update modal with a feedback message that says "Friend request successfully sent to {name}"? Idk, to be figured out later
     * */
    if (friendNameExists(friendName)) {
      console.log("Friend request sent");
    } else {
      console.log("User not found");
    }
    setModalVisible(false);
  };

  const friendNameExists = (name) => {
    /* TODO
     * Add logic to check if the friend exists
     * For now, assume any non-empty name is valid
     * */
    return name.trim() !== "";
  };

  return (
    <View style={[styles.pane, props.style]}>
      <View style={{ justifyContent: "space-between", flexDirection: "row", width: "100%" }}>
        <Text style={[globals.styles.h2, styles.label]}>FRIENDS</Text>
        <TouchableOpacity onPress={toggleModal}>
          <Text style={[globals.styles.h3, styles.addFriend]}>Add Friend</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.horizontalBar} />

      <FriendsList />

      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setModalVisible(!isModalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Friend</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter friend's name"
              onChangeText={(text) => setFriendName(text)}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.addButton} onPress={sendFriendRequest}>
                <Text style={styles.buttonText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={toggleModal}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}


function FriendsList() {
  /*
   * friendItem = current state
   * setFriendItem = name of the function that changes the current state
   *
   * useState() takes one parameter representing the initial value of current state (`friendItem` in this case)
   * useState() returns an array of two items: the initial state, and a function to update the current state
   *
   * Using an anonymous function -- useState(() => {...}) -- to set the initial state ensures that the current state is only set the first time this component is rendered
   * */
  let [friendItems, setFriendItems] = useState(() => {
    return null;
  });

  /*
   * useEffect takes 2 parameters: a function and an array of variables.
   * The function MUST take NO parameters
   * The array of variables representing dependencies. Whenever any of those variables change, useEffect() gets called. If the array is empty, useEffect() only gets called
   * on first render of this component
   *
   * We use useEffect() so that whenever this component renders, we obtain the current list of friends
   * */
  useEffect(() => {
    async function getFriends() {
      setFriendItems(await generateFriendsList())
    }
    getFriends();
  }, [])

  if (friendItems == null) {
    return (
      <View style={globals.styles.list}>
        <Image source={LoadingGif} style={globals.styles.loading} />
      </View>
    );
  } else {
    return (
      <View style={globals.styles.list}>
        {friendItems}
      </View>
    );
  }
}


function FriendItem(props) {
  let name = props.name
  let id = props.id
  
  return (
    /* TODO
     * Currently, clicking on any of your friends would redirect you to `socialspendingapp.com/profile/{id}` which would be their profile
     * Is this how we wanna do that? 
     * */
    <Link href={"profile/" + id} asChild>
      <View style={props.border ? globals.styles.listItemSeperator : globals.styles.listItem}>
        <Text style={globals.styles.listText}>{name}</Text>
      </View>
    </Link>
  )
}


async function generateFriendsList() {
  // Ideally this would be an array of the user's friends stored as strings
  // To be figured out later
  let friends_list = [];

  // This is just sample data
  let list_of_friendItems = [];
  let sample_list = [
    "Matthew Duphily",
    "Matthew Frances",
    "Nick Jones",
    "Ryder Reed",
    "Brandon Jose Tenorio Noguera",
    "Samit Shivadekar",
    "Jayalakshmi Mangalagiri",
    "Barack Obama",
  ];

  friends_list = sample_list;

  for (let i = 0; i < friends_list.length; i++) {
    list_of_friendItems.push(
      <FriendItem key={i} name={friends_list[i]} id={i} border={i > 0}/>
    );
  }
  
  return list_of_friendItems;
}



const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: globals.COLOR_WHITE,
    padding: 20,
    borderRadius: 10,
    width: "30%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  addButton: {
    backgroundColor: globals.COLOR_ORANGE,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginRight: 5,
  },
  cancelButton: {
    backgroundColor: globals.COLOR_GRAY,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginLeft: 5,
  },
  buttonText: {
    color: globals.COLOR_WHITE,
    fontWeight: "bold",
  },
  pane: {
    width: '35vw',
    minHeight: '20em',
    height: '25vw',
    backgroundColor: globals.COLOR_WHITE,
    minWidth: '20em',
    boxShadow: '0px 0px 5px 5px #eee',

    justifyContent: 'flex-start',
    alignItems: 'left',
    overflow: 'hidden'
  },
  label: {
    marginLeft: '3%',
    paddingLeft: ' .5em',
    paddingTop: '2em',
    paddingBottom: '0em',
    color: globals.COLOR_GRAY,
  },
  addFriend: {
    marginRight: '3%',
    paddingRight: ' .5em',
    paddingTop: '2em',
    paddingBottom: '0em',
    color: globals.COLOR_ORANGE,
    alignSelf: 'flex-end',
  },
  addFriendText : {
    color: globals.COLOR_ORANGE,
    paddingRight: "0.5em",
  },
  horizontalBar: {
    alignSelf: 'center',
    height: '1px',
    width: '92%',
    backgroundColor: globals.COLOR_GRAY,
  },
  successText: {
    color: 'green',
    marginTop: 10,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
});
