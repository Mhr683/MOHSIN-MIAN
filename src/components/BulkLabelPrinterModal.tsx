import React from 'react';
import { X, Printer, Truck, FileText, CheckCircle } from 'lucide-react';
import { Order } from '../types';

interface BulkLabelPrinterModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
}

export const BulkLabelPrinterModal: React.FC<BulkLabelPrinterModalProps> = ({
  isOpen,
  onClose,
  orders,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-3xl rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl bg-cyan-500/20 p-2 text-cyan-400">
              <Printer className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">4x6 Thermal Bulk Shipping Label Printer</h3>
              <p className="text-xs text-slate-400">Standard Daraz / Trax flyer sticker layout ({orders.length} orders)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Labels Scroll Area */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
          {orders.map((ord) => (
            <div
              key={ord.id}
              className="bg-white text-black p-4 rounded-xl border border-slate-300 font-sans text-xs space-y-2 shadow"
            >
              <div className="flex items-center justify-between border-b border-black pb-2">
                <span className="font-extrabold text-sm tracking-wider uppercase">
                  {ord.courierName || 'TRAX EXPRESS COD'}
                </span>
                <span className="font-mono font-bold text-sm">{ord.trackingNumber || 'TRX-1092837'}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-[10px] text-gray-500 uppercase font-bold">Consignee (Customer):</div>
                  <div className="font-bold text-sm">{ord.customerName}</div>
                  <div>{ord.customerPhone}</div>
                  <div className="text-gray-700">{ord.customerAddress}, {ord.customerCity}</div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-gray-500 uppercase font-bold">Cash on Delivery (COD):</div>
                  <div className="text-base font-extrabold">Rs. {ord.sellingPricePKR.toLocaleString()}</div>
                  <div className="text-[10px] text-gray-600 mt-1">Item: {ord.productName}</div>
                </div>
              </div>

              <div className="border-t border-dashed border-gray-400 pt-2 flex justify-between text-[10px] text-gray-600">
                <span>Order Ref: {ord.orderNumber || ord.id}</span>
                <span>Dispatch Origin: Lahore Central Logistics Hub</span>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 flex gap-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl bg-slate-800 hover:bg-slate-700 py-3 text-xs font-bold text-slate-300 transition"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 py-3 text-xs font-bold text-white shadow-lg transition cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            <span>Print All 4x6 Stickers</span>
          </button>
        </div>
      </div>
    </div>
  );
};
