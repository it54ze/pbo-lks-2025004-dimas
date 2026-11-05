<?php

namespace App\Controllers;

use App\Core\Request;
use App\Core\Response;
use App\Services\CategoryService;
use InvalidArgumentException;

/**
 * CategoryController menerjemahkan HTTP request ke Service.
 */
class CategoryController
{
    public function __construct(private CategoryService $service) {}

    public function index(Request $request): void
    {
        try {
            Response::success($this->service->list(), 'Daftar kategori');
        } catch (\Throwable $e) {
            Response::error($e->getMessage(), 500);
        }
    }

    public function show(Request $request, string $id): void
    {
        try {
            Response::success($this->service->detail((int) $id), 'Detail kategori');
        } catch (InvalidArgumentException $e) {
            Response::error($e->getMessage(), $e->getCode() ?: 404);
        } catch (\Throwable $e) {
            Response::error($e->getMessage(), 500);
        }
    }

    public function store(Request $request): void
    {
        try {
            $data = $this->service->create($request->body());
            Response::success($data, 'Kategori berhasil dibuat', 201);
        } catch (InvalidArgumentException $e) {
            Response::error($e->getMessage(), $e->getCode() ?: 422);
        } catch (\Throwable $e) {
            Response::error($e->getMessage(), 500);
        }
    }

    public function update(Request $request, string $id): void
    {
        try {
            $data = $this->service->update((int) $id, $request->body());
            Response::success($data, 'Kategori berhasil diperbarui');
        } catch (InvalidArgumentException $e) {
            Response::error($e->getMessage(), $e->getCode() ?: 422);
        } catch (\Throwable $e) {
            Response::error($e->getMessage(), 500);
        }
    }

    public function destroy(Request $request, string $id): void
    {
        try {
            $this->service->delete((int) $id);
            Response::success(null, 'Kategori berhasil dihapus');
        } catch (InvalidArgumentException $e) {
            Response::error($e->getMessage(), $e->getCode() ?: 404);
        } catch (\Throwable $e) {
            Response::error($e->getMessage(), 500);
        }
    }
}