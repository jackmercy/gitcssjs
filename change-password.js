'use strict';
var request = superagent;

var changePasswordBtn = document.getElementById('change-password-button');

var _currentPasswordInput = document.getElementById('current-password');
var currentPasswordError = document.getElementById('currentPassword-err');

var _passwordInput = document.getElementById('password');
var passwordError = document.getElementById('password-err');

var _confirmPasswordInput = document.getElementById('confirm-password');
var confirmPasswordError = document.getElementById('confirm-password-err');

var notification = document.getElementById('notification-text');

// enable validation

var currentPasswordInput;
var isCurrentPasswordError;
var passwordInput;
var isPasswordError;
var confirmPasswordInput;
var isConfirmPasswordError;
var isFormValidated;
var CHANGE_PASSWORD, RESET_PASSWORD, GENERAL;
var globalError;
var isChangePassword;

document.getElementById("change-password-widget-container").style.display= "none";

function changePasswordViewModel() {
    GENERAL = {
        NEW_PASSWORD: 'New password',
        CONFIRM_PASSWORD: 'Re-enter new password',
        LENGTH_8_ERROR: 'Password must be at least 8 characters',
        PASSWORD_NOT_MATCH_ERROR: 'New password doesn\'t match'
    }
    CHANGE_PASSWORD = {
        TITLE: 'Change password',
        BUTTON: 'Change password',
        PAGE_TITLE: 'BEC Change Password'
    };
    RESET_PASSWORD = {
        TITLE: 'Reset password',
        BUTTON: 'Reset password',
        PAGE_TITLE: 'BEC Reset Password'
    };

    currentPasswordInput = ko.observable('');
    isCurrentPasswordError = ko.observable(false);
    passwordInput = ko.observable('');
    isPasswordError = ko.observable(false);
    confirmPasswordInput = ko.observable('');
    isConfirmPasswordError = ko.observable(false);
    isFormValidated = ko.observable(false);
    globalError = ko.observable('');
    isChangePassword = ko.observable(false);

};

function onSubmitClick() {
    if (isFormValidated() && passwordInput().length > 0 && confirmPasswordInput().length  > 0 ) {
        //
        changePassword.globalError = '';
        globalError(changePassword.globalError);

        var data = {
            newPassword: passwordInput(),
            confirmNewPassword: confirmPasswordInput(),
            _csrf: changePassword.csrf_token,
            ticket: changePassword.ticket
        };

        request.post('https://nani.eu.auth0.com/lo/reset').type('form').send(data).timeout(6000).end(function (err, res) {
            if (err) { handleFailedRequest(err, res) }
            else { handleSuccessfulRequest(res) };
        });
    }
}

function handleSuccessfulRequest(res) {
    var shouldRedirect = res.body && typeof res.body.result_url === 'string';
    globalError(changePassword.globalError);
    changePassword.isSubmitting = false;

    if (shouldRedirect) {
        setTimeout(function () {
            redirect(res.body.result_url);
        }, changePassword.delayBeforeRedirect);
    } else if (changePassword.successCallback) {
        changePassword.successCallback();
    }
};

function handleFailedRequest(err, res) {
    res ? handleResponseError(res) : handleNetworkError(err);
};

function handleResponseError(res) {
    var body = res.body;


    if (!body || (typeof body === 'undefined' ? 'undefined' : typeof(body)) !== 'object') {
        body = {};
    }

    var passwordErrors = {
        PasswordStrengthError: 'weakPasswordError',
        PasswordHistoryError: 'passwordHistoryError',
        PasswordDictionaryError: 'passwordDictError',
        PasswordNoUserInfoError: 'passwordNoUserInfoError'
    };

    changePassword.globalError = changePassword.t(passwordErrors[body.name] || body.code || 'serverError');
    globalError(changePassword.globalError);
};

function handleNetworkError(err) {
    changePassword.globalError = changePassword.t(err.timeout ? 'timeoutError' : 'networkError');
    globalError(changePassword.globalError);
};

function transformRequest(obj) {
    var str = [];
    for(var p in obj)
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    return str.join("&");
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
        passwordErrorText.innerHTML = GENERAL.LENGTH_8_ERROR;
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
        confirmPasswordError.innerHTML = GENERAL.PASSWORD_NOT_MATCH_ERROR;
    } else {
        isConfirmPasswordError(false);
        isFormValidated(true);
        confirmPasswordError.innerHTML = '';
    }
}

ko.applyBindings(new changePasswordViewModel(), document.getElementById("html") );