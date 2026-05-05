import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import {
  MoreVertical,
  Download,
  ChevronDown,
  ChevronUp,
  Search,
  File,
  FileText,
} from "lucide-react";
import clsx from "clsx";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import useSubscribtion from "./hooks/useSubscribtion";

const planDotColors: Record<string, string> = {
  Free: "bg-green-500",
  Pro: "bg-blue-500",
  Premium: "bg-purple-500",
};

const formatDate = (timestamp: number) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(timestamp * 1000));

const formatCurrency = (amount: number, currency: string) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);

const BillingTable = () => {
  const { invoices } = useSubscribtion();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState<string[]>([]);
  const [sortAsc, setSortAsc] = useState(false);

  const toggleSelection = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleAll = (checked: boolean) => {
    if (checked) {
      setSelected((filteredData ?? []).map((i) => i.id));
    } else {
      setSelected([]);
    }
  };

  const handleDownloadAll = () => {
    alert(`Downloading ${selected.length} invoice(s)...`);
  };

  const handleRowDownload = (id: string, type: "pdf" | "csv") => {
    alert(`Downloading invoice ${id} as ${type.toUpperCase()}`);
  };

  const filteredData = invoices
    ?.filter((bill) => {
      const matchesSearch = bill.id
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "All" || bill.status === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) =>
      sortAsc ? a.created - b.created : b.created - a.created
    );

  return (
    <div className="w-full flex-col-3">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 lg:gap-0">
        <div className="flex-col-1">
          <h2 className="text-2xl font-bold">Billing History</h2>
          <p className="text-sm text-muted-foreground mt-1">
            View, search, filter, and download your billing history.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative h-max">
            <Input
              placeholder="Search..."
              className="no-ring box-border px-9 input-register w-[300px]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search
              size={15}
              className="absolute text-stone-400 top-[12px] left-3"
            />
          </div>
          <div className="flex-row-3 flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px] no-ring border-accent">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="unpaid">Unpaid</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="default"
              onClick={handleDownloadAll}
              className="flex items-center px-4 py-2 text-sm bg-primary rounded-md transition"
              disabled={selected.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto overflow-y-auto max-h-[600px] border rounded-lg mt-6">
        <table className="w-full text-sm">
          <thead className="bg-accent dark:bg-input/30">
            <tr>
              <th className="p-3 text-left w-10">
                <Checkbox
                  checked={
                    selected.length > 0 &&
                    selected.length === filteredData?.length
                  }
                  onCheckedChange={(checked: boolean) => toggleAll(checked)}
                />
              </th>
              <th className="p-3 text-left w-[20%]">Invoice</th>
              <th className="p-3 text-left flex items-center gap-1">
                Date
                <button
                  onClick={() => setSortAsc((prev) => !prev)}
                  className="text-muted-foreground"
                >
                  {sortAsc ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Plan</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-right w-10"></th>
            </tr>
          </thead>
          <tbody>
            {filteredData?.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="p-4 text-center text-muted-foreground"
                >
                  No invoices found.
                </td>
              </tr>
            ) : (
              filteredData?.map((bill) => (
                <tr
                  key={bill.id}
                  className="border-t hover:bg-muted/10 transition"
                >
                  <td className="p-3">
                    <Checkbox
                      checked={selected.includes(bill.id)}
                      onCheckedChange={() => toggleSelection(bill.id)}
                    />
                  </td>
                  <td className="p-3 font-semibold text-stone-400">
                    {bill.id}
                  </td>
                  <td className="p-3 text-stone-400 font-medium">
                    {formatDate(bill.created)}
                  </td>
                  <td className="p-3 text-stone-400 font-medium">
                    {formatCurrency(bill.amount_paid, bill.currency)}
                  </td>
                  <td className="p-3 flex items-center gap-2 text-stone-400 font-medium">
                    <Badge variant="outline">
                      <span
                        className={clsx(
                          "h-2 w-2 rounded-full mr-1",
                          planDotColors[
                            bill.lines?.data?.[0]?.description || "Free"
                          ] || "bg-gray-400"
                        )}
                      />
                      {bill.lines?.data?.[0]?.description || "Free"}
                    </Badge>
                  </td>
                  <td className="p-3 text-stone-400 font-medium">
                    <Badge
                      className={clsx(
                        "px-2 py-0.5 rounded-full text-xs font-medium",
                        bill.status === "paid"
                          ? "bg-emerald-200 text-emerald-800 dark:bg-emerald-800/20 dark:text-emerald-300"
                          : "bg-rose-200 text-rose-800 dark:bg-rose-800/20 dark:text-rose-300"
                      )}
                    >
                      {bill.status}
                    </Badge>
                  </td>
                  <td className="p-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 hover:bg-accent rounded-md text-muted-foreground">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            window.open(bill.invoice_pdf, "_blank")
                          }
                        >
                          <File className="mr-2 h-4 w-4" />
                          Download PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleRowDownload(bill.id, "csv")}
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          Download CSV
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BillingTable;
