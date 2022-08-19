"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateParent = exports.setParentInfo = exports.getAllParents = void 0;
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
exports.setParentInfo = ((req, res) => {
    const { parent_id } = req.body;
    config_1.default.query(`SELECT * FROM smartle.parent WHERE parent_id = "${parent_id}"`, (err, rows) => {
        if (err) {
            console.log(err);
        }
        res.send(rows);
    });
});
exports.updateParent = ((req, res) => {
    const { phone, parent_id } = req.body;
    config_1.default.query(`UPDATE smartle.parent SET parent_contactno = ? WHERE parent_id = '${parent_id}'`, [phone], (err, rows) => {
        if (err) {
            console.log(err);
        }
        res.send({ result: "Success" });
    });
});
