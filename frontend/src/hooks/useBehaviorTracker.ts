import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export function useBehaviorTracker() {
  const { user } = useAuth();
  const activeSectionRef = useRef<string | null>(null);
  const entryTimeRef = useRef<number>(Date.now());
  const pathRef = useRef<string>(window.location.pathname);

  // Send payload to backend api
  const trackEvent = async (payload: {
    eventType: string;
    page: string;
    section?: string | null;
    elementId?: string | null;
    timeSpent?: number | null;
    metadata?: string | null;
  }) => {
    try {
      const data = {
        ...payload,
        userId: user?.email || null, // Associate user session if logged in
      };
      
      await fetch(`${API_BASE_URL}/api/analytics/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    } catch (e) {
      // Fail silently to not impact user experience
    }
  };

  const trackCustomEvent = (
    eventType: string,
    section: string | null = null,
    elementId: string | null = null,
    metadata: Record<string, any> | null = null
  ) => {
    trackEvent({
      eventType,
      page: window.location.pathname,
      section,
      elementId,
      metadata: metadata ? JSON.stringify(metadata) : null,
    });
  };

  useEffect(() => {
    pathRef.current = window.location.pathname;
    
    // Helper to send section view duration
    const reportSectionView = () => {
      const section = activeSectionRef.current;
      if (section) {
        const timeSpent = Date.now() - entryTimeRef.current;
        if (timeSpent > 500) { // Only log if stayed for more than 500ms
          trackEvent({
            eventType: 'SECTION_VIEW',
            page: pathRef.current,
            section,
            timeSpent,
          });
        }
      }
    };

    // --- INTERSECTION OBSERVER FOR SECTIONS ---
    // Observe sections marked with [data-track-section]
    const observerOptions = {
      root: null, // Viewport
      rootMargin: '0px',
      threshold: 0.2, // Section is considered viewed when 20% is visible
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      // Find the entry that has the highest intersection ratio
      const visibleEntries = entries.filter((entry) => entry.isIntersecting);
      if (visibleEntries.length > 0) {
        // Sort by intersection ratio descending
        visibleEntries.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const topEntry = visibleEntries[0];
        const sectionName = topEntry.target.getAttribute('data-track-section');
        
        if (sectionName && sectionName !== activeSectionRef.current) {
          // Log duration of previous section
          reportSectionView();
          
          // Set new active section
          activeSectionRef.current = sectionName;
          entryTimeRef.current = Date.now();
        }
      }
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    
    // Find all sections on mount
    const sections = document.querySelectorAll('[data-track-section]');
    sections.forEach((sec) => observer.observe(sec));

    // --- GLOBAL CLICK LISTENER ---
    const handleGlobalClick = (event: MouseEvent) => {
      let target = event.target as HTMLElement | null;
      let trackId: string | null = null;
      let innerText = '';

      // Traverse up the tree to find data-track-id
      while (target && target !== document.body) {
        trackId = target.getAttribute('data-track-id');
        if (trackId) {
          innerText = target.innerText || '';
          break;
        }
        target = target.parentElement;
      }

      if (trackId) {
        trackEvent({
          eventType: 'CLICK',
          page: pathRef.current,
          section: activeSectionRef.current,
          elementId: trackId,
          metadata: JSON.stringify({ text: innerText.trim().substring(0, 100) }),
        });
      }
    };

    document.addEventListener('click', handleGlobalClick);

    // --- PAGE UNLOAD OR UNMOUNT ---
    const handleBeforeUnload = () => {
      reportSectionView();
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup
    return () => {
      reportSectionView();
      observer.disconnect();
      document.removeEventListener('click', handleGlobalClick);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [user]);

  return { trackCustomEvent };
}
export default useBehaviorTracker;
