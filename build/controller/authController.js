"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createChild = exports.childrenSelect = exports.passwordLessLogin = exports.logout = exports.rememberDevice = exports.resendCode = exports.getAllUsers = exports.loginParentDataInput = exports.login = exports.confrimCode = exports.signUp = void 0;
const config_1 = __importDefault(require("../config/config"));
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
                accessToken: result.getAccessToken().getJwtToken(),
                username: result.getAccessToken().payload.username,
                name: result.getIdToken().payload.name,
                email: result.getIdToken().payload.email
            });
            //  db.query('INSERT INTO parent (parent_id, parent_name, parent_email) VALUES(?,?,?)', [result.getAccessToken().payload.username, result.getIdToken().payload.name, result.getIdToken().payload.email],
            //  (err, result) => {
            //     if(err){
            // 	console.log(err);
            //  	}
            //  }) 
        },
        onFailure: function (err) {
            console.log(err.message || JSON.stringify(err));
            res.send(err.message || JSON.stringify(err));
        },
    });
};
exports.login = login;
const loginParentDataInput = (req, res) => {
    const { parentId, parentName, parentEmail } = req.body;
    config_1.default.query('INSERT INTO parent (parent_id, parent_name, parent_email) VALUES(?,?,?)', [parentId, parentName, parentEmail], (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(result);
    });
};
exports.loginParentDataInput = loginParentDataInput;
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
const passwordLessLogin = (req, res) => {
    const { email, password } = req.body;
    const loginDetails = {
        Username: email,
    };
    const authenticationDetails = new amazon_cognito_identity_js_1.AuthenticationDetails(loginDetails);
    const userDetails = {
        Username: email,
        Pool: userPool,
    };
    const cognitoUser = new amazon_cognito_identity_js_1.CognitoUser(userDetails);
    cognitoUser.setAuthenticationFlowType('CUSTOM_AUTH');
    cognitoUser.initiateAuth(authenticationDetails, {
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
        customChallenge: function (loginDetails) {
            var challengeResponses = 'challenge-answer';
            cognitoUser.sendCustomChallengeAnswer(challengeResponses, this);
        },
    });
};
exports.passwordLessLogin = passwordLessLogin;
const childrenSelect = (req, res) => {
    const { userId } = req.body;
    try {
        config_1.default.query(`SELECT * FROM student WHERE parent_id = ?`, [userId], (err, result) => {
            if (err) {
                console.log(err);
                res.json({ message: "error" });
            }
            else {
                res.json({ message: "success", result });
            }
        });
    }
    catch (error) {
        res.status(404).json({ message: 'Error' });
    }
};
exports.childrenSelect = childrenSelect;
const createChild = (req, res) => {
    const { studentName, studentGender, studentAge, parentId } = req.body;
    try {
        config_1.default.query('INSERT INTO student (student_name, student_gender, student_age, parent_id) VALUES(?,?,?,?)', [studentName, studentGender, studentAge, parentId, studentGender], (err, result) => {
            if (err) {
                console.log(err);
                res.json({ message: "error" });
            }
            else {
                res.json({ message: "success", result });
            }
        });
    }
    catch (error) {
        res.status(404).json({ message: 'Error' });
    }
};
exports.createChild = createChild;
