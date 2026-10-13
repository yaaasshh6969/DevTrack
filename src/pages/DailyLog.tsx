import { useState } from 'react';
import { useDailyLogs, DailyLogEntry } from '../hooks/useDailyLogs';
import { useRoadmap } from '../hooks/useRoadmap';
import { useAuth } from '../context/AuthContext';
import { FlameIcon, ClockIcon, CheckCircleIcon, ChevronDownIcon, TrashIcon } from '../components/ui/icons';

const DEFAULT_MODULES = [
  { name: 'HTML & CSS', color: '#f97316' },
  { name: 'JavaScript', color: '#eab308' },
  { name: 'React', color: '#06b6d4' },
  { name: 'Node.js', color: '#22c55e' },
  { name: 'Express.js', color: '#8b5cf6' },
  { name: 'MongoDB', color: '#10b981' },
];

const MOOD_LABELS = ['', 'Tough', 'Meh', 'OK', 'Good', 'Amazing'];
const MOOD_COLORS = ['', '#f87171', '#fbbf24', '#a3e635', '#4dd0a1', '#8b47f3'];

function MoodPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((v) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          className="flex-1 py-2 rounded-[8px] text-[12px] font-medium transition-all cursor-pointer"
          style={{
            background: value === v ? `${MOOD_COLORS[v]}18` : 'rgba(255,255,255,0.03)',
            color: value === v ? MOOD_COLORS[v] : '#60608a',
            border: `1px solid ${value === v ? `${MOOD_COLORS[v]}35` : 'rgba(255,255,255,0.05)'}`,
          }}
        >
          {MOOD_LABELS[v]}
        </button>
      ))}
    </div>
  );
}

interface LogCardProps {
  entry: DailyLogEntry;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (id: string, updated: Partial<DailyLogEntry>) => Promise<void>;
}

