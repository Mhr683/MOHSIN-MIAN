import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product, Order, User, UserRole } from '../types';
import { AppNotification } from '../types/notification';

interface AppContextType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  addProduct: (product: Product | Partial<Product>) => void;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  returns: any[];
  setReturns: React.Dispatch<React.SetStateAction<any[]>>;
  suppliers: User[];
  customers: User[];
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  isAddProductModalOpen: boolean;
  setIsAddProductModalOpen: (open: boolean) => void;
  isGlobalSearchOpen: boolean;
  setIsGlobalSearchOpen: (open: boolean) => void;
  selectedProductForModal: Product | null;
  setSelectedProductForModal: (product: Product | null) => void;
  isProductDetailModalOpen: boolean;
  setIsProductDetailModalOpen: (open: boolean) => void;
  selectedOrderForModal: Order | null;
  setSelectedOrderForModal: (order: Order | null) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
}

const defaultNotifications: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'New COD Order Received',
    message: 'Order #YM-8821 for 2x T9 Trimmer received from Karachi. Verification pending.',
    type: 'ORDER_NEW',
    timestamp: new Date().toISOString(),
    read: false,
    isRead: false,
    orderId: 'YM-8821',
  },
  {
    id: 'notif-2',
    title: 'Dispatched via Trax Express',
    message: 'Tracking #TRX-94821034 active for Lahore customer.',
    type: 'ORDER_DISPATCHED',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    read: false,
    isRead: false,
  },
  {
    id: 'notif-3',
    title: 'Profit Margin Deposited',
    message: 'Rs. 1,450 margin added to your reseller wallet.',
    type: 'FINANCE_PAYOUT',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    read: true,
    isRead: true,
  },
];

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [returns, setReturns] = useState<any[]>([]);
  const [suppliers] = useState<User[]>([
    {
      id: 'sup-1',
      name: 'Kamran Electronics Wholesale',
      email: 'kamran@hallroad.pk',
      companyName: 'Kamran Hall Road Distribution',
      role: 'SUPPLIER',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      walletBalancePKR: 450000,
      phone: '0300-4491029',
      city: 'Lahore',
    },
    {
      id: 'sup-2',
      name: 'Al-Madina Kitchen Importers',
      email: 'sales@almadinakh.com',
      companyName: 'Al-Madina Kitchen & Homeware',
      role: 'SUPPLIER',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      walletBalancePKR: 320000,
      phone: '0321-9988221',
      city: 'Karachi',
    },
  ]);
  const [customers] = useState<User[]>([
    {
      id: 'cust-1',
      name: 'Muhammad Usman',
      email: 'usman.lahore@gmail.com',
      companyName: 'Individual Buyer',
      role: 'CUSTOMER',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      walletBalancePKR: 0,
      phone: '0302-8871234',
      city: 'Lahore',
    },
  ]);

  const [activeRole, setActiveRole] = useState<UserRole>('RESELLER');
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const [isProductDetailModalOpen, setIsProductDetailModalOpen] = useState(false);
  const [selectedOrderForModal, setSelectedOrderForModal] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState('catalog');
  const [notifications, setNotifications] = useState<AppNotification[]>(defaultNotifications);

  const addProduct = (prod: Product | Partial<Product>) => {
    const fullProd: Product = {
      id: prod.id || `prod-${Date.now()}`,
      name: prod.name || 'New Wholesale Product',
      category: prod.category || 'General Wholesale',
      sku: prod.sku || `SKU-${Date.now().toString().slice(-4)}`,
      supplierCostPKR: prod.supplierCostPKR || 1000,
      recSellingPricePKR: prod.recSellingPricePKR || 2000,
      stock: prod.stock ?? 50,
      image: prod.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
      images: prod.images || [prod.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'],
      rating: prod.rating || 4.8,
      status: 'ACTIVE',
      ...prod,
    };
    setProducts((prev) => [fullProd, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <AppContext.Provider
      value={{
        products,
        setProducts,
        addProduct,
        orders,
        setOrders,
        returns,
        setReturns,
        suppliers,
        customers,
        activeRole,
        setActiveRole,
        isAddProductModalOpen,
        setIsAddProductModalOpen,
        isGlobalSearchOpen,
        setIsGlobalSearchOpen,
        selectedProductForModal,
        setSelectedProductForModal,
        isProductDetailModalOpen,
        setIsProductDetailModalOpen,
        selectedOrderForModal,
        setSelectedOrderForModal,
        activeTab,
        setActiveTab,
        notifications,
        markNotificationRead,
        clearAllNotifications,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    // Return safe fallback so components mounted without provider don't crash
    return {
      products: [],
      setProducts: () => {},
      addProduct: () => {},
      orders: [],
      setOrders: () => {},
      returns: [],
      setReturns: () => {},
      suppliers: [],
      customers: [],
      activeRole: 'RESELLER' as UserRole,
      setActiveRole: () => {},
      isAddProductModalOpen: false,
      setIsAddProductModalOpen: () => {},
      isGlobalSearchOpen: false,
      setIsGlobalSearchOpen: () => {},
      selectedProductForModal: null,
      setSelectedProductForModal: () => {},
      isProductDetailModalOpen: false,
      setIsProductDetailModalOpen: () => {},
      selectedOrderForModal: null,
      setSelectedOrderForModal: () => {},
      activeTab: 'catalog',
      setActiveTab: () => {},
      notifications: defaultNotifications,
      markNotificationRead: () => {},
      clearAllNotifications: () => {},
    };
  }
  return context;
};
