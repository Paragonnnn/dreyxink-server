export const logOut = (req, res) => {
  res
    .clearCookie("refreshToken", {
      httpOnly: true,
      domain: ".dreyxink-server.onrender.com",
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    })
    .status(200)
    .json({ success: true, message: "User logged out" });
};
