"use client";

import { useMemo } from "react";
import { PageBreadcrumb } from "@/components/dashboard/breadcrumb";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@dashboardpack/core/components/ui/card";
import { DataTable, DataTableColumnHeader } from "@dashboardpack/core/components/shared/data-table";
import type { ColumnDef } from "@tanstack/react-table";

// ---------------------------------------------------------------------------
// Employee dataset (30 rows) — inline per-page data
// ---------------------------------------------------------------------------

interface Employee {
  id: number;
  name: string;
  position: string;
  office: string;
  age: number;
  startDate: string;
  salary: number;
}

const employees: Employee[] = [
  { id:  1, name: "Airi Satou",          position: "Accountant",              office: "Tokyo",       age: 33, startDate: "2008-11-28", salary: 162700  },
  { id:  2, name: "Angelica Ramos",      position: "Chief Executive Officer",  office: "London",      age: 47, startDate: "2009-10-09", salary: 1200000 },
  { id:  3, name: "Ashton Cox",          position: "Junior Technical Author",  office: "San Francisco",age: 66,startDate: "2009-01-12", salary: 86000   },
  { id:  4, name: "Bradley Greer",       position: "Software Engineer",        office: "London",      age: 41, startDate: "2012-10-13", salary: 132000  },
  { id:  5, name: "Brenden Wagner",      position: "Software Engineer",        office: "San Francisco",age: 28,startDate: "2011-06-07", salary: 206850  },
  { id:  6, name: "Brielle Williamson",  position: "Integration Specialist",   office: "New York",    age: 61, startDate: "2012-12-02", salary: 372000  },
  { id:  7, name: "Bruno Nash",          position: "Software Engineer",        office: "London",      age: 38, startDate: "2011-05-03", salary: 163500  },
  { id:  8, name: "Caesar Vance",        position: "Pre-Sales Support",        office: "New York",    age: 21, startDate: "2011-12-12", salary: 106450  },
  { id:  9, name: "Cara Stevens",        position: "Sales Assistant",          office: "New York",    age: 46, startDate: "2011-12-06", salary: 145600  },
  { id: 10, name: "Cedric Kelly",        position: "Senior Javascript Developer",office: "Edinburgh", age: 22, startDate: "2012-03-29", salary: 433060  },
  { id: 11, name: "Charde Marshall",     position: "Regional Director",        office: "San Francisco",age: 36,startDate: "2008-10-16", salary: 470600  },
  { id: 12, name: "Colleen Hurst",       position: "Javascript Developer",     office: "San Francisco",age: 39,startDate: "2009-09-15", salary: 205500  },
  { id: 13, name: "Dai Rios",            position: "Personnel Lead",           office: "Edinburgh",   age: 35, startDate: "2012-09-26", salary: 217500  },
  { id: 14, name: "Donna Snider",        position: "Customer Support",         office: "New York",    age: 27, startDate: "2011-01-25", salary: 112000  },
  { id: 15, name: "Doris Wilder",        position: "Sales Assistant",          office: "Sydney",      age: 23, startDate: "2010-09-20", salary: 85600   },
  { id: 16, name: "Finn Camacho",        position: "Support Engineer",         office: "San Francisco",age: 36,startDate: "2009-07-07", salary: 342000  },
  { id: 17, name: "Fiona Green",         position: "Chief Operating Officer",  office: "San Francisco",age: 48,startDate: "2010-03-11", salary: 850000  },
  { id: 18, name: "Garrett Winters",     position: "Accountant",               office: "Tokyo",       age: 63, startDate: "2011-07-25", salary: 170750  },
  { id: 19, name: "Gavin Cortez",        position: "Team Leader",              office: "San Francisco",age: 22,startDate: "2008-10-26", salary: 235500  },
  { id: 20, name: "Gavin Joyce",         position: "Developer",                office: "Edinburgh",   age: 42, startDate: "2010-12-22", salary: 92575   },
  { id: 21, name: "Gloria Little",       position: "Systems Administrator",    office: "New York",    age: 59, startDate: "2009-04-10", salary: 237500  },
  { id: 22, name: "Haley Kennedy",       position: "Senior Marketing Designer",office: "London",      age: 43, startDate: "2012-12-18", salary: 313500  },
  { id: 23, name: "Hermione Butler",     position: "Regional Director",        office: "London",      age: 47, startDate: "2011-03-21", salary: 356250  },
  { id: 24, name: "Herrod Chandler",     position: "Sales Assistant",          office: "San Francisco",age: 59,startDate: "2012-08-06", salary: 137500  },
  { id: 25, name: "Hope Fuentes",        position: "Secretary",                office: "San Francisco",age: 41,startDate: "2010-02-12", salary: 109850  },
  { id: 26, name: "Howard Hatfield",     position: "Office Manager",           office: "San Francisco",age: 51,startDate: "2008-12-16", salary: 164500  },
  { id: 27, name: "Jackson Bradshaw",    position: "Director",                 office: "New York",    age: 65, startDate: "2008-09-26", salary: 645750  },
  { id: 28, name: "Jena Gaines",         position: "Office Manager",           office: "London",      age: 30, startDate: "2008-12-19", salary: 90560   },
  { id: 29, name: "Jenette Caldwell",    position: "Development Lead",         office: "New York",    age: 30, startDate: "2011-09-03", salary: 345000  },
  { id: 30, name: "Jennifer Acosta",     position: "Junior Javascript Developer",office: "Edinburgh", age: 43, startDate: "2013-02-01", salary: 75650   },
];

// ===========================================================================
// Page Component
// ===========================================================================

export default function DataTablesPage() {
  const columns = useMemo<ColumnDef<Employee>[]>(
    () => [
      {
        id: "select",
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Name" />
        ),
        cell: ({ row }) => (
          <span className="font-medium text-foreground">{row.original.name}</span>
        ),
        meta: { mobileLabel: "Name" },
      },
      {
        accessorKey: "position",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Position" />
        ),
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.position}</span>
        ),
        meta: { mobileLabel: "Position" },
      },
      {
        accessorKey: "office",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Office" />
        ),
        cell: ({ row }) => (
          <span className="text-foreground">{row.original.office}</span>
        ),
        meta: { mobileLabel: "Office" },
      },
      {
        accessorKey: "age",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Age" />
        ),
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.age}</span>
        ),
        meta: { mobileLabel: "Age" },
      },
      {
        accessorKey: "startDate",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Start Date" />
        ),
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-muted-foreground">{row.original.startDate}</span>
        ),
        meta: { mobileLabel: "Start Date" },
      },
      {
        accessorKey: "salary",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Salary" />
        ),
        cell: ({ row }) => (
          <span className="font-semibold text-foreground">
            {row.original.salary.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
            })}
          </span>
        ),
        meta: { mobileLabel: "Salary" },
      },
    ],
    []
  );

  return (
    <>
      <PageBreadcrumb
        title="Data Tables"
        items={[{ label: "Tables" }, { label: "Data Tables" }]}
      />

      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Employee Directory</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={employees}
              searchPlaceholder="Search employees..."
              enableRowSelection
              exportFilename="employees"
              perPageOptions={[10, 25, 50]}
              facetedFilters={[
                {
                  columnId: "office",
                  title: "Office",
                  options: [
                    { label: "Edinburgh",     value: "Edinburgh"     },
                    { label: "London",        value: "London"        },
                    { label: "New York",      value: "New York"      },
                    { label: "San Francisco", value: "San Francisco" },
                    { label: "Sydney",        value: "Sydney"        },
                    { label: "Tokyo",         value: "Tokyo"         },
                  ],
                },
              ]}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
