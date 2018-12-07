'use strict';

// Auth0
/* var config = JSON.parse(
    decodeURIComponent(escape(window.atob('@@config@@')))
);
var params = Object.assign({
    domain: config.auth0Domain,
    clientID: config.clientID,
    redirectUri: config.callbackURL,
    responseType: 'code'
}, config.internalOptions);

var webAuth = new auth0.WebAuth(params);
var databaseConnection = 'Username-Password-Authentication'; */
// Login form
var loginBtn = document.getElementById('login-button');

var _emailInput = document.getElementById('email');
var emailErrorText = document.getElementById('email-err-text');

var _passwordInput = document.getElementById('password');
var passwordErrorText = document.getElementById('password-err-text');

var notificationErr = document.getElementById('notification-error');


// validator 8 chars: .{8,} expr: ^(?=[a-zA-Z0-9#@$?]{8,}$)(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9]).*
function hasNumber(input) {
    return /\d/.test(input);
}

function hasLetters(input) {
    return /[^0-9]/.test(input);
}

function hasLowerCase(str) {
    return (/[a-z]/.test(str));
}

function hasUpperCase(str) {
    return (/[A-Z]/.test(str));
}

function validateEmail(email) {
    var expr = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    return expr.test(String(email).toLowerCase());
}

function validatePassword(pwd) {
    var expr = /.{8,}/;
    return expr.test(String(pwd));
}
// Validator

// enable validation
var _signInViewModel = {
    emailInput: ko.observable(''),
    passwordInput: ko.observable(''),

    shouldShowEmailErrMessage: ko.observable(false),
    shouldShowPasswordErrMessage: ko.observable(false),

    isEmailValidated: ko.observable(false),
    isPasswordValidated: ko.observable(false),
};

function onChangeEmailValue() {
    if (_signInViewModel.emailInput().toString().length === 0) {
        _signInViewModel.shouldShowEmailErrMessage(true);
        _signInViewModel.isEmailValidated(false);
        return;
    } else if (!validateEmail(_signInViewModel.emailInput())) {
        _signInViewModel.shouldShowEmailErrMessage(false);
        _signInViewModel.isEmailValidated(false);
        emailErrorText.innerHTML = 'Invalid Email address';
    } else if (validateEmail(_signInViewModel.emailInput())) {
        emailErrorText.innerHTML = '';
        _signInViewModel.shouldShowEmailErrMessage(false);
        _signInViewModel.isEmailValidated(true);
    }
}

// strict password: upper & lower case + number
/* function onChangePasswordValue() {
    if (_signInViewModel.passwordInput().length === 0) {
        _signInViewModel.shouldShowPasswordErrMessage(true);
        return;
    } else if(_signInViewModel.passwordInput().length > 0 && _signInViewModel.passwordInput().length < 8) {
        _signInViewModel.shouldShowPasswordErrMessage(false);
        _signInViewModel.isPasswordValidated(false);
        passwordErrorText.innerHTML = 'Password must be at least 8 characters';

    } else if (!hasNumber(_signInViewModel.passwordInput()) ||
            !hasLetters(_signInViewModel.passwordInput())   ||
            !hasLowerCase(_signInViewModel.passwordInput()) ||
            !hasUpperCase(_signInViewModel.passwordInput())) {
        _signInViewModel.shouldShowPasswordErrMessage(false);
        _signInViewModel.isPasswordValidated(false);
        passwordErrorText.innerHTML = 'Must contains number, lowercase and uppercase letters';
    } else {
        _signInViewModel.shouldShowPasswordErrMessage(false);
        passwordErrorText.innerHTML = '';
        _signInViewModel.isPasswordValidated(true);
    }
} */

// simple: > 8 chars
function onChangePasswordValue() {
    if (_signInViewModel.passwordInput().length === 0) {
        _signInViewModel.shouldShowPasswordErrMessage(true);
        return;
    } else if(_signInViewModel.passwordInput().length > 0 && _signInViewModel.passwordInput().length < 8) {
        _signInViewModel.shouldShowPasswordErrMessage(false);
        _signInViewModel.isPasswordValidated(false);
        passwordErrorText.innerHTML = 'Password must be at least 8 characters';
    } else {
        _signInViewModel.shouldShowPasswordErrMessage(false);
        passwordErrorText.innerHTML = '';
        _signInViewModel.isPasswordValidated(true);
    }
}

ko.applyBindings( _signInViewModel );

// login logic

function signInClicked(e) {
    e.preventDefault();
    var email = _signInViewModel.emailInput();
    var password = _signInViewModel.passwordInput();
    alert(`${email}`);
    /* webAuth.redirect.loginWithCredentials({
        connection: databaseConnection,
        username: email,
        password: password
    }, function(err) {
        if (err) displayError(err);
    }); */
}

/*function forgotPassword(e) {
    e.preventDefault();
    var email = document.getElementById('email-forgot').value;
    webAuth.changePassword({
    connection: databaseConnection,
    email: email
}, function(err, resp) {
    if (err) displayError(err);
    else {
        $('.auth0-lock-back-button').click();
        displaySuccess(resp);
    }
    });
}

 function displayError(err) {
    var errorMessage = document.getElementById('error-message');
    errorMessage.innerHTML = err.description.toUpperCase();
    errorMessage.style.display = 'block';

    $('#success-message').hide();
}

function displaySuccess(message) {
    var successMessage = document.getElementById('success-message');
    successMessage.innerHTML = message;
    successMessage.style.display = 'block';

    $('#error-message').hide();
} */

/* $('.auth0-lock-alternative-link').click(function () {
    $('#login-form').hide();
    $('#forgot-password-form').show();
});

$('.auth0-lock-back-button').click(function () {
    $('#login-form').show();
    $('#forgot-password-form').hide();
}); */

document.getElementById('sign-in-button').addEventListener('click', signInClicked);
/* document.getElementById('btn-forgot-password').addEventListener('click', forgotPassword); */