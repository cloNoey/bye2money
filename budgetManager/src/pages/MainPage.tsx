import { useState, useEffect } from 'react';
import Header from '../components/layout/Header'
import DocumentPage from './DocumentPage'
import CalendarPage from './CalendarPage'
import ChartPage from './ChartPage'
import PaymentModal from '../components/PaymentModal'
import DeleteConfirmDialog from '../components/DeleteConfirmDialog'
import type { Transaction } from '../components/InputBar'

const STORAGE_KEY = 'allPayments';
const DEFAULT_PAYMENTS = ['현금', '신용카드'];

export default function MainPage() {
  const [activeTab, setActiveTab] = useState<'doc' | 'calendar' | 'chart'>('doc');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [allPayments, setAllPayments] = useState<string[]>(DEFAULT_PAYMENTS);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // 초기 로드: Local Storage에서 저장된 결제수단 불러오기
  useEffect(() => {
    const savedPayments = localStorage.getItem(STORAGE_KEY);
    if (savedPayments) {
      try {
        setAllPayments(JSON.parse(savedPayments));
      } catch (error) {
        console.error('Failed to parse saved payments:', error);
        setAllPayments(DEFAULT_PAYMENTS);
      }
    } else {
      // 처음 방문 시 기본값 저장
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PAYMENTS));
    }
  }, []);

  const handleTabChange = (tab: 'doc' | 'calendar' | 'chart') => {
    setActiveTab(tab);
  };

  const handleOpenPaymentModal = () => {
    setIsPaymentModalOpen(true);
  };

  const handleAddPayment = (newPayment: string) => {
    const updatedPayments = [...allPayments, newPayment];
    setAllPayments(updatedPayments);
    // Local Storage에 저장
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPayments));
    setIsPaymentModalOpen(false);
  };

  const handleOpenDeleteConfirm = (payment: string) => {
    setPaymentToDelete(payment);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (paymentToDelete) {
      const updatedPayments = allPayments.filter(p => p !== paymentToDelete);
      setAllPayments(updatedPayments);
      // Local Storage에 저장
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPayments));
    }
    setIsDeleteConfirmOpen(false);
    setPaymentToDelete(null);
  };

  const handleCancelDelete = () => {
    setIsDeleteConfirmOpen(false);
    setPaymentToDelete(null);
  };

  const handleAddTransaction = (transaction: Transaction) => {
    setTransactions([...transactions, transaction]);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'doc':
        return <DocumentPage onOpenPaymentModal={handleOpenPaymentModal} allPayments={allPayments} onOpenDeleteConfirm={handleOpenDeleteConfirm} onAddTransaction={handleAddTransaction} transactions={transactions} />;
      case 'calendar':
        return <CalendarPage />;
      case 'chart':
        return <ChartPage />;
      default:
        return <DocumentPage onOpenPaymentModal={handleOpenPaymentModal} allPayments={allPayments} onOpenDeleteConfirm={handleOpenDeleteConfirm} onAddTransaction={handleAddTransaction} transactions={transactions} />;
    }
  };

  return (
    <div className="mainPage">
      <Header activeTab={activeTab} onTabChange={handleTabChange} />
      {renderContent()}

      {/* Payment Modal */}
      {isPaymentModalOpen && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          onAdd={handleAddPayment}
        />
      )}

      {/* Delete Confirm Dialog */}
      <DeleteConfirmDialog
        isOpen={isDeleteConfirmOpen}
        paymentName={paymentToDelete || ''}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  )
}