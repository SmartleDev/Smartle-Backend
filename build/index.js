"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const config_1 = __importDefault(require("./config/config"));
const studentRoutes_1 = __importDefault(require("./routes/studentRoutes"));
const coursesRoutes_1 = __importDefault(require("./routes/coursesRoutes"));
const parentRoutes_1 = __importDefault(require("./routes/parentRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const enrollmentRoutes_1 = __importDefault(require("./routes/enrollmentRoutes"));
const courseProgressRoutes_1 = __importDefault(require("./routes/courseProgressRoutes"));
const emailServiceRoutes_1 = __importDefault(require("./routes/emailServiceRoutes"));
const voucherRoutes_1 = __importDefault(require("./routes/voucherRoutes"));
const homeRoutes_1 = __importDefault(require("./routes/homeRoutes"));
const app = (0, express_1.default)();
dotenv_1.default.config({ path: './.env' });
app.use(express_1.default.json({ limit: "30mb" }));
app.use(express_1.default.urlencoded({ limit: "30mb", extended: true }));
app.use((0, cors_1.default)());
config_1.default.connect((err) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log(`MYSQL Database connected`);
    }
});
// app.use(MainRouters)
app.use('/', studentRoutes_1.default);
app.use('/', coursesRoutes_1.default);
app.use('/', parentRoutes_1.default);
app.use('/', authRoutes_1.default);
app.use('/', enrollmentRoutes_1.default);
app.use('/', courseProgressRoutes_1.default);
app.use('/', emailServiceRoutes_1.default);
app.use('/', voucherRoutes_1.default);
app.use('/', homeRoutes_1.default);
app.get("/", (req, res) => {
    res.json({ message: "Smartle Backend" });
});
app.listen("8000", () => {
    console.log("Server Running!");
});
