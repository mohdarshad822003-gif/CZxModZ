const express = require("express");

const app = express();

app.use(express.json());

const keys = {
    "CZX-12345": {
        active: true,
        expires: "2026-12-31"
    },
    "CZX-67890": {
        active: true,
        expires: "2026-10-15"
    }
};

app.get("/", (req, res) => {
    res.send("Key Server is Running!");
});

app.post("/api/login", (req, res) => {

    const key = req.body.key;

    if (!key) {
        return res.status(400).json({
            success: false,
            message: "Key required"
        });
    }

    const data = keys[key];

    if (!data) {
        return res.status(401).json({
            success: false,
            message: "Invalid key"
        });
    }

    if (!data.active) {
        return res.status(401).json({
            success: false,
            message: "Key disabled"
        });
    }

    const today = new Date();
    const expiry = new Date(data.expires);

    if (today > expiry) {
        return res.status(401).json({
            success: false,
            message: "Key expired"
        });
    }

    res.json({
        success: true,
        message: "Login successful",
        expires: data.expires
    });
});app.listen(3000, () => {
    console.log("Server running on port 3000");
});
app.get("/check/:key", (req, res) => {
    const key = req.params.key;
    const data = keys[key];

    if (!data) {
        return res.json({
            success: false,
            message: "Invalid key"
        });
    }

    if (!data.active) {
        return res.json({
            success: false,
            message: "Key disabled"
        });
    }

    const today = new Date();
    const expiry = new Date(data.expires);

    if (today > expiry) {
        return res.json({
            success: false,
            message: "Key expired"
        });
    }

    res.json({
        success: true,
        message: "Key is valid",
        expires: data.expires
    });
});
