<?php

namespace App\Services;

use App\Contracts\CategoryRepositoryInterface;
use App\Models\Category;
use InvalidArgumentException;

/**
 * CategoryService pusat logika bisnis kategori.
 * TIDAK tahu database apa yang dipakai (hanya tahu interface).
 */
class CategoryService
{
    public function __construct(
        private CategoryRepositoryInterface $repo
    ) {}

    public function list(): array
    {
        return array_map(
            fn(Category $c) => $c->toArray(),
            $this->repo->findAll()
        );
    }

    public function detail(int $id): array
    {
        $category = $this->repo->findById($id);
        if ($category === null) {
            throw new InvalidArgumentException(
                "Kategori dengan ID {$id} tidak ditemukan",
                404
            );
        }
        
        return $category->toArray();
    }

    public function create(array $data): array
    {
        $this->validate($data);
        
        $category = new Category(
            null,
            $data['nama'],
            $data['deskripsi'] ?? ''
        );
        
        $id = $this->repo->save($category);
        
        return $this->detail($id);
    }

    public function update(int $id, array $data): array
    {
        if ($this->repo->findById($id) === null) {
            throw new InvalidArgumentException(
                "Kategori dengan ID {$id} tidak ditemukan",
                404
            );
        }
        
        $this->validate($data);
        
        $category = new Category(
            $id,
            $data['nama'],
            $data['deskripsi'] ?? ''
        );
        
        $this->repo->update($category);
        
        return $this->detail($id);
    }

    public function delete(int $id): void
    {
        if ($this->repo->findById($id) === null) {
            throw new InvalidArgumentException(
                "Kategori dengan ID {$id} tidak ditemukan",
                404
            );
        }
        
        $this->repo->delete($id);
    }

    /** Validasi input dari user. */
    private function validate(array $data): void
    {
        if (empty($data['nama'])) {
            throw new InvalidArgumentException('Nama kategori wajib diisi', 422);
        }
        if (strlen($data['nama']) > 100) {
            throw new InvalidArgumentException('Nama maksimal 100 karakter', 422);
        }
    }
}