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
exports.controlTrial = void 0;
const config_1 = __importDefault(require("../config/config"));
const controlTrial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        config_1.default.query('SELECT * FROM parent', (err, result) => {
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
});
exports.controlTrial = controlTrial;
