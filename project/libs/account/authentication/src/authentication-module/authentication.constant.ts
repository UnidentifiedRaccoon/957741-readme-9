export const AUTH_USER_EXISTS = 'User with this email already exists'
export const AUTH_USER_NOT_FOUND = 'User not found';
export const AUTH_USER_PASSWORD_WRONG = 'User password is wrong';

export const AuthenticationResponseMessage = {
    UserCreated: 'The new user has been successfully created.',
    UserLogged: 'User has been successfully logged.',
    UserFound: 'User found',
    UserNotFound: 'User not found',
    UserExists: 'User with this email already exists',
    UserPasswordWrong: 'Password or Login is wrong.',
} as const;
  

export const AuthenticationValidateMessage = {
    EmailNotValid: 'The email is not valid',
    DateBirthNotValid: 'The user date birth is not valid',
} as const;
  