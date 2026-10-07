import React, { useState } from 'react';
import {
  Truck,
  Package,
  CheckCircle,
  ExternalLink,
  Printer,
  Search,
  Filter,
  AlertCircle,
  MapPin,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { Order, User } from '../types';
import { getCourierTrackingUrl, getWhatsAppTrackingShareUrl } from '../utils/courierTracking';
import { calculateComprehensiveShippingRate } from '../utils/shippingRateCalculator';
import { CourierBookingModal } from './CourierBookingModal';
import { BulkLabelPrinterModal } from './BulkLabelPrinterModal';

interface CourierDispatchViewProps {
  orders: Order[];
  currentUser: User;
  onDispatchOrder: (orderId: string, courierName: string, trackingNumber?: string) => void;
  onBulkDispatchOrders?: (dispatches: Array<{ orderId: string; courierName: string; trackingNumber: string }>) => void;
}

export const CourierDispatchView: React.FC<CourierDispatchViewProps> = ({
  orders,
  currentUser,
  onDispatchOrder,
  onBulkDispatchOrders,
}) => {
  const [filterCourier, setFilterCourier] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [selectedOrderForBooking, setSelectedOrderForBooking] = useState<Order | null>(null);
  const [isBulkPrintOpen, setIsBulkPrintOpen] = useState(false);

  // Ready for dispatch or in-transit orders
  const dispatchQueue = orders.filter((o) => {
    const matchesCourier = filterCourier === 'ALL' || o.courierName === filterCourier;
    const matchesSearch =
      (o.orderNumber || o.id).toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      (o.trackingNumber || '').toLowerCase().includes(search.toLowerCase()) ||
      o.customerCity.toLowerCase().includes(search.toLowerCase());
    return matchesCourier && matchesSearch;
  });

  const pendingBookings = orders.filter(
    (o) => o.status === 'VERIFIED' || o.status === 'CONFIRMED' || o.status === 'PENDING_VERIFICATION'
  );

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-slate-900 p-6 sm:p-8 border border-cyan-500/20 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-bold text-cyan-400 border border-cyan-500/30">
              <Truck className="h-4 w-4" />
              <span>Multi-Courier Dispatch Operations Desk</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Courier Booking & Manifest Dispatch
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              1-Click generate airway bills with Trax Sonic, PostEx Rapid, TCS Express, and Leopards COD. Print 4x6 thermal dispatch labels and track live parcel transit.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsBulkPrintOpen(true)}
              className="flex items-center gap-1.5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg transition cursor-pointer"
            >
              <Printer className="h-4 w-4" />
              <span>Print 4x6 Thermal Slips</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-slate-900 p-4 border border-slate-800">
          <div className="text-xs text-slate-400">Ready to Book</div>
          <div className="text-xl font-bold font-mono text-cyan-400 mt-1">
            {pendingBookings.length} Orders
          </div>
        </div>
        <div className="rounded-2xl bg-slate-900 p-4 border border-slate-800">
          <div className="text-xs text-slate-400">Active In Transit</div>
          <div className="text-xl font-bold font-mono text-blue-400 mt-1">
            {orders.filter((o) => o.status === 'DISPATCHED' || o.status === 'IN_TRANSIT').length} Parcels
          </div>
        </div>
        <div className="rounded-2xl bg-slate-900 p-4 border border-slate-800">
          <div className="text-xs text-slate-400">Delivered Successfully</div>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
            {orders.filter((o) => o.status === 'DELIVERED').length} Parcels
          </div>
        </div>
        <div className="rounded-2xl bg-slate-900 p-4 border border-slate-800">
          <div className="text-xs text-slate-400">RTO Returns</div>
          <div className="text-xl font-bold font-mono text-amber-400 mt-1">
            {orders.filter((o) => o.status === 'RTO' || o.status === 'RETURNED').length} Parcels
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] max-w-md bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search order#, consignee name, tracking number, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-xs text-white placeholder-slate-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          {['ALL', 'TRAX', 'POSTEX', 'TCS', 'LEOPARDS'].map((c) => (
            <button
              key={c}
              onClick={() => setFilterCourier(c)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                filterCourier === c
                  ? 'bg-cyan-600 text-white shadow'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Dispatch Table */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Order / Item</th>
                <th className="p-4">Consignee & Destination</th>
                <th className="p-4">Courier Partner</th>
                <th className="p-4">Tracking Number</th>
                <th className="p-4">COD Amount</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {dispatchQueue.map((ord) => {
                const trackingUrl = getCourierTrackingUrl(ord.courierName, ord.trackingNumber);
                const isDispatched = Boolean(ord.trackingNumber);

                return (
                  <tr key={ord.id} className="hover:bg-slate-850 transition">
                    <td className="p-4">
                      <div className="font-mono text-cyan-400 font-bold">{ord.orderNumber || ord.id}</div>
                      <div className="text-white font-bold text-sm mt-0.5 line-clamp-1">{ord.productName}</div>
                      <div className="text-[10px] text-slate-400">Qty: {ord.quantity || 1}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-white">{ord.customerName}</div>
                      <div className="flex items-center gap-1 text-slate-400 mt-0.5">
                        <MapPin className="h-3 w-3 text-cyan-400" />
                        <span>{ord.customerCity}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[150px]">
                        {ord.customerAddress}
                      </div>
                    </td>
                    <td className="p-4 font-bold">
                      <span className="px-2.5 py-1 rounded-full text-[10px] bg-slate-800 border border-slate-700 text-slate-200">
                        {ord.courierName || 'TRAX'}
                      </span>
                    </td>
                    <td className="p-4 font-mono">
                      {ord.trackingNumber ? (
                        <a
                          href={trackingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-cyan-400 hover:underline font-bold"
                        >
                          <span>{ord.trackingNumber}</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-slate-500 italic">Not Booked Yet</span>
                      )}
                    </td>
                    <td className="p-4 font-mono font-bold text-emerald-400 text-sm">
                      Rs. {ord.sellingPricePKR.toLocaleString()}
                    </td>
                    <td className="p-4 text-right">
                      {isDispatched ? (
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={trackingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-xl bg-slate-800 hover:bg-slate-700 px-3 py-1.5 font-bold text-cyan-300 transition"
                          >
                            Track Live
                          </a>
                        </div>
                      ) : (
                        <button
                          onClick={() => setSelectedOrderForBooking(ord)}
                          className="rounded-xl bg-cyan-600 hover:bg-cyan-500 px-3 py-1.5 font-bold text-white transition cursor-pointer"
                        >
                          Book Courier
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Courier Booking Modal */}
      {selectedOrderForBooking && (
        <CourierBookingModal
          isOpen={Boolean(selectedOrderForBooking)}
          onClose={() => setSelectedOrderForBooking(null)}
          order={selectedOrderForBooking}
          onConfirmBooking={(ordId, courierName, trackingNumber) => {
            onDispatchOrder(ordId, courierName, trackingNumber);
            setSelectedOrderForBooking(null);
          }}
        />
      )}

      {/* Thermal Label Printer Modal */}
      <BulkLabelPrinterModal
        isOpen={isBulkPrintOpen}
        onClose={() => setIsBulkPrintOpen(false)}
        orders={orders}
      />
    </div>
  );
};
