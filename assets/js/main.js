(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var supportsHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  function $(selector, context) {
    return (context || document).querySelector(selector);
  }

  function $$(selector, context) {
    return Array.prototype.slice.call((context || document).querySelectorAll(selector));
  }

  /* ---------------------------------------------------------
     Preloader
     --------------------------------------------------------- */
  var preloader = $("#preloader");
  var pageReady = false;

  function revealPage() {
    if (pageReady) return;
    pageReady = true;
    if (preloader) preloader.classList.add("loaded");
    document.body.classList.add("ready");
  }

  window.addEventListener("load", function () {
    window.setTimeout(revealPage, 700);
  });

  // Failsafe: never leave the page hidden if an asset stalls.
  window.setTimeout(revealPage, 3000);

  /* ---------------------------------------------------------
     Typewriter
     --------------------------------------------------------- */
  var typed = $("#typed");

  if (typed) {
    var words = ["Web Developer", "Programmer", "ICCT IT Student", "UI Designer"];

    if (reduceMotion) {
      typed.textContent = words[0];
    } else {
      var wordIndex = 0;
      var charIndex = 0;
      var deleting = false;

      var type = function () {
        var word = words[wordIndex];
        typed.textContent = word.slice(0, charIndex);

        var delay = deleting ? 55 : 115;

        if (!deleting && charIndex < word.length) {
          charIndex += 1;
        } else if (deleting && charIndex > 0) {
          charIndex -= 1;
        } else if (!deleting) {
          deleting = true;
          delay = 1500;
        } else {
          deleting = false;
          wordIndex = (wordIndex + 1) % words.length;
          delay = 320;
        }

        window.setTimeout(type, delay);
      };

      type();
    }
  }

  /* ---------------------------------------------------------
     Header, active nav, scroll progress, back to top
     --------------------------------------------------------- */
  var header = $("#header");
  var scrollBar = $("#scrollBar");
  var backTop = $("#backTop");
  var sections = $$("main section[id]");
  var navLinks = $$(".nav-link");

  function updateScrollUI() {
    var y = window.scrollY || window.pageYOffset;

    if (header) header.classList.toggle("scrolled", y > 30);

    if (scrollBar) {
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var progress = docHeight > 0 ? Math.min(y / docHeight, 1) : 0;
      scrollBar.style.transform = "scaleX(" + progress + ")";
    }

    if (backTop) backTop.classList.toggle("visible", y > 650);

    var line = y + window.innerHeight * 0.35;
    var current = "";

    sections.forEach(function (section) {
      var top = section.getBoundingClientRect().top + y;
      if (line >= top) current = section.id;
    });

    navLinks.forEach(function (link) {
      var isActive = link.getAttribute("href") === "#" + current;
      link.classList.toggle("active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  window.addEventListener("scroll", updateScrollUI, { passive: true });
  window.addEventListener("resize", updateScrollUI);
  updateScrollUI();

  if (backTop) {
    backTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  /* ---------------------------------------------------------
     Mobile menu
     --------------------------------------------------------- */
  var menuBtn = $("#menuBtn");
  var nav = $("#nav");

  function closeMenu() {
    if (!nav || !menuBtn) return;
    nav.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Open menu");
    document.body.classList.remove("nav-open");
  }

  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(isOpen));
      menuBtn.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
      document.body.classList.toggle("nav-open", isOpen);
    });

    navLinks.forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 991) closeMenu();
    });
  }

  /* ---------------------------------------------------------
     Scroll reveal
     --------------------------------------------------------- */
  var revealItems = $$(".reveal");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px" }
    );

    revealItems.forEach(function (item) {
      revealObserver.observe(item);
    });
  }

  /* ---------------------------------------------------------
     Skill bars
     --------------------------------------------------------- */
  var skillsSection = $("#skills");

  if (skillsSection) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      skillsSection.classList.add("is-visible");
    } else {
      var skillsObserver = new IntersectionObserver(
        function (entries) {
          if (entries[0].isIntersecting) {
            skillsSection.classList.add("is-visible");
            skillsObserver.disconnect();
          }
        },
        { threshold: 0.2 }
      );
      skillsObserver.observe(skillsSection);
    }
  }

  /* ---------------------------------------------------------
     Animated counters
     --------------------------------------------------------- */
  var counters = $$(".counter");

  function setFinalCount(counter) {
    counter.textContent = counter.getAttribute("data-target");
  }

  function animateCounter(counter) {
    var target = parseInt(counter.getAttribute("data-target"), 10) || 0;
    var duration = 1400;
    var start = null;

    var step = function (timestamp) {
      if (start === null) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = String(Math.round(target * eased));
      if (progress < 1) window.requestAnimationFrame(step);
    };

    window.requestAnimationFrame(step);
  }

  if (counters.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      counters.forEach(setFinalCount);
    } else {
      var counterObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          });
        },
        { threshold: 0.6 }
      );

      counters.forEach(function (counter) {
        counterObserver.observe(counter);
      });
    }
  }

  /* ---------------------------------------------------------
     Cursor glow
     --------------------------------------------------------- */
  var glow = $("#cursorGlow");

  if (glow && supportsHover && !reduceMotion) {
    var targetX = window.innerWidth / 2;
    var targetY = window.innerHeight / 2;
    var currentX = targetX;
    var currentY = targetY;
    var glowFrame = 0;

    var moveGlow = function () {
      currentX += (targetX - currentX) * 0.14;
      currentY += (targetY - currentY) * 0.14;

      glow.style.transform =
        "translate(" + currentX + "px, " + currentY + "px) translate(-50%, -50%)";

      if (Math.abs(targetX - currentX) > 0.4 || Math.abs(targetY - currentY) > 0.4) {
        glowFrame = window.requestAnimationFrame(moveGlow);
      } else {
        glowFrame = 0;
      }
    };

    document.addEventListener(
      "pointermove",
      function (event) {
        targetX = event.clientX;
        targetY = event.clientY;
        if (!glowFrame) glowFrame = window.requestAnimationFrame(moveGlow);
      },
      { passive: true }
    );

    glow.style.transform =
      "translate(" + currentX + "px, " + currentY + "px) translate(-50%, -50%)";
  }

  /* ---------------------------------------------------------
     Project card tilt + spotlight
     --------------------------------------------------------- */
  if (supportsHover && !reduceMotion) {
    $$(".project-card").forEach(function (card) {
      card.addEventListener(
        "pointermove",
        function (event) {
          if (event.pointerType !== "mouse") return;

          var rect = card.getBoundingClientRect();
          var x = (event.clientX - rect.left) / rect.width;
          var y = (event.clientY - rect.top) / rect.height;

          card.style.setProperty("--mx", x * 100 + "%");
          card.style.setProperty("--my", y * 100 + "%");
          card.style.setProperty("--rx", (y - 0.5) * -5 + "deg");
          card.style.setProperty("--ry", (x - 0.5) * 5 + "deg");
        },
        { passive: true }
      );

      card.addEventListener("pointerleave", function () {
        card.style.setProperty("--rx", "0deg");
        card.style.setProperty("--ry", "0deg");
      });
    });
  }

  /* ---------------------------------------------------------
     Screenshot lightbox
     --------------------------------------------------------- */
  var lightbox = $("#lightbox");
  var lightboxImg = $("#lightboxImg");
  var lightboxTitle = $("#lightboxTitle");
  var lastFocused = null;

  function openLightbox(trigger) {
    if (!lightbox || !lightboxImg || !lightboxTitle) return;

    var img = trigger.querySelector("img");
    if (!img) return;

    lightboxImg.src = trigger.getAttribute("data-image") || img.src;
    lightboxImg.alt = img.alt;
    lightboxTitle.textContent = trigger.getAttribute("data-title") || img.alt;

    lastFocused = document.activeElement;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");

    var closeBtn = $(".lightbox-close", lightbox);
    if (closeBtn) {
      // Wait one frame so the dialog is visible before moving focus into it.
      window.setTimeout(function () {
        closeBtn.focus();
      }, 60);
    }
  }

  function closeLightbox() {
    if (!lightbox) return;

    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");

    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    }
  }

  if (lightbox) {
    $$(".project-media").forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        openLightbox(trigger);
      });
    });

    $$("[data-close]", lightbox).forEach(function (closer) {
      closer.addEventListener("click", closeLightbox);
    });

    document.addEventListener("keydown", function (event) {
      if (!lightbox.classList.contains("open")) return;

      if (event.key === "Escape") {
        closeLightbox();
      }

      if (event.key === "Tab") {
        var focusable = $$("button, [href], input, textarea, select", lightbox);
        if (!focusable.length) return;

        var first = focusable[0];
        var last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });
  }

  /* ---------------------------------------------------------
     Contact form (Formspree)
     --------------------------------------------------------- */
  var form = $("#contactForm");
  var status = $("#formStatus");

  if (form && status) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var button = form.querySelector('button[type="submit"]');
      var originalMarkup = button ? button.innerHTML : "";
      var formData = {};

      new FormData(form).forEach(function (value, key) {
        formData[key] = value;
      });
      formData._subject = "Portfolio message from " + formData.name;

      status.textContent = "";
      status.className = "form-status";

      if (button) {
        button.disabled = true;
        button.innerHTML = "Sending...";
      }

      fetch("https://formspree.io/f/xdeezyqq", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then(function (response) {
          if (!response.ok) throw new Error("Request failed");
          return response.json();
        })
        .then(function () {
          form.reset();
          status.textContent = "Thanks! Your message was sent. I'll get back to you as soon as I can.";
          status.classList.add("success");
        })
        .catch(function () {
          status.textContent =
            "Something went wrong. Please email me directly at jmmarquez@gmail.com.";
          status.classList.add("error");
        })
        .then(function () {
          if (button) {
            button.disabled = false;
            button.innerHTML = originalMarkup;
          }
        });
    });
  }

  /* ---------------------------------------------------------
     Footer year
     --------------------------------------------------------- */
  var year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
