import React, { useState } from 'react';
import type { DailyRate } from '../types';
import { formatIndianCurrency } from '../utils/dateUtils';
import {
  History,
  TrendingUp,
  TrendingDown,
  Download,
  RotateCcw,
  Trash2,
  Calendar,
  FileSpreadsheet,
  Search,
  Minus,
} from 'lucide-react';

interface HistorySectionProps {
  history: DailyRate[];
  onLoadRate: (rate: DailyRate) => void;
  onDeleteRate: (id: string) => void;
  onRegenerateAndDownload: (rate: DailyRate) => void;
}

export const HistorySection: React.FC<HistorySectionProps> = ({
  history,
  onLoadRate,
  onDeleteRate,
  onRegenerateAndDownload,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filteredHistory = history.filter((item) => {
    if (!searchTerm) return true;
    return (
      item.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.goldRate.toString().includes(searchTerm) ||
      item.silverRate.toString().includes(searchTerm)
    );
  });

  const exportToCsv = () => {
    if (!history.length) return;
    const headers = ['Date', 'Gold Rate (₹/g)', 'Silver Rate (₹/g)', 'Timestamp', 'Filename'];
    const rows = history.map((item) => [
      item.date,
      item.goldRate,
      item.silverRate,
      item.timestamp,
      item.posterFilename,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SRI_CHAIRMAN_JEWELLERS_RATE_HISTORY_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-4 p-5 md:p-6 bg-[#16120b] border border-[#3d3118] rounded-2xl shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2d2412] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#271e0f] text-[#f7d070] border border-[#483719]">
            <History className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[#f7d070] tracking-wide">
                DAILY RATE ARCHIVE & HISTORY
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#2a2111] text-[#d4af37] border border-[#473619] font-mono">
                {history.length} records
              </span>
            </div>
            <p className="text-xs text-[#a99c85]">
              Stored rates, previous posters, and historical trend logs
            </p>
          </div>
        </div>

        {/* Toolbar: Search & Export */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 text-[#887a64] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search date..."
              className="w-full pl-8 pr-3 py-1.5 bg-[#100d08] border border-[#3e3119] rounded-lg text-xs text-white focus:outline-none focus:border-[#f7d070]"
            />
          </div>

          <button
            type="button"
            onClick={exportToCsv}
            title="Export CSV"
            className="px-3 py-1.5 bg-[#20190e] hover:bg-[#302514] text-[#cfb684] hover:text-white rounded-lg border border-[#3e3119] text-xs font-medium flex items-center gap-1.5 transition-all"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* History Table / List */}
      {filteredHistory.length === 0 ? (
        <div className="text-center py-12 text-[#7d705c] bg-[#110e09] rounded-xl border border-dashed border-[#302613]">
          <Calendar className="w-8 h-8 mx-auto mb-2 opacity-40 text-[#f7d070]" />
          <p className="text-sm font-medium">No rate records found.</p>
          <p className="text-xs text-[#625745] mt-1">
            Generate today's poster to save your first rate record.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#312613] bg-[#120e09]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#2d2210] bg-[#19130b] text-[11px] font-bold text-[#b5a588] uppercase tracking-wider">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Gold Rate (22K)</th>
                <th className="py-3 px-4">Silver Rate</th>
                <th className="py-3 px-4">Trend vs Prev</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#241a0d] text-xs">
              {filteredHistory.map((item, index) => {
                // Calculate trend compared to next row in list (which is the previous day)
                const prevItem = filteredHistory[index + 1];
                let goldDiff = 0;
                let silverDiff = 0;
                if (prevItem) {
                  goldDiff = item.goldRate - prevItem.goldRate;
                  silverDiff = item.silverRate - prevItem.silverRate;
                }

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-[#1a140d] transition-colors group"
                  >
                    {/* Date */}
                    <td className="py-3 px-4 font-mono font-bold text-[#fce8a6] whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-[#f7d070]" />
                        <span>{item.date}</span>
                      </div>
                    </td>

                    {/* Gold Rate */}
                    <td className="py-3 px-4 font-mono whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-[#f7d070]">
                          {formatIndianCurrency(item.goldRate)}
                          <span className="text-[10px] text-[#9b8b73] font-normal ml-1">/ g</span>
                        </span>
                        <span className="text-[10px] text-[#867862]">
                          Sovereign: {formatIndianCurrency(item.goldRate * 8)}
                        </span>
                      </div>
                    </td>

                    {/* Silver Rate */}
                    <td className="py-3 px-4 font-mono whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-[#d4dde5]">
                          {formatIndianCurrency(item.silverRate)}
                          <span className="text-[10px] text-[#8893a0] font-normal ml-1">/ g</span>
                        </span>
                        <span className="text-[10px] text-[#717b88]">
                          1 KG: {formatIndianCurrency(item.silverRate * 1000)}
                        </span>
                      </div>
                    </td>

                    {/* Trend indicator */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {prevItem ? (
                        <div className="flex flex-col gap-0.5 text-[11px] font-mono">
                          <span
                            className={`flex items-center gap-1 ${
                              goldDiff > 0
                                ? 'text-amber-400'
                                : goldDiff < 0
                                ? 'text-blue-400'
                                : 'text-zinc-500'
                            }`}
                          >
                            {goldDiff > 0 && <TrendingUp className="w-3 h-3" />}
                            {goldDiff < 0 && <TrendingDown className="w-3 h-3" />}
                            {goldDiff === 0 && <Minus className="w-3 h-3" />}
                            Gold: {goldDiff > 0 ? `+${goldDiff}` : goldDiff}
                          </span>
                          <span
                            className={`flex items-center gap-1 ${
                              silverDiff > 0
                                ? 'text-emerald-400'
                                : silverDiff < 0
                                ? 'text-red-400'
                                : 'text-zinc-500'
                            }`}
                          >
                            {silverDiff > 0 && <TrendingUp className="w-3 h-3" />}
                            {silverDiff < 0 && <TrendingDown className="w-3 h-3" />}
                            {silverDiff === 0 && <Minus className="w-3 h-3" />}
                            Silver: {silverDiff > 0 ? `+${silverDiff}` : silverDiff}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-[#635745] italic">Base record</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Load in editor */}
                        <button
                          type="button"
                          onClick={() => onLoadRate(item)}
                          title="Load into Editor"
                          className="px-2.5 py-1 bg-[#251e12] hover:bg-[#382b15] text-[#f7d070] rounded-lg border border-[#443316] text-[11px] font-medium flex items-center gap-1 transition-all"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Load</span>
                        </button>

                        {/* Regenerate & Download */}
                        <button
                          type="button"
                          onClick={() => onRegenerateAndDownload(item)}
                          title="Generate & Download Poster for this date"
                          className="p-1.5 bg-[#251e12] hover:bg-[#382b15] text-[#d4af37] hover:text-white rounded-lg border border-[#443316] transition-all"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete */}
                        {confirmDeleteId === item.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                onDeleteRate(item.id);
                                setConfirmDeleteId(null);
                              }}
                              className="px-2 py-0.5 bg-red-900 text-white rounded text-[10px] font-bold"
                            >
                              Confirm
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-1.5 py-0.5 bg-zinc-800 text-zinc-300 rounded text-[10px]"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(item.id)}
                            title="Delete Record"
                            className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
