export const MOTION = {
  cursor: {
    dotLerp: 1, // 1 = instant pointer tracking (zero delay)
    ringLerp: 0.2, // 0.18 - 0.22 range for snappy trailing ring
    scaleLerp: 0.24,
    hoverTransitionMs: 200, // 0.2s hover grow/shrink
    velocitySmoothing: 0.45,
    squashMaxStretch: 0.22,
    squashMaxSquash: 0.1,
    particleMaxCount: 16,
    particleSpeedThreshold: 3.0,
    particleDecayMin: 0.085,
    particleDecayRange: 0.045,
    particleRadiusMin: 0.9,
    particleRadiusRange: 0.8,
  },

  scroll: {
    lenisLerp: 0.115, // 0.1 - 0.12 (close to native scrolling)
    lenisWheelMultiplier: 1,
    lenisTouchMultiplier: 1.2,
    scrollToDuration: 0.95, // 0.9 - 1.1s
    scrub: 0.35, // 0.3 - 0.5s
    scrubParallax: true, // instant 1:1 parallax
    horizontalEndPaddingPx: 64, // compact horizontal scroll distance
  },

  timing: {
    revealDuration: 0.58, // 0.5 - 0.8s
    staggerChar: 0.024, // 0.02 - 0.05s
    staggerWord: 0.035, // 0.02 - 0.05s
    staggerItem: 0.045, // 0.02 - 0.05s
    hoverDuration: 0.22, // 0.2 - 0.3s
    menuDuration: 0.48, // ~0.5s total open/close
    menuLinkDuration: 0.34,
    menuLinkStagger: 0.032,
    menuLinkDelay: 0.08,
  },

  easing: {
    gsapSnappy: 'expo.out',
    gsapPowerOut: 'power3.out',
    gsapWipe: 'power3.inOut',
    framerSnappy: [0.16, 1, 0.3, 1],
  },

  preloader: {
    sessionKey: 'ak-preloader-seen',
    countDuration: 0.78,
    strokeDuration: 0.72,
    underlineDuration: 0.64,
    fillStartAt: 0.52,
    fillDuration: 0.24,
    textExitAt: 0.78,
    textExitDuration: 0.16,
    curtainStartAt: 0.82,
    curtainDuration: 0.46, // total ~1.28s (1.2 - 1.5s range)
  },

  pageTransition: {
    stripInDuration: 0.2,
    curtainInDuration: 0.24,
    curtainInOffset: 0.03,
    pauseAtMidpoint: 0.02,
    curtainOutDuration: 0.26,
    stripOutDuration: 0.22, // total ~0.53s (0.5 - 0.6s max)
  },
};

