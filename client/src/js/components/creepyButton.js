/**
 * Creepy Button Component — Interactive Eye-Tracking Playful Button
 * Features:
 * - Automatic peeking & gaze shift every 2 seconds
 * - Interactive cursor eye-tracking
 * - Matte luxury styling with zero glow
 */

export function initCreepyButton(buttonEl) {
  if (!buttonEl || buttonEl._creepyInit) return;
  buttonEl._creepyInit = true;

  const eyesContainer = buttonEl.querySelector('.creepy-btn__eyes');
  const pupils = buttonEl.querySelectorAll('.creepy-btn__pupil');

  if (!eyesContainer || pupils.length === 0) return;

  let isHovered = false;
  let idleTimer = null;

  function setPupilOffset(xPercent, yPercent) {
    pupils.forEach(pupil => {
      pupil.style.transform = `translate(${xPercent}%, ${yPercent}%)`;
    });
  }

  function updateEyes(e) {
    const userEvent = e.touches ? e.touches[0] : e;
    const eyesRect = eyesContainer.getBoundingClientRect();
    const eyesCenter = {
      x: eyesRect.left + eyesRect.width / 2,
      y: eyesRect.top + eyesRect.height / 2,
    };

    const cursor = {
      x: userEvent.clientX,
      y: userEvent.clientY,
    };

    // Calculate angle & distance
    const dx = cursor.x - eyesCenter.x;
    const dy = cursor.y - eyesCenter.y;
    const angle = Math.atan2(-dy, dx) + Math.PI / 2;

    const visionRangeX = 140;
    const visionRangeY = 90;
    const distance = Math.min(Math.hypot(dx, dy), 200);

    const x = (Math.sin(angle) * distance) / visionRangeX;
    const y = (Math.cos(angle) * distance) / visionRangeY;

    const translateX = -50 + x * 45;
    const translateY = -50 + y * 45;

    setPupilOffset(translateX, translateY);
  }

  // Idle playful eye gaze shifts every 2 seconds
  const idleGazePositions = [
    { x: -30, y: -60 }, // look up-right
    { x: -70, y: -45 }, // look left
    { x: -35, y: -35 }, // look down-right
    { x: -50, y: -50 }, // center
  ];
  let gazeIndex = 0;

  function cycleIdleGaze() {
    if (!isHovered) {
      const target = idleGazePositions[gazeIndex % idleGazePositions.length];
      gazeIndex++;
      setPupilOffset(target.x, target.y);
    }
  }

  idleTimer = setInterval(cycleIdleGaze, 1500);

  buttonEl.addEventListener('mouseenter', () => {
    isHovered = true;
  });

  buttonEl.addEventListener('mousemove', (e) => {
    isHovered = true;
    updateEyes(e);
  });

  buttonEl.addEventListener('touchmove', (e) => {
    isHovered = true;
    updateEyes(e);
  }, { passive: true });

  buttonEl.addEventListener('mouseleave', () => {
    isHovered = false;
    setPupilOffset(-50, -50);
  });

  buttonEl.addEventListener('touchend', () => {
    isHovered = false;
    setPupilOffset(-50, -50);
  });
}

export function bindAllCreepyButtons() {
  const buttons = document.querySelectorAll('.creepy-btn');
  buttons.forEach(btn => initCreepyButton(btn));
}

