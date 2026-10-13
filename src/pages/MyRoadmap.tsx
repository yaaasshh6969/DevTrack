import { useState } from 'react';
import { useRoadmap, RoadmapModule } from '../hooks/useRoadmap';
import { useAuth } from '../context/AuthContext';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  LockIcon,
} from '../components/ui/icons';

// ── Status badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status, isCurrent }: { status: 'complete' | 'in-progress' | 'locked'; isCurrent?: boolean }) {
  if (status === 'complete') {
    return (
      <span
        className="inline-flex items-center gap-1 text-[10.5px] font-semibold px-2 py-0.5 rounded-full"
        style={{ background: 'rgba(77,208,161,0.1)', color: '#4dd0a1', border: '1px solid rgba(77,208,161,0.18)' }}
      >
        <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
          <path d="M2 5l2.5 2.5L8 3" stroke="#4dd0a1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Complete
      </span>
    );
  }
  if (status === 'locked') {
    return (
      <span
        className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full"
        style={{ background: 'rgba(255,255,255,0.04)', color: '#383868', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        Locked
      </span>
    );
  }
  if (isCurrent) {
    return (
      <span
        className="text-[10.5px] font-bold px-2 py-0.5 rounded-full"
        style={{ background: 'rgba(139,71,243,0.14)', color: '#8b47f3', border: '1px solid rgba(139,71,243,0.22)' }}
      >
        You Are Here
      </span>
    );
  }
  return (
    <span
      className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full"
      style={{ background: 'rgba(139,71,243,0.08)', color: '#6b6baa', border: '1px solid rgba(139,71,243,0.12)' }}
    >
      In Progress
    </span>
  );
}

// ── Roadmap card ──────────────────────────────────────────────────────────────

interface RoadmapCardProps {
  item: RoadmapModule;
  index: number;
  isCurrent: boolean;
  unlockAfter?: string;
  onToggleTopic: (topicId: string, currentComplete: boolean) => void;
}

function RoadmapCard({ item, index, isCurrent, unlockAfter, onToggleTopic }: RoadmapCardProps) {
  const [expanded, setExpanded] = useState(isCurrent);
  const completedTopics = item.topics.filter((t) => t.complete).length;
  const isLocked = item.status === 'locked';
  const isDone = item.status === 'complete';

  const cardBorder = isCurrent
    ? 'rgba(139,71,243,0.24)'
    : isDone
    ? 'rgba(77,208,161,0.1)'
    : isLocked
    ? 'rgba(100,70,200,0.05)'
    : 'rgba(100,70,200,0.08)';

  return (
    <div
      className="rounded-[10px] overflow-hidden transition-all relative"
      style={{
        background: isDone ? 'rgba(11,11,32,0.7)' : '#0b0b20',
        border: `1px solid ${cardBorder}`,
        opacity: isLocked ? 0.42 : 1,
        boxShadow: isCurrent ? '0 0 0 1px rgba(139,71,243,0.06), 0 6px 28px rgba(139,71,243,0.05)' : 'none',
      }}
    >
      {/* Left accent strip for current */}
      {isCurrent && (
        <div
          className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-[10px]"
          style={{ background: 'linear-gradient(180deg, #8b47f3 0%, #cc1144 100%)' }}
        />
      )}

      <button
        className="w-full text-left relative cursor-pointer"
        onClick={() => !isLocked && setExpanded((e) => !e)}
        disabled={isLocked}
      >
        <div className="flex items-start gap-4 p-5 pb-4">
          {/* Stage number / icon */}
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-[13px] font-bold shrink-0 mt-0.5"
            style={{
              background: isLocked ? 'rgba(255,255,255,0.03)' : isDone ? 'rgba(77,208,161,0.1)' : `${item.color}16`,
              color: isLocked ? '#383868' : isDone ? '#4dd0a1' : item.color,
              border: `1px solid ${isLocked ? 'rgba(255,255,255,0.05)' : isDone ? 'rgba(77,208,161,0.2)' : `${item.color}28`}`,
              boxShadow: isCurrent ? `0 0 10px ${item.color}22` : 'none',
            }}
          >
            {isLocked ? <LockIcon size={14} /> : index + 1}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-[14.5px] font-semibold" style={{ color: isDone ? '#6868a8' : '#f0ecff' }}>
                {item.name}
              </h3>
              <StatusBadge status={item.status} isCurrent={isCurrent} />
            </div>
            <p className="mt-1 text-[12px] leading-snug" style={{ color: isDone ? '#383868' : '#50508a' }}>
              {isLocked && unlockAfter ? `Unlocks after completing ${unlockAfter}` : item.description}
            </p>
          </div>

          {/* Right: hours + chevron */}
          <div className="flex items-center gap-3 shrink-0">
            {!isLocked && (
              <div className="text-right hidden sm:block">
                <p className="text-[13px] font-semibold font-mono" style={{ color: isDone ? '#4dd0a1' : '#f0ecff' }}>
                  {item.hoursSpent}h
                </p>
                <p className="text-[10.5px]" style={{ color: '#383868' }}>
                  / {item.estimatedHours}h
                </p>
              </div>
            )}
            {isLocked && (
              <p className="text-[12px] font-mono" style={{ color: '#383868' }}>
                {item.estimatedHours}h est.
              </p>
            )}
            {!isLocked && (
              <div style={{ color: '#50508a' }}>
                {expanded ? <ChevronDownIcon size={16} /> : <ChevronRightIcon size={16} />}
              </div>
            )}
          </div>
        </div>

        {/* Progress bar */}
        {!isLocked && (
          <div className="px-5 pb-5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10.5px]" style={{ color: '#383868' }}>
                {completedTopics} / {item.topics.length} topics
              </span>
              <span className="text-[10.5px] font-semibold font-mono" style={{ color: isDone ? '#4dd0a1' : item.color }}>
                {item.progress}%
              </span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${item.progress}%`, background: isDone ? '#4dd0a1' : item.color }}
              />
            </div>
          </div>
        )}
      </button>

      {/* Expanded topics */}
      {expanded && !isLocked && (
        <div className="px-5 pb-5" style={{ borderTop: '1px solid rgba(100,70,200,0.07)' }}>
          {item.currentFocus && (
            <div
              className="mt-4 mb-4 flex items-center gap-2 px-3 py-2 rounded-[7px]"
              style={{ background: 'rgba(139,71,243,0.06)', border: '1px solid rgba(139,71,243,0.12)' }}
            >
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#8b47f3' }} />
              <span className="text-[11.5px] font-medium" style={{ color: '#6868a8' }}>
                Current focus:
              </span>
              <span className="text-[11.5px] font-semibold" style={{ color: '#8b47f3' }}>
                {item.currentFocus}
              </span>
            </div>
          )}

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-0.5">
            {item.topics.map((topic, ti) => (
              <button
                key={topic._id || ti}
                type="button"
                onClick={() => onToggleTopic(topic._id, topic.complete)}
                className="flex items-center gap-2.5 py-2 w-full text-left cursor-pointer group hover:bg-white/[0.02] rounded px-1 -mx-1 transition-colors"
                style={{ borderBottom: ti < item.topics.length - 1 ? '1px solid rgba(100,70,200,0.05)' : 'none' }}
              >
                <div
                  className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                  style={{
                    background: topic.complete ? 'rgba(77,208,161,0.12)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${topic.complete ? 'rgba(77,208,161,0.28)' : 'rgba(255,255,255,0.07)'}`,
                  }}
                >
                  {topic.complete && (
                    <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                      <path
                        d="M2 5l2.5 2.5L8 3"
                        stroke="#4dd0a1"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <span
                  className="text-[12.5px] flex-1 group-hover:text-white transition-colors"
                  style={{
                    color: topic.complete ? '#50508a' : '#f0ecff',
                    textDecoration: topic.complete ? 'line-through' : 'none',
                  }}
                >
                  {topic.name}
                </span>
                {topic.hours && (
                  <span className="text-[10.5px] font-mono shrink-0" style={{ color: '#383868' }}>
                    {topic.hours}h
                  </span>
                )}
              </button>
            ))}
          </div>

          {item.resources && item.resources.length > 0 && (
            <div className="mt-4 pt-3" style={{ borderTop: '1px solid rgba(100,70,200,0.05)' }}>
              <p className="text-[10px] font-medium uppercase tracking-widest mb-2" style={{ color: '#383868' }}>
                Resources
              </p>
              <div className="flex flex-wrap gap-1.5">
                {item.resources.map((r) => (
                  <span
                    key={r}
                    className="text-[11.5px] px-2.5 py-1 rounded-[5px]"
                    style={{ background: 'rgba(255,255,255,0.04)', color: '#6868a8' }}
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-3 flex gap-6 text-[11px]" style={{ color: '#383868' }}>
            {item.startDate && (
              <span>
                Started:{' '}
                <span style={{ color: '#6868a8' }}>
                  {new Date(item.startDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </span>
            )}
            {item.completedDate && (
              <span>
                Completed:{' '}
                <span style={{ color: '#4dd0a1' }}>
                  {new Date(item.completedDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function MyRoadmap() {
  const { roadmap, loading, error, toggleTopic, refetch } = useRoadmap();
  const { user, refreshUser } = useAuth();

  const handleToggle = async (topicId: string, currentComplete: boolean) => {
    await toggleTopic(topicId, currentComplete);
    await refreshUser();
  };

  const modules = roadmap?.modules || [];
  const totalHoursSpent = modules.reduce((s, i) => s + (i.hoursSpent || 0), 0);
  const totalEstimated = modules.reduce((s, i) => s + (i.estimatedHours || 0), 0);
  const completedCount = modules.filter((i) => i.status === 'complete').length;
  const overallProgress = roadmap?.totalProgress ?? user?.roadmapCompletion ?? 0;

  // "You Are Here" = stage matching user.currentModule or first in-progress
  const currentItem =
    modules.find((i) => user?.currentModule && i.name.toLowerCase().includes(user.currentModule.toLowerCase()) && i.status === 'in-progress') ||
    modules.find((i) => i.status === 'in-progress');

  // Locked stage prerequisite labels
  const unlockMap: Record<string, string> = {
    expressjs: 'Node.js',
    mongodb: 'Express.js',
  };

  if (loading && !roadmap) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 w-full space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded-[8px]" style={{ background: '#0b0b20' }} />
          <div className="h-4 w-72 rounded-[6px]" style={{ background: '#0b0b20' }} />
          <div className="h-28 rounded-[12px]" style={{ background: '#0b0b20' }} />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 rounded-[10px]" style={{ background: '#0b0b20' }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error && !roadmap) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 w-full">
        <div className="card p-6 text-center max-w-md mx-auto space-y-3">
          <p className="text-[14px] font-semibold" style={{ color: '#f87171' }}>
            {error}
          </p>
          <button
            onClick={refetch}
            className="px-4 py-2 rounded-[8px] text-[13px] font-semibold transition-opacity hover:opacity-90"
            style={{ background: '#8b47f3', color: 'white' }}
          >
            Retry Loading Roadmap
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[22px] sm:text-[24px] font-semibold tracking-tight" style={{ color: '#f0ecff' }}>
          {roadmap?.title || 'My Roadmap'}
        </h1>
        <p className="mt-1 text-[13.5px]" style={{ color: '#6868a8' }}>
          {roadmap?.description || 'Full-stack developer path · HTML → JavaScript → React → Node.js → Express → MongoDB'}
        </p>
      </div>

      {/* "You Are Here" hero */}
      {currentItem && (
        <div
          className="rounded-[12px] p-5 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(139,71,243,0.07) 0%, rgba(100,70,200,0.03) 100%)',
            border: '1px solid rgba(139,71,243,0.18)',
          }}
        >
          <div className="flex items-start gap-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-[14px] font-bold shrink-0"
              style={{
                background: `${currentItem.color}18`,
                color: currentItem.color,
                border: `1px solid ${currentItem.color}30`,
              }}
            >
              {modules.findIndex((i) => i._id === currentItem._id) + 1}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <span
                  className="text-[9.5px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(139,71,243,0.12)', color: '#8b47f3' }}
                >
                  Current Stage
                </span>
              </div>
              <h2 className="text-[15px] font-semibold" style={{ color: '#f0ecff' }}>
                {currentItem.name}
              </h2>
              {currentItem.currentFocus && (
                <p className="text-[12px] mt-0.5" style={{ color: '#6868a8' }}>
                  Focus: {currentItem.currentFocus}
                </p>
              )}
            </div>
            <div className="text-right shrink-0">
              <p className="text-[22px] font-semibold font-mono" style={{ color: currentItem.color }}>
                {currentItem.progress}%
              </p>
              <p className="text-[11px]" style={{ color: '#383868' }}>
                {currentItem.hoursSpent}h / {currentItem.estimatedHours}h est.
              </p>
            </div>
          </div>
          <div className="mt-3 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${currentItem.progress}%`,
                background: `linear-gradient(90deg, ${currentItem.color}88, ${currentItem.color})`,
              }}
            />
          </div>
        </div>
      )}

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Overall', value: `${overallProgress}%`, accent: '#8b47f3' },
          { label: 'Stages done', value: `${completedCount} / ${modules.length}`, accent: '#4dd0a1' },
          { label: 'Hours logged', value: `${totalHoursSpent}h`, accent: '#22d3ee' },
          { label: 'Est. remaining', value: `~${Math.max(0, totalEstimated - totalHoursSpent)}h`, accent: '#fbbf24' },
        ].map((s) => (
          <div key={s.label} className="card p-4">
            <p className="text-[10.5px] font-medium uppercase tracking-widest" style={{ color: '#383868' }}>
              {s.label}
            </p>
            <p className="mt-2 text-[20px] font-semibold font-mono" style={{ color: s.accent }}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Path progress strip */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[13px] font-medium" style={{ color: '#f0ecff' }}>
            Full-Stack Path
          </span>
          <span className="text-[13px] font-semibold font-mono" style={{ color: '#8b47f3' }}>
            {overallProgress}%
          </span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${overallProgress}%`,
              background: 'linear-gradient(90deg, #4dd0a1 0%, #8b47f3 55%, #22d3ee 100%)',
            }}
          />
        </div>
        <div className="flex justify-between mt-2.5">
          {modules.map((item) => {
            const isCur = currentItem?._id === item._id;
            return (
              <div key={item._id} className="flex flex-col items-center gap-1">
                <div
                  className="w-2 h-2 rounded-full transition-all"
                  style={{
                    background:
                      item.status === 'complete' ? '#4dd0a1' : item.status === 'in-progress' ? item.color : '#252548',
                    boxShadow: isCur ? `0 0 6px ${item.color}60` : 'none',
                  }}
                />
                <span className="hidden sm:block text-[9px]" style={{ color: isCur ? item.color : '#383868' }}>
                  {item.name.split(' ')[0]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stage cards */}
      <div className="space-y-3 relative">
        {modules.map((item, index) => (
          <RoadmapCard
            key={item._id}
            item={item}
            index={index}
            isCurrent={currentItem?._id === item._id}
            unlockAfter={unlockMap[item.slug]}
            onToggleTopic={handleToggle}
          />
        ))}
      </div>

      {/* Coaching note */}
      <div
        className="p-4 rounded-[10px] text-[12.5px]"
        style={{ background: 'rgba(139,71,243,0.05)', border: '1px solid rgba(139,71,243,0.1)', color: '#6868a8' }}
      >
        <span style={{ color: '#8b47f3', fontWeight: 600 }}>Tip:</span> Click on any topic to mark it complete or
        incomplete. Your roadmap progress will update immediately and sync to your account!
      </div>
    </div>
  );
}
