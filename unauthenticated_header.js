window.addEventListener("load", (event) =>
{
    let bttn = document.getElementById('home_headerButton');
    bttn.onclick = home_headerButton_onclick;
    bttn.onmouseenter = onmouseenter;
    bttn.onmouseleave = onmouseleave;

    bttn = document.getElementById('signup_headerButton');
    bttn.onclick = signup_headerButton_onclick;
    bttn.onmouseenter = onmouseenter;
    bttn.onmouseleave = onmouseleave;

    bttn = document.getElementById('login_headerButton');
    bttn.onclick = login_headerButton_onclick;
    bttn.onmouseenter = onmouseenter;
    bttn.onmouseleave = onmouseleave;
});

function onmouseenter(event)
{
    event.target.classList.add('hover');
}

function onmouseleave(event)
{
    event.target.classList.remove('hover');
}

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
