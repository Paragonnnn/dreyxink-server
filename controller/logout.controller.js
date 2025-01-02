export const logOut = (req, res) => {
  res
    .clearCookie("refreshToken", {
      httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
    })
    .status(200)
    .json({ success: true, message: "User logged out" });
};
