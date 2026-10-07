import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle, Building, UserCheck } from 'lucide-react';
import { User, UserRole, VerifiedRegistrationData } from '../types';

interface VerifiedRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onRegistrationSuccess: (data: VerifiedRegistrationData) => void;
}

export const VerifiedRegistrationModal: React.FC<VerifiedRegistrationModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onRegistrationSuccess,
}) => {
  const [role, setRole] = useState<'SUPPLIER' | 'RESELLER' | 'MANUFACTURER'>('RESELLER');
  const [name, setName] = useState(currentUser.name || '');
  const [companyName, setCompanyName] = useState(currentUser.companyName || '');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [city, setCity] = useState(currentUser.city || 'Lahore');
  const [cnic, setCnic] = useState(currentUser.cnicNumber || '');
  const [ntn, setNtn] = useState(currentUser.ntnNumber || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRegistrationSuccess({
      role,
      businessName: companyName || name,
      contactName: name,
      email: currentUser.email || 'user@yourmart.pk',
      phone,
      city,
      cnic,
      ntn,
      warehouseAddress: `${city} Central Wholesale Depot`,
      businessAddress: `${city} Main Commercial Area`,
      bankName: 'Meezan Bank',
      accountTitle: companyName || name,
      accountNumber: '020101992019',
      businessCategory: 'Wholesale & Dropshipping',
      verificationId: `PK-MFR-${Math.floor(10000 + Math.random() * 90000)}`,
      isVerified: true,
      registeredAt: new Date().toISOString(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl bg-emerald-500/20 p-2 text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Verified B2B Registration</h3>
              <p className="text-xs text-slate-400">Join as Wholesale Importer, Supplier, or Dropshipper</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole('RESELLER')}
              className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                role === 'RESELLER'
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 font-bold'
                  : 'border-slate-800 bg-slate-950 text-slate-400'
              }`}
            >
              <UserCheck className="h-5 w-5 mx-auto mb-1" />
              <div>Reseller / Dropshipper</div>
            </button>
            <button
              type="button"
              onClick={() => setRole('SUPPLIER')}
              className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                role === 'SUPPLIER'
                  ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400 font-bold'
                  : 'border-slate-800 bg-slate-950 text-slate-400'
              }`}
            >
              <Building className="h-5 w-5 mx-auto mb-1" />
              <div>Supplier / Factory Hub</div>
            </button>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Full Legal Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Company / Brand Name</label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Phone (WhatsApp Active)</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">CNIC (Optional)</label>
              <input
                type="text"
                placeholder="35201-xxxxxxxx-x"
                value={cnic}
                onChange={(e) => setCnic(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">City</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 py-3 text-xs font-bold text-white shadow-lg transition cursor-pointer"
          >
            Complete Registration & Verify
          </button>
        </form>
      </div>
    </div>
  );
};
