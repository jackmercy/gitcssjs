'use strict';
window.onload = function() {
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
function validateEmail(email) {
    var expr = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    return expr.test(String(email).toLowerCase());
}
var databaseConnection = 'Username-Password-Authentication';
var pageTexts = {
    TITLE: {
        SIGN_IN: '',
        FORGOT_PASSWORD: ''
    },
    SUCCESS: {
        EMAIL_SENT: ''
    },
    ERROR: {
        INVALID_EMAIL: '',
        PASSWORD_LENGTH: '',
    },
    NOTIFICATION: {
        FORGOT_NOTIFICATION_INTRO: '',
    }
};
var pageTexts_en = {
    TITLE: {
        SIGN_IN: 'SIGN IN',
        FORGOT_PASSWORD: 'forgot password'
    },
    SUCCESS: {
        EMAIL_SENT: ''
    },
    ERROR: {
        INVALID_EMAIL: 'Invalid Email address',
        PASSWORD_LENGTH: 'Password must be at least 8 characters',
    },
    NOTIFICATION: {
        FORGOT_NOTIFICATION_INTRO: 'Please enter your email address. We will send you an email to reset your password.',
    }
};
var pageTexts_de = {
    TITLE: {
        SIGN_IN: 'SIGN IN(de)',
        FORGOT_PASSWORD: 'forgot password(de)'
    },
    SUCCESS: {
        EMAIL_SENT: ''
    },
    ERROR: {
        INVALID_EMAIL: 'Invalid Email address',
        PASSWORD_LENGTH: 'Password must be at least 8 characters',
    },
    NOTIFICATION: {
        FORGOT_NOTIFICATION_INTRO: 'Please enter your email address. We will send you an email to reset your password.',
    }
};
function _signInViewModel() {
    var self = this;

    // Email
    self.emailInput = ko.observable('');
    self.showMandatoryEmailErrMessage = ko.observable(false),
    self.isEmailValidated = ko.observable(false),
    // Password
    self.passwordInput = ko.observable(''),
    self.showMandatoryPasswordErrMessage = ko.observable(false),
    self.isPasswordValidated = ko.observable(false),
    // Forgot email
    self.forgotEmailInput = ko.observable(''),
    self.showMandatoryForgotEmailErrMessage = ko.observable(false),
    self.isForgotEmailValidated = ko.observable(false),

    // page texts
    self.pageTexts = ko.observable();

    this.signInClicked = function() {
        event.preventDefault();
        var email = self.emailInput();
        var password = self.passwordInput();
    
        webAuth.login({
            realm: databaseConnection,
            username: email,
            password: password
        }, function(err) {
            if (err) displayError(err);
        });
    };
    this.forgotPassword = function() {
        event.preventDefault();
        var _email = self.forgotEmailInput();
    
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
                headerText.innerHTML = pageTexts.TITLE.SIGN_IN;
            }
        });
    }

    this.onChangeEmailValue = function(input, showMandatoryErrMessage, isValidated, errElement) {
        var emailErrorText = document.getElementById(errElement);
        if (input().length === 0) {
            showMandatoryErrMessage(true);
            isValidated(false);
            return;
        } else if (!validateEmail(input())) {
            showMandatoryErrMessage(false);
            isValidated(false);
            emailErrorText.innerHTML = pageTexts.ERROR.INVALID_EMAIL;
        } else if (validateEmail(input())) {
            emailErrorText.innerHTML = '';
            showMandatoryErrMessage(false);
            isValidated(true);
        }
    }
    this.onChangePasswordValue = function(input, showMandatoryErrMessage, isValidated) {
        if (input().length === 0) {
            showMandatoryErrMessage(true);
            return;
        } else if(input().length > 0 && input().length < 8) {
            showMandatoryErrMessage(false);
            isValidated(false);
            passwordErrorText.innerHTML = pageTexts.ERROR.PASSWORD_LENGTH;
        } else {
            showMandatoryErrMessage(false);
            isValidated(true);
            passwordErrorText.innerHTML = '';
        }
    }
    /* if (config.extraParams.ui_locales === "de") {
        self.pageTexts(pageTexts_de);
    } else {
        // default language
        self.pageTexts(pageTexts_en);
    } */
};

function displaySuccess(message) {
    notificationMessage.innerHTML = '';
    notificationErr.innerHTML = '';
    notificationSuccess.innerHTML = message;
}

function displayError(err) {
    notificationMessage.innerHTML = '';
    notificationSuccess.innerHTML = '';
    if (err.error_description) {
        notificationErr.innerHTML = err.error_description;
    } else if (err.description) {
        notificationErr.innerHTML = err.description;
    }
}

function onForgotPasswordLinkClicked() {
    signInContainer.style.display = 'none';
    forgotPasswordContainer.style.display = 'block';
    headerText.innerHTML = pageTexts.TITLE.FORGOT_PASSWORD;
    notificationMessage.innerHTML = pageTexts.NOTIFICATION.FORGOT_NOTIFICATION_INTRO;
    notificationSuccess.innerHTML = '';
    notificationErr.innerHTML = '';
}


ko.applyBindings(new _signInViewModel());

}
