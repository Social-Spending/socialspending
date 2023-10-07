import { StyleSheet, View, Pressable, Text, Image } from 'react-native';



export default function Button({ label, style, icon, onClick }) {
  return (
    <View style={style}>
      <Pressable style={styles.button} onPress={onClick}>
		<Icon icon={icon}/>
        <h3 style={styles.buttonLabel}>{label}</h3>
      </Pressable>
    </View>
  );
}

function Icon({icon}) {
	if (icon){
		return (
			<Image source={icon}  style={styles.icon}/>
		);
	}else{
		return;
	}
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonIcon: {
    paddingRight: 8,
  },
  buttonLabel: {
    color: '#000',
  },
  icon: {
    aspectRatio: 1,
    justifyContent: 'flex-start',
    height: '100%',
    borderRadius: 18,
  },
});
