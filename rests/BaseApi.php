<?php

namespace Hasdemir\Rest;

use Hasdemir\Base\Auth;
use Hasdemir\Base\Rest;
use Hasdemir\Base\Session;

class BaseApi extends Rest
{
  public static $authenticatedUser;

  public function __construct()
  {
    self::$authenticatedUser = Session::get('user.session');
  }
}
