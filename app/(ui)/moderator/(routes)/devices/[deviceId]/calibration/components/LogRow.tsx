import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { CalibrationLog } from "@/types/type";

interface LogRowProps {
  log: CalibrationLog;
}

export const LogRow = ({ log }: LogRowProps) => {
  return (
    <TableRow className="hover:bg-slate-50 transition-colors">
      {/* Status */}
      <TableCell className="w-25">
        <span
          className={`px-2 py-1 rounded-full text-[10px] font-bold ${
            log.status === "SUCCESS"
              ? "bg-green-100 text-green-700"
              : log.status === "PENDING"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
          }`}
        >
          {log.status}
        </span>
      </TableCell>

      {/* Values */}
      <TableCell>
        <div className="flex flex-wrap gap-1.5 max-w-60">
          {Object.entries(log.newValues).map(([key, value]) => (
            <Badge
              key={key}
              variant="outline"
              className="flex items-center gap-1.5 px-2 py-0.5 border-slate-200"
            >
              <span className="text-[10px] uppercase text-muted-foreground font-semibold">
                {key}
              </span>
              <span className="text-[11px] font-mono font-bold">{value}</span>
            </Badge>
          ))}
        </div>
      </TableCell>

      {/* Reason */}
      <TableCell className="max-w-37.5 truncate text-sm italic text-slate-600">
        {log.reason || "—"}
      </TableCell>

      {/* Lifecycle */}
      <TableCell className="text-[11px] text-slate-500">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <span className="font-semibold text-slate-700">Start:</span>
            <span>
              {new Date(log.effectiveFrom).toLocaleString([], {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </span>
          </div>
          <div className="flex items-center gap-1 text-red-600 font-medium">
            <span>Expires:</span>
            <span>
              {new Date(log.expiresAt).toLocaleString([], {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </span>
          </div>
        </div>
      </TableCell>

      {/* Created At */}
      <TableCell className="text-right text-xs text-muted-foreground font-mono">
        {new Date(log.createdAt).toLocaleString([], {
          month: "numeric",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })}
      </TableCell>
    </TableRow>
  );
};
