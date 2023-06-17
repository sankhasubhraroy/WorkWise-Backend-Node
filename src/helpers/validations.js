const nameRegex = new RegExp(process.env.NAME_REGEX);
const emailRegex = new RegExp(process.env.EMAIL_REGEX);
const usernameRegex = new RegExp(process.env.USERNAME_REGEX);
const phoneRegex = new RegExp(process.env.PHONE_REGEX);
const passwordRegex = new RegExp(process.env.PASSWORD_REGEX);

exports.isNameValid = (name) => {
    if (name.length < 3)
        return false;

    const valid = nameRegex.test(name);
    if (!valid)
        return false;

    return true;
}

exports.isEmailValid = (email) => {
    if (email.length > 254)
        return false;

    const valid = emailRegex.test(email);
    if (!valid)
        return false;

    const parts = email.split("@");
    if (parts[0].length > 64)
        return false;

    // when passed all tests
    return true;
}

exports.isUsernameValid = (username) => {
    if (username.length < 3)
        return false;

    const valid = usernameRegex.test(username);
    if (!valid)
        return false;

    return true;
}

exports.isPhoneValid = (phone) => {
    const valid = phoneRegex.test(phone);
    if (!valid)
        return false;

    return true;
}

exports.isPasswordValid = (password) => {
    const valid = passwordRegex.test(password);
    if (!valid)
        return false;

    return true;
}