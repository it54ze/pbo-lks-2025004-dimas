<?php
namespace App\Core;

class Router
{
    /** @var array<string, array<string, callable>> */
    private array $routes = [];

    public function get(string $path, callable $h): void { $this->routes['GET'][$path] = $h; }
    public function post(string $path, callable $h): void { $this->routes['POST'][$path] = $h; }
    public function put(string $path, callable $h): void { $this->routes['PUT'][$path] = $h; }
    public function delete(string $path, callable $h): void { $this->routes['DELETE'][$path] = $h; }

    public function dispatch(Request $request): void
    {
        $method = $request->method();
        $uri = rtrim($request->uri(), '/') ?: '/';

        if (!isset($this->routes[$method])) {
            Response::error("HTTP method $method tidak didukung", 405);
        }

        // 1) Exact match
        if (isset($this->routes[$method][$uri])) {
            call_user_func($this->routes[$method][$uri], $request);
            return;
        }

        // 2) Pattern match (misal /api/books/{id})
        foreach ($this->routes[$method] as $route => $handler) {
            $pattern = preg_replace('#\{[^}]+\}#', '([^/]+)', $route);
            if (preg_match("#^$pattern$#", $uri, $matches)) {
                array_shift($matches); // hapus full match
                call_user_func_array(
                    $handler,
                    array_merge([$request], $matches)
                );
                return;
            }
        }

        Response::error("Endpoint tidak ditemukan: $uri", 404);
    }
}