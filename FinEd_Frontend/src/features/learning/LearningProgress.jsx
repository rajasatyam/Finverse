import React from 'react';
import { CheckCircle2, Award, Sparkles } from 'lucide-react';

/**
 * Reusable Learning Progress component inspired by the YouTube Learning UI
 */
const LearningProgress = ({
  completedCount = 0,
  totalCount = 0,
  variant = "full", // "full" | "compact" | "minimal"
  className = ""
}) => {
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const isAllComplete = totalCount > 0 && completedCount === totalCount;

  if (variant === "minimal") {
    return (
      <div className={`w-full ${className}`}>
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-gold to-yellow-400 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className="flex-1">
          <div className="flex justify-between items-center text-[11px] mb-1.5 font-mono">
            <span className="text-gray-400 uppercase tracking-wider font-semibold">Course Progress</span>
            <span className="text-gold font-bold">{completedCount}/{totalCount} ({percentage}%)</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/5">
            <div
              className="h-full bg-gradient-to-r from-red-500 via-amber-500 to-gold transition-all duration-500 ease-out rounded-full"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white/[0.03] border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-md ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
        <div className="flex items-center gap-2">
          {isAllComplete ? (
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Award className="w-3.5 h-3.5" />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full bg-gold/15 text-gold flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          )}
          <span className="text-xs uppercase font-bold tracking-widest text-gray-400 font-mono">
            Course Progression
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-400">
            <strong className="text-white font-mono text-sm">{completedCount}</strong> of {totalCount} completed
          </span>
          <span className="px-2 py-0.5 rounded-full bg-gold/10 text-gold border border-gold/25 font-bold font-mono text-xs">
            {percentage}%
          </span>
        </div>
      </div>

      {/* Progress Bar with glow */}
      <div className="relative w-full h-2.5 bg-black/40 rounded-full overflow-hidden border border-white/10">
        <div
          className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-gold transition-all duration-700 ease-out rounded-full shadow-[0_0_12px_rgba(255,215,0,0.5)]"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {isAllComplete && (
        <div className="mt-3 flex items-center gap-2 text-emerald-400 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4" />
          <span>Congratulations! You have completed all lessons in this module.</span>
        </div>
      )}
    </div>
  );
};

export default LearningProgress;

