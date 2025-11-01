interface DeleteConfirmDialogProps {
  isOpen: boolean;
  paymentName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmDialog({
  isOpen,
  paymentName,
  onConfirm,
  onCancel,
}: DeleteConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Background Overlay */}
      <div
        className="fixed inset-0 z-10"
        style={{ backgroundColor: '#0000004D' }}
        onClick={onCancel}
      />

      {/* Dialog Box */}
      <div
        className="absolute w-[384px] h-[200px] z-20 flex flex-col"
        style={{ top: '754px', left: '528px' }}>
        {/* Message */}
        <div className="flex flex-col justify-center items-center bg-neutral-surface-default border-t border-r border-l border-neutral-border-default"
          style={{
            width: '384px',
            height: '144px',
            padding: '32px',
            gap: '8px'
          }}>
          <p className="text-[16px] font-400 text-neutral-text-default text-center">
            해당 결제 수단을 삭제하시겠습니까?
          </p>
          <p className="text-[12px] font-300 text-neutral-text-default text-center">결제 수단 : {paymentName}</p>
        </div>

        {/* Button Area */}
        <div className="flex items-center justify-between w-[384px] h-[56px] border bg-neutral-surface-default">
          <button
            onClick={onCancel}
            className="flex items-center justify-center w-[192px] h-[56px] text-[14px] font-300 text-neutral-text-default border-r border-neutral-border-default">
            취소
          </button>
          <button
            onClick={onConfirm}
            disabled={!paymentName.trim()}
            className="flex items-center justify-center w-[192px] h-[56px] text-[14px] font-600 text-neutral-text-default">
            삭제
          </button>
        </div>
      </div>
    </>
  );
}
