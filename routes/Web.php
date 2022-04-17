<?php

namespace Hasdemir\Route;

use Hasdemir\Base\Codes;

class Web
{
  public static $routes = [];

  public static function getRoutes()
  {
    global $routes;
    self::addRoutes();
    return $routes;
  }

  public static function addRoutes()
  {
    global $routes;

    $routes['Home'][Codes::MIDDLEWARE] = [];
    $routes['Home'][Codes::ROUTES] = [
      ['GET', '/', 'home'],
      ['GET', '/404', 'not_found'],
    ];

    $routes['Admin'][Codes::MIDDLEWARE] = [];
    $routes['Admin'][Codes::ROUTES] = [
      ['GET', '/login', 'admin'],
      ['GET', '/register', 'admin'],
      ['GET', '/forget-password', 'admin'],
      ['GET', '/admin', 'admin'],
      ['GET', '/admin/users', 'admin'],
      ['GET', '/admin/users/new', 'admin'],
      ['GET', '/admin/users/{id}', 'admin'],
      ['GET', '/admin/roles', 'admin'],
      ['GET', '/admin/roles/new', 'admin'],
      ['GET', '/admin/roles/{id}', 'admin'],
      ['GET', '/admin/option', 'admin'],
      ['GET', '/admin/layouts', 'admin'],
    ];

    $routes['Route'][Codes::MIDDLEWARE] = ['TrailingSlashes'];
    $routes['Route'][Codes::ROUTES] = [
      ['GET', '/{uri1}/{uri2}/{uri3}/{uri4}/', 'route'],
    ];
  }
}
