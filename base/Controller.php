<?php

namespace Hasdemir\Base;

class Controller
{
  public function __construct()
  {
    $GLOBALS['is_route_called'] = true;
  }
}
