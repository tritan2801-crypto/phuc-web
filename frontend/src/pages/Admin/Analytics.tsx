import React, { useEffect, useState } from 'react';
import { Activity, Download, Layout, MousePointer, Eye, Calendar, RefreshCw, ChevronLeft, ChevronRight, User } from 'lucide-react';

interface Log {
  id: string;
  userId: string | null;
  ip: string | null;
  userAgent: string | null;
  eventType: string;
  page: string;
  section: string | null;
  elementId: string | null;
  timeSpent: number | null;
  metadata: string | null;
  createdAt: string;
}

interface Stats {
  sectionViews: { section: string; count: number }[];
  clickCounts: { elementId: string; count: number }[];
  uniqueVisitors: number;
}

export default function AdminAnalytics() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState<Stats>({ sectionViews: [], clickCounts: [], uniqueVisitors: 0 });
  const [loading, setLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(0);
  const [limit] = useState(15);

  // Filters
  const [eventTypeFilter, setEventTypeFilter] = useState('');
  const [pageFilter, setPageFilter] = useState('');
  const [sectionFilter, setSectionFilter] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: String(limit),
        pageIndex: String(pageIndex),
      });
      if (eventTypeFilter) params.append('eventType', eventTypeFilter);
      if (pageFilter) params.append('page', pageFilter);
      if (sectionFilter) params.append('section', sectionFilter);

      const res = await fetch(`/api/analytics/logs?${params.toString()}`);
      if (res.status === 403) {
        return;
      }
      const data = await res.json();
      setLogs(data.logs || []);
      setTotal(data.total || 0);
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (e) {
      console.error('Failed to fetch analytics logs:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [pageIndex, eventTypeFilter, pageFilter, sectionFilter]);

  const handleExport = () => {
    if (total === 0) {
      alert('Không có thông tin');
      return;
    }
    // Download directly using window.location
    window.location.href = '/api/analytics/export';
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-8 font-sans selection:bg-teal-500 selection:text-slate-950">
      
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-6 border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-44 h-44 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="space-y-1 z-10">
          <span className="text-[9px] bg-teal-500/10 text-teal-400 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
            Phân Tích Dữ Liệu
          </span>
          <h2 className="font-heading font-black text-xl text-white">Ghi Nhận Hành Vi Người Dùng</h2>
          <p className="text-xs text-slate-400">Giám sát các tương tác, lượt xem trang và thời gian dừng chân của khách hàng.</p>
        </div>

        <div className="flex gap-3 z-10 w-full sm:w-auto">
          <button
            onClick={handleExport}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs transition-all cursor-pointer active:scale-95 shadow-lg shadow-teal-500/10"
          >
            <Download size={14} />
            <span>Xuất Excel (CSV)</span>
          </button>
          
          <button
            onClick={fetchLogs}
            disabled={loading}
            className="p-3 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition-all cursor-pointer"
            title="Tải lại số liệu"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Tổng số tương tác</span>
            <span className="font-heading font-black text-2xl text-white">{total}</span>
          </div>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-teal-500/10 text-teal-400">
            <Activity size={20} className="stroke-[2]" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Khách truy cập (IP duy nhất)</span>
            <span className="font-heading font-black text-2xl text-white">{stats.uniqueVisitors}</span>
          </div>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-500/10 text-blue-400">
            <User size={20} className="stroke-[2]" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Vùng xem nhiều nhất</span>
            <span className="font-heading font-black text-md text-white truncate max-w-[180px] block">
              {stats.sectionViews[0]?.section || 'N/A'}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-amber-500/10 text-amber-400">
            <Layout size={20} className="stroke-[2]" />
          </div>
        </div>
      </div>

      {/* GRAPH SUMMARY BLOCKS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* TOP SECTION VIEWS */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
            <Eye size={16} className="text-teal-400" />
            <h3 className="font-heading font-black text-xs text-white uppercase tracking-wider">Top Vùng Xem Nhiều Nhất (SECTION_VIEW)</h3>
          </div>

          <div className="space-y-4">
            {stats.sectionViews.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">Chưa có dữ liệu lượt xem vùng</p>
            ) : (
              stats.sectionViews.map((sv, idx) => {
                const maxCount = stats.sectionViews[0]?.count || 1;
                const percentage = Math.round((sv.count / maxCount) * 100);
                return (
                  <div key={sv.section} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-300">
                        {idx + 1}. {sv.section}
                      </span>
                      <span className="text-slate-200">{sv.count} lượt xem</span>
                    </div>
                    <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-teal-500 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* TOP BUTTON CLICKS */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
            <MousePointer size={16} className="text-blue-400" />
            <h3 className="font-heading font-black text-xs text-white uppercase tracking-wider">Top Nút Được Click Nhiều Nhất</h3>
          </div>

          <div className="space-y-4">
            {stats.clickCounts.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">Chưa có dữ liệu lượt click</p>
            ) : (
              stats.clickCounts.map((cc, idx) => {
                const maxCount = stats.clickCounts[0]?.count || 1;
                const percentage = Math.round((cc.count / maxCount) * 100);
                return (
                  <div key={cc.elementId} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-300">
                        {idx + 1}. {cc.elementId}
                      </span>
                      <span className="text-slate-200">{cc.count} clicks</span>
                    </div>
                    <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* FILTER & TABLE BLOCK */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <h3 className="font-heading font-black text-xs text-white uppercase tracking-wider">Lịch Sử Chi Tiết Tương Tác</h3>
        </div>

        {/* FILTER BAR */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Hành động</label>
            <select
              value={eventTypeFilter}
              onChange={(e) => {
                setEventTypeFilter(e.target.value);
                setPageIndex(0);
              }}
              className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-teal-500 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none transition-all"
            >
              <option value="">Tất cả hành động</option>
              <option value="SECTION_VIEW">SECTION_VIEW (Xem vùng)</option>
              <option value="CLICK">CLICK (Bấm nút)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Trang truy cập</label>
            <input
              type="text"
              value={pageFilter}
              placeholder="Ví dụ: / hoặc /products"
              onChange={(e) => {
                setPageFilter(e.target.value);
                setPageIndex(0);
              }}
              className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-teal-500 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Tên Vùng (Section)</label>
            <input
              type="text"
              value={sectionFilter}
              placeholder="Ví dụ: HeroBanner"
              onChange={(e) => {
                setSectionFilter(e.target.value);
                setPageIndex(0);
              }}
              className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-teal-500 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* LOGS TABLE */}
        <div className="overflow-x-auto border border-slate-800 rounded-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[9px]">
                <th className="p-4">Thời gian</th>
                <th className="p-4">Tài khoản</th>
                <th className="p-4">Hành động</th>
                <th className="p-4">Trang</th>
                <th className="p-4">Vùng (Section)</th>
                <th className="p-4">Mã phần tử</th>
                <th className="p-4">Dừng chân</th>
                <th className="p-4">IP / Trình duyệt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw size={16} className="animate-spin text-teal-400" />
                      <span>Đang tải danh sách logs...</span>
                    </div>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    Không tìm thấy bản ghi hành vi nào khớp bộ lọc.
                  </td>
                </tr>
              ) : (
                logs.map((log) => {
                  const dateStr = new Date(log.createdAt).toLocaleString('vi-VN');
                  return (
                    <tr key={log.id} className="hover:bg-slate-800/20 text-slate-300">
                      <td className="p-4 whitespace-nowrap text-slate-400 flex items-center gap-1.5">
                        <Calendar size={12} />
                        {dateStr}
                      </td>
                      <td className="p-4 whitespace-nowrap font-semibold">
                        {log.userId ? (
                          <span className="text-teal-400">{log.userId}</span>
                        ) : (
                          <span className="text-slate-600">Khách vãng lai</span>
                        )}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide ${
                          log.eventType === 'SECTION_VIEW' 
                            ? 'bg-teal-500/10 text-teal-400' 
                            : 'bg-blue-500/10 text-blue-400'
                        }`}>
                          {log.eventType}
                        </span>
                      </td>
                      <td className="p-4 whitespace-nowrap font-mono text-[11px] text-slate-400">{log.page}</td>
                      <td className="p-4 whitespace-nowrap">{log.section || <span className="text-slate-600">-</span>}</td>
                      <td className="p-4 whitespace-nowrap font-mono text-[11px] text-slate-400">
                        {log.elementId || <span className="text-slate-600">-</span>}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        {log.timeSpent !== null ? (
                          <span className="font-bold text-slate-200">{(log.timeSpent / 1000).toFixed(1)}s</span>
                        ) : (
                          <span className="text-slate-600">-</span>
                        )}
                      </td>
                      <td className="p-4 max-w-[180px] truncate" title={`${log.ip} | ${log.userAgent}`}>
                        <span className="text-slate-400 block font-mono text-[11px]">{log.ip || 'Unknown IP'}</span>
                        <span className="text-slate-500 block text-[10px] truncate">{log.userAgent || 'Unknown UA'}</span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center text-xs text-slate-400 pt-2">
            <span>Hiển thị trang {pageIndex + 1} / {totalPages} (Tổng cộng {total} bản ghi)</span>
            <div className="flex gap-2">
              <button
                disabled={pageIndex === 0}
                onClick={() => setPageIndex(p => Math.max(0, p - 1))}
                className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 rounded-lg text-slate-200 transition-all cursor-pointer flex items-center"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                disabled={pageIndex >= totalPages - 1}
                onClick={() => setPageIndex(p => Math.min(totalPages - 1, p + 1))}
                className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 rounded-lg text-slate-200 transition-all cursor-pointer flex items-center"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
