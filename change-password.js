'use strict';
var request = superagent;
var confirmPasswordError = document.getElementById('confirm-password-err');
// enable validation

var passwordInput;
var isPasswordError;
var confirmPasswordInput;
var isConfirmPasswordError;
var isFormValidated;
var LANGUAGE;
var isChangePassword, isSuccess, isSubmitting;
var globalError;
var title;

// Language label
var EN = {
    GENERAL: {
        NEW_PASSWORD: 'New password',
        CONFIRM_PASSWORD: 'Re-enter new password',
        LENGTH_8_ERROR: 'Password must be at least 8 characters',
        PASSWORD_NOT_MATCH_ERROR: 'New password doesn\'t match',
        SUCCESS_MESSAGE: 'You have successfully changed your password!'
    },
    CHANGE_PASSWORD: {
        TITLE: 'Change password',
        BUTTON: 'Change password',
        PAGE_TITLE: 'BEC Change Password'
    },
    RESET_PASSWORD: {
        TITLE: 'Reset password',
        BUTTON: 'Reset password',
        PAGE_TITLE: 'BEC Reset Password'
    },
    MESSAGE: {
        passwordConfirmationMatchError: 'Please ensure the password and the confirmation are the same.',
        configurationError: 'An error ocurred. There appears to be a misconfiguration in the form.',
        networkError: 'The server cannot be reached, there is a problem with the network.',
        timeoutError: 'The server cannot be reached, please try again.',
        serverError: 'There was an error processing the password reset.',
        weakPasswordError: 'Password is too weak.',
        passwordHistoryError: 'Password has previously been used',
        passwordDictError: 'Password is too common',
        passwordNoUserInfoError: 'Password is based on user information'
    }
};
var DE = {
    GENERAL: {
        NEW_PASSWORD: 'Neues Kennwort',
        CONFIRM_PASSWORD: 'neues Passwort erneut eingeben',
        LENGTH_8_ERROR: 'Das Passwort muss aus mindestens 8 Zeichen bestehen',
        PASSWORD_NOT_MATCH_ERROR: 'Neues Passwort stimmt nicht überein',
        SUCCESS_MESSAGE: 'Sie haben Ihr Passwort erfolgreich geändert!'
    },
    CHANGE_PASSWORD: {
        TITLE: 'Ändere das Passwort',
        BUTTON: 'Ändere das Passwort',
        PAGE_TITLE: 'BEC Passwort ändern'
    },
    RESET_PASSWORD: {
        TITLE: 'Passwort zurücksetzen',
        BUTTON: 'Passwort zurücksetzen',
        PAGE_TITLE: 'BEC Passwort zurücksetzen'
    },
    MESSAGE: {
        passwordConfirmationMatchError: 'Zorg ervoor dat het wachtwoord en de bevestiging hetzelfde zijn.',
        configurationError: 'Ein Fehler ist aufgetreten. Es scheint eine falsche Konfiguration im Formular zu geben',
        networkError: 'Der Server ist nicht erreichbar, es liegt ein Problem mit dem Netzwerk vor.',
        timeoutError: 'Der Server ist nicht erreichbar. Bitte versuchen Sie es erneut.',
        serverError: 'Fehler beim Verarbeiten der Kennwortrücksetzung.',
        weakPasswordError: 'Passwort ist zu schwach.',
        passwordHistoryError: 'Das Passwort wurde zuvor verwendet.',
        passwordDictError: 'Password is too common',
        passwordNoUserInfoError: 'Das Passwort basiert auf Benutzerinformationen.'
    }
};

function changePasswordViewModel() {
    passwordInput = ko.observable('');
    isPasswordError = ko.observable(false);
    confirmPasswordInput = ko.observable('');
    isConfirmPasswordError = ko.observable(true);
    isFormValidated = ko.observable(false);
    globalError = ko.observable('');
    isSuccess = ko.observable(false);
    isChangePassword= ko.observable(getQueryStringValue('isChangePassword') || false);
    isSubmitting = ko.observable(false);
    LANGUAGE = ko.observable(EN);
    title = ko.computed(function () {
        return isChangePassword() ?
            LANGUAGE().CHANGE_PASSWORD.PAGE_TITLE : LANGUAGE().RESET_PASSWORD.PAGE_TITLE;
    });
}

