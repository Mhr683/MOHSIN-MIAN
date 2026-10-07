import React, { useState } from 'react';
import { X, Lock, ShieldCheck, UserCheck, ArrowRight } from 'lucide-react';
import { User } from '../types';

interface RegistrationRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  allUsers: User[];
  existingUsers?: User[];
  onSelectRegisteredUser?: (user: User) => void;
  onSelectExistingUser?: (user: User) => void;
  onRegistrationSuccess?: (user: User) => void;
  onRegisterSuccess?: (user: User) => void;
  onOpenFullVerifiedRegistration: () => void;
  pendingOrderSummary?: {
    productName: string;
    totalAmountPKR: number;
    itemsCount: number;
  };
}

export const RegistrationRequiredModal: React.FC<RegistrationRequiredModalProps> = ({
  isOpen,
  onClose,
  allUsers,
  onSelectRegisteredUser,
  onOpenFullVerifiedRegistration,
  pendingOrderSummary,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6 text-center">
        <div className="rounded-2xl bg-amber-500/20 w-12 h-12 flex items-center justify-center text-amber-400 mx-auto">
          <Lock className="h-6 w-6" />
        </div>

        <div className="space-y-1">
          <h3 className="text-xl font-bold text-white">Registration Required to Order</h3>
          <p className="text-xs text-slate-400">
            To prevent fraud & guarantee courier dispatch, please sign in or register with verified mobile number.
          </p>
        </div>

        {pendingOrderSummary && (
          <div className="rounded-2xl bg-slate-950 p-4 border border-slate-800 text-xs text-left space-y-1">
            <div className="text-slate-400">Pending Order Basket:</div>
            <div className="font-bold text-white">{pendingOrderSummary.productName}</div>
            <div className="text-emerald-400 font-bold font-mono">
              Total: Rs. {pendingOrderSummary.totalAmountPKR.toLocaleString()}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => {
              const demoUser = allUsers.find((u) => u.role === 'RESELLER') || allUsers[0];
              if (onSelectRegisteredUser && demoUser) {
                onSelectRegisteredUser(demoUser);
              }
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-3 text-xs font-bold text-white shadow-lg transition cursor-pointer"
          >
            <UserCheck className="h-4 w-4" />
            <span>Continue as Verified Demo Reseller</span>
          </button>

          <button
            onClick={onOpenFullVerifiedRegistration}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 py-3 text-xs font-bold text-slate-200 transition cursor-pointer"
          >
            <span>Register New Account</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
