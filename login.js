window.addEventListener("load", (event) =>
{
    document.getElementById('login_headerButton').classList.add('active');
    document.getElementById('loginForm_submit').onclick = submitLogin;
});

async function submitLogin(event)
{
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

        if (response.ok)
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