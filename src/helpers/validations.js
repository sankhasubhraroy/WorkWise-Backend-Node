const nameRegex = new RegExp(process.env.NAME_REGEX);
const emailRegex = new RegExp(process.env.EMAIL_REGEX);
const usernameRegex = new RegExp(process.env.USERNAME_REGEX);
const phoneRegex = new RegExp(process.env.PHONE_REGEX);
const passwordRegex = new RegExp(process.env.PASSWORD_REGEX);

exports.isNameValid = (name) => {
    if (name.length < 3)
        return false;

    const isValid = nameRegex.test(name);
    if (!isValid)
        return false;

    return true;
}

exports.isEmailValid = (email) => {
    if (email.length > 254)
        return false;

    const isValid = emailRegex.test(email);
    if (!isValid)
        return false;

    const parts = email.split("@");
    if (parts[0].length > 64)
        return false;

    return true;
}

exports.isUsernameValid = (username) => {
    if (username.length < 3)
        return false;

    const isValid = usernameRegex.test(username);
    if (!isValid)
        return false;

    return true;
}

exports.isPhoneValid = (phone) => {
    const isValid = phoneRegex.test(phone);
    if (!isValid)
        return false;

    return true;
}

exports.isPasswordValid = (password) => {
    const isValid = passwordRegex.test(password);
    if (!isValid)
        return false;

    return true;
}