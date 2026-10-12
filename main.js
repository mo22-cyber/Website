/* MUP Trading — mobile menu, scroll reveals, header state, form validation. */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasIO = "IntersectionObserver" in window;

  /* ----- Mobile menu ----- */

  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".menu-toggle");

  function setMenu(open) {
    header.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  }

  if (header && toggle) {
    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });
    header.querySelectorAll(".site-nav a").forEach(function (link) {
      link.addEventListener("click", function () { setMenu(false); });
    });
    // Close when focus leaves the header, so the open panel never hides the focused control
    header.addEventListener("focusout", function (event) {
      if (header.classList.contains("is-open") && !header.contains(event.relatedTarget)) setMenu(false);
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && header.classList.contains("is-open")) {
        var inside = header.contains(document.activeElement);
        setMenu(false);
        if (inside) toggle.focus();
      }
    });
    window.matchMedia("(min-width: 820px)").addEventListener("change", function (mq) {
      if (mq.matches) setMenu(false);
    });
  }

  /* ----- Header hairline once the page is scrolled ----- */

  if (header && hasIO) {
    var sentinel = document.createElement("div");
    sentinel.setAttribute("aria-hidden", "true");
    sentinel.style.cssText = "position:absolute;top:0;left:0;width:1px;height:8px;pointer-events:none;";
    document.body.prepend(sentinel);
    new IntersectionObserver(function (entries) {
      header.classList.toggle("is-scrolled", !entries[0].isIntersecting);
    }).observe(sentinel);
  }

  /* ----- Statement: split into words for the scroll-linked brightening ----- */

  var statement = document.querySelector("[data-words]");
  var scrollTimeline = window.CSS && CSS.supports && CSS.supports("animation-timeline: view()");

  if (statement && scrollTimeline && !reduceMotion) {
    var words = statement.textContent.trim().split(/\s+/);
    var full = document.createElement("span");
    full.className = "sr-only";
    full.textContent = statement.textContent.trim();
    statement.textContent = "";
    statement.appendChild(full);
    words.forEach(function (word, i) {
      var span = document.createElement("span");
      span.className = "sw";
      span.setAttribute("aria-hidden", "true");
      span.textContent = word;
      statement.appendChild(span);
      if (i < words.length - 1) statement.appendChild(document.createTextNode(" "));
    });
  }

  /* ----- Scroll reveals ----- */

  var singles = document.querySelectorAll(
    ".js-reveal"
  );
  var groups = document.querySelectorAll(".js-stagger");

  singles.forEach(function (el) { el.setAttribute("data-reveal", ""); });
  // Without scroll timelines the statement fades up as a block. The reveal sits on the
  // wrapper because the statement is an inline run-in on desktop (transforms skip inline boxes).
  if (statement && !(scrollTimeline && !reduceMotion)) {
    (statement.closest(".about__grid") || statement).setAttribute("data-reveal", "");
  }

  groups.forEach(function (group) {
    Array.prototype.forEach.call(group.children, function (item, i) {
      item.setAttribute("data-reveal", "");
      item.style.setProperty("--i", i);
    });
  });

  // The footer wordmark sits at the very bottom of the page, partly cropped, so it can never
  // clear the shared observer's margins; it gets its own observer with no margins.
  var wordmark = document.querySelector(".site-footer__wordmark");
  if (wordmark) {
    wordmark.setAttribute("data-reveal", "");
    if (reduceMotion || !hasIO) {
      wordmark.classList.add("is-visible");
    } else {
      new IntersectionObserver(function (entries, observer) {
        if (entries[0].isIntersecting) {
          wordmark.classList.add("is-visible");
          observer.disconnect();
        }
      }).observe(wordmark);
    }
  }

  var targets = document.querySelectorAll("[data-reveal]:not(.site-footer__wordmark)");

  if (reduceMotion || !hasIO) {
    targets.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var revealer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.12 });

    targets.forEach(function (el) { revealer.observe(el); });
  }

  /* ----- Marquee: pause button, and pause while off-screen ----- */

  var supply = document.querySelector(".supply");
  var marquee = document.querySelector(".marquee");
  var marqueeToggle = document.querySelector(".marquee-toggle");

  if (supply && marquee && marqueeToggle && !reduceMotion) {
    marqueeToggle.hidden = false;
    marqueeToggle.addEventListener("click", function () {
      var paused = marqueeToggle.getAttribute("aria-pressed") !== "true";
      marqueeToggle.setAttribute("aria-pressed", String(paused));
      supply.classList.toggle("is-paused", paused);
    });

    if (hasIO) {
      new IntersectionObserver(function (entries) {
        marquee.classList.toggle("is-offscreen", !entries[0].isIntersecting);
      }).observe(marquee);
    }
  }

  /* ----- Service explorer: accessible tabs (without JS every panel shows) ----- */

  var tablist = document.querySelector('[role="tablist"]');
  if (tablist) {
    var tabs = Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]'));
    var select = function (tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
      });
      if (focus) tab.focus();
    };
    select(tabs.filter(function (t) { return t.getAttribute("aria-selected") === "true"; })[0] || tabs[0], false);
    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () { select(tab, false); });
      tab.addEventListener("keydown", function (event) {
        var next = null;
        if (event.key === "ArrowDown" || event.key === "ArrowRight") next = tabs[(i + 1) % tabs.length];
        if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = tabs[(i - 1 + tabs.length) % tabs.length];
        if (event.key === "Home") next = tabs[0];
        if (event.key === "End") next = tabs[tabs.length - 1];
        if (next) { event.preventDefault(); select(next, true); }
      });
    });
  }

  /* ----- Contact form validation ----- */

  var form = document.getElementById("inquiry-form");
  if (!form) return;
  form.noValidate = true;

  var status = document.getElementById("form-status");
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  var rules = {
    name: function (v) {
      if (!v) return "Please enter your full name.";
    },
    company: function (v) {
      if (!v) return "Please enter the name of your company or organisation.";
    },
    email: function (v) {
      if (!v) return "Please enter your work email.";
      if (!emailPattern.test(v)) return "Please enter an email address in the format name@company.com.";
    },
    topic: function (v) {
      if (!v) return "Please choose the topic closest to your inquiry.";
    },
    message: function (v) {
      if (!v) return "Please tell us briefly what you need.";
    }
  };

  function validateField(field) {
    var message = rules[field.name](field.value.trim());
    var error = document.getElementById(field.id + "-error");
    if (message) {
      field.setAttribute("aria-invalid", "true");
      error.textContent = message;
      error.hidden = false;
      return false;
    }
    field.setAttribute("aria-invalid", "false");
    error.textContent = "";
    error.hidden = true;
    return true;
  }

  var fields = Array.prototype.filter.call(form.elements, function (el) {
    return rules[el.name];
  });

  // After the first submit attempt, re-check fields as the visitor fixes them
  var attempted = false;
  fields.forEach(function (field) {
    var evt = field.tagName === "SELECT" ? "change" : "input";
    field.addEventListener(evt, function () { if (attempted) validateField(field); });
    field.addEventListener("blur", function () { if (attempted) validateField(field); });
  });

  form.addEventListener("submit", function (event) {
    attempted = true;
    status.textContent = "";

    var firstInvalid = null;
    fields.forEach(function (field) {
      if (!validateField(field) && !firstInvalid) firstInvalid = field;
    });

    if (firstInvalid) {
      event.preventDefault();
      firstInvalid.focus();
      return;
    }

    // No endpoint yet (action="#"): do not pretend the message was sent.
    var action = form.getAttribute("action");
    if (!action || action === "#") {
      event.preventDefault();
      // Set on a later tick so a repeat submit is announced again
      setTimeout(function () {
        status.textContent =
          "Thank you. This form is not connected yet, so your message has not been sent. " +
          "Please email us at [EMAIL ADDRESS] for now.";
      }, 100);
    }
  });
})();
