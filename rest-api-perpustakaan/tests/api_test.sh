#!/bin/bash

echo "== Test 1: GET semua buku =="
curl -X GET http://localhost:8000/api/books
echo -e "\n"

echo "== Test 2: POST buku baru =="
curl -X POST http://localhost:8000/api/books \
  -H "Content-Type: application/json" \
  -d '{"judul":"Pulang","penulis":"Leila S. Chudori","tahun":2012,"stok":4}'
echo -e "\n"

echo "== Test 3: GET buku ID 5 =="
curl -X GET http://localhost:8000/api/books/5
echo -e "\n"

echo "== Test 4: PUT ubah buku =="
curl -X PUT http://localhost:8000/api/books/1 \
  -H "Content-Type: application/json" \
  -d '{"judul":"Laskar Pelangi Revisi","penulis":"Andrea Hirata","tahun":2008,"stok":10}'
echo -e "\n"

echo "== Test 5: DELETE buku =="
curl -X DELETE http://localhost:8000/api/books/3
echo -e "\n"

echo "== Test 6: Validasi error =="
curl -X POST http://localhost:8000/api/books \
  -H "Content-Type: application/json" \
  -d '{"judul":""}'
echo -e "\n"