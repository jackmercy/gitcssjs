'use strict';

// Login form
var loginBtn = document.getElementById('login-button');

var _emailInput = document.getElementById('email');


var _passwordInput = document.getElementById('password');
var passwordErrorText = document.getElementById('password-err-text');

var headerText = document.getElementById('header-text');

var notificationMessage = document.getElementById('notification-message');
var notificationErr = document.getElementById('notification-error');
var notificationSuccess = document.getElementById('notification-success');

var signInContainer = document.getElementById('sign-in-container');
var forgotPasswordContainer = document.getElementById('forgot-password-container');

forgotPasswordContainer.style.display = 'none';

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



var _signInViewModel = {
    // Email
    emailInput: ko.observable(''),
    showMandatoryEmailErrMessage: ko.observable(false),
    isEmailValidated: ko.observable(false),
    // Password
    passwordInput: ko.observable(''),
    showMandatoryPasswordErrMessage: ko.observable(false),
    isPasswordValidated: ko.observable(false),
    // Forgot email
    forgotEmailInput: ko.observable(''),
    showMandatoryForgotEmailErrMessage: ko.observable(false),
    isForgotEmailValidated: ko.observable(false),
};

function onChangeEmailValue(input, showMandatoryErrMessage, isValidated, errElement) {
    var emailErrorText = document.getElementById(errElement);
    if (input().length === 0) {
        showMandatoryErrMessage(true);
        isValidated(false);
        return;
    } else if (!validateEmail(input())) {
        showMandatoryErrMessage(false);
        isValidated(false);
        emailErrorText.innerHTML = pageTexts.INVALID_EMAIL;
    } else if (validateEmail(input())) {
        emailErrorText.innerHTML = '';
        showMandatoryErrMessage(false);
        isValidated(true);
    }
}

// strict password: upper & lower case + number
/* function onChangePasswordValue() {
    if (_signInViewModel.passwordInput().length === 0) {
        _signInViewModel.showMandatoryPasswordErrMessage(true);
        return;
    } else if(_signInViewModel.passwordInput().length > 0 && _signInViewModel.passwordInput().length < 8) {
        _signInViewModel.showMandatoryPasswordErrMessage(false);
        _signInViewModel.isPasswordValidated(false);
        passwordErrorText.innerHTML = 'Password must be at least 8 characters';

    } else if (!hasNumber(_signInViewModel.passwordInput()) ||
            !hasLetters(_signInViewModel.passwordInput())   ||
            !hasLowerCase(_signInViewModel.passwordInput()) ||
            !hasUpperCase(_signInViewModel.passwordInput())) {
        _signInViewModel.showMandatoryPasswordErrMessage(false);
        _signInViewModel.isPasswordValidated(false);
        passwordErrorText.innerHTML = 'Must contains number, lowercase and uppercase letters';
    } else {
        _signInViewModel.showMandatoryPasswordErrMessage(false);
        passwordErrorText.innerHTML = '';
        _signInViewModel.isPasswordValidated(true);
    }
} */

// simple: > 8 chars
function onChangePasswordValue(input, showMandatoryErrMessage, isValidated) {
    if (input().length === 0) {
        showMandatoryErrMessage(true);
        return;
    } else if(input().length > 0 && input().length < 8) {
        showMandatoryErrMessage(false);
        isValidated(false);
        passwordErrorText.innerHTML = pageTexts.PASSWORD_LENGTH;
    } else {
        showMandatoryErrMessage(false);
        isValidated(true);
        passwordErrorText.innerHTML = '';
    }
}

ko.applyBindings( _signInViewModel );

// Auth0

var params = Object.assign({
    domain: 'nani.eu.auth0.com',
    clientID: 'DGq0t6mLXz2mIAAKR1GvQHTYybwnaA6X',
    redirectUri: 'http://localhost:4200',
    responseType: 'code'
});

var webAuth = new auth0.WebAuth(params);
var databaseConnection = 'Username-Password-Authentication';

// login logic

function signInClicked(e) {
    e.preventDefault();
    var email = _signInViewModel.emailInput();
    var password = _signInViewModel.passwordInput();

    webAuth.redirect.loginWithCredentials({
        connection: databaseConnection,
        username: email,
        password: password
    }, function(err) {
        if (err) displayError(err);
    });
}

function forgotPassword(e) {
    e.preventDefault();
    var _email = _signInViewModel.forgotEmailInput();

    webAuth.changePassword({
    connection: databaseConnection,
    email: _email
    }, function(err, resp) {
        if (err) displayError(err);
        else {
            // back to sign in page
            forgotPasswordContainer.style.display = 'none';
            signInContainer.style.display = 'block';
            displaySuccess(resp);
            headerText.innerHTML = pageTexts.SIGNIN_HEADER;
        }
        });
    }

function displaySuccess(message) {
    notificationMessage.innerHTML = '';
    notificationErr.innerHTML = '';
    notificationSuccess.innerHTML = message;
}

function displayError(err) {
    notificationMessage.innerHTML = '';
    notificationSuccess.innerHTML = '';
    notificationErr.innerHTML = err.description;
}

function onForgotPasswordLinkClicked() {
    signInContainer.style.display = 'none';
    forgotPasswordContainer.style.display = 'block';
    headerText.innerHTML = pageTexts.FORGOT_HEADER;
    notificationMessage.innerHTML = pageTexts.FORGOT_NOTIFICATION_INTRO;
    notificationSuccess.innerHTML = '';
    notificationErr.innerHTML = '';
}

document.getElementById('sign-in-button').addEventListener('click', signInClicked);
document.getElementById('forgot-password-button').addEventListener('click', forgotPassword);


var pageTexts = {
    INVALID_EMAIL: 'Invalid Email address',
    PASSWORD_LENGTH: 'Password must be at least 8 characters',
    FORGOT_NOTIFICATION_INTRO: 'Please enter your email address. We will send you an email to reset your password.',
    FORGOT_HEADER: 'forgot password',
    SIGNIN_HEADER: 'SIGN IN'
}

