"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.trialEmail = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const ses = new aws_sdk_1.default.SES({
    apiVersion: "2022-05-09",
    accessKeyId: 'AKIA3V6IJEBBECRZI36R',
    secretAccessKey: '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',
    region: 'ap-south-1'
});
exports.trialEmail = ((req, res) => {
    const { body, emailTo, subject } = req.body;
    const yoyo = (emailTo, body) => {
        const params = {
            Destination: {
                ToAddresses: [emailTo]
            },
            Message: {
                Body: {
                    // Text : {
                    //     Data : "Trial Run for the SES" + body
                    // },
                    Html: {
                        Data: `<h1>${body}</h1>`
                    }
                },
                Subject: {
                    Data: { subject }
                }
            },
            Source: "adeeb.shah@smartle.co" // talk2ussmartle.co
        };
        return ses.sendEmail(params).promise();
    };
    yoyo(emailTo, body).then((val) => {
        console.log(val);
        res.send("Email Sent Sucessfully");
    }).catch((err) => {
        res.send("Error" + err);
    });
});
