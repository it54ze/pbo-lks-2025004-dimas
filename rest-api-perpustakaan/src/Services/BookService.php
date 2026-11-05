<?php
namespace App\Services;

use App\Contracts\BookRepositoryInterface;
use App\Models\Book;
use InvalidArgumentException;

/**
 * BookService pusat logika bisnis buku.
 * TIDAK tahu database apa yang dipakai (hanya tahu interface).
 */
class BookService
{
    public function __construct(
        private BookRepositoryInterface $repo
    ) {}

    /** @return array[] */
    public function list(): array
    {
        return array_map(
            fn(Book $b) => $b->toArray(),
            $this->repo->findAll()
        );
    }

    public function detail(int $id): array
    {
        $book = $this->repo->findById($id);
        
        if ($book === null) {
            throw new InvalidArgumentException(
                "Buku dengan ID $id tidak ditemukan",
                404
            );
        }

        return $book->toArray();
    }

    public function create(array $data): array
    {
        $this->validate($data);

        $book = new Book(
            null,
            $data['judul'],
            $data['penulis'],
            (int) $data['tahun'],
            (int) $data['stok']
        );

        $id = $this->repo->save($book);

        return $this->detail($id);
    }

    public function update(int $id, array $data): array
    {
        if ($this->repo->findById($id) === null) {
            throw new InvalidArgumentException(
                "Buku dengan ID $id tidak ditemukan",
                404
            );
        }

        $this->validate($data);

        $book = new Book(
            $id,
            $data['judul'],
            $data['penulis'],
            (int) $data['tahun'],
            (int) $data['stok']
        );

        $this->repo->update($book);

        return $this->detail($id);
    }

    public function delete(int $id): void
    {
        if ($this->repo->findById($id) === null) {
            throw new InvalidArgumentException(
                "Buku dengan ID $id tidak ditemukan",
                404
            );
        }

        $this->repo->delete($id);
    }

    /** Validasi input dari user. */
    private function validate(array $data): void
    {
        if (empty($data['judul'])) {
            throw new InvalidArgumentException('Judul wajib diisi', 422);
        }

        if (empty($data['penulis'])) {
            throw new InvalidArgumentException('Penulis wajib diisi', 422);
        }

        if (!isset($data['tahun']) || !is_numeric($data['tahun'])) {
            throw new InvalidArgumentException('Tahun harus berupa angka', 422);
        }

        if (!isset($data['stok']) || !is_numeric($data['stok'])) {
            throw new InvalidArgumentException('Stok harus berupa angka', 422);
        }
    }
}