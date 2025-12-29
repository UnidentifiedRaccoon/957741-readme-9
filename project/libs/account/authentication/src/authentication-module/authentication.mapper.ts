import { BlogUserEntity } from '@project/blog-user';
import { UserRdo } from '../rdo/user.rdo';
import { LoggedUserRdo } from '../rdo/logged-user.rdo';
import { fillDto } from '@project/helpers';

export const mapUserToRdo = (user: BlogUserEntity): UserRdo => {
  return fillDto(UserRdo, user.toPOJO());
}

export const mapLoggedUserToRdo = (user: BlogUserEntity, accessToken?: string): LoggedUserRdo => {
  return fillDto(LoggedUserRdo, {
    ...user.toPOJO(),
    accessToken: accessToken ?? '',
  });
}
