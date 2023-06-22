// User Roles
const ROLE = {
  ADMIN: "admin",
  CONSUMER: "consumer",
  FREELANCER: "freelancer",
};

// Avatar Image Size for DiceBear Avatars
const AVATAR_IMAGE_SIZE = 200;
const DEFAULT_AVATAR = (name)=>`https://avatars.dicebear.com/api/initials/${name}.svg?size=${AVATAR_IMAGE_SIZE}`

// Regular Expressions for Validations
const NAME_REGEX = /^[a-zA-Z-]+$/
const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const USERNAME_REGEX = /^[a-zA-Z0-9]+$/
const PHONE_REGEX = /^((\+91)?|91?|0)?[789][0-9]{9}$/
const PASSWORD_REGEX = /^(?=.[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/

// Google Scopes for Google OAuth
const GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email",
]

module.exports = {
  ROLE,
  AVATAR_IMAGE_SIZE,
  DEFAULT_AVATAR,
  NAME_REGEX,
  EMAIL_REGEX,
  USERNAME_REGEX,
  PHONE_REGEX,
  PASSWORD_REGEX,
  GOOGLE_SCOPES
};
