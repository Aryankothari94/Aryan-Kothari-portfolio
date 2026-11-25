import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Container, MagneticButton, ResumeButton, SpotlightCard } from '../ui';
import { SuccessConfettiCheck } from '../contact/SuccessConfettiCheck';
import { personalInfo, socials } from '../../data/content';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useSound } from '../../context/SoundContext';
import { MOTION } from '../../config/motion';

gsap.registerPlugin(ScrollTrigger);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateForm(values) {
  const errors = {};
  if (!values.name.trim() || values.name.trim().length < 2) {
    errors.name = 'Please enter your name (at least 2 characters).';
  }
  if (!values.email.trim() || !EMAIL_RE.test(values.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!values.message.trim() || values.message.trim().length < 10) {
    errors.message = 'Please enter a message (at least 10 characters).';
  }
  return errors;
}

function FloatingField({
  id,
  name,
  label,
  type = 'text',
  value,
  onChange,
  error,
  shakeKey,
  multiline = false,
}) {
  const Component = multiline ? 'textarea' : 'input';
  const hasError = Boolean(error);

  return (
    <div key={`${id}-${shakeKey}`} className={`relative ${hasError ? 'animate-shake' : ''}`}>
      <Component
        id={id}
        name={name}
        type={multiline ? undefined : type}
        rows={multiline ? 4 : undefined}
        value={value}
        onChange={onChange}
        placeholder=" "
        required
        aria-invalid={hasError}
        aria-describedby={hasError ? `${id}-error` : undefined}
        className={`peer w-full rounded-xl border bg-white/[0.03] px-4 pt-6 pb-2.5 text-sm text-[var(--text-primary)] outline-none transition-colors duration-200 ${
          multiline ? 'min-h-[124px] resize-y' : ''
        } ${
          hasError
            ? 'border-rose-400/80 focus:border-rose-400'
            : 'border-[var(--border-strong)] focus:border-[var(--accent-neon)]'
        }`}
      />
      <label
        htmlFor={id}
        className={`pointer-events-none absolute top-4 left-4 origin-left font-mono text-xs uppercase tracking-wider transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:scale-75 peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:scale-75 ${
          hasError
            ? 'text-rose-400'
            : 'text-[var(--text-muted)] peer-focus:text-[var(--accent-neon)]'
        }`}
      >
        {label}
      </label>
      {hasError && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 font-mono text-xs text-rose-400">
          {error}
        </p>
      )}
    </div>
  );
}

