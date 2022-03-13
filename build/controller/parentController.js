"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllParents = void 0;
const config_1 = __importDefault(require("../config/config"));
exports.getAllParents = ((req, res) => {
    // db.getConnection(function (err: any, conn: any){
    //     if(err){
    //         console.log(err)
    //     }
    config_1.default.query('SELECT * from parent', (err, rows) => {
        if (err) {
            console.log(err);
        }
        res.send(rows);
    });
    //     conn.release();
    // })   
});
