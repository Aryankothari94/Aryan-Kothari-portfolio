import { Suspense, useEffect, useRef, useState } from 'react';

export function LazySection({
  id,
  dataSection,
  minHeightClass = 'min-h-[85vh]',
  children,
}) {
  const hostRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (mounted) return undefined;
    const el = hostRef.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setMounted(true);
          observer.disconnect();
        }
      },
      { rootMargin: '120px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [mounted]);

  if (mounted) {
    return (
      <Suspense fallback={<section id={id} data-section={dataSection} className={minHeightClass} />}>
        {children}
      </Suspense>
    );
  }

  return (
    <section
      ref={hostRef}
      id={id}
      data-section={dataSection}
      aria-hidden="true"
      className={minHeightClass}
    />
  );
}

