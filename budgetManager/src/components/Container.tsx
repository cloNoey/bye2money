import checkboxIcon from '../assets/icons/checkbox.svg';
import type { Transaction } from './InputBar';

interface ContainerProps {
  transactions: Transaction[];
}

export default function Container({ transactions }: ContainerProps) {
  const incomeCount = transactions.filter(t => t.type === 'income').length;
  const expenseCount = transactions.filter(t => t.type === 'expense').length;
  const count = transactions.length;

  return(
    <div className="absolute top-[286px] left-[296px]">
        <div className="w-[846px] h-[1263px]">
            {/* monthlyInfo */}
            <div className="w-[846px] h-[24px] flex items-center justify-between">
                {/* item Counter */}
                <div className="flex w-[76px] h-[24px] gap-[8px]">
                    <div className="w-[45px] h-[24px] text-[12px] font-300 text-neutral-text-default">전체내역</div>
                    <div className="w-[23px] h-[24px] text-[12px] font-300 text-neutral-text-default">{count}건</div>
                </div>
                {/* Checkbox buttons */}
                <div className="w-[195px] h-[24px] flex items-center justify-between gap-[12px]">
                    {/* income checkbox */}
                    <div className="w-[97px] h-[24px] flex items-center justify-between">
                        <button className="w-[16px] h-[16px]">
                            <img src={checkboxIcon} alt="checkbox" className="w-[13px] h-[13px]" />
                        </button>
                        <div className="flex items-center justify-start w-[77px] h-[24px] text-[12px] font-300 text-neutral-text-default">수입 {incomeCount}</div>
                    </div>
                    {/* expense checkbox */}
                    <div className="w-[97px] h-[24px] flex items-center justify-between">
                        <button className="w-[16px] h-[16px]">
                            <img src={checkboxIcon} alt="checkbox" className="w-[13px] h-[13px]" />
                        </button>
                        <div className="flex items-center justify-start w-[77px] h-[24px] text-[12px] font-300 text-neutral-text-default">지출 {expenseCount}</div>
                    </div>
                </div>
            </div>

            {/* Transactions List */}
            <div className="mt-[24px] flex flex-col gap-[8px]">
              {transactions.length === 0 ? (
                <div className="w-[846px] h-[56px] flex items-center justify-center text-[12px] font-300 text-neutral-text-weak bg-neutral-surface-weak">
                  내역이 없습니다
                </div>
              ) : (
                transactions.map((transaction, index) => (
                  <div key={index} className="w-[846px] h-[56px] flex items-center justify-between px-[16px] bg-neutral-surface-default border border-neutral-border-default">
                    <div className="flex items-center gap-[16px] flex-1">
                      <div className="w-[60px] text-[12px] font-300 text-neutral-text-default">{transaction.date}</div>
                      <div className="w-[100px] text-[12px] font-300 text-neutral-text-default">{transaction.description}</div>
                    </div>
                    <div className="flex items-center gap-[24px]">
                      <div className="w-[80px] text-[12px] font-300 text-neutral-text-default text-right">{transaction.amount}</div>
                      <div className="w-[70px] text-[12px] font-300 text-neutral-text-default">{transaction.category}</div>
                      <div className="w-[60px] text-[12px] font-300 text-neutral-text-default">{transaction.payment}</div>
                      <div className="w-[50px] text-[12px] font-600" style={{color: transaction.type === 'income' ? '#2563eb' : '#ef4444'}}>
                        {transaction.type === 'income' ? '+' : '-'}{transaction.amount}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
        </div>
    </div>
  )
}
