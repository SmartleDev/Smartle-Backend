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
exports.updateParent = exports.setParentInfo = exports.getAllParents = void 0;
const config_1 = __importDefault(require("../config/config"));
const promisePool = config_1.default.promise();
const getAllParents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // db.getConnection(function (err: any, conn: any){
    //     if(err){
    //         console.log(err)
    //     }
    try {
        const [rows] = yield promisePool.query('SELECT * from parent');
        res.send(rows);
    }
    catch (sqlError) {
        console.log(sqlError);
    }
    //     conn.release();
    // })
});
exports.getAllParents = getAllParents;
const setParentInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { parent_id } = req.body;
    try {
        const [rows] = yield promisePool.query(`SELECT * FROM smartle.parent WHERE parent_id = "${parent_id}"`);
        res.send(rows);
    }
    catch (sqlError) {
        console.log(sqlError);
    }
});
exports.setParentInfo = setParentInfo;
const updateParent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { phone, parent_id } = req.body;
    try {
        const [rows] = yield promisePool.query(`UPDATE smartle.parent SET parent_contactno = ? WHERE parent_id = '${parent_id}'`, [phone]);
        res.send({ result: 'Success' });
    }
    catch (sqlError) {
        console.log(sqlError);
    }
});
exports.updateParent = updateParent;
