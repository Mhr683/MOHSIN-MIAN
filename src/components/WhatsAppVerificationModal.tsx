import React, { useState } from 'react';
import { X, MessageSquare, CheckCircle, XCircle, Phone, Send } from 'lucide-react';
import { Order } from '../types';

interface WhatsAppVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onConfirmVerification: (orderId: string, method: string) => void;
  onRejectOrder: (orderId: string, reason?: string) => void;
}

export const WhatsAppVerificationModal: React.FC<WhatsAppVerificationModalProps> = ({
  isOpen,
  onClose,
  order,
  onConfirmVerification,
  onRejectOrder,
}) => {
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  if (!isOpen || !order) return null;

  const handleSendWhatsApp = () => {
    const phone = (order.customerPhone || '').replace(/[^0-9]/g, '');
    const cleanPhone = phone.startsWith('0') ? '92' + phone.slice(1) : phone;
    const msg = `السلام علیکم ${order.customerName}! 🛍️\nکیا آپ نے YourMart پر *${order.productName}* کا آرڈر نمبر *#${order.orderNumber || order.id}* کل رقم *Rs. ${order.sellingPricePKR.toLocaleString()}* کنفرم کیا ہے؟\n\nبراہ کرم ہاں لکھ کر بھیجیں تاکہ پارسل آج ہی روانہ کیا جا سکے۔ شکریہ!`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl bg-emerald-500/20 p-2 text-emerald-400">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">WhatsApp COD Order Verification</h3>
              <p className="text-xs text-slate-400">Confirm buyer purchase intent before booking courier</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Order Details */}
        <div className="rounded-2xl bg-slate-950 p-4 border border-slate-800 text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-400">Customer:</span>
            <span className="text-white font-bold">{order.customerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Mobile Phone:</span>
            <span className="text-cyan-400 font-mono font-bold">{order.customerPhone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Delivery Address:</span>
            <span className="text-slate-300">{order.customerAddress}, {order.customerCity}</span>
          </div>
          <div className="flex justify-between pt-1 border-t border-slate-800 font-bold">
            <span className="text-slate-300">COD Total:</span>
            <span className="text-emerald-400 font-mono">Rs. {order.sellingPricePKR.toLocaleString()}</span>
          </div>
        </div>

        <button
          onClick={handleSendWhatsApp}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-3 text-xs font-bold text-white shadow-lg transition cursor-pointer"
        >
          <Send className="h-4 w-4" />
          <span>Open Interactive WhatsApp Chat with Customer</span>
        </button>

        {showRejectInput ? (
          <div className="space-y-3 pt-2">
            <input
              type="text"
              placeholder="Cancellation reason (e.g. Buyer refused on call, wrong number)..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-xs text-white"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowRejectInput(false)}
                className="flex-1 rounded-xl bg-slate-800 py-2 text-xs font-bold text-slate-300"
              >
                Back
              </button>
              <button
                onClick={() => onRejectOrder(order.id, rejectReason)}
                className="flex-1 rounded-xl bg-red-600 hover:bg-red-500 py-2 text-xs font-bold text-white"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => onConfirmVerification(order.id, 'WHATSAPP_CONFIRMED')}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 py-2.5 text-xs font-bold transition"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Mark Verified</span>
            </button>
            <button
              onClick={() => setShowRejectInput(true)}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 py-2.5 text-xs font-bold transition"
            >
              <XCircle className="h-4 w-4" />
              <span>Reject / Fake</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
