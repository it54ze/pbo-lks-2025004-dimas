<?php
/**
 * Front Controller
 * Satu-satunya file yang diakses dari browser.
 * Semua request masuk lewat sini, lalu diarahkan ke Controller.
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');
header('Access-Control-Max-Age: 86400');

// Handle preflight request (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . '/../vendor/autoload.php';

use App\Config\Env;
use App\Controllers\BookController;
use App\Contracts\BookRepositoryInterface;
use App\Core\Container;
use App\Core\Request;
use App\Core\Response;
use App\Core\Router;
use App\Database\Connection;
use App\Repositories\MySQLBookRepository;
use App\Services\BookService;
use App\Controllers\CategoryController;
use App\Contracts\CategoryRepositoryInterface;
use App\Repositories\MySQLCategoryRepository;
use App\Services\CategoryService;

// 1. Load konfigurasi
Env::load(__DIR__ . '/../.env');

// 2. Setup Dependency Container
$container = new Container();
$container->singleton(PDO::class, fn() => Connection::get());
$container->bind(
    BookRepositoryInterface::class,
    fn(Container $c) => new MySQLBookRepository($c->make(PDO::class))
);
$container->bind(
    BookService::class,
    fn(Container $c) => new BookService(
        $c->make(BookRepositoryInterface::class)
    )
);
$container->bind(
    BookController::class,
    fn(Container $c) => new BookController(
        $c->make(BookService::class)
    )
);

// 3. Daftarkan route
$router = new Router();
$controller = $container->make(BookController::class);
$router->get('/api/books', [$controller, 'index']);
$router->get('/api/books/{id}', [$controller, 'show']);
$router->post('/api/books', [$controller, 'store']);
$router->put('/api/books/{id}', [$controller, 'update']);
$router->delete('/api/books/{id}', [$controller, 'destroy']);

// TAMBAHAN - Binding Category
$container->bind(
    CategoryRepositoryInterface::class,
    fn(Container $c) => new MySQLCategoryRepository($c->make(PDO::class))
);

$container->bind(
    CategoryService::class,
    fn(Container $c) => new CategoryService(
        $c->make(CategoryRepositoryInterface::class)
    )
);

$container->bind(
    CategoryController::class,
    fn(Container $c) => new CategoryController(
        $c->make(CategoryService::class)
    )
);

// TAMBAHAN - Route Category
$categoryCtrl = $container->make(CategoryController::class);

$router->get('/api/categories', [$categoryCtrl, 'index']);
$router->get('/api/categories/{id}', [$categoryCtrl, 'show']);
$router->post('/api/categories', [$categoryCtrl, 'store']);
$router->put('/api/categories/{id}', [$categoryCtrl, 'update']);
$router->delete('/api/categories/{id}', [$categoryCtrl, 'destroy']);

// 4. Dispatch request
try {
    $router->dispatch(new Request());
} catch (\Throwable $e) {
    Response::error('Server Error: ' . $e->getMessage(), 500);
}