"use strict";

/*
  Live character counter, panel toggle, and temporary notes.
  Everything lives inside one IIFE so no identifiers leak onto window.
 */
(function init() {
  const MAX_LENGTH_FALLBACK = 280;
  const WARNING_RATIO = 0.9;
  const NOTE_LIFETIME_MS = 3000;

  /* Returns the element only when it exists, otherwise null. */
  function byId(id) {
    return document.getElementById(id);
  }

  function initCounter() {
    const postBox = byId("postBox");
    const counter = byId("counter");
    const preview = byId("preview");
    if (!postBox || !counter) return;

    const maxLength = Number(postBox.maxLength) || MAX_LENGTH_FALLBACK;
    const warnAt = Math.floor(maxLength * WARNING_RATIO);
    const EMPTY_PREVIEW = "Nothing typed yet.";

    const render = () => {
      const message = postBox.value;
      const length = message.length;

      counter.textContent = `${length} / ${maxLength}`;
      counter.classList.toggle("is-warning", length >= warnAt);
      counter.classList.toggle("is-over", length > maxLength);

      // textContent never parses HTML, so typed markup stays inert.
      if (preview) {
        preview.textContent = length === 0 ? EMPTY_PREVIEW : message;
      }
    };

    postBox.addEventListener("input", render);
    render();
  }

  function initThemeToggle() {
    const themeBtn = byId("themeBtn");
    if (!themeBtn) return;

    const DARK = "dark-theme";
    const LABELS = {
      dark: "Switch to dark theme",
      light: "Switch to light theme",
    };

    const render = () => {
      const isDark = document.body.classList.contains(DARK);
      themeBtn.textContent = isDark ? LABELS.light : LABELS.dark;
      themeBtn.setAttribute("aria-pressed", String(isDark));
    };

    themeBtn.addEventListener("click", () => {
      document.body.classList.toggle(DARK);
      render();
    });

    render();
  }

  function initToggle() {
    const toggleBtn = byId("toggleBtn");
    const panel = byId("panel");
    if (!toggleBtn || !panel) return;

    const LABELS = { show: "Show explanation", hide: "Hide explanation" };

    toggleBtn.setAttribute("aria-controls", panel.id);

    const render = (isHidden) => {
      // The native hidden attribute works even if the stylesheet fails to load.
      panel.hidden = isHidden;
      panel.classList.toggle("hidden", isHidden);
      toggleBtn.textContent = isHidden ? LABELS.show : LABELS.hide;
      toggleBtn.setAttribute("aria-expanded", String(!isHidden));
    };

    toggleBtn.addEventListener("click", () => {
      render(!panel.hidden);
    });

    render(panel.hidden || panel.classList.contains("hidden"));
  }

  function initNotes() {
    const addNoteBtn = byId("addNoteBtn");
    const notesDiv = byId("notes");
    if (!addNoteBtn || !notesDiv) return;

    const NOTE_TEXT = "This note exists in the live DOM only.";
    const timers = new Map();

    addNoteBtn.addEventListener("click", () => {
      const note = document.createElement("p");
      note.className = "note";
      note.textContent = NOTE_TEXT;
      notesDiv.append(note);

      const timer = setTimeout(() => {
        note.remove();
        timers.delete(timer);
      }, NOTE_LIFETIME_MS);

      timers.set(note, timer);
    });

    // Drop any pending removals so nothing is left running after unload.
    window.addEventListener("pagehide", () => {
      timers.forEach(clearTimeout);
      timers.clear();
    });
  }

  initCounter();
  initToggle();
  initNotes();
  initThemeToggle();
})();