export function ContactSection() {
  const reducedMotion = useReducedMotion();
  const { playSuccess } = useSound();
  const headingRef = useRef(null);
  const letterRefs = useRef([]);

  const [values, setValues] = useState({ name: '', email: '', message: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [shakeCount, setShakeCount] = useState(0);
  const [status, setStatus] = useState('idle');
  const [serverError, setServerError] = useState('');
  const [successWarning, setSuccessWarning] = useState('');
  const [copied, setCopied] = useState(false);

  const headingWords = ["Let's", 'work', 'together'];

  useEffect(() => {
    if (reducedMotion || !headingRef.current) return undefined;

    const letters = letterRefs.current.filter(Boolean);
    if (letters.length === 0) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        letters,
        { y: 42, opacity: 0, rotateZ: 4 },
        {
          y: 0,
          opacity: 1,
          rotateZ: 0,
          duration: MOTION.timing.revealDuration,
          stagger: MOTION.timing.staggerChar,
          ease: MOTION.easing.gsapSnappy,
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 84%',
            once: true,
          },
        }
      );
    }, headingRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
    if (serverError) setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm(values);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setShakeCount((c) => c + 1);
      return;
    }

    setStatus('loading');
    setServerError('');
    setSuccessWarning('');

    const apiBase = import.meta.env.VITE_API_URL || '/api';

    try {
      const response = await fetch(`${apiBase}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 400 && data.fieldErrors) {
          setFieldErrors(data.fieldErrors);
          setShakeCount((c) => c + 1);
        }
        setServerError(data.error || 'Could not send message. Please try again.');
        setStatus('idle');
        return;
      }

      setSuccessWarning(data.warning || '');
      setStatus('success');
      playSuccess();
      setValues({ name: '', email: '', message: '' });
      setFieldErrors({});
    } catch {
      setServerError('Network error — please check your connection or email directly.');
      setStatus('idle');
    }
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(personalInfo.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore
    }
  };

  let charCounter = 0;

  return (
    <section
      id="contact"
      data-section="CONTACT"
      className="relative z-10 border-t border-[var(--border-subtle)]/60 py-28 sm:py-36"
    >
      <Container className="space-y-14">
        <div ref={headingRef} className="space-y-4">
          <div className="inline-flex items-center gap-3 font-mono text-xs tracking-[0.2em] uppercase text-[var(--text-secondary)]">
            <span className="text-[var(--accent-neon)]">06</span>
            <span className="h-px w-6 bg-[var(--border-strong)]" />
            <span>Contact</span>
          </div>

          <h2 className="type-hero flex flex-wrap gap-x-4 sm:gap-x-6" aria-label="Let's work together">
            {headingWords.map((word, wIdx) => {
              const isAccent = wIdx === 2;
              return (
                <span key={`${word}-${wIdx}`} className="inline-flex overflow-hidden py-1">
                  {word.split('').map((char, cIdx) => {
                    const idx = charCounter;
                    charCounter += 1;
                    return (
                      <span
                        key={`${char}-${cIdx}`}
                        ref={(el) => {
                          letterRefs.current[idx] = el;
                        }}
                        className={`inline-block transition-transform duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-2 motion-reduce:transform-none ${
                          isAccent ? 'text-gradient-secondary' : 'text-[var(--text-primary)]'
                        }`}
                      >
                        {char}
                      </span>
                    );
                  })}
                </span>
              );
            })}
          </h2>
        </div>

        <div className="grid items-start gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          {/* Email + Social Links + Download Resume */}
          <SpotlightCard className="space-y-8">
            <div>
              <p className="font-mono text-xs tracking-[0.2em] uppercase text-[var(--text-muted)]">
                Direct Email
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="font-display text-lg font-semibold text-[var(--text-primary)] transition-colors hover:text-[var(--accent-neon)]"
                >
                  {personalInfo.email}
                </a>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="cursor-pointer rounded-full border border-[var(--border-strong)] px-3 py-1 font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-neon)] hover:text-[var(--accent-neon)]"
                >
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="space-y-3 border-t border-[var(--border-subtle)] pt-6">
              <p className="font-mono text-xs tracking-[0.2em] uppercase text-[var(--text-muted)]">
                Socials
              </p>
              <div className="flex flex-wrap gap-2.5">
                {socials.map((item) => {
                  const isTodo = item.url.startsWith('TODO');
                  return isTodo ? (
                    <span
                      key={item.name}
                      title={item.url}
                      className="rounded-full border border-[var(--border-subtle)] px-3.5 py-1.5 font-mono text-xs text-[var(--text-muted)]"
                    >
                      {item.name} (TODO)
                    </span>
                  ) : (
                    <a
                      key={item.name}
                      href={item.url}
                      className="rounded-full border border-[var(--border-strong)] px-3.5 py-1.5 font-mono text-xs text-[var(--text-primary)] transition-colors hover:border-[var(--accent-neon)] hover:text-[var(--accent-neon)]"
                    >
                      {item.name}
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-[var(--border-subtle)] pt-6">
              <ResumeButton variant="secondary" />
            </div>
          </SpotlightCard>

          {/* Short 3-Field Form */}
          {status === 'success' ? (
            <SuccessConfettiCheck
              warning={successWarning}
              onReset={() => {
                setStatus('idle');
                setSuccessWarning('');
              }}
            />
          ) : (
            <SpotlightCard>
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <FloatingField
                    id="contact-name"
                    name="name"
                    label="Your Name *"
                    value={values.name}
                    onChange={handleChange}
                    error={fieldErrors.name}
                    shakeKey={shakeCount}
                  />
                  <FloatingField
                    id="contact-email"
                    name="email"
                    type="email"
                    label="Email Address *"
                    value={values.email}
                    onChange={handleChange}
                    error={fieldErrors.email}
                    shakeKey={shakeCount}
                  />
                </div>

                <FloatingField
                  id="contact-message"
                  name="message"
                  label="How can we work together? *"
                  value={values.message}
                  onChange={handleChange}
                  error={fieldErrors.message}
                  shakeKey={shakeCount}
                  multiline
                />

                {serverError && (
                  <div
                    role="alert"
                    className="rounded-xl border border-rose-400/50 bg-rose-500/10 px-4 py-3 font-mono text-xs text-rose-300"
                  >
                    {serverError}
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <MagneticButton
                    type="submit"
                    variant="primary"
                    disabled={status === 'loading'}
                    className="min-w-[180px]"
                  >
                    {status === 'loading' ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#06070B] border-t-transparent" />
                        <span>Sending...</span>
                      </span>
                    ) : (
                      'Send Message →'
                    )}
                  </MagneticButton>
                </div>
              </form>
            </SpotlightCard>
          )}
        </div>
      </Container>
    </section>
  );
}
