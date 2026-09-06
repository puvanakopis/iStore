'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Share2 } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  text?: string;
  url?: string;
  image?: string;
}

export default function ShareModal({
  isOpen,
  onClose,
  title = 'Check this out on iStore!',
  text = 'I found this awesome product on iStore. Take a look!',
  url,
  image,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const shareOptions = [
    {
      name: 'WhatsApp',
      color: 'bg-[#25D366] text-white hover:bg-[#20bd5a]',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.572-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
      ),
      action: () => {
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + shareUrl)}`, '_blank');
      },
    },
    {
      name: 'Telegram',
      color: 'bg-[#229ED9] text-white hover:bg-[#1d8cb0]',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.562 8.161c-.18.717-.962 4.084-1.362 5.752-.168.706-.43 1.002-.68 1.025-.547.05-0.963-.36-1.492-.707-.828-.543-1.296-.88-2.101-1.41-.93-.612-.328-.949.203-1.501.139-.144 2.55-2.337 2.597-2.537.006-.025.011-.119-.044-.168s-.136-.033-.195-.019c-.083.018-1.411.897-3.983 2.634-.377.26-.718.388-1.024.381-.338-.008-.988-.191-1.472-.349-.593-.193-1.065-.295-1.024-.623.021-.171.259-.346.713-.526 2.798-1.218 4.665-2.022 5.602-2.412 2.667-1.111 3.222-1.304 3.583-1.31.079-.001.257.019.372.113.097.079.124.186.136.26.012.075.027.247.016.388z" />
        </svg>
      ),
      action: () => {
        window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`, '_blank');
      },
    },
    {
      name: 'Facebook',
      color: 'bg-[#1877F2] text-white hover:bg-[#1464cc]',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      action: () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
      },
    },
    {
      name: 'X (Twitter)',
      color: 'bg-black text-white hover:bg-zinc-800',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      action: () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
      },
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
          />

          {/* Modal Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 px-4"
          >
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-border">
              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border/60">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-primary/10 rounded-2xl text-primary">
                    <Share2 size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground leading-tight">
                      Share Product
                    </h3>
                    <p className="text-xs text-foreground-muted">
                      Spread the word with friends & family
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full text-foreground-muted hover:text-foreground hover:bg-background-dim transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Product Card Snippet (If Image or Title available) */}
                {(image || title) && (
                  <div className="flex items-center gap-4 p-3 bg-background-dim rounded-2xl border border-border/60">
                    {image && (
                      <div className="w-14 h-14 rounded-xl bg-white p-1 overflow-hidden border border-border/50 flex-shrink-0 flex items-center justify-center">
                        <img
                          src={image}
                          alt={title}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-primary uppercase tracking-wider">
                        iStore Product
                      </p>
                      <h4 className="text-sm font-bold text-foreground truncate">
                        {title}
                      </h4>
                      <p className="text-xs text-foreground-muted truncate">
                        {text}
                      </p>
                    </div>
                  </div>
                )}

                {/* Social Share Grid */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground-muted mb-3">
                    Share via
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-3 gap-3">
                    {shareOptions.map((option) => (
                      <button
                        key={option.name}
                        onClick={option.action}
                        className="flex flex-col items-center justify-center p-3 rounded-2xl bg-background-dim hover:bg-white border border-transparent hover:border-border transition-all duration-200"
                      >
                        <div
                          className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-transform duration-200 ${option.color}`}
                        >
                          {option.icon}
                        </div>
                        <span className="text-xs font-medium text-foreground mt-2">
                          {option.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Copy Link Section */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground-muted mb-2">
                    Or copy link
                  </label>
                  <div className="flex items-center gap-2 p-1.5 bg-background-dim rounded-2xl border border-border focus-within:border-primary transition-all">
                    <input
                      type="text"
                      readOnly
                      value={shareUrl}
                      className="flex-1 bg-transparent px-3 text-xs font-mono text-foreground focus:outline-none truncate"
                    />
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 ">
                      {copied ? (
                        <>
                          <Check size={15} />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={15} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
