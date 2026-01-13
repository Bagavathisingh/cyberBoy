import { motion, AnimatePresence } from "framer-motion";

function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title = "Confirm",
  message = "Are you sure?",
  confirmText = "Confirm",
  confirmColor = "bg-cyber-accent text-black",
}) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bento-card p-10 md:p-14 w-full max-w-lg relative z-10 border-white/10 bg-[#0A0A0A]/90 shadow-[0_0_100px_rgba(0,0,0,0.5)]"
          >
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-[2rem] bg-cyber-accent/10 border border-cyber-accent/20 mb-8 font-black font-zentry text-3xl text-cyber-accent italic rotate-12">
                !
              </div>
              <h3 className="zentry-title text-4xl mb-4 leading-none">
                {title}
              </h3>
              <p className="text-sm font-medium text-cyber-muted leading-relaxed uppercase tracking-widest text-[10px]">
                {message}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onClose}
                className="flex-1 px-8 py-4 bg-white/5 border border-white/10 text-white/40 text-[10px] font-black tracking-widest uppercase hover:bg-white/10 hover:text-white transition-all rounded-full"
              >
                Abort Protocol
              </button>
              <button
                onClick={onConfirm}
                className={`flex-1 zentry-button ${confirmColor} flex items-center justify-center`}
              >
                <span>{confirmText}</span>
              </button>
            </div>

            <div className="mt-8 flex justify-center gap-2 opacity-10">
              <div className="w-1 h-1 rounded-full bg-white" />
              <div className="w-1 h-1 rounded-full bg-white" />
              <div className="w-1 h-1 rounded-full bg-white" />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default ConfirmModal;


