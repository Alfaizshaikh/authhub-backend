require("dotenv").config();
const express = require("express");

const app = express();

const authRoutes = require("./routes/authRoutes");
app.use(express.json());
app.use(
    "/auth",
    authRoutes
);

const profileRoutes =
    require("./routes/profileRoutes");
app.use(
    "/",
    profileRoutes
);

const adminRoutes =
    require("./routes/adminRoutes");
app.use(
    "/",
    adminRoutes
);
const errorHandler =
require("./middleware/errorHandler");
app.use(errorHandler);

app.listen(
    process.env.PORT,
    () => {
        console.log(
            `Server running on ${process.env.PORT}`
        );
    }
);