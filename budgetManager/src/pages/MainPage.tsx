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
  const [deleteConfirmType, setDeleteConfirmType] = useState<'payment' | 'transaction'>('payment');
  const [paymentToDelete, setPaymentToDelete] = useState<string | null>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
  const [transactionToDeleteIndex, setTransactionToDeleteIndex] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [editingTransactionIndex, setEditingTransactionIndex] = useState<number | null>(null);

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

  const handleMonthChange = (date: Date) => {
    setCurrentDate(date);
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
    setDeleteConfirmType('payment');
    setPaymentToDelete(payment);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmType === 'payment' && paymentToDelete) {
      const updatedPayments = allPayments.filter(p => p !== paymentToDelete);
      setAllPayments(updatedPayments);
      // Local Storage에 저장
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPayments));
      setIsDeleteConfirmOpen(false);
      setPaymentToDelete(null);
    } else if (deleteConfirmType === 'transaction' && transactionToDeleteIndex !== null) {
      // 1초 지연 후 삭제
      setTimeout(() => {
        const updatedTransactions = transactions.filter((_, i) => i !== transactionToDeleteIndex);
        setTransactions(updatedTransactions);
        setIsDeleteConfirmOpen(false);
        setTransactionToDelete(null);
        setTransactionToDeleteIndex(null);
      }, 1000);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteConfirmOpen(false);
    setPaymentToDelete(null);
    setTransactionToDelete(null);
    setTransactionToDeleteIndex(null);
  };

  // 거래 삭제 핸들러
  const handleDeleteTransaction = (index: number, transaction: Transaction) => {
    setDeleteConfirmType('transaction');
    setTransactionToDelete(transaction);
    setTransactionToDeleteIndex(index);
    setIsDeleteConfirmOpen(true);
  };

  // 거래 수정 핸들러
  const handleEditTransaction = (transaction: Transaction) => {
    // 새 객체를 생성하여 React가 변경을 감지하도록 함
    const index = transactions.findIndex(t => t === transaction);
    setEditingTransaction({ ...transaction });
    setEditingTransactionIndex(index);
  };

  // 거래 수정 취소 핸들러
  const handleCancelEdit = () => {
    setEditingTransaction(null);
    setEditingTransactionIndex(null);
  };

  const handleAddTransaction = (transaction: Transaction) => {
    if (editingTransactionIndex !== null) {
      // 수정 모드: 기존 거래 업데이트
      const updatedTransactions = transactions.map((t, i) =>
        i === editingTransactionIndex ? transaction : t
      );
      setTransactions(updatedTransactions);
      setEditingTransaction(null);
      setEditingTransactionIndex(null);
    } else {
      // 추가 모드: 새 거래 추가
      setTransactions([...transactions, transaction]);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'doc':
        return <DocumentPage onOpenPaymentModal={handleOpenPaymentModal} allPayments={allPayments} onOpenDeleteConfirm={handleOpenDeleteConfirm} onAddTransaction={handleAddTransaction} transactions={transactions} editingTransaction={editingTransaction} onCancelEdit={handleCancelEdit} onDeleteTransaction={handleDeleteTransaction} onEditTransaction={handleEditTransaction} currentDate={currentDate} />;
      case 'calendar':
        return <CalendarPage currentDate={currentDate} transactions={transactions} />;
      case 'chart':
        return <ChartPage />;
      default:
        return <DocumentPage onOpenPaymentModal={handleOpenPaymentModal} allPayments={allPayments} onOpenDeleteConfirm={handleOpenDeleteConfirm} onAddTransaction={handleAddTransaction} transactions={transactions} editingTransaction={editingTransaction} onCancelEdit={handleCancelEdit} onDeleteTransaction={handleDeleteTransaction} onEditTransaction={handleEditTransaction} currentDate={currentDate} />;
    }
  };

  // 전체 화면 클릭 감지
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      // InputBar 제외하고 다른 영역 클릭 시 선택 해제
      if (!(e.target as HTMLElement).closest('[data-inputbar]') && editingTransaction) {
        handleCancelEdit();
      }
    };

    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [editingTransaction]);

  return (
    <div className="mainPage">
      <Header activeTab={activeTab} onTabChange={handleTabChange} currentDate={currentDate} onMonthChange={handleMonthChange} />
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
        type={deleteConfirmType}
        paymentName={paymentToDelete || ''}
        transaction={transactionToDelete || undefined}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  )
}