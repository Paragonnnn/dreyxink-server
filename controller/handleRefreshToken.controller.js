import jwt from "jsonwebtoken";


const generateToken = (user) => {
    return jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
    });
}


export const handleRefreshToken = (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, message: "Forbidden" });
        }
        console.log(user);
        const accessToken = generateToken(user);
        res.status(200).json({ success: true, accessToken });
    });
}
