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
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && header.classList.contains("is-open")) {
        setMenu(false);
        toggle.focus();
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
    ".kicker, .h2, .label, .details__note, .register, .contact__title, .contact__text, .contact__details, .form"
  );
  var groups = document.querySelectorAll(".services, .steps, .register__list");

  singles.forEach(function (el) { el.setAttribute("data-reveal", ""); });
  if (statement && !(scrollTimeline && !reduceMotion)) statement.setAttribute("data-reveal", "");

  groups.forEach(function (group) {
    Array.prototype.forEach.call(group.children, function (item, i) {
      item.setAttribute("data-reveal", "");
      item.style.setProperty("--i", i);
    });
  });

  var targets = document.querySelectorAll("[data-reveal]");

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

  /* ----- Contact form validation ----- */

  var form = document.getElementById("inquiry-form");
  if (!form) return;

  var status = document.getElementById("form-status");
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  var rules = {
    name: function (v) {
      if (!v) return "Please enter your full name.";
      if (v.length < 2) return "Please enter your full name, not just an initial.";
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
      if (v.length < 20) return "Please add a little more detail, at least 20 characters.";
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
    field.removeAttribute("aria-invalid");
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
      status.textContent =
        "Thank you. This form is not connected yet, so your message has not been sent. " +
        "Please email us at [EMAIL ADDRESS] for now.";
    }
  });
})();