function LogEntryCard({ entry, onDelete, onUpdate }: LogCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTopic, setEditTopic] = useState(entry.topic);
  const [editHours, setEditHours] = useState(entry.hours);
  const [editNotes, setEditNotes] = useState(entry.notes || '');
  const [editMood, setEditMood] = useState(entry.mood);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const moodColor = MOOD_COLORS[entry.mood] || '#6868a8';

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onUpdate(entry._id, {
      topic: editTopic,
      hours: editHours,
      notes: editNotes,
      mood: editMood,
    });
    setSaving(false);
    setIsEditing(false);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Delete log "${entry.topic}"?`)) return;
    setDeleting(true);
    await onDelete(entry._id);
  };

  return (
    <div
      className="rounded-[10px] transition-all"
      style={{
        background: '#0b0b20',
        border: '1px solid rgba(100,70,200,0.08)',
        opacity: deleting ? 0.4 : 1,
      }}
    >
      <div className="w-full text-left px-4 py-3.5 flex items-center gap-3">
        {/* Module color bar */}
        <div
          className="w-0.5 self-stretch min-h-[36px] rounded-full shrink-0"
          style={{ background: entry.moduleColor || '#8b47f3' }}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3">
            <span
              onClick={() => setExpanded((e) => !e)}
              className="text-[13.5px] font-medium truncate cursor-pointer hover:underline"
              style={{ color: '#f0ecff' }}
            >
              {entry.topic}
            </span>
            <div className="flex items-center gap-2.5 shrink-0">
              <span className="text-[12px] font-semibold font-mono" style={{ color: '#8b47f3' }}>
                {entry.hours}h
              </span>
              {/* Mood dot */}
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: moodColor }}
                title={MOOD_LABELS[entry.mood]}
              />
              <button
                onClick={() => {
                  setIsEditing(!isEditing);
                  setExpanded(true);
                }}
                className="text-[11px] font-medium px-2 py-0.5 rounded cursor-pointer transition-colors"
                style={{ background: 'rgba(139,71,243,0.1)', color: '#8b47f3' }}
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="text-[11px] p-1 rounded hover:bg-red-500/10 text-red-400 cursor-pointer transition-colors"
                title="Delete session"
              >
                <TrashIcon size={13} />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span
              className="text-[10.5px] font-medium px-1.5 py-0.5 rounded-[4px]"
              style={{ background: `${entry.moduleColor || '#8b47f3'}12`, color: entry.moduleColor || '#8b47f3' }}
            >
              {entry.module}
            </span>
            {entry.subtopic && (
              <span className="text-[11px] truncate" style={{ color: '#50508a' }}>
                {entry.subtopic}
              </span>
            )}
            <span className="text-[10.5px] ml-auto shrink-0" style={{ color: '#383868' }}>
              {new Date(entry.date).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 space-y-3" style={{ borderTop: '1px solid rgba(100,70,200,0.06)' }}>
          {isEditing ? (
            <form onSubmit={handleSaveEdit} className="space-y-3 pt-3">
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-widest mb-1" style={{ color: '#6868a8' }}>
                  Topic
                </label>
                <input
                  type="text"
                  value={editTopic}
                  onChange={(e) => setEditTopic(e.target.value)}
                  className="w-full px-3 py-2 rounded text-[13px]"
                  style={{ background: '#090918', border: '1px solid rgba(100,70,200,0.2)', color: '#f0ecff' }}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-widest mb-1" style={{ color: '#6868a8' }}>
                    Hours
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="24"
                    value={editHours}
                    onChange={(e) => setEditHours(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded text-[13px]"
                    style={{ background: '#090918', border: '1px solid rgba(100,70,200,0.2)', color: '#f0ecff' }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-widest mb-1" style={{ color: '#6868a8' }}>
                    Mood
                  </label>
                  <MoodPicker value={editMood} onChange={setEditMood} />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-widest mb-1" style={{ color: '#6868a8' }}>
                  Notes
                </label>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded text-[13px]"
                  style={{ background: '#090918', border: '1px solid rgba(100,70,200,0.2)', color: '#f0ecff' }}
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-3 py-1.5 rounded text-[12px] font-semibold cursor-pointer"
                  style={{ background: '#8b47f3', color: 'white' }}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 rounded text-[12px] font-medium cursor-pointer"
                  style={{ background: 'rgba(255,255,255,0.05)', color: '#6868a8' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              {entry.notes && (
                <p className="mt-3 text-[13px] leading-relaxed" style={{ color: '#b0b0d0' }}>
                  {entry.notes}
                </p>
              )}
              {entry.resources && entry.resources.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-medium uppercase tracking-wider" style={{ color: '#383868' }}>
                    Resources
                  </span>
                  {entry.resources.map((r) => (
                    <span
                      key={r}
                      className="text-[11.5px] px-2 py-0.5 rounded-[5px]"
                      style={{ background: 'rgba(255,255,255,0.04)', color: '#6868a8' }}
                    >
                      {r}
                    </span>
                  ))}
                </div>
              )}
              {entry.tags && entry.tags.length > 0 && (
                <div className="flex gap-1.5 flex-wrap">
                  {entry.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[11px] px-2 py-0.5 rounded-[4px]"
                      style={{ background: 'rgba(139,71,243,0.07)', color: '#8b47f3' }}
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DailyLog() {
  const { logs, loading, error, createLog, updateLog, deleteLog, refetch } = useDailyLogs();
  const { roadmap } = useRoadmap();
  const { user, refreshUser } = useAuth();

  const [topic, setTopic] = useState('');
  const [selectedModule, setSelectedModule] = useState('React');
  const [hours, setHours] = useState(1.5);
  const [showDetails, setShowDetails] = useState(false);
  const [subtopic, setSubtopic] = useState('');
  const [notes, setNotes] = useState('');
  const [resources, setResources] = useState('');
  const [mood, setMood] = useState(4);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const modules =
    roadmap?.modules && roadmap.modules.length > 0
      ? roadmap.modules.map((m) => ({ name: m.name, color: m.color, status: m.status }))
      : DEFAULT_MODULES;

  const currentModule = modules.find((m) => m.name === selectedModule) || modules[0];

  // Today's entries
  const todayKey = new Date().toISOString().split('T')[0];
  const todayEntries = logs.filter((e) => e.date.split('T')[0] === todayKey);
  const todayHours = todayEntries.reduce((s, e) => s + e.hours, 0);
  const todayGoal = user?.todayGoal || 3;
  const todayPct = Math.min(100, Math.round((todayHours / todayGoal) * 100));

  const streakDays = user?.streak ?? 0;
  const longestStreak = user?.longestStreak ?? 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const result = await createLog({
      topic: topic.trim(),
      module: selectedModule,
      moduleColor: currentModule?.color || '#8b47f3',
      hours,
      subtopic: subtopic.trim(),
      notes: notes.trim(),
      resources: resources.trim() ? resources.split(',').map((r) => r.trim()) : [],
      mood,
      date: new Date().toISOString(),
    });

    setIsSubmitting(false);

    if (result) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      setTopic('');
      setSubtopic('');
      setNotes('');
      setResources('');
      setMood(4);
      setShowDetails(false);
      await refreshUser();
    }
  };

  const handleUpdate = async (id: string, updated: Partial<DailyLogEntry>) => {
    await updateLog(id, updated);
    await refreshUser();
  };

  const handleDelete = async (id: string) => {
    await deleteLog(id);
    await refreshUser();
  };

  const inputBase = {
    background: '#090918',
    border: '1px solid rgba(100,70,200,0.1)',
    color: '#f0ecff',
    borderRadius: 8,
    fontSize: 13.5,
  };

  // Format today's date nicely
  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full">
      {/* ── Header with today's goal status ── */}
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
          <div>
            <h1 className="text-[22px] sm:text-[24px] font-semibold tracking-tight" style={{ color: '#f0ecff' }}>
              Daily Learning Log
            </h1>
            <p className="mt-1 text-[13.5px]" style={{ color: '#6868a8' }}>
              {todayFormatted}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[12.5px] font-medium"
              style={{
                background: 'rgba(77,208,161,0.08)',
                border: '1px solid rgba(77,208,161,0.15)',
                color: '#4dd0a1',
              }}
            >
              <FlameIcon size={13} />
              {streakDays}d streak
            </div>
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[12.5px] font-medium"
              style={{
                background: 'rgba(139,71,243,0.08)',
                border: '1px solid rgba(139,71,243,0.12)',
                color: '#8b47f3',
              }}
            >
              <ClockIcon size={13} />
              {todayHours.toFixed(1)}h today
            </div>
          </div>
        </div>

        {/* Today's goal progress bar — prominent hero element */}
        <div
          className="rounded-[10px] p-4"
          style={{ background: '#0b0b20', border: '1px solid rgba(100,70,200,0.09)' }}
        >
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-medium" style={{ color: '#f0ecff' }}>
                Today's goal
              </span>
              <span
                className="text-[11px] font-semibold px-1.5 py-0.5 rounded-full"
                style={{
                  background: todayPct >= 100 ? 'rgba(77,208,161,0.12)' : 'rgba(139,71,243,0.1)',
                  color: todayPct >= 100 ? '#4dd0a1' : '#8b47f3',
                }}
              >
                {todayPct >= 100 ? '✓ Complete' : `${todayPct}%`}
              </span>
            </div>
            <span className="text-[13px] font-mono" style={{ color: '#6868a8' }}>
              <span style={{ color: todayPct >= 100 ? '#4dd0a1' : '#f0ecff', fontWeight: 600 }}>
                {todayHours.toFixed(1)}h
              </span>{' '}
              / {todayGoal}h
            </span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${todayPct}%`,
                background:
                  todayPct >= 100
                    ? 'linear-gradient(90deg, #4dd0a1, #22d3ee)'
                    : 'linear-gradient(90deg, #6418c8, #8b47f3)',
              }}
            />
          </div>
          {todayPct < 100 && (
            <p className="mt-1.5 text-[11.5px]" style={{ color: '#50508a' }}>
              {Math.max(0, todayGoal - todayHours).toFixed(1)}h remaining to hit your daily goal
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">
        {/* ── Main: today's sessions + quick-log form ── */}
        <div className="space-y-5">
          {/* Today's sessions */}
          {todayEntries.length > 0 ? (
            <div>
              <p className="text-[11px] font-medium uppercase tracking-widest mb-2.5" style={{ color: '#383868' }}>
                Today's Sessions
              </p>
              <div className="space-y-2">
                {todayEntries.map((e) => (
                  <LogEntryCard key={e._id} entry={e} onDelete={handleDelete} onUpdate={handleUpdate} />
                ))}
              </div>
            </div>
          ) : (
            <div
              className="rounded-[10px] p-6 text-center"
              style={{ background: '#0b0b20', border: '1px dashed rgba(100,70,200,0.12)' }}
            >
              <p className="text-[13px]" style={{ color: '#50508a' }}>
                No sessions logged yet today.
              </p>
              <p className="text-[12px] mt-1" style={{ color: '#383868' }}>
                Log your first session below.
              </p>
            </div>
          )}

          {/* ── Quick-log form ── */}
          <div
            className="rounded-[10px] overflow-hidden"
            style={{ background: '#0b0b20', border: '1px solid rgba(100,70,200,0.09)' }}
          >
            <div className="px-5 pt-5 pb-4" style={{ borderBottom: '1px solid rgba(100,70,200,0.07)' }}>
              <div className="flex items-center justify-between">
                <h2 className="text-[14.5px] font-semibold" style={{ color: '#f0ecff' }}>
                  Log a Session
                </h2>
                {submitted && (
                  <div className="flex items-center gap-1.5 text-[12px] font-medium" style={{ color: '#4dd0a1' }}>
                    <CheckCircleIcon size={13} />
                    Logged to MongoDB!
                  </div>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {/* REQUIRED: Topic + Module */}
              <div>
                <label
                  className="block text-[11px] font-medium uppercase tracking-widest mb-2"
                  style={{ color: '#383868' }}
                >
                  What did you work on?
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. React Context API"
                  className="w-full px-3.5 py-3 transition-colors text-[14px]"
                  style={inputBase}
                  required
                  autoFocus
                />
              </div>

              {/* Module + Hours — side by side */}
              <div className="grid grid-cols-[1fr_auto] gap-3 items-end">
                <div>
                  <label
                    className="block text-[11px] font-medium uppercase tracking-widest mb-2"
                    style={{ color: '#383868' }}
                  >
                    Module
                  </label>
                  <div className="relative">
                    <select
                      value={selectedModule}
                      onChange={(e) => setSelectedModule(e.target.value)}
                      className="w-full px-3.5 py-3 appearance-none pr-8 transition-colors"
                      style={inputBase}
                    >
                      {modules.map((m) => (
                        <option key={m.name} value={m.name} style={{ background: '#090918' }}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                    {currentModule && (
                      <div
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full pointer-events-none"
                        style={{ background: currentModule.color }}
                      />
                    )}
                    <div
                      className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ color: '#50508a' }}
                    >
                      <ChevronDownIcon size={14} />
                    </div>
                  </div>
                </div>

                {/* Hours quick-pick */}
                <div>
                  <label
                    className="block text-[11px] font-medium uppercase tracking-widest mb-2"
                    style={{ color: '#383868' }}
                  >
                    Hours
                  </label>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setHours(Math.max(0.5, +(hours - 0.5).toFixed(1)))}
                      className="w-9 h-[46px] rounded-l-[8px] flex items-center justify-center text-lg font-medium transition-colors cursor-pointer"
                      style={{ background: '#090918', border: '1px solid rgba(100,70,200,0.1)', color: '#6868a8' }}
                    >
                      −
                    </button>
                    <div
                      className="w-14 h-[46px] flex items-center justify-center text-[15px] font-semibold font-mono"
                      style={{
                        background: '#090918',
                        borderTop: '1px solid rgba(100,70,200,0.1)',
                        borderBottom: '1px solid rgba(100,70,200,0.1)',
                        color: '#f0ecff',
                      }}
                    >
                      {hours}h
                    </div>
                    <button
                      type="button"
                      onClick={() => setHours(Math.min(12, +(hours + 0.5).toFixed(1)))}
                      className="w-9 h-[46px] rounded-r-[8px] flex items-center justify-center text-lg font-medium transition-colors cursor-pointer"
                      style={{ background: '#090918', border: '1px solid rgba(100,70,200,0.1)', color: '#6868a8' }}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick-pick hours */}
              <div className="flex gap-1.5">
                {[0.5, 1, 1.5, 2, 2.5, 3].map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setHours(h)}
                    className="flex-1 py-1.5 rounded-[6px] text-[11.5px] font-medium transition-all cursor-pointer"
                    style={{
                      background: hours === h ? 'rgba(139,71,243,0.14)' : 'rgba(255,255,255,0.03)',
                      color: hours === h ? '#8b47f3' : '#50508a',
                      border: `1px solid ${hours === h ? 'rgba(139,71,243,0.25)' : 'rgba(255,255,255,0.04)'}`,
                    }}
                  >
                    {h}h
                  </button>
                ))}
              </div>

              {/* Progressive disclosure — optional details */}
              <button
                type="button"
                onClick={() => setShowDetails((d) => !d)}
                className="flex items-center gap-1.5 text-[12px] font-medium transition-opacity hover:opacity-80 w-full cursor-pointer"
                style={{ color: '#50508a' }}
              >
                <span
                  className="inline-block transition-transform"
                  style={{ transform: showDetails ? 'rotate(180deg)' : 'none' }}
                >
                  <ChevronDownIcon size={13} />
                </span>
                {showDetails ? 'Hide details' : 'Add notes, subtopic & resources'}
              </button>

              {showDetails && (
                <div className="space-y-3 pt-1">
                  <div className="h-px" style={{ background: 'rgba(100,70,200,0.07)' }} />
                  <div>
                    <label
                      className="block text-[11px] font-medium uppercase tracking-widest mb-1.5"
                      style={{ color: '#383868' }}
                    >
                      Subtopic / Focus area
                    </label>
                    <input
                      type="text"
                      value={subtopic}
                      onChange={(e) => setSubtopic(e.target.value)}
                      placeholder="e.g. useContext hook & Provider pattern"
                      className="w-full px-3.5 py-2.5 transition-colors"
                      style={inputBase}
                    />
                  </div>

                  <div>
                    <label
                      className="block text-[11px] font-medium uppercase tracking-widest mb-1.5"
                      style={{ color: '#383868' }}
                    >
                      Notes & Reflections
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="What clicked? What to revisit? Key takeaways..."
                      rows={3}
                      className="w-full px-3.5 py-2.5 resize-none transition-colors leading-relaxed"
                      style={inputBase}
                    />
                  </div>

                  <div>
                    <label
                      className="block text-[11px] font-medium uppercase tracking-widest mb-1.5"
                      style={{ color: '#383868' }}
                    >
                      Resources used
                    </label>
                    <input
                      type="text"
                      value={resources}
                      onChange={(e) => setResources(e.target.value)}
                      placeholder="React Docs, YouTube, blog post..."
                      className="w-full px-3.5 py-2.5 transition-colors"
                      style={inputBase}
                    />
                  </div>

                  <div>
                    <label
                      className="block text-[11px] font-medium uppercase tracking-widest mb-2"
                      style={{ color: '#383868' }}
                    >
                      Session mood
                    </label>
                    <MoodPicker value={mood} onChange={setMood} />
                  </div>
                </div>
              )}

              {/* Submit */}
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-[8px] text-[13.5px] font-semibold transition-opacity hover:opacity-90 flex-1 sm:flex-none justify-center cursor-pointer"
                  style={{ background: '#8b47f3', color: 'white' }}
                >
                  {isSubmitting ? 'Logging...' : 'Log Session'}
                </button>
                <p className="text-[12px]" style={{ color: '#383868' }}>
                  +{hours}h toward today's {todayGoal}h goal
                </p>
              </div>
            </form>
          </div>

          {/* Past entries */}
          {logs.filter((e) => e.date.split('T')[0] !== todayKey).length > 0 ? (
            <div>
              <p className="text-[11px] font-medium uppercase tracking-widest mb-2.5" style={{ color: '#383868' }}>
                Previous Entries ({logs.filter((e) => e.date.split('T')[0] !== todayKey).length})
              </p>
              <div className="space-y-2">
                {logs
                  .filter((e) => e.date.split('T')[0] !== todayKey)
                  .map((entry) => (
                    <LogEntryCard
                      key={entry._id}
                      entry={entry}
                      onDelete={handleDelete}
                      onUpdate={handleUpdate}
                    />
                  ))}
              </div>
            </div>
          ) : (
            !loading &&
            todayEntries.length === 0 && (
              <div
                className="rounded-[10px] p-6 text-center"
                style={{ background: '#0b0b20', border: '1px solid rgba(100,70,200,0.06)' }}
              >
                <p className="text-[13px]" style={{ color: '#50508a' }}>
                  No learning logs recorded yet.
                </p>
                <p className="text-[12px] mt-1" style={{ color: '#383868' }}>
                  Log your daily study session above to begin your journey!
                </p>
              </div>
            )
          )}
        </div>

        {/* ── Right sidebar ── */}
        <div className="space-y-4">
          {/* Streak */}
          <div
            className="rounded-[10px] p-5"
            style={{ background: '#0b0b20', border: '1px solid rgba(100,70,200,0.09)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12.5px] font-semibold" style={{ color: '#f0ecff' }}>
                Current Streak
              </span>
              <FlameIcon size={15} className="text-success" />
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-[36px] font-bold font-mono leading-none" style={{ color: '#4dd0a1' }}>
                {streakDays}
              </span>
              <span className="text-[14px]" style={{ color: '#50508a' }}>
                days
              </span>
            </div>
            <p className="text-[11.5px] mb-4" style={{ color: '#383868' }}>
              Longest: <span style={{ color: '#6868a8' }}>{longestStreak} days</span>
            </p>
            {/* This week's days */}
            <div className="flex gap-1">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
                const isToday = (new Date().getDay() + 6) % 7 === i;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                    <div
                      className="w-full aspect-square rounded-[5px]"
                      style={{
                        background: isToday
                          ? 'rgba(139,71,243,0.18)'
                          : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${isToday ? 'rgba(139,71,243,0.3)' : 'rgba(255,255,255,0.04)'}`,
                      }}
                    >
                      {isToday && (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#8b47f3' }} />
                        </div>
                      )}
                    </div>
                    <span className="text-[9.5px]" style={{ color: isToday ? '#8b47f3' : '#383868' }}>
                      {day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* This month stats */}
          <div
            className="rounded-[10px] p-5"
            style={{ background: '#0b0b20', border: '1px solid rgba(100,70,200,0.09)' }}
          >
            <p className="text-[12.5px] font-semibold mb-3" style={{ color: '#f0ecff' }}>
              Summary
            </p>
            <div className="space-y-2.5">
              {[
                { label: 'Total Sessions', value: logs.length.toString() },
                {
                  label: 'Total hours',
                  value: `${logs.reduce((s, l) => s + l.hours, 0).toFixed(1)}h`,
                },
                {
                  label: 'Avg / session',
                  value: logs.length > 0 ? `${(logs.reduce((s, l) => s + l.hours, 0) / logs.length).toFixed(1)}h` : '0h',
                },
                {
                  label: 'Modules touched',
                  value: new Set(logs.map((l) => l.module)).size.toString(),
                },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between">
                  <span className="text-[12px]" style={{ color: '#6868a8' }}>
                    {s.label}
                  </span>
                  <span className="text-[12.5px] font-semibold font-mono" style={{ color: '#f0ecff' }}>
                    {s.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Current module mini-progress */}
          {currentModule && (
            <div
              className="rounded-[10px] p-5"
              style={{ background: '#0b0b20', border: '1px solid rgba(139,71,243,0.1)' }}
            >
              <p className="text-[11px] font-medium uppercase tracking-widest mb-3" style={{ color: '#383868' }}>
                Active Module
              </p>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full" style={{ background: currentModule.color }} />
                <span className="text-[13px] font-semibold" style={{ color: '#f0ecff' }}>
                  {currentModule.name}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
