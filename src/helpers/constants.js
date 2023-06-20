// User Roles
const ROLE = {
  ADMIN: "admin",
  CONSUMER: "consumer",
  FREELANCER: "freelancer",
};

// Avatar Image Size for DiceBear Avatars
const AVATAR_IMAGE_SIZE = 200;

// Regular Expressions for Validations
const NAME_REGEX = /^[a-zA-Z-]+$/
const EMAIL_REGEX = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/
const USERNAME_REGEX = /^[a-zA-Z0-9]+$/
const PHONE_REGEX = /^((\+91)?|91?|0)?[789][0-9]{9}$/
const PASSWORD_REGEX = /^(?=.[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/

module.exports = {
  ROLE,
  AVATAR_IMAGE_SIZE,
  NAME_REGEX,
  EMAIL_REGEX,
  USERNAME_REGEX,
  PHONE_REGEX,
  PASSWORD_REGEX,
};
