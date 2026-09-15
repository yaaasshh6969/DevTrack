import { useState } from 'react';
import {
  hanaMessages,
  hanaQuickSuggestions,
  weeklyCoachingInsights,
  gamification,
  user,
} from '../data/mockData';
import { HanaCharacterSVG, HanaQuote } from '../components/ui/WaifuCompanion';
import { PlusIcon } from '../components/ui/icons';

// ── Message bubble ────────────────────────────────────────────────────────────

interface Message {
  id: number;
  from: 'hana' | 'user';
  text: string;
  time: string;
}

const initialMessages: Message[] = hanaMessages.map((m) => ({
  id: m.id,
  from: 'hana',
  text: m.text,
  time: m.time,
}));

// ── AI Coach Page ─────────────────────────────────────────────────────────────

export default function AICoach() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputText, setInputText] = useState('');
  const [hanaTyping, setHanaTyping] = useState(false);
  const [selectedMood, setSelectedMood] = useState<'happy' | 'thinking' | 'excited'>('happy');

  const hanaReplies: Record<string, string> = {
    "What should I focus on today?":
      "Today: 90 minutes on React Context API — you're within reach of completing it. Then 30 minutes reviewing your async JS notes. Hardest concept first, then review. That's the sequence that works for you.",
    "Give me a study plan for this week":
      "Mon/Tue: Context API and useReducer, 2h each. Wed: deliberate rest — no cramming. Thu: Custom hooks deep dive, this is your highest-output day, use it. Fri: Build something with what you've learned. Sat: Node.js intro. Sun: review and consolidate. No shortcuts.",
    "Explain Context API simply":
      "Context is a broadcast channel. Instead of drilling props through every component in the tree, Context lets any descendant tune in directly. Think radio tower — not telephone chain. The Provider transmits; useContext receives. The mental model is the hard part. The syntax follows naturally once you have that.",
    "How am I doing overall?":
      "47 days without breaking — that puts you in the top 3% for consistency. Not talent. Consistency. 284h logged, React up 10% this week. One gap: Error Handling in JS. You've touched it twice this month. That's not enough. Close it this week.",
    "I'm feeling stuck on async JS":
      "Expected. Async requires a complete mental model shift, not just syntax memorization. Draw the call stack on paper while running a fetch() call. Physically trace what happens. Promise.all() handles parallel fetches — understand when that's appropriate versus sequential chains. The frustration you feel is the learning happening.",
    "Challenge me with a concept ⚡":
      "Explain this without looking it up: why does `const arr = []; arr.push(1)` work even though arr is const? Most developers know the answer. Few can explain the distinction clearly. Const protects the binding — the reference — not the internal structure of what it points to. Elaborate on the implications of that.",
  };

  function sendMessage(text: string) {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now(),
      from: 'user',
      text,
      time: 'Now',
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setHanaTyping(true);
    setSelectedMood('thinking');

    setTimeout(() => {
      const reply =
        hanaReplies[text] ||
        "Worth exploring. Based on your learning history, break this into smaller units — one concept at a time, each with a concrete example you write yourself. Summarize what you've just learned in your own words. Your comprehension rate is highest when you do that.";
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, from: 'hana', text: reply, time: 'Just now' },
      ]);
      setHanaTyping(false);
      setSelectedMood('happy');
    }, 1500);
  }

  const xpPct = Math.round((gamification.xp / gamification.xpToNext) * 100);

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto space-y-6">

      {/* ── Header ── */}
      <div>
        <div className="flex items-center gap-2.5 mb-1">
          <h1 className="text-[24px] font-semibold tracking-tight" style={{ color: '#f0ecff' }}>
            AI Coach
          </h1>
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest"
            style={{ background: 'rgba(204,34,85,0.1)', color: '#cc1144', border: '1px solid rgba(204,34,85,0.18)' }}
          >
            Aria
          </span>
        </div>
        <p className="text-[14px]" style={{ color: '#6868a8' }}>
          Your AI learning architect — analysis, coaching, and direct feedback.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start">

        {/* ── Left: Aria profile ── */}
        <div className="flex flex-col gap-4">
          {/* Character card */}
          <div
            className="card overflow-hidden"
            style={{ borderColor: 'rgba(139,71,243,0.14)' }}
          >
            <div
              className="relative flex items-end justify-center pt-4"
              style={{
                height: 280,
                background:
                  'radial-gradient(ellipse at 50% 85%, rgba(139,71,243,0.1) 0%, transparent 58%), radial-gradient(ellipse at 50% 8%, rgba(204,34,85,0.07) 0%, transparent 48%), #0b0b20',
              }}
            >
              {/* Atmospheric side glow — left */}
              <div
                className="absolute left-0 top-0 bottom-0 w-1/4"
                style={{ background: 'linear-gradient(to right, rgba(139,71,243,0.05), transparent)' }}
              />
              {/* Atmospheric side glow — right */}
              <div
                className="absolute right-0 top-0 bottom-0 w-1/4"
                style={{ background: 'linear-gradient(to left, rgba(204,34,85,0.04), transparent)' }}
              />
              {/* Subtle decorative line */}
              <div
                className="absolute bottom-0 left-0 right-0 h-px"
                style={{ background: 'linear-gradient(to right, transparent, rgba(139,71,243,0.1), rgba(204,34,85,0.08), transparent)' }}
              />
              <div className="w-[250px] h-[295px]">
                <HanaCharacterSVG mood={hanaTyping ? 'thinking' : selectedMood} />
              </div>
            </div>

            <div className="px-5 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-[16px] font-semibold" style={{ color: '#f0ecff' }}>
                    Aria
                  </h2>
                  <p className="text-[12px] mt-0.5" style={{ color: '#6868a8' }}>
                    Learning Architect · AI
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: '#4dd0a1', boxShadow: '0 0 6px rgba(77,208,161,0.5)' }}
                  />
                  <span className="text-[10px]" style={{ color: '#38386a' }}>Online</span>
                </div>
              </div>

              <div
                className="mt-3 pt-3 flex gap-4"
                style={{ borderTop: '1px solid rgba(100,70,200,0.07)' }}
              >
                {[
                  { label: 'Coaching Streak', value: `${user.streak}d` },
                  { label: 'Sessions', value: '127' },
                  { label: 'Insights', value: '34' },
                ].map((s) => (
                  <div key={s.label} className="flex-1 text-center">
                    <p className="text-[15px] font-semibold font-mono" style={{ color: '#8b47f3' }}>
                      {s.value}
                    </p>
                    <p className="text-[10px]" style={{ color: '#38386a' }}>
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Level card */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                    style={{ background: 'rgba(139,71,243,0.16)', color: '#8b47f3' }}
                  >
                    LVL {gamification.level}
                  </span>
                  <span className="text-[12px] font-semibold" style={{ color: '#f0ecff' }}>
                    {gamification.levelName}
                  </span>
                </div>
                <p className="text-[11px] mt-0.5" style={{ color: '#38386a' }}>
                  {gamification.xp.toLocaleString()} / {gamification.xpToNext.toLocaleString()} XP
                </p>
              </div>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div className="h-full rounded-full xp-bar-fill" style={{ width: `${xpPct}%` }} />
            </div>
            <p className="mt-1.5 text-[11px]" style={{ color: '#38386a' }}>
              {gamification.xpToNext - gamification.xp} XP to Level {gamification.level + 1}
            </p>
          </div>

          {/* Weekly insights */}
          <div className="card p-4 space-y-3">
            <h3 className="text-[13px] font-semibold" style={{ color: '#f0ecff' }}>
              This Week's Insights
            </h3>
            {weeklyCoachingInsights.map((insight) => (
              <div
                key={insight.label}
                className="flex items-center gap-3 p-2.5 rounded-[7px]"
                style={{ background: 'rgba(255,255,255,0.02)' }}
              >
                <span className="text-[14px] shrink-0" style={{ filter: 'saturate(0.7) brightness(0.85)' }}>{insight.emoji}</span>
                <div className="min-w-0">
                  <p className="text-[11px] font-medium truncate" style={{ color: '#f0ecff' }}>
                    {insight.value}
                  </p>
                  <p className="text-[10.5px] truncate" style={{ color: '#38386a' }}>
                    {insight.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: Chat ── */}
        <div className="flex flex-col gap-4">
          {/* Chat window */}
          <div
            className="card flex flex-col"
            style={{ borderColor: 'rgba(139,71,243,0.12)', minHeight: 500 }}
          >
            {/* Chat header */}
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: '1px solid rgba(100,70,200,0.08)' }}
            >
              <div className="flex items-center gap-3">
                {/* Avatar orb */}
                <div
                  className="w-8 h-8 rounded-full shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, #360a80 0%, #8b47f3 50%, #cc1144 100%)',
                    boxShadow: '0 0 8px rgba(139,71,243,0.2)',
                  }}
                />
                <div>
                  <p className="text-[13px] font-semibold" style={{ color: '#f0ecff' }}>
                    Aria
                  </p>
                  <p className="text-[11px]" style={{ color: hanaTyping ? '#8b47f3' : '#38386a' }}>
                    {hanaTyping ? 'Processing...' : 'Active now'}
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono" style={{ color: '#38386a' }}>
                AI COACH
              </span>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4" style={{ maxHeight: 460 }}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.from === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {msg.from === 'hana' && (
                    <div
                      className="w-7 h-7 rounded-full shrink-0 mt-1"
                      style={{
                        background: 'linear-gradient(135deg, #360a80 0%, #8b47f3 60%, #cc1144 100%)',
                        boxShadow: '0 0 6px rgba(139,71,243,0.15)',
                      }}
                    />
                  )}
                  <div className={`flex flex-col gap-1 max-w-[78%] ${msg.from === 'user' ? 'items-end' : ''}`}>
                    <div
                      className={`px-4 py-3 text-[13px] leading-relaxed ${
                        msg.from === 'hana' ? 'chat-bubble-hana' : 'chat-bubble-user'
                      }`}
                    >
                      <p style={{ color: msg.from === 'hana' ? '#c4c0e0' : '#f0ecff' }}>{msg.text}</p>
                    </div>
                    <span className="text-[10px]" style={{ color: '#38386a' }}>
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {hanaTyping && (
                <div className="flex gap-3">
                  <div
                    className="w-7 h-7 rounded-full shrink-0"
                    style={{ background: 'linear-gradient(135deg, #360a80 0%, #8b47f3 60%, #cc1144 100%)' }}
                  />
                  <div className="chat-bubble-hana px-4 py-3">
                    <div className="flex gap-1.5 items-center h-4">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{
                            background: '#8b47f3',
                            animation: 'subtle-pulse 1.2s ease-in-out infinite',
                            animationDelay: `${i * 0.2}s`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input area */}
            <div
              className="px-5 py-4"
              style={{ borderTop: '1px solid rgba(100,70,200,0.07)' }}
            >
              <div className="flex gap-3">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage(inputText)}
                  placeholder="Ask Aria anything..."
                  className="flex-1 px-4 py-2.5 rounded-[8px] text-[13.5px] transition-colors"
                  style={{
                    background: '#090918',
                    border: '1px solid rgba(100,70,200,0.12)',
                    color: '#f0ecff',
                  }}
                />
                <button
                  onClick={() => sendMessage(inputText)}
                  disabled={!inputText.trim() || hanaTyping}
                  className="px-4 py-2.5 rounded-[8px] text-[13px] font-semibold transition-opacity hover:opacity-90 disabled:opacity-40"
                  style={{ background: '#8b47f3', color: 'white' }}
                >
                  <PlusIcon size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* Quick suggestions */}
          <div>
            <p className="text-[12px] font-medium mb-2.5" style={{ color: '#38386a' }}>
              Quick prompts
            </p>
            <div className="flex flex-wrap gap-2">
              {hanaQuickSuggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  disabled={hanaTyping}
                  className="px-3 py-1.5 rounded-[6px] text-[12.5px] font-medium transition-all hover:opacity-80 disabled:opacity-40"
                  style={{
                    background: 'rgba(139,71,243,0.06)',
                    color: '#c0bcdc',
                    border: '1px solid rgba(139,71,243,0.1)',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Coaching quote */}
          <HanaQuote
            text={`284 hours, ${user.name}. That's compounded skill — not just time served. Keep the streak. Close the gaps.`}
            subtitle="Aria · Learning Architect"
          />
        </div>
      </div>
    </div>
  );
}
