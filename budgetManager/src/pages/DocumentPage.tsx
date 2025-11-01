import InputBar from '../components/InputBar'
import type { Transaction } from '../components/InputBar'
import Container from '../components/Container'

interface DocumentPageProps {
  onOpenPaymentModal: () => void;
  allPayments: string[];
  onOpenDeleteConfirm: (payment: string) => void;
  onAddTransaction: (transaction: Transaction) => void;
  transactions: Transaction[];
}

export default function DocumentPage({ onOpenPaymentModal, allPayments, onOpenDeleteConfirm, onAddTransaction, transactions }: DocumentPageProps) {
  return (
    <>
      <InputBar onOpenPaymentModal={onOpenPaymentModal} allPayments={allPayments} onOpenDeleteConfirm={onOpenDeleteConfirm} onAddTransaction={onAddTransaction} />
      <Container transactions={transactions} />
    </>
  )
}
