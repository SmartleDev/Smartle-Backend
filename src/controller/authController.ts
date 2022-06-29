import mysql from 'mysql';
import express, {Request, Response} from 'express';
import db from '../config/config';
import 'cross-fetch/polyfill';
import jwt from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';
import request from 'request';
import {
	CognitoUserPool,
	CognitoUserAttribute,
	AuthenticationDetails,
	CognitoUser,
} from 'amazon-cognito-identity-js';

const poolData : any = {
	UserPoolId : 'ap-south-1_aFlE9qxGz',
	ClientId : '7trqouonoof0uidoq1psmqbohh'
}


const userPool: any = new CognitoUserPool(poolData);

export const signUp = ((req: Request, res: Response) => {

	const {email, name, password} = req.body

	console.log(req.body)

	let attributeList = [];

	const emailData: any = {
		Name : 'email',
		Value : email
	}

	const nameData : any = {
		Name : 'name',
		Value : name
	} 
	
	const emailAttributes = new CognitoUserAttribute(emailData);
	const nameAttributes = new CognitoUserAttribute(nameData);

	attributeList.push(emailAttributes);
	attributeList.push(nameAttributes);

	userPool.signUp(email, password, attributeList, null, function(
		err : any,
		result : any
	) {
		if (err) {
			console.log(err.message || JSON.stringify(err));
			res.send(err.message || JSON.stringify(err));
			return;
		}
		res.send(result.user)
		var cognitoUser = result.user;
	});

});


export const confrimCode = (req: Request, res: Response) => {

	const {email, code} = req.body
	
let userData = {
	Username: email,
	Pool: userPool,
};
 var cognitoUser = new CognitoUser(userData);
     cognitoUser.confirmRegistration(code, true, function(err : any, result : any) {
         if (err) {
           console.log(err);
           res.send(err);
            return;
         }
         console.log(result);
         res.send(result);
    });
 }

export const login = (req: Request, res: Response) => {

	 const {email, password} = req.body

	const loginDetails : any = {
		Username : email,
		Password : password
	}

	const authenticationDetails : any = new AuthenticationDetails(loginDetails)

	const userDetails = {
		Username: email,
		Pool: userPool,
	};

	const cognitoUser = new CognitoUser(userDetails)

	cognitoUser.authenticateUser(authenticationDetails, {
		onSuccess: result => {
			res.send({
			token: result.getIdToken().getJwtToken(),
			accessToken : result.getAccessToken().getJwtToken(),
			username : result.getAccessToken().payload.username,
			name : result.getIdToken().payload.name,
			email : result.getIdToken().payload.email
			})
			//  db.query('INSERT INTO parent (parent_id, parent_name, parent_email) VALUES(?,?,?)', [result.getAccessToken().payload.username, result.getIdToken().payload.name, result.getIdToken().payload.email],
			//  (err, result) => {
			//     if(err){
			// 	console.log(err);
			//  	}
			//  }) 

		},
	
		onFailure: function(err) {
			console.log(err.message || JSON.stringify(err));
			res.send(err.message || JSON.stringify(err));
		},
	});

}

export const verifyToken = (req: Request, res : Response) => {

	const userPoolId = poolData.UserPoolId; // Cognito user pool id here    
	const pool_region = 'ap-south-1'; // Region where your cognito user pool is created
	const {token} = req.body
	let pem;
	
	
	// Token verification function
		console.log('Validating the token...')
		request({
			url: `https://cognito-idp.${pool_region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`,
			json: true
		}, (error, request, body) => {
			console.log('validation token..')
			if (!error && request.statusCode === 200) {
				let pems : any = {};
				var keys = body['keys'];
				for(var i = 0; i < keys.length; i++) {
					//Convert each key to PEM
					var key_id = keys[i].kid;
					var modulus = keys[i].n;
					var exponent = keys[i].e;
					var key_type = keys[i].kty;
					var jwk = { kty: key_type, n: modulus, e: exponent};
					var pem = jwkToPem(jwk);
					pems[key_id] = pem;
				}
				//validate the token
				var decodedJwt = jwt.decode(token, {complete: true});
				if (!decodedJwt) {
					res.send("Not a valid JWT token");
					return;
				}
	
				var kid: any= decodedJwt.header.kid;
				pem = pems[kid];
				if (!pem) {
					res.send('Invalid token');
					return;
				}
	
				jwt.verify(token, pem, function(err: any, payload : any) {
					if(err) {
						res.send("Invalid Token.");
					} else {
						console.log("Valid Token.");
						res.send(payload);
					}
				});
			} else {
				console.log(error)
				console.log("Error! Unable to download JWKs");
			}
		});

}

 export const loginParentDataInput = (req: Request, res: Response) => {

	const {parentId, parentName, parentEmail} = req.body

 	db.query('INSERT INTO parent (parent_id, parent_name, parent_email) VALUES(?,?,?)', [parentId, parentName, parentEmail],
 	(err, result) => {
 	   if(err){
 		   console.log(err);
 		}
		 res.send(result)
 	}) 
 }

export const getAllUsers = (req: Request, res: Response) => {

	const {email} = req.body

	const userDetails = {
		Username: email,
		Pool: userPool,
	};


	const cognitoUser = new CognitoUser(userDetails)

	cognitoUser.getUserData(function(err, userData) {
		if (err) {
			res.send(err.message || JSON.stringify(err));
			return;
		}
		console.log('User data for user ' + userData);
	});
	
	// If you want to force to get the user data from backend,
	// you can set the bypassCache to true
	cognitoUser.getUserData(
		function(err, userData) {
			if (err) {
				res.send(err.message || JSON.stringify(err));
				return;
			}
			res.send('User data for user ' + userData);
		},
		{ bypassCache: true }
	);
}

export const resendCode = (req: Request, res: Response) => {

	const {email} = req.body

	const userDetails = {
		Username: email,
		Pool: userPool,
	};


	const cognitoUser = new CognitoUser(userDetails)

	cognitoUser.resendConfirmationCode(function(err, result) {
		if (err) {
			res.send(err.message || JSON.stringify(err));
			return;
		}
		console.log(result);
		res.send(result);
	});
}

export const rememberDevice = (req : Request, res : Response) => {

	const {email} = req.body

	const userDetails = {
		Username: email,
		Pool: userPool,
	};


	const cognitoUser = new CognitoUser(userDetails)
	cognitoUser.setDeviceStatusRemembered({
		onSuccess: function(result) {
			res.send('call result: ' + result);
		},
		onFailure: function(err) {
			res.send(err.message || JSON.stringify(err));
		},
	});
}

export const logout = (req: Request, res: Response) => {

	const {email} = req.body

	const userDetails = {
		Username: email,
		Pool: userPool,
	};

	const cognitoUser = new CognitoUser(userDetails)
	
	cognitoUser.signOut();
}

export const forgotPassword = (req : Request, res: Response) => {

	let {email} = req.body

	const userDetails = {
		Username: email,
		Pool: userPool,
	};

	const cognitoUser = new CognitoUser(userDetails)


    cognitoUser.forgotPassword({
        onSuccess: function (data) {
            // successfully initiated reset password request
			  res.send({result : data})
        },
        onFailure: function(err) {
            res.send(err.message);
        },
    });
}

export const forgotPasswordNext = (req: Request, res: Response) =>{

	let {email, verificationCode, newPassword} = req.body

	const userDetails = {
		Username: email,
		Pool: userPool,
	};

	const cognitoUser = new CognitoUser(userDetails)

		cognitoUser.confirmPassword(verificationCode, newPassword, {
			onSuccess() {
				res.send('Password confirmed!');
			},
			onFailure(err) {
				res.send(err);
			}
		});
}

export const passwordLessLogin = (req: Request, res: Response) => {

	const {email, password} = req.body

	const loginDetails : any = {
		Username : email,
	}

	const authenticationDetails : any = new AuthenticationDetails(loginDetails)

	const userDetails = {
		Username: email,
		Pool: userPool,
	};

	const cognitoUser = new CognitoUser(userDetails)


	cognitoUser.setAuthenticationFlowType('CUSTOM_AUTH');

	cognitoUser.initiateAuth(authenticationDetails, {
	onSuccess: result => {
		res.send({
		token: result.getIdToken().getJwtToken(),
		accessToken : result.getAccessToken().getJwtToken()
		})
	},

	onFailure: function(err) {
		console.log(err.message || JSON.stringify(err));
		res.send(err.message || JSON.stringify(err));
	},

	customChallenge: function(loginDetails) {
		var challengeResponses = 'challenge-answer';
		cognitoUser.sendCustomChallengeAnswer(challengeResponses, this);
	},
});
}

export const childrenSelect = (req: Request, res: Response) => {

		const {userId} = req.body
		
	try {
		
		db.query(`SELECT * FROM student WHERE parent_id = ?`, [userId],
		(err, result) => {
		   if(err){
			   console.log(err);
			   res.json({message : "error"})
		   }else{
			   res.json({message : "success",result})
		   }
	   })
  
	  } catch (error) {
		  res.status(404).json( {message : 'Error'} )
	  }
}
export const createChild = (req: Request, res: Response) => {

		const {studentName, studentGender, studentAge, parentId} = req.body
		
	try {
		
		db.query('INSERT INTO student (student_name, student_gender, student_age, parent_id) VALUES(?,?,?,?)', [studentName, studentGender,studentAge, parentId, studentGender],
		(err, result) => {
		   if(err){
			   console.log(err);
			   res.json({message : "error"})
		   }else{
			   res.json({message : "success",result})
		   }
	   })
  
	  } catch (error) {
		  res.status(404).json( {message : 'Error'} )
	  }
}