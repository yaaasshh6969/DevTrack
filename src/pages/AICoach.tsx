import { useState } from 'react';
import {
  hanaMessages,
  hanaQuickSuggestions,
} from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { useGamification } from '../hooks/useGamification';
import { useRoadmap } from '../hooks/useRoadmap';
import { useDailyLogs } from '../hooks/useDailyLogs';
import { aiApi } from '../services/api';
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
  const { user: authUser } = useAuth();
  const { data: game, goals } = useGamification();
  const { roadmap } = useRoadmap();
  const { logs } = useDailyLogs();

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputText, setInputText] = useState('');
  const [hanaTyping, setHanaTyping] = useState(false);
  const [selectedMood, setSelectedMood] = useState<'happy' | 'thinking' | 'excited'>('happy');
  const [chatError, setChatError] = useState<string | null>(null);

  const streak = authUser?.streak ?? 0;
  const sessionsCount = logs.length;
  const currentLevel = game?.level ?? (typeof authUser?.level === 'number' ? authUser.level : 1);
  const levelName = game?.levelName ?? 'Code Initiate';
  const xp = game?.xp ?? (authUser?.xp ?? 0);
  const xpToNext = game?.xpToNext ?? 500;
  const xpPerLevel = game?.xpPerLevel ?? 500;
  const xpInLevel = game?.xpInLevel ?? (xp % xpPerLevel);
  const xpPct = Math.min(100, Math.round((xpInLevel / xpPerLevel) * 100));

  const activeModule =
    roadmap?.modules?.find((m) => m.status === 'in-progress')?.name ||
    authUser?.currentModule ||
    'HTML & CSS';

  const weeklyTarget = `${goals.weeklyGoal || authUser?.weeklyGoal || 15}.0 hours`;

  const dynamicInsights = [
    {
      label: 'Current focus',
      value: activeModule,
      note: 'Active roadmap module',
      color: '#06b6d4',
      emoji: '🌐',
    },
    {
      label: 'Weekly target',
      value: weeklyTarget,
      note: `${(goals.todayGoal || authUser?.todayGoal || 3).toFixed(1)}h / day target`,
      color: '#a855f7',
      emoji: '🎯',
    },
    {
      label: 'Level goal',
      value: `Level ${currentLevel + 1}`,
      note: `${xpToNext} XP to level up`,
      color: '#ffb800',
      emoji: '✨',
    },
  ];

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || hanaTyping) return;

    setChatError(null);

    const userMsg: Message = {
      id: Date.now(),
      from: 'user',
      text: trimmed,
      time: 'Now',
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInputText('');
    setHanaTyping(true);
    setSelectedMood('thinking');

    // Convert past messages to history format
    const history = messages.map((m) => ({
      role: m.from === 'hana' ? ('assistant' as const) : ('user' as const),
      content: m.text,
    }));

    try {
      const res = await aiApi.chat(trimmed, history);

      if (res.success && res.data?.message) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            from: 'hana',
            text: res.data!.message,
            time: 'Just now',
          },
        ]);
        setSelectedMood('happy');
      } else {
        const errorMsg = res.error?.message || 'Failed to get response';
        const isNotConfigured = errorMsg.toLowerCase().includes('not configured');

        const fallbackReply = isNotConfigured
          ? "I'm ready to coach you, but my AI API is not configured yet! Please add `AI_API_KEY` in `backend/.env` to unlock live dynamic coaching with full access to your roadmap and logs."
          : `I ran into a temporary issue connecting to the AI service (${errorMsg}). Please verify backend server and API key.`;

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            from: 'hana',
            text: fallbackReply,
            time: 'Just now',
          },
        ]);
        if (!isNotConfigured) {
          setChatError(errorMsg);
        }
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          from: 'hana',
          text: 'Network error communicating with the backend. Please check your connection.',
          time: 'Just now',
        },
      ]);
      setChatError(err.message || 'Network error');
    } finally {
      setHanaTyping(false);
    }
  }

  const quoteText = `${(authUser?.totalHours ?? 0).toFixed(1)} hours logged, ${
    authUser?.name ? authUser.name.split(' ')[0] : 'Developer'
  }. That's compounded skill — not just time served. Keep the streak. Close the gaps.`;

  return (
    <div className="p-6 lg:p-8 w-full space-y-6">
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

      {chatError && (
        <div
          className="p-3.5 rounded-[8px] text-[13px] flex items-center justify-between"
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171' }}
        >
          <span>Notice: {chatError}</span>
          <button
            onClick={() => setChatError(null)}
            className="text-[12px] underline hover:text-white cursor-pointer ml-2"
          >
            Dismiss
          </button>
        </div>
      )}

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
                  <span className="text-[10px]" style={{ color: '#38386a' }}>Live</span>
                </div>
              </div>

              <div
                className="mt-3 pt-3 flex gap-4"
                style={{ borderTop: '1px solid rgba(100,70,200,0.07)' }}
              >
                {[
                  { label: 'Your Streak', value: `${streak}d` },
                  { label: 'Sessions', value: `${sessionsCount}` },
                  { label: 'Level', value: `${currentLevel}` },
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
                    LVL {currentLevel}
                  </span>
                  <span className="text-[12px] font-semibold" style={{ color: '#f0ecff' }}>
                    {levelName}
                  </span>
                </div>
                <p className="text-[11px] mt-0.5" style={{ color: '#38386a' }}>
                  {xpInLevel} / {xpPerLevel} XP in level
                </p>
              </div>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div className="h-full rounded-full xp-bar-fill" style={{ width: `${xpPct}%` }} />
            </div>
            <p className="mt-1.5 text-[11px]" style={{ color: '#38386a' }}>
              {xpToNext} XP to Level {currentLevel + 1}
            </p>
          </div>

          {/* Weekly insights */}
          <div className="card p-4 space-y-3">
            <h3 className="text-[13px] font-semibold" style={{ color: '#f0ecff' }}>
              This Week's Snapshot
            </h3>
            {dynamicInsights.map((insight) => (
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
                    {hanaTyping ? 'Thinking & analyzing...' : 'Online & ready'}
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
                      className={`px-4 py-3 text-[13px] leading-relaxed whitespace-pre-wrap ${
                        msg.from === 'hana' ? 'chat-bubble-hana' : 'chat-bubble-user'
                      }`}
                    >
                      <p style={{ color: msg.from === 'hana' ? '#4a154b' : '#0f172a' }}>{msg.text}</p>
                    </div>
                    <span className="text-[10px]" style={{ color: '#64748b' }}>
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
                  onKeyDown={(e) => e.key === 'Enter' && !hanaTyping && sendMessage(inputText)}
                  disabled={hanaTyping}
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
                  className="px-4 py-2.5 rounded-[8px] text-[13px] font-semibold transition-opacity hover:opacity-90 disabled:opacity-40 cursor-pointer"
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
                  className="px-3 py-1.5 rounded-[6px] text-[12.5px] font-medium transition-all hover:opacity-80 disabled:opacity-40 cursor-pointer"
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
            text={quoteText}
            subtitle="Aria · Learning Architect"
          />
        </div>
      </div>
    </div>
  );
}