ko.applyBindings(new changePasswordViewModel(), document.getElementById('html') );

document.getElementById('change-password-widget-container').style.display= 'none';
initPageLanguage();

function initPageLanguage() {
    //Uncomment this for production
    //var language = getQueryStringValue('language').toLowerCase();

    var language = 'de'; //This is for development

    if (language === 'en') {
        LANGUAGE(EN);
    }

    if (language === 'de') {
        LANGUAGE(DE);
    }
}

function getQueryStringValue (key) {
    return decodeURIComponent(window.location.search.replace(new RegExp('^(?:.*[&\\?]' + encodeURIComponent(key).replace(/[\.\+\*]/g, '\\$&') +
        '(?:\\=([^&]*))?)?.*$', 'i'), '$1'));
}

function onSubmitClick() {
    if (isFormValidated() && passwordInput().length > 0
        && confirmPasswordInput().length > 0 && !isSubmitting() ) {

        changePassword.globalError = '';
        globalError(changePassword.globalError);

        var data = {
            newPassword: passwordInput(),
            confirmNewPassword: confirmPasswordInput(),
            _csrf: changePassword.csrf_token,
            ticket: changePassword.ticket
        };

        isSubmitting(true);
        request.post('/lo/reset').type('form').send(data).timeout(6000).end(function (err, res) {
            if (err) { handleFailedRequest(err, res); }
            else { handleSuccessfulRequest(res); }
        });
    }
}

function handleSuccessfulRequest(res) {
    var shouldRedirect = res.body && typeof res.body.result_url === 'string';
    globalError(changePassword.globalError);
    changePassword.isSubmitting = false;
    isSuccess(true);
    isSubmitting(false);

    if (shouldRedirect) {
        setTimeout(function () {
            window.location.replace(res.body.result_url);
        }, changePassword.delayBeforeRedirect);
    } else if (changePassword.successCallback) {
        changePassword.successCallback();
    }
};

function handleFailedRequest(err, res) {
    isSubmitting(false);
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

    changePassword.globalError = getError(passwordErrors[body.name] || body.code || 'serverError');
    globalError(changePassword.globalError);
};

function handleNetworkError(err) {
    changePassword.globalError = getError(err.timeout ? 'timeoutError' : 'networkError');
    globalError(changePassword.globalError);
};

function getError(key) {
    return LANGUAGE.MESSAGE[key];
}

function onBlur(input, inputEl, isError, errorText) {
    doesPasswordMatch();
    var passwordErrorText = document.getElementById(errorText);
    var inputParent = document.getElementById(inputEl).parentElement;

    // Add css
    if (input().length > 0 && !isError()) {
        inputParent.classList.add('success');
    } else if (input().length > 0 && isError()) {
        inputParent.classList.add('error');
    }
}

function onFocus(inputEl) {
    var inputParent = document.getElementById(inputEl).parentElement;
    var inputError = document.getElementById(inputEl + '-err');
    inputError.innerHTML = '';
    inputParent.classList.remove('success');
    inputParent.classList.remove('error');
}

function doesPasswordMatch() {
    var inputParent = document.getElementById('confirm-password').parentElement;

    if (passwordInput().length <= 0 || confirmPasswordInput().length <= 0) {
        isConfirmPasswordError(false);
        confirmPasswordError.innerHTML = '';
        return;
    }

    if (passwordInput() !== confirmPasswordInput() ) {
        isConfirmPasswordError(true);
        isFormValidated(false);
        inputParent.classList.add('error');
        document.getElementById('confirm-password-err').innerHTML = LANGUAGE().GENERAL.PASSWORD_NOT_MATCH_ERROR;
    } else {
        isConfirmPasswordError(false);
        isFormValidated(true);
        inputParent.classList.remove('error');
        inputParent.classList.add('success');
        document.getElementById('confirm-password-err').innerHTML = '';
    }
}