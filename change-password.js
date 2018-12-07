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
var canSubmit;

function changePasswordViewModel() {
    currentPasswordInput = ko.observable('');
    isCurrentPasswordError = ko.observable(false);
    passwordInput = ko.observable('');
    isPasswordError = ko.observable(false);
    confirmPasswordInput = ko.observable('');
    isConfirmPasswordError = ko.observable(false);
    isFormValidated = ko.observable(false);
/*    canSubmit = ko.pureComputed(function () {
            console.log('called');
            return (
                this.passwordInput().length > 0 &&
                this.currentPasswordInput().length > 0 &&
                this.confirmPasswordInput().length > 0
            )}, this);*/
};

function onSubmitClick() {
    console.log(currentPasswordInput());
    console.log(passwordInput());
    console.log(confirmPasswordInput());

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
        passwordErrorText.innerHTML = 'Password must be at least 8 characters';
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
        confirmPasswordError.innerHTML = 'Passwords do not match';
    } else {
        isConfirmPasswordError(false);
        isFormValidated(true);
        confirmPasswordError.innerHTML = '';
    }
}

ko.applyBindings(new changePasswordViewModel() );