import mysql from 'mysql';
import express, {Request, Response} from 'express';
import db from '../config/config';
import 'cross-fetch/polyfill';
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