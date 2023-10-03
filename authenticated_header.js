window.addEventListener("load", (event) =>
{
    document.getElementById('home_headerButton').onclick = home_headerButton_onclick;
    document.getElementById('signup_headerButton').onclick = signup_headerButton_onclick;
    document.getElementById('login_headerButton').onclick = login_headerButton_onclick;
});

function home_headerButton_onclick()
{
    window.location.href = window.location.origin;
}

function signup_headerButton_onclick()
{
    window.location.href = window.location.origin + '/signup.php';
}

function login_headerButton_onclick()
{
    window.location.href = window.location.origin + '/login.php';
}
