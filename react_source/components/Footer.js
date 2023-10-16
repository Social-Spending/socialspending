

import { StyleSheet, Text, View, Image } from 'react-native';

const Logo = require('../assets/images/logo.png');

export default function Footer() {
  return (
  
    <View style={styles.footer}>
	
		<View style={styles.leftContainer}>
		</View>
		<Text style={{color:'#f9f7f3'}}>Copyright SocialSpending© 2023</Text>
		<View style={styles.rightContainer}>
			
		</View>
	</View>
  );
}

const styles = StyleSheet.create({
  footer: {
	  position: 'absolute',
	bottom: 0,
	zIndex: 1,
    width: '100%',
    height: '4vh',
	minHeight: '1.75em',
	backgroundColor: '#00000099',
	alignSelf: 'top',
	justifyContent: 'space-between',
	alignItems: 'center',
	flexDirection: 'row',
	opacity: .8
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
  
});