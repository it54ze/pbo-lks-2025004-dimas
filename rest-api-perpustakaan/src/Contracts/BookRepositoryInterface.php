<?php
namespace App\Contracts;
use App\Models\Book;
/**
* BookRepositoryInterface — kontrak akses data buku.
* Implementasi konkret (MySQL, In-Memory, dll) wajib mengikuti interface ini.
* Ini adalah inti dari prinsip Dependency Inversion (D).
*/
interface BookRepositoryInterface
{
/** @return Book[] */
public function findAll(): array;
public function findById(int $id): ?Book;
/** @return int ID yang baru dibuat */
public function save(Book $book): int;
public function update(Book $book): bool;
public function delete(int $id): bool;
}