import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useState, useEffect } from 'react';

import Header from './components/Header.js';
import Footer from './components/Footer.js';
import Base from './components/Base.js';
import Login from './components/Login.js';

export default function App() {
	
	const [loggedIn, setLoggedIn] = useState(true);
	
  return (
	<Base style={styles.container} loggedIn={loggedIn}>
	<Login onLogin={() => {setLoggedIn(!loggedIn)}}/>
	</Base>
  );
}

const styles = StyleSheet.create({
  container: {
	  position: 'relative',
	  width: '100%',
	  flex: 1,
    backgroundColor: '#f9f7f3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  darkContainer: {
	  position: 'relative',
	  width: '100%',
	  flex: 1,
    backgroundColor: '#2B2D42',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
