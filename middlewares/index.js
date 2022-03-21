// jwt token there or not middleware
// i will send the jwt token in the request cookies and this middleware will identify whether jwt is compromised or not
const expressJwt= require('express-jwt');

export const jwtSigned= expressJwt({
    getToken: (req, res)=> req.cookies.token,
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
});

