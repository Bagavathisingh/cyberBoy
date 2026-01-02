function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title = "Confirm",
  message = "Are you sure?",
  confirmText = "Confirm",
  confirmColor = "bg-red-600 hover:bg-red-700",
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md">
      <div className="bg-cyber-bg p-8 border border-cyber-border shadow-2xl w-full max-w-sm relative">
        <div className="absolute top-0 left-0 w-8 h-px bg-cyber-accent" />
        <h3 className="text-sm font-orbitron font-black text-white mb-4 tracking-widest uppercase">
          {title}
        </h3>
        <p className="text-[10px] font-cyber text-cyber-muted mb-8 leading-relaxed">
          {message}
        </p>
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-white/[0.02] border border-cyber-border text-cyber-muted text-[10px] font-orbitron tracking-widest uppercase hover:text-white transition-all"
          >
            Abort
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-3 text-[10px] font-orbitron font-black tracking-widest uppercase transition-all ${confirmColor}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
