'use client';

import { Icon } from '@/components/ui/Icon';

export default function MessagingNegotiation() {
  const messages = [
    {
      type: 'received',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuD9BLcSVIUfNz6qLnGDxqy8Wv_jgYBLDlZYiNovzBghuMT1OqDdkriqXFaKfPJ6QlOTW7Of3R9oKcoo6RdkysGD1TX3uBgJpYmOephSb4uq0B_i9N-nlTtx0IPki-kAUCdFUle0dex2DyIEuMjAQr9iRwILCpQi7V4wLSTeIdBlxO69J7mnbjbbB-GCBWK2wuMZp9Fsv93D-Tc8D7o4te_GnCUSr0Vp5tS9nXCXHpgm4FFoYoaHSWPEh4GmGyLmHWBDoN2spXMASYk',
      text: "Hey there! Just went through the creative brief for the upcoming campaign. Everything looks great, but I'd like to adjust the timeline slightly to ensure the lighting for the outdoor shoot is perfect.",
      time: '10:42 AM',
    },
    {
      type: 'sent',
      text: 'That makes sense! We definitely want that golden hour glow. What date were you thinking for the shoot?',
      time: '10:45 AM',
      read: true,
    },
    {
      type: 'system',
      text: 'Contract terms updated to ₹1,500',
    },
    {
      type: 'received',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCRj8tiKxKDo_vHuH1ZwLSUcFP3gZlxoIDRymNwKFBWkLDZLQ2uvnCqkTaTVPSpkypE5LmgW3ulxJpNi00z5oLMqq4LGlXVQphsqDgzSdjl8thNL0khtZyq8LvHhdRoOrb2y4sYiyvBCIdnN639AxjvCH7rd7ownrbycVHo94-ZhwcPBOWFpPhE9dTLBT5ShFDinZV-nQl1qELTs-l1wXZc_VcbgMir9sJvntbu5Ogm5HOvsBXzO6PRzjhJ05Oko2p1qRxlMQ1yjI4',
      text: "I've reviewed the updated offer. The ₹1,500 for the 60-second Reel works for me given the production value we're aiming for. 🎬",
      time: '11:02 AM',
      multiple: true,
    },
    {
      type: 'received',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCRj8tiKxKDo_vHuH1ZwLSUcFP3gZlxoIDRymNwKFBWkLDZLQ2uvnCqkTaTVPSpkypE5LmgW3ulxJpNi00z5oLMqq4LGlXVQphsqDgzSdjl8thNL0khtZyq8LvHhdRoOrb2y4sYiyvBCIdnN639AxjvCH7rd7ownrbycVHo94-ZhwcPBOWFpPhE9dTLBT5ShFDinZV-nQl1qELTs-l1wXZc_VcbgMir9sJvntbu5Ogm5HOvsBXzO6PRzjhJ05Oko2p1qRxlMQ1yjI4',
      text: 'Can we confirm the usage rights? Is this just for organic social or does it include paid ads for 30 days?',
      time: '11:02 AM',
    },
    {
      type: 'sent',
      text: "The current offer includes 30 days of paid usage rights. I've pinned the breakdown in the negotiation panel above if you want to double-check the fine print!",
      time: '11:15 AM',
      read: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Top Navigation / Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-border glass-panel">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-colors lg:hidden text-slate-700 dark:text-slate-200">
              <Icon name="arrow_back" />
            </button>
            <div className="relative">
              <div
                className="w-10 h-10 rounded-full bg-cover bg-center border border-slate-200 dark:border-border"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAvsJxoTQNleUbzq2ak09Y-AbN5tli1B6fVI4jLAMFxezULSm4lMhYpJRI8xbHvIb5vIWxT80aLkr2np4ZAM_FXMTa0IjKjbsXVoKsVkeILQlMSCZF1JuxybU_BOordOEAJoDkEmnKkbCy4yGCHqeZpwtuouyxzmeE2eyL4uXKhl93H7HxzuAynPirjFAJXcVKHANg9mT_ewEX95b0fqEm0ETPuDNWiZFNWptYUeJsuTdn9jMVASUbxeuKDPP-orBjHkenx1nmrvyo')",
                }}
              ></div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background-light dark:border-background-dark rounded-full"></div>
            </div>
            <div>
              <h1 className="font-bold text-sm md:text-base text-slate-900 dark:text-white">Sarah Jenkins</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Online • Influencer</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-colors text-slate-700 dark:text-slate-200">
              <Icon name="videocam" />
            </button>
            <button className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-colors text-slate-700 dark:text-slate-200">
              <Icon name="info" />
            </button>
          </div>
        </div>

        {/* Sticky Negotiation Panel */}
        <div className="border-t border-slate-200 dark:border-border bg-slate-100 dark:bg-surface-dark/50 px-4 py-3">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/20 p-2 rounded-lg">
                <Icon name="handshake" className="text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">Current Offer: ₹1,500.00</span>
                  <span className="text-[10px] uppercase tracking-wider bg-primary/20 text-primary px-1.5 py-0.5 rounded font-bold">
                    Pending
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">1x Instagram Reel (60s) • Delivery: Oct 24</p>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <button className="flex-1 md:flex-none px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                Accept
              </button>
              <button className="flex-1 md:flex-none px-4 py-2 bg-slate-800 text-white text-sm font-bold rounded-lg hover:bg-slate-700 transition-all border border-border-dark">
                Counter
              </button>
              <button className="p-2 bg-transparent text-slate-400 hover:text-red-400 transition-colors">
                <Icon name="block" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Interface */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-4 overflow-y-auto space-y-6 pb-24">
        {/* System Timestamp */}
        <div className="flex justify-center">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest bg-slate-200 dark:bg-surface-dark px-3 py-1 rounded-full border border-slate-300 dark:border-border">
            Yesterday
          </span>
        </div>

        {messages.map((message, idx) => {
          if (message.type === 'system') {
            return (
              <div key={idx} className="flex flex-col items-center gap-2 py-2">
                <div className="h-px w-32 bg-slate-300 dark:bg-border"></div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Icon name="edit_document" size={14} />
                  <span>{message.text}</span>
                </div>
              </div>
            );
          }

          if (message.type === 'received') {
            return (
              <div key={idx} className="flex items-end gap-3 max-w-[85%] md:max-w-[70%]">
                {!message.multiple && (
                  <div
                    className="w-8 h-8 rounded-full bg-cover bg-center shrink-0 border border-slate-200 dark:border-border"
                    style={{ backgroundImage: `url('${message.avatar}')` }}
                  ></div>
                )}
                {message.multiple && <div className="w-8"></div>}
                <div className="space-y-1">
                  <div className="bg-slate-200 dark:bg-surface-dark border border-slate-200 dark:border-border p-3 rounded-xl rounded-bl-none">
                    <p className="text-sm leading-relaxed text-slate-900 dark:text-slate-100">{message.text}</p>
                  </div>
                  {!message.multiple && <p className="text-[10px] text-slate-500 ml-1">{message.time}</p>}
                </div>
              </div>
            );
          }

          if (message.type === 'sent') {
            return (
              <div key={idx} className="flex flex-col items-end gap-1 ml-auto max-w-[85%] md:max-w-[70%]">
                <div className="bg-primary p-3 rounded-xl rounded-br-none text-white shadow-md">
                  <p className="text-sm leading-relaxed">{message.text}</p>
                </div>
                <div className="flex items-center gap-1 mr-1">
                  <p className="text-[10px] text-slate-500">{message.time}</p>
                  <Icon name="done_all" size={14} className={message.read ? 'text-primary' : 'text-slate-500'} />
                </div>
              </div>
            );
          }

          return null;
        })}
      </main>

      {/* Message Input Bar */}
      <footer className="fixed bottom-0 left-0 right-0 glass-panel border-t border-slate-200 dark:border-border pb-safe">
        <div className="max-w-5xl mx-auto p-4">
          <div className="flex items-center gap-3 bg-slate-100 dark:bg-background-dark/50 border border-slate-200 dark:border-border rounded-xl p-2 pl-4">
            <button className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">
              <Icon name="add_circle" />
            </button>
            <input
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-900 dark:text-slate-100"
              placeholder="Type a message..."
              type="text"
            />
            <button className="text-slate-400 hover:text-primary transition-colors px-1">
              <Icon name="mood" />
            </button>
            <button className="w-10 h-10 bg-primary text-white rounded-lg flex items-center justify-center hover:bg-primary/90 transition-all active:scale-95 shadow-lg shadow-primary/20">
              <Icon name="send" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
