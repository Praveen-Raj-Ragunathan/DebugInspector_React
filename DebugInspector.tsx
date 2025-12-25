
import React, { useState, useEffect, useRef } from 'react';

/**
 * GENERIC DEBUG INSPECTOR v5.0 (Heuristic Discovery Edition)
 * Polished to match the finalized UI attachment.
 */

export const DebugInspector = () => {
  const [target, setTarget] = useState<any>(null);
  const [isEnabled, setIsEnabled] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const startTime = useRef(performance.now());

  const getFiber = (el: HTMLElement): any => {
    const key = Object.keys(el).find(k => k.startsWith('__reactFiber$') || k.startsWith('__reactInternalInstance$'));
    return key ? (el as any)[key] : null;
  };

  const inspectComponent = (fiber: any) => {
    let curr = fiber;
    const path: string[] = [];
    let found = null;

    while (curr) {
      const type = curr.type;
      const rawName = type?.displayName || type?.name || curr.elementType?.name || curr.elementType?.displayName;
      
      const isFunction = typeof type === 'function';
      const isClass = typeof type === 'object' && type !== null && type.prototype?.isReactComponent;
      const isNotInternal = rawName && !['Provider', 'Consumer', 'Context', 'Route', 'BrowserRouter', 'Link', 'Switch', 'Layout', 'StaticContainer'].some(n => rawName.includes(n));

      if ((isFunction || isClass) && isNotInternal) {
        if (!found) {
          const debugSource = curr._debugSource || type?.__source || type?._debugSource;
          const fileName = debugSource?.fileName || type?.__file;
          const lineNumber = debugSource?.lineNumber || 'VAR';

          const inferredFile = fileName 
            ? fileName.split('/').pop() 
            : `${rawName.toUpperCase()}.TSX`;

          found = {
            name: rawName,
            props: curr.memoizedProps || {},
            source: type.toString()
              .split('\n')
              .slice(0, 10)
              .join('\n')
              .replace(/^[ ]{4}/gm, '') + '\n  // ... (implementation continues)',
            file: inferredFile,
            line: lineNumber,
            isGuessed: !fileName
          };
        }
        path.unshift(rawName);
      }
      curr = curr.return;
    }

    return { found, cleanPath: path };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isEnabled || isLocked) return;
      const el = e.target as HTMLElement;
      if (!el) return;
      const fiber = getFiber(el);
      if (fiber) {
        const { found } = inspectComponent(fiber);
        if (found) {
          const rect = el.getBoundingClientRect();
          setTarget({ ...found, rect, x: e.clientX, y: e.clientY, renderTime: (performance.now() - startTime.current).toFixed(2) });
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'D' || e.key === 'd')) {
        setIsEnabled(!isEnabled);
        setTarget(null);
      }
      if (e.key === ' ' && target) {
        e.preventDefault();
        setIsLocked(!isLocked);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isEnabled, isLocked, target]);

  if (!isEnabled) return null;
  if (!target) return (
    <div className="fixed bottom-6 right-6 z-[9999] pointer-events-none opacity-40 hover:opacity-100 transition-opacity">
      <div className="bg-slate-900/90 backdrop-blur-md text-white px-5 py-2.5 rounded-full border border-white/10 flex items-center space-x-3 text-[10px] font-black tracking-[0.2em] shadow-2xl">
         <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
         <span>DEBUG PROBE IDLE</span>
      </div>
    </div>
  );

  return (
    <>
      <div className={`fixed z-[9998] pointer-events-none transition-all duration-150 border-2 ${isLocked ? 'border-amber-500 shadow-[0_0_40px_rgba(245,158,11,0.25)]' : 'border-indigo-500/60 bg-indigo-500/5'}`}
        style={{ left: target.rect.left, top: target.rect.top, width: target.rect.width, height: target.rect.height }}>
        <div className="absolute -top-7 left-0 bg-slate-900 text-white text-[9px] font-black px-3 py-1.5 rounded-t-xl border-x border-t border-white/10 uppercase tracking-widest flex items-center space-x-2">
          <span className="text-indigo-400">#</span>
          <span>{target.name}</span> 
          <span className="text-slate-500 font-normal">{Math.round(target.rect.width)} × {Math.round(target.rect.height)}</span>
        </div>
      </div>

      <div className={`fixed z-[9999] pointer-events-auto bg-[#1a1c3d]/98 backdrop-blur-3xl text-white rounded-[2.5rem] border ${isLocked ? 'border-amber-500 shadow-3xl' : 'border-white/10 shadow-2xl'} flex flex-col w-[420px] overflow-hidden animate-in zoom-in-95 duration-200 font-sans`}
        style={{ left: Math.min(target.x + 24, window.innerWidth - 444), top: Math.min(target.y + 24, window.innerHeight - 620) }}>
        
        <div className="px-8 py-6 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center space-x-3">
            <div className={`w-2 h-2 rounded-full ${isLocked ? 'bg-amber-500' : 'bg-indigo-500'} ${!isLocked && 'animate-pulse'}`} />
            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-300">Spectroscopy Analysis</span>
          </div>
          <button onClick={() => setIsLocked(false)} className="text-slate-400 hover:text-white transition p-1.5 bg-white/5 rounded-full">
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          </button>
        </div>

        <div className="p-10 space-y-8 overflow-y-auto max-h-[540px] scrollbar-hide">
          <div className="flex items-start justify-between">
            <h2 className="text-5xl font-black font-serif text-white tracking-tight">{target.name}</h2>
            <div className="flex flex-col items-end pt-2">
              <span className="text-[10px] font-mono font-black text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">LN {target.line}</span>
              {target.isGuessed && <span className="text-[7px] text-amber-500/70 font-black uppercase mt-1 tracking-widest">Heuristic Guess</span>}
            </div>
          </div>

          <div className="bg-white/5 border border-white/5 px-6 py-4 rounded-2xl flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Resolved Module:</span>
            <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">{target.file}</span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-indigo-400"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/></svg>
               <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Function Definition</span>
            </div>
            <div className="bg-black/40 rounded-3xl p-6 font-mono text-[11px] text-slate-300 border border-white/5 relative overflow-hidden">
              <div className="whitespace-pre overflow-x-auto pb-2 scrollbar-hide opacity-90 leading-relaxed italic">
                {target.source}
              </div>
              <div className="absolute top-4 right-6 text-[8px] font-black opacity-20 text-indigo-400 uppercase tracking-widest">Live Trace</div>
            </div>
          </div>

          <div className="space-y-4">
             <div className="flex items-center space-x-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-amber-400"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Environment Props</span>
             </div>
             <div className="bg-white/5 rounded-3xl p-8 border border-white/5 font-mono text-[11px] flex items-center justify-center min-h-[100px]">
                {Object.keys(target.props).length > 0 ? (
                  <div className="w-full space-y-3">
                    {Object.entries(target.props).slice(0, 6).map(([key, val]) => (
                      <div key={key} className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-amber-300 font-bold">{key}</span>
                        <span className="text-slate-400 truncate max-w-[180px]">{typeof val === 'function' ? 'ƒ()' : JSON.stringify(val)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-slate-500 italic text-center text-xs">No functional props found for this instance.</span>
                )}
             </div>
          </div>
        </div>

        <div className="p-6">
          <button onClick={() => { navigator.clipboard.writeText(JSON.stringify(target.props)); }} 
            className="w-full bg-[#5a46e5] hover:bg-[#4a36d5] text-white py-5 rounded-3xl font-black text-[11px] uppercase tracking-[0.3em] shadow-xl flex items-center justify-center space-x-3 transition active:scale-[0.98]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
            <span>Copy Trace Object</span>
          </button>
        </div>

        <div className="bg-[#0f1129] py-4 px-10 text-[8px] font-black text-slate-600 uppercase tracking-[0.25em] flex justify-center">
           SPACE: LOCK &nbsp;&nbsp; CTRL+SHIFT+D: TOGGLE &nbsp;&nbsp; V5.0 HEURISTIC CORE
        </div>
      </div>
    </>
  );
};
