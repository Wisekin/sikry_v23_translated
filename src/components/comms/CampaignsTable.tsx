"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/data/tables/DataTable";
import { ROUTES } from "@/constants/routes";

// Define the column types
type Column = {
  accessorKey: string;
  header: string;
  cell?: (props: { row: { original: any } }) => React.ReactNode;
};

// Define the columns configuration
const columns: Column[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <Link href={ROUTES.CAMPAIGN_DETAIL(row.original.id)} className="font-medium hover:underline">
        {row.original.name}
      </Link>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => <div className="capitalize">{row.original.type}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const statusClasses = {
        active: "bg-green-100 text-green-800",
        draft: "bg-gray-100 text-gray-800",
        paused: "bg-yellow-100 text-yellow-800",
        completed: "bg-blue-100 text-blue-800",
      };
      return (
        <div
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            statusClasses[status as keyof typeof statusClasses]
          }`}
        >
          {status}
        </div>
      );
    },
  },
  { accessorKey: "sent", header: "Sent" },
  { accessorKey: "opened", header: "Opened" },
  { accessorKey: "clicked", header: "Clicked" },
  { accessorKey: "replied", header: "Replied" },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return <div>{date.toISOString().split('T')[0]}</div>;
    },
  },
];

interface CampaignsTableProps {
  campaigns: any[];
  status?: string;
}

export default function CampaignsTable({ campaigns, status }: CampaignsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {status ? `${status.charAt(0).toUpperCase() + status.slice(1)} Campaigns` : "All Campaigns"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={campaigns} />
      </CardContent>
    </Card>
  );
}
