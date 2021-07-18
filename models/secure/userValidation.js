const Yup = require('yup');

exports.schema = Yup.object().shape({
    fullname: Yup.string().required("fullname should not be empty").min(4, "fullname should not be less then 5").max(100, "fullname should not be less then 100"),
    email: Yup.string().email("email should not be empty").required("email should not be empty"),
    password: Yup.string().required("password should not be empty").min(5, "password should not be less then 5").max(255, "password should not be less then 100"),
    ConfirmPassword: Yup.string().required("they must br the same password").oneOf([Yup.ref("password"), null],"they must br the same password"),
})