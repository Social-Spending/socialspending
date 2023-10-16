
import { StyleSheet, Text, View } from 'react-native';
import { Redirect } from "expo-router";


export default function Page() {


  return (
    <Redirect href='/login'/>
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
