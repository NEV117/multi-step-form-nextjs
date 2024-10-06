/* eslint-disable prettier/prettier */
"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableColumn,
  TableHeader,
  TableBody,
  TableCell,
  TableRow,
  getKeyValue,
} from "@nextui-org/table";
import { Input } from "@nextui-org/input";

import { CreateProduct } from "../Modals/CreateProducts";
import { SearchIcon } from "../icons";

import { useProducts } from "@/hooks/products/useProducts";
import { useCategories } from "@/hooks/categories/useCategories";

export const Products = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchTitle, setSearchTitle] = useState<string>("");

  const {
    products,
    loading,
    setFilters: updateFilters,
  } = useProducts({
    page,
    limit: rowsPerPage,
    categoryId: selectedCategory || undefined,
    title: searchTitle, // Agregar filtro por título
  });

  const { categories, categoriesLoading, error } = useCategories();

  useEffect(() => {
    updateFilters({
      page,
      limit: rowsPerPage,
      categoryId: selectedCategory || undefined,
      title: searchTitle, // Actualizar el filtro de búsqueda por título
    });
  }, [page, rowsPerPage, selectedCategory, searchTitle]);

  const loadingState = loading ? "loading" : "idle";

  const onRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  };

  const handleTitleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTitle(e.target.value); // Actualizar el estado de búsqueda por título
  };

  const topContent = (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between gap-3 items-end">
        <CreateProduct />
      </div>
      <div className="flex justify-between items-center">
        <label className="flex items-center text-default-400 text-small">
          Rows per page:
          <select
            className="bg-transparent outline-none text-default-400 text-small"
            onChange={onRowsPerPageChange}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="40">40</option>
          </select>
        </label>

        <Input
        className="max-w-[200px]"
          endContent={
            <SearchIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
          }
          placeholder="Search by title"
          type="text"
          value={searchTitle}
          onChange={handleTitleSearch}
        />
      </div>
    </div>
  );

  return (
    <Table
      isStriped
      aria-label="Tabla de productos con paginación asíncrona"
      topContent={topContent}
    >
      <TableHeader>
        <TableColumn key="title">Product Name</TableColumn>
        <TableColumn key="price">Price</TableColumn>
        <TableColumn key="category">Category</TableColumn>
        <TableColumn key="images">Image</TableColumn>
      </TableHeader>
      <TableBody
        emptyContent={"No rows to display."}
        items={products ?? []}
        loadingContent={"Loading..."}
        loadingState={loadingState}
      >
        {(product) => (
          <TableRow key={product?.id}>
            {(columnKey) => (
              <TableCell>
                {columnKey === "category" ? (
                  product.category?.name
                ) : columnKey === "images" ? (
                  product.images.length > 0 ? (
                    <img
                      alt={product.title}
                      src={JSON.parse(product.images[0])[0]}
                      style={{ width: "50px", height: "50px" }}
                    />
                  ) : (
                    "No image available"
                  )
                ) : (
                  getKeyValue(product, columnKey)
                )}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
