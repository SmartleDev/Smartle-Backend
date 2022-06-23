"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkVoucher = void 0;
const config_1 = __importDefault(require("../config/config"));
exports.checkVoucher = ((req, res) => {
    const { code, course_id, parent_id } = req.body;
    console.log(req.body);
    config_1.default.query('SELECT * FROM smartle.voucher  WHERE voucher_code=? AND date(voucher_expirydate) >= curdate()', [code], (err, rows) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        if (err) {
            console.log(err);
        }
        const id = "" + ((_a = rows[0]) === null || _a === void 0 ? void 0 : _a.voucher_course_id);
        if (rows.length === 0) {
            res.send({ result: "Code Not Active or Expired" });
        }
        else if (((_b = rows[0]) === null || _b === void 0 ? void 0 : _b.voucher_usagecount) >= ((_c = rows[0]) === null || _c === void 0 ? void 0 : _c.voucher_limit)) {
            res.send({ result: "Usage Count Reached!" });
        }
        else if (((_d = rows[0]) === null || _d === void 0 ? void 0 : _d.voucher_active) !== 'ACTIVE' || ((_e = rows[0]) === null || _e === void 0 ? void 0 : _e.voucher_active) === '') {
            res.send({ result: "Code not active!" });
        }
        else if (((_f = rows[0]) === null || _f === void 0 ? void 0 : _f.voucher_course_id) !== "0") {
            if (id !== course_id) {
                res.send({ result: "Not valid for this course" });
            }
            else if (((_g = rows[0]) === null || _g === void 0 ? void 0 : _g.voucher_pid) !== "0") {
                if (((_h = rows[0]) === null || _h === void 0 ? void 0 : _h.voucher_pid) !== parent_id) {
                }
                else if (((_j = rows[0]) === null || _j === void 0 ? void 0 : _j.voucher_pid) !== "0") {
                    if (((_k = rows[0]) === null || _k === void 0 ? void 0 : _k.voucher_pid) !== parent_id) {
                        res.send({ result: "Not valid for this parent id" });
                    }
                    else {
                        res.send({ result: parseInt(rows[0].voucher_discount) });
                    }
                }
                else {
                    res.send({ result: "Not valid for this parent id" });
                }
            }
            else {
                res.send({ result: parseInt(rows[0].voucher_discount) });
            }
        }
        else if (((_l = rows[0]) === null || _l === void 0 ? void 0 : _l.voucher_pid) !== "0") {
            if (((_m = rows[0]) === null || _m === void 0 ? void 0 : _m.voucher_pid) !== parent_id) {
                res.send({ result: "Not valid for this parent id" });
            }
            else {
                res.send({ result: parseInt(rows[0].voucher_discount) });
            }
        }
        else {
            res.send({ result: parseInt(rows[0].voucher_discount) });
        }
    });
});
