import { useState, useCallback, useEffect, useRef } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Dynamic DataTable component.
 *
 * @param {Object} props
 * @param {(params: object) => Promise<any>} props.fetcher - Function that calls the API with {page, per_page, search, sort_by, sort_order}
 * @param {Array} props.columns - Column definitions
 * @param {boolean} [props.searchable=true]
 * @param {boolean} [props.selectable=false]
 * @param {string} [props.searchPlaceholder="Search..."]
 * @param {number[]} [props.perPageOptions=[10,15,25,50,100]]
 * @param {(selected: Array) => void} [props.onSelectionChange]
 * @param {React.ReactNode} [props.rightItems]
 * @param {React.ReactNode} [props.selectableContent]
 */
export default function DataTable({
  fetcher,
  columns = [],
  searchable = true,
  selectable = false,
  searchPlaceholder = "Search...",
  perPageOptions = [10, 15, 25, 50, 100],
  onSelectionChange,
  rightItems,
  selectableContent,
}) {
  // --- State Management ---
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);

  // Query States (These trigger API calls)
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [perPage, setPerPage] = useState(perPageOptions[0]);
  const [currentPage, setCurrentPage] = useState(1);

  const [selected, setSelected] = useState([]);
  const searchTimeout = useRef(null);

  // --- Core Data Fetcher ---
  const fetchData = useCallback(
    async (overrideParams = {}) => {
      if (!fetcher) return;

      setLoading(true);
      try {
        // Construct parameters to send to the API
        const queryParams = {
          page: overrideParams.page ?? currentPage,
          per_page: overrideParams.per_page ?? perPage,
          search: overrideParams.search ?? search,
          sort_by: overrideParams.sort_by ?? sortKey,
          sort_order: overrideParams.sort_order ?? sortOrder,
        };

        const response = await fetcher(queryParams);

        // Assuming standard pagination structure: { data: [], current_page: 1, last_page: 5, total: 50 }
        setData(response?.data ?? []);
        setPagination(response);

        // Reset selection on new data fetch if needed
        setSelected([]);
        onSelectionChange?.([]);
      } catch (error) {
        console.error("DataTable fetch error:", error);
      } finally {
        setLoading(false);
      }
    },
    [
      fetcher,
      currentPage,
      perPage,
      search,
      sortKey,
      sortOrder,
      onSelectionChange,
    ],
  );

  // Re-fetch when pagination or sorting changes
  useEffect(() => {
    fetchData();
  }, [currentPage, perPage, sortKey, sortOrder]);

  // --- Event Handlers ---
  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(1); // Always reset to page 1 on search

    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    searchTimeout.current = setTimeout(() => {
      // Trigger API call specifically with the new search value
      fetchData({ search: value, page: 1 });
    }, 500);
  };

  const handleSort = (key) => {
    const newOrder = sortKey === key && sortOrder === "asc" ? "desc" : "asc";
    setSortKey(key);
    setSortOrder(newOrder);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePerPageChange = (value) => {
    setPerPage(parseInt(value));
    setCurrentPage(1);
  };

  // --- Selection Logic ---
  const allSelected = data.length > 0 && selected.length === data.length;
  const someSelected = selected.length > 0 && selected.length < data.length;

  const toggleAll = () => {
    const next = allSelected ? [] : data.map((_, i) => i);
    setSelected(next);
    onSelectionChange?.(allSelected ? [] : data);
  };

  const toggleRow = (index) => {
    const next = selected.includes(index)
      ? selected.filter((i) => i !== index)
      : [...selected, index];
    setSelected(next);
    onSelectionChange?.(next.map((i) => data[i]));
  };

  // --- Sub-components ---
  const SortIcon = ({ colKey }) => {
    if (sortKey !== colKey)
      return <ArrowUpDown className="size-3.5 opacity-40" />;
    return sortOrder === "asc" ? (
      <ArrowUp className="size-3.5" />
    ) : (
      <ArrowDown className="size-3.5" />
    );
  };

  // Pagination Helpers
  const page = pagination?.current_page ?? 1;
  const lastPage = pagination?.last_page ?? 1;
  const total = pagination?.total ?? 0;
  const from = pagination?.from ?? 0;
  const to = pagination?.to ?? 0;

  return (
    <div className="w-full space-y-4">
      {/* Header: search + perPage */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {searchable && (
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pl-9 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          )}
          <Select value={String(perPage)} onValueChange={handlePerPageChange}>
            <SelectTrigger className="h-9 w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {perPageOptions.map((opt) => (
                <SelectItem key={opt} value={String(opt)}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {rightItems && (
          <div className="flex items-center gap-2 shrink-0">{rightItems}</div>
        )}
      </div>

      {/* Table Container */}
      <div className="rounded-lg border overflow-hidden relative">
        {selected.length > 0 && selectableContent && (
          <div className="bg-muted/30 border-b p-2 flex items-center">
            {selectableContent}
          </div>
        )}

        {/* Loading Bar Overlay */}
        {loading && (
          <div className="absolute top-0 left-0 right-0 h-[2px] z-10 overflow-hidden">
            <style>{`
              @keyframes progress-bar-1 {
                0% { left: -100%; right: 100%; }
                60% { left: 100%; right: -90%; }
                100% { left: 100%; right: -90%; }
              }
              @keyframes progress-bar-2 {
                0% { left: -136%; right: 100%; }
                60% { left: 100%; right: -30%; }
                100% { left: 100%; right: -30%; }
              }
              .animate-progress-bar-1 {
                position: absolute; top: 0; bottom: 0; will-change: left, right;
                animation: progress-bar-1 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;
              }
              .animate-progress-bar-2 {
                position: absolute; top: 0; bottom: 0; will-change: left, right;
                animation: progress-bar-2 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) 1.15s infinite;
              }
            `}</style>
            <div className="bg-primary animate-progress-bar-1" />
            <div className="bg-primary animate-progress-bar-2" />
          </div>
        )}

        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              {selectable && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={allSelected}
                    indeterminate={someSelected}
                    onCheckedChange={toggleAll}
                  />
                </TableHead>
              )}
              {columns.map((col) => (
                <TableHead key={col.key}>
                  {col.sortable !== false ? (
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
                      onClick={() => handleSort(col.key)}
                    >
                      {col.head}
                      <SortIcon colKey={col.key} />
                    </button>
                  ) : (
                    col.head
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="h-[400px] text-center"
                >
                  {loading ? (
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Loader2 className="size-8 text-primary animate-spin" />
                      <p className="text-sm text-muted-foreground">
                        Fetching data...
                      </p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No records found.</p>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, idx) => (
                <TableRow
                  key={row.id ?? idx}
                  data-state={selected.includes(idx) ? "selected" : undefined}
                >
                  {selectable && (
                    <TableCell>
                      <Checkbox
                        checked={selected.includes(idx)}
                        onCheckedChange={() => toggleRow(idx)}
                      />
                    </TableCell>
                  )}
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      {col.render
                        ? col.render(row[col.key], row)
                        : (row[col.key] ?? "—")}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer: per-page selector + pagination */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-end">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap select-none">
            {from}-{to} of {total}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              disabled={page <= 1}
              onClick={() => handlePageChange(1)}
            >
              <ChevronsLeftIcon className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              disabled={page <= 1}
              onClick={() => handlePageChange(page - 1)}
            >
              <ChevronLeftIcon className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              disabled={page >= lastPage}
              onClick={() => handlePageChange(page + 1)}
            >
              <ChevronRightIcon className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              disabled={page >= lastPage}
              onClick={() => handlePageChange(lastPage)}
            >
              <ChevronsRightIcon className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
