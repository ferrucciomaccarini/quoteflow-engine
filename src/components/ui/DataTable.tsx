
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Define the Column interface with required accessorKey
interface Column<T> {
  header: string;
  accessorKey: keyof T | string; // Required property
  id?: string;
  cell?: (info: any) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
}

export function DataTable<T>({
  columns,
  data,
  loading = false,
}: DataTableProps<T>) {
  // Helper function to get a value from a complex path (e.g., 'user.name')
  const getValue = (row: T, accessorKey: string) => {
    if (accessorKey.includes('.')) {
      const keys = accessorKey.split('.');
      let value: any = row;
      for (const key of keys) {
        if (value === null || value === undefined) return '';
        value = value[key as keyof typeof value];
      }
      return value;
    }
    return row[accessorKey as keyof T];
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.header}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No data available
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((column, colIndex) => (
                  <TableCell key={`${rowIndex}-${colIndex}`}>
                    {column.cell
                      ? column.cell({ 
                          getValue: () => getValue(row, column.accessorKey.toString()),
                          row: { original: row }
                        })
                      : getValue(row, column.accessorKey.toString())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
