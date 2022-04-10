<?php

namespace Hasdemir\Controller;

use Hasdemir\Base\Codes as BaseCodes;

class Codes extends BaseCodes
{
  const JOB_ADMIN = 'admin';
  const JOB_LOGIN = 'loginAttempt';
  const JOB_LOGOUT = 'logout';
  const JOB_AUTH_CHECK = 'authCheck';
  const JOB_USER_SEARCH = 'userSearch';
  const JOB_USER_CREATE = 'userCreate';
  const JOB_USER_READ = 'userRead';
  const JOB_USER_UPDATE = 'userUpdate';
  const JOB_USER_DELETE = 'userDelete';
  const JOB_POST_SEARCH = 'postSearch';
  const JOB_POST_CREATE = 'postCreate';
  const JOB_POST_READ = 'postRead';
  const JOB_POST_UPDATE = 'postUpdate';
  const JOB_POST_DELETE = 'postDelete';
  const JOB_SLUG_SEARCH = 'slugSearch';
  const JOB_SLUG_CREATE = 'slugCreate';
  const JOB_SLUG_READ = 'slugRead';
  const JOB_SLUG_UPDATE = 'slugUpdate';
  const JOB_SLUG_DELETE = 'slugDelete';
  const JOB_OPTION_SEARCH = 'optionSearch';
  const JOB_OPTION_CREATE = 'optionCreate';
  const JOB_OPTION_READ = 'optionRead';
  const JOB_OPTION_UPDATE = 'optionUpdate';
  const JOB_OPTION_DELETE = 'optionDelete';
  const JOB_CATEGORY_SEARCH = 'categorySearch';
  const JOB_CATEGORY_CREATE = 'categoryCreate';
  const JOB_CATEGORY_READ = 'categoryRead';
  const JOB_CATEGORY_UPDATE = 'categoryUpdate';
  const JOB_CATEGORY_DELETE = 'categoryDelete';
  const JOB_AUTO_LINK_SEARCH = 'autoLinkSearch';
  const JOB_AUTO_LINK_CREATE = 'autoLinkCreate';
  const JOB_AUTO_LINK_READ = 'autoLinkRead';
  const JOB_AUTO_LINK_UPDATE = 'autoLinkUpdate';
  const JOB_AUTO_LINK_DELETE = 'autoLinkDelete';
}