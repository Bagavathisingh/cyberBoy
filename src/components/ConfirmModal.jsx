function ConfirmModal({ open, onClose, onConfirm, title = "Confirm", message = "Are you sure?", confirmText = "Confirm", confirmColor = "bg-red-600 hover:bg-red-700" }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-slate-800 p-6 rounded-xl shadow-lg w-full max-w-xs border border-purple-500/30">
        <h3 className="text-lg font-bold text-white mb-4 text-center">
          {title}
        </h3>
        <p className="text-gray-300 mb-6 text-center">
          {message}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-600 text-white font-semibold hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg text-white font-semibold transition-colors ${confirmColor}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
