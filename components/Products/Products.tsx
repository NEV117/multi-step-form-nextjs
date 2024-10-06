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

export const Products = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedCategory] = useState<number | null>(null);
  const [searchTitle, setSearchTitle] = useState<string>("");

  const {
    products,
    loading,
    setFilters: updateFilters,
  } = useProducts({
    page,
    limit: rowsPerPage,
    categoryId: selectedCategory || undefined,
    title: searchTitle,
  });

  useEffect(() => {
    updateFilters({
      page,
      limit: rowsPerPage,
      categoryId: selectedCategory || undefined,
      title: searchTitle,
    });
  }, [page, rowsPerPage, selectedCategory, searchTitle]);

  const loadingState = loading ? "loading" : "idle";

  const onRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  };

  const handleTitleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTitle(e.target.value);
  };

  const topContent = (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between gap-3 items-end">
        <CreateProduct />
      </div>
      <div className="flex justify-between items-center">
        <label className="flex items-center text-default-400 text-small">
          Cantidad de Filas:
          <select
            className="bg-transparent outline-none text-default-400 text-small"
            onChange={onRowsPerPageChange}
          >
            <option value="All" />
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
      isHeaderSticky
      isStriped
      aria-label="Tabla de productos "
      className="max-h-[650px]"
      topContent={topContent}
    >
      <TableHeader>
        <TableColumn key="title">Product Name</TableColumn>
        <TableColumn key="price">Price</TableColumn>
        <TableColumn key="category">Category</TableColumn>
        <TableColumn key="images">Image</TableColumn>
      </TableHeader>
      <TableBody
        emptyContent={loading ? "Cargando..." : "No se encontraron registros."}
        items={products && products.length > 0 ? products : []}
        loadingContent={"Loading..."}
        loadingState={loadingState}
      >
        {(product) => (
          <TableRow key={product?.id}>
            {(columnKey) => (
              <TableCell>
                {columnKey === "category"
                  ? product.category?.name
                  : getKeyValue(product, columnKey)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
