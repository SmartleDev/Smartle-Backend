"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.rememberDevice = exports.resendCode = exports.getAllUsers = exports.login = exports.confrimCode = exports.signUp = void 0;
require("cross-fetch/polyfill");
const amazon_cognito_identity_js_1 = require("amazon-cognito-identity-js");
const poolData = {
    UserPoolId: 'ap-south-1_aFlE9qxGz',
    ClientId: '7trqouonoof0uidoq1psmqbohh'
};
const userPool = new amazon_cognito_identity_js_1.CognitoUserPool(poolData);
exports.signUp = ((req, res) => {
    const { email, name, password } = req.body;
    console.log(req.body);
    let attributeList = [];
    const emailData = {
        Name: 'email',
        Value: email
    };
    const nameData = {
        Name: 'name',
        Value: name
    };
    const emailAttributes = new amazon_cognito_identity_js_1.CognitoUserAttribute(emailData);
    const nameAttributes = new amazon_cognito_identity_js_1.CognitoUserAttribute(nameData);
    attributeList.push(emailAttributes);
    attributeList.push(nameAttributes);
    userPool.signUp(email, password, attributeList, null, function (err, result) {
        if (err) {
            console.log(err.message || JSON.stringify(err));
            res.send(err.message || JSON.stringify(err));
            return;
        }
        res.send(result.user);
        var cognitoUser = result.user;
    });
});
const confrimCode = (req, res) => {
    const { email, code } = req.body;
    let userData = {
        Username: email,
        Pool: userPool,
    };
    var cognitoUser = new amazon_cognito_identity_js_1.CognitoUser(userData);
    cognitoUser.confirmRegistration(code, true, function (err, result) {
        if (err) {
            console.log(err);
            res.send(err);
            return;
        }
        console.log(result);
        res.send(result);
    });
};
exports.confrimCode = confrimCode;
const login = (req, res) => {
    const { email, password } = req.body;
    const loginDetails = {
        Username: email,
        Password: password
    };
    const authenticationDetails = new amazon_cognito_identity_js_1.AuthenticationDetails(loginDetails);
    const userDetails = {
        Username: email,
        Pool: userPool,
    };
    const cognitoUser = new amazon_cognito_identity_js_1.CognitoUser(userDetails);
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: result => {
            res.send({
                token: result.getIdToken().getJwtToken(),
                accessToken: result.getAccessToken().getJwtToken()
            });
        },
        onFailure: function (err) {
            console.log(err.message || JSON.stringify(err));
            res.send(err.message || JSON.stringify(err));
        },
    });
};
exports.login = login;
const getAllUsers = (req, res) => {
    const { email } = req.body;
    const userDetails = {
        Username: email,
        Pool: userPool,
    };
    const cognitoUser = new amazon_cognito_identity_js_1.CognitoUser(userDetails);
    cognitoUser.getUserData(function (err, userData) {
        if (err) {
            res.send(err.message || JSON.stringify(err));
            return;
        }
        console.log('User data for user ' + userData);
    });
    // If you want to force to get the user data from backend,
    // you can set the bypassCache to true
    cognitoUser.getUserData(function (err, userData) {
        if (err) {
            res.send(err.message || JSON.stringify(err));
            return;
        }
        res.send('User data for user ' + userData);
    }, { bypassCache: true });
};
exports.getAllUsers = getAllUsers;
const resendCode = (req, res) => {
    const { email } = req.body;
    const userDetails = {
        Username: email,
        Pool: userPool,
    };
    const cognitoUser = new amazon_cognito_identity_js_1.CognitoUser(userDetails);
    cognitoUser.resendConfirmationCode(function (err, result) {
        if (err) {
            res.send(err.message || JSON.stringify(err));
            return;
        }
        console.log(result);
        res.send(result);
    });
};
exports.resendCode = resendCode;
const rememberDevice = (req, res) => {
    const { email } = req.body;
    const userDetails = {
        Username: email,
        Pool: userPool,
    };
    const cognitoUser = new amazon_cognito_identity_js_1.CognitoUser(userDetails);
    cognitoUser.setDeviceStatusRemembered({
        onSuccess: function (result) {
            res.send('call result: ' + result);
        },
        onFailure: function (err) {
            res.send(err.message || JSON.stringify(err));
        },
    });
};
exports.rememberDevice = rememberDevice;
const logout = (req, res) => {
    const { email } = req.body;
    const userDetails = {
        Username: email,
        Pool: userPool,
    };
    const cognitoUser = new amazon_cognito_identity_js_1.CognitoUser(userDetails);
    cognitoUser.signOut();
};
exports.logout = logout;
