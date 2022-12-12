"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createChild = exports.childrenSelect = exports.passwordLessLogin = exports.forgotPasswordNext = exports.forgotPassword = exports.logout = exports.rememberDevice = exports.resendCode = exports.getAllUsers = exports.loginParentDataInput = exports.verifyToken = exports.login = exports.confrimCode = exports.signUp = void 0;
const config_1 = __importDefault(require("../config/config"));
require("cross-fetch/polyfill");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwk_to_pem_1 = __importDefault(require("jwk-to-pem"));
const request_1 = __importDefault(require("request"));
const amazon_cognito_identity_js_1 = require("amazon-cognito-identity-js");
const poolData = {
    UserPoolId: 'ap-south-1_aFlE9qxGz',
    ClientId: '7trqouonoof0uidoq1psmqbohh',
};
const promisePool = config_1.default.promise();
const userPool = new amazon_cognito_identity_js_1.CognitoUserPool(poolData);
const signUp = (req, res) => {
    const { email, name, password } = req.body;
    console.log(req.body);
    let attributeList = [];
    const emailData = {
        Name: 'email',
        Value: email,
    };
    const nameData = {
        Name: 'name',
        Value: name,
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
        res.send(result.user).end();
        var cognitoUser = result.user;
    });
};
exports.signUp = signUp;
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
        res.send(result).end();
    });
};
exports.confrimCode = confrimCode;
const login = (req, res) => {
    const { email, password } = req.body;
    const loginDetails = {
        Username: email,
        Password: password,
    };
    const authenticationDetails = new amazon_cognito_identity_js_1.AuthenticationDetails(loginDetails);
    const userDetails = {
        Username: email,
        Pool: userPool,
    };
    const cognitoUser = new amazon_cognito_identity_js_1.CognitoUser(userDetails);
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
            res.send({
                token: result.getIdToken().getJwtToken(),
                accessToken: result.getAccessToken().getJwtToken(),
                username: result.getAccessToken().payload.username,
                name: result.getIdToken().payload.name,
                email: result.getIdToken().payload.email,
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
            res.send(err.message || JSON.stringify(err)).end();
        },
    });
};
exports.login = login;
const verifyToken = (req, res) => {
    const userPoolId = poolData.UserPoolId; // Cognito user pool id here
    const pool_region = 'ap-south-1'; // Region where your cognito user pool is created
    const { token } = req.body;
    let pem;
    // Token verification function
    console.log('Validating the token...');
    (0, request_1.default)({
        url: `https://cognito-idp.${pool_region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`,
        json: true,
    }, (error, request, body) => {
        console.log('validation token..');
        if (!error && request.statusCode === 200) {
            let pems = {};
            var keys = body['keys'];
            for (var i = 0; i < keys.length; i++) {
                //Convert each key to PEM
                var key_id = keys[i].kid;
                var modulus = keys[i].n;
                var exponent = keys[i].e;
                var key_type = keys[i].kty;
                var jwk = { kty: key_type, n: modulus, e: exponent };
                var pem = (0, jwk_to_pem_1.default)(jwk);
                pems[key_id] = pem;
            }
            //validate the token
            var decodedJwt = jsonwebtoken_1.default.decode(token, { complete: true });
            if (!decodedJwt) {
                res.send('Not a valid JWT token').end();
                return;
            }
            var kid = decodedJwt.header.kid;
            pem = pems[kid];
            if (!pem) {
                res.send('Invalid token');
                return;
            }
            jsonwebtoken_1.default.verify(token, pem, function (err, payload) {
                if (err) {
                    res.send('Invalid Token.');
                }
                else {
                    console.log('Valid Token.');
                    res.send(payload);
                }
            });
        }
        else {
            console.log(error);
            console.log('Error! Unable to download JWKs');
        }
    });
};
exports.verifyToken = verifyToken;
const loginParentDataInput = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { parentId, parentName, parentEmail } = req.body;
    try {
        const [result] = yield promisePool.query('INSERT INTO parent (parent_id, parent_name, parent_email) VALUES(?,?,?)', [parentId, parentName, parentEmail]);
        res.send(result).end();
    }
    catch (sqlError) {
        console.log(sqlError);
    }
});
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
            res.send(err.message || JSON.stringify(err)).end();
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
            res.send(err.message || JSON.stringify(err)).end();
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
            res.send('call result: ' + result).end();
        },
        onFailure: function (err) {
            res.send(err.message || JSON.stringify(err)).end();
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
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { email } = req.body;
    const userDetails = {
        Username: email,
        Pool: userPool,
    };
    const cognitoUser = new amazon_cognito_identity_js_1.CognitoUser(userDetails);
    try {
        const [rows] = yield promisePool.query('SELECT * FROM smartle.parent WHERE parent_email = ?;', [email]);
        if ((rows === null || rows === void 0 ? void 0 : rows.length) === 0) {
            res.send('Enter Email is not Registed Please Try with Another Email');
        }
        else {
            cognitoUser.forgotPassword({
                onSuccess: function (data) {
                    // successfully initiated reset password request
                    res.send([data]).end();
                },
                onFailure: function (err) {
                    res.send(err).end();
                },
            });
        }
    }
    catch (sqlError) {
        console.log(sqlError);
    }
});
exports.forgotPassword = forgotPassword;
const forgotPasswordNext = (req, res) => {
    let { email, verificationCode, newPassword } = req.body;
    const userDetails = {
        Username: email,
        Pool: userPool,
    };
    const cognitoUser = new amazon_cognito_identity_js_1.CognitoUser(userDetails);
    cognitoUser.confirmPassword(verificationCode, newPassword, {
        onSuccess() {
            res.send('Password confirmed!').end();
        },
        onFailure(err) {
            res.send(err).end();
        },
    });
};
exports.forgotPasswordNext = forgotPasswordNext;
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
        onSuccess: (result) => {
            res.send({
                token: result.getIdToken().getJwtToken(),
                accessToken: result.getAccessToken().getJwtToken(),
            });
        },
        onFailure: function (err) {
            console.log(err.message || JSON.stringify(err));
            res.send(err.message || JSON.stringify(err)).end();
        },
        customChallenge: function (loginDetails) {
            var challengeResponses = 'challenge-answer';
            cognitoUser.sendCustomChallengeAnswer(challengeResponses, this);
        },
    });
};
exports.passwordLessLogin = passwordLessLogin;
const childrenSelect = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    try {
        const [result] = yield promisePool.query(`SELECT * FROM student WHERE parent_id = ?`, [userId]);
        res.json({ message: 'success', result }).end();
    }
    catch (error) {
        res.status(404).json({ message: 'Error' });
    }
});
exports.childrenSelect = childrenSelect;
const createChild = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { studentName, studentGender, studentAge, parentId } = req.body;
    try {
        const [result] = yield promisePool.query('INSERT INTO student (student_name, student_gender, student_age, parent_id) VALUES(?,?,?,?)', [studentName, studentGender, studentAge, parentId, studentGender]);
        res.json({ message: 'success', result }).end();
    }
    catch (error) {
        res.status(404).json({ message: 'Error' });
    }
});
exports.createChild = createChild;
