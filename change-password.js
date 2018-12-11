'use strict';

var changePasswordBtn = document.getElementById('change-password-button');

var _currentPasswordInput = document.getElementById('current-password');
var currentPasswordError = document.getElementById('currentPassword-err');

var _passwordInput = document.getElementById('password');
var passwordError = document.getElementById('password-err');

var _confirmPasswordInput = document.getElementById('confirm-password');
var confirmPasswordError = document.getElementById('confirm-password-err');

var notification = document.getElementById('notification-text');


// validator
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
// Validator


// enable validation

var currentPasswordInput;
var isCurrentPasswordError;
var passwordInput;
var isPasswordError;
var confirmPasswordInput;
var isConfirmPasswordError;
var isFormValidated;
var CHANGE_PASSWORD;
var globalError;

document.getElementById("change-password-widget-container").style.display= "none";

function changePasswordViewModel() {
    CHANGE_PASSWORD = {
        TITLE: 'Change password',
        CURRENT_PASSWORD: 'Current password',
        NEW_PASSWORD: 'New password',
        CONFIRM_PASSWORD: 'Re-enter new password',
        LENGTH_8_ERROR: 'Password must be at least 8 characters',
        PASSWORD_NOT_MATCH_ERROR: 'New password doesn\'t match',
        BUTTON_SUBMIT: 'Change password'
    };
    currentPasswordInput = ko.observable('');
    isCurrentPasswordError = ko.observable(false);
    passwordInput = ko.observable('');
    isPasswordError = ko.observable(false);
    confirmPasswordInput = ko.observable('');
    isConfirmPasswordError = ko.observable(false);
    isFormValidated = ko.observable(false);

};

function onSubmitClick() {
    if (isFormValidated() && passwordInput().length > 0 && confirmPasswordInput().length  > 0 ) {
        var data = {
            newPassword: passwordInput(),
            confirmNewPassword: confirmPasswordInput(),
            _csrf: changePassword.csrf_token,
            ticket: changePassword.ticket
        };
        console.log(data);
        changePassword.request(data);
    }
}

function onChangePasswordValue(input, isError, errorText) {
    var passwordErrorText = document.getElementById(errorText);
    if (input().length === 0) {
        isError(false);
        passwordErrorText.innerHTML = '';
        return;
    } else if(input().length > 0 && input().length < 8) {
        isError(true);
        isFormValidated(false);
        passwordErrorText.innerHTML = CHANGE_PASSWORD.LENGTH_8_ERROR;
    } else {
        isError(false);
        passwordErrorText.innerHTML = '';
        isFormValidated(true);
    }
}

function doesPasswordMatch() {
    if (passwordInput().length <= 0 || confirmPasswordInput() <= 0) {
        isConfirmPasswordError(false);
        isFormValidated(true);
        confirmPasswordError.innerHTML = '';
        return;
    }

    if (passwordInput() !== confirmPasswordInput() ) {
        isConfirmPasswordError(true);
        isFormValidated(false);
        confirmPasswordError.innerHTML = CHANGE_PASSWORD.PASSWORD_NOT_MATCH_ERROR;
    } else {
        isConfirmPasswordError(false);
        isFormValidated(true);
        confirmPasswordError.innerHTML = '';
    }
}

ko.applyBindings(new changePasswordViewModel() );