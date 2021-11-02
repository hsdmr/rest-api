<?php

namespace Hasdemir\Base;

use Hasdemir\Route\Api;
use Hasdemir\Route\Web;

class Route
{
    public static $hasRoute;
    public Request $request;

    public function __construct($request)
    {
        $this->request = $request;
    }

    public static function pattern($uri)
    {
        $patterns = [
            '{id}' => '([0-9]+)'
        ];

        foreach (explode('/', $uri) as $item) {
            if ($item != '{id}' && str_contains($item, '{')) {
                $patterns[$item] = '([0-9a-zA-Z-]+)';
            }
        }
        return $patterns;
    }

    public function run()
    {
        if ($this->isApi()) {
            $this->handle(Api::getRoutes(), API_NAMESPACE, API_PREFIX, 'Api');
        }

        if (!$this->isApi()) {
            $this->handle(Web::getRoutes(), CONTROLLER_NAMESPACE, '', 'Controller');
        }

        self::hasRoute();
    }

    public static function hasRoute()
    {
        if (self::$hasRoute === false) {
            die('Hatalı Url');
        }
    }

    public function isApi(): bool
    {
        return '/' . explode('/', $this->request->getPath())[1] === API_PREFIX;
    }

    public function handle(array $routes = [], string $namespase = '', string $prefix = '', string $class_suffix = '')
    {
        foreach ($routes as $key => $value) {
            foreach ($value as $route) {
                $class = $key . $class_suffix;
                if (!class_exists($class)) {
                    $class = $namespase . $class;
                }
                $method = $route[0];
                $uri = $prefix . $route[1];
                $function = $route[2];
                $uri = str_replace(array_keys(self::pattern($uri)), array_values(self::pattern($uri)), $uri);
                
                if (preg_match('@^' . $uri . '$@', $this->request->getPath(), $args) && $method == $this->request->getMethod()) {
                    unset($args[0]);
                    self::$hasRoute = true;
                    if (method_exists($class, $function)) {
                        call_user_func_array([new $class, $function], [$this->request, array_values($args)]);
                    }
                    break;
                }
            }
        }
    }
}
