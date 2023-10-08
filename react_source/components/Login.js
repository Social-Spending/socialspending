

import { StyleSheet, Text, View, Pressable} from 'react-native';

import Button from './Button.js'
import { HeaderLink, HeaderText } from './TextComponents.js'



export default function Login() {
		
  return (
  
    <View style={styles.login}>
	
		<Text id= 'loginForm_errorMessage' style={styles.error}></Text>
	
		<HeaderText size={3} style={{padding: '1em'}}> Username </HeaderText>
        <input style={styles.input} id='loginForm_user' name="Username" />
		
		<HeaderText size={3} style={{padding: '1em'}}> Password </HeaderText>
        <input style={styles.input}  id='loginForm_password' type='password' name="Password" />
		
		<Button style={styles.buttonContainer} label='Login' onClick={Submit} />
			
	</View>
  );
}

async function Submit(){

	
	let userTextbox = document.getElementById('loginForm_user');
    let passwordTextbox = document.getElementById('loginForm_password');

    // pul username and password in form data for a POST request
    let payload = new URLSearchParams();
    payload.append('user', userTextbox.value);
    payload.append('password', passwordTextbox.value);

    // assemble endpoint for authentication
    let url = window.location.origin + '/authenticate.php';

    // do the POST request
    try
    {
        let response = await fetch(url, {method: 'POST', body: payload, credentials: 'same-origin'} );

        if (response.ok && response.status === 200)
        {
            // success, redirect user
            // check if this url specifies a url to which to redirect
            let redirectTarget = '/summary.php';
            window.location.href = window.location.origin + redirectTarget;
        }
        else
        {
            // failed, display error message returned by server
            let errorDiv = document.getElementById('loginForm_errorMessage');
			errorDiv.innerText = "Invalid Username or Password";
            errorDiv.innerText = await response.text();
            errorDiv.classList.remove('hidden');
        }
    }
    catch (error)
    {
        console.log("error in in POST request to login (/authenticate.php)");
        console.log(error);
    }
}

const styles = StyleSheet.create({
  login:{
	  width:'40vh',
	  height: '50vh',
	  boxShadow: '0px 0px 5px 5px #9E9E9E',
	  borderRadius: 18,
	  justifyContent: 'center',
	  alignItems: 'center',
  },
  input:{
	  width:'50%',
	  height: '2em',
	  fontSize: '1.17em',
	  boxShadow: '3px 3px 3px #9E9E9E',
	  borderRadius: 10
  },
  error:{
	  color: '#F00'
  },
  buttonContainer: {
    width: '50%',
    height: '8%',
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '10%',
	backgroundColor: '#f7a072',
	borderRadius: 10,
	boxShadow: '3px 3px 3px #9E9E9E',
  },
});