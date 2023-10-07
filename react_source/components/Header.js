

import { StyleSheet, Text, View, Image } from 'react-native';



import useWindowDimensions from './Utils.js';
import Button from './Button.js'


const Logo = require('../assets/images/logo.png');
const Bell = require('../assets/images/bx-bell.png');


export default function Header({loggedIn, showNotif}) {
	const { height, width } = useWindowDimensions();
	
  return (
    <View style={styles.header}>
	
		<View style={styles.leftContainer}>
		
			<Image source={Logo}  style={styles.logo}/>
			<Links loggedIn={loggedIn}/>
			
		</View>
		<Account loggedIn={loggedIn} showNotif={showNotif}/>
	</View>
  );
}

function Links({loggedIn}) {
	if (loggedIn){
		return (
			<View style ={styles.links}>
			
				<h3 style = {styles.text}> Groups </h3>
				<h3 style = {styles.text}> Friends </h3>

				<h3 style = {styles.text}> FAQ </h3>
				<h3 style = {styles.text}> About </h3>
				
			</View>
		);
	}else{
		return(
			<View style ={styles.links}>
			
				<h3 style = {styles.text}> FAQ </h3>
				<h3 style = {styles.text}> About </h3>
				
			</View>
		);
	}
}

function Account({loggedIn, showNotif}) {
	if (loggedIn){
		return (
			<View style={styles.rightContainer}>
				<Button style={styles.notif} icon={Bell} onClick={showNotif} />
				<h3 style = {styles.text}>Account Name Here</h3>
			</View>
		);
	}else{
		return(
			<View style={styles.rightContainer}>
				<h3 style = {styles.text}>Login</h3>
				<h3 style= {{color:'#f9f7f3'}}>|</h3>
				<h3 style = {styles.text}>Signup</h3>
			</View>
		);
	}
}



const styles = StyleSheet.create({
  header: {
	position: 'sticky',
	top: 0,
	zIndex: 1,
	height: '4vh',
    width: '100%',
	backgroundColor: '#0FA3B1',
	alignSelf: 'top',
	justifyContent: 'space-between',
	alignItems: 'center',
	flexDirection: 'row',
  },
  leftContainer: {
	  flex:1,
    height: '100%',
	flexDirection: 'row',
    justifyContent: 'flex-start',
	alignItems: 'center',
  },
   rightContainer: {
	   flex:1,
    height: '100%',
	flexDirection: 'row',
	alignItems: 'center',
    justifyContent: 'flex-end',
  },
  logo: {
    aspectRatio: 1,
    justifyContent: 'flex-start',
    height: '100%',
    borderRadius: 18,
  },
  links: {
    flex:1,
    height: '100%',
	flexDirection: 'row',
    justifyContent: 'flex-start',
	alignItems: 'center',
  },
  text: {
	  color: '#f9f7f3',
	  paddingRight: '2.5%',
	  paddingLeft: '2.5%'
  },
  notif: {
    width: '10%',
    height: '50%',
	fill: '#f9f7f3',
    alignItems: 'center',
    justifyContent: 'center',
	borderRadius: 10,
  },
});