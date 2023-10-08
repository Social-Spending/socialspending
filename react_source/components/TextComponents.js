import { StyleSheet, Text, } from 'react-native';
import { Link } from "expo-router";


export function HeaderText(props) {
  return (
    <Text style={[pickStyle(props.size), props.style]}>{props.children}</Text>
  );
}

export function HeaderLink(props) {

  return (
	<Link style={props.style} href={props.href} asChild>
		<Text style={pickStyle(props.size)}>{props.children}</Text>
	</Link>
  );
}


function pickStyle(styleId){
	switch (styleId) {
		case 1:
			return styles.h1;
		case 2:
			return styles.h2;
	    case 3:
			return styles.h3;
		case 4:
			return styles.h4;
		case 5:
			return styles.h5;
		case 6:
			return styles.h6;
		default:
			return styles.h4;
			break;
		
	}
	
}



const styles = StyleSheet.create({
  h1:{
	  
	  padding: '1em',
	  fontSize: '2em',
	  fontWeight: 'bolder'
  },
  h2:{
	  
	  padding: '.75em',
	  fontSize: '1.5em',
	  fontWeight: 'bolder'
  },
  h3:{
	  
	  padding: '.566em',
	  fontSize: '1.17em',
	  fontWeight: 'bolder'
  },
  h4:{
	  
	  padding: '.5em',
	  fontSize: '1em',
	  fontWeight: 'bolder'
  },
  h5:{
	  
	  padding: '.416em',
	  fontSize: '.83em',
	  fontWeight: 'bolder'
  },
  h6:{
	  
	  padding: '.33em',
	  fontSize: '.67em',
	  fontWeight: 'bolder'
  },
  
});
