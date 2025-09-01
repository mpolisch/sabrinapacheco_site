document.addEventListener("DOMContentLoaded", function () {
  const opts = {
    root: null,
    threshold: 0.12,
    rootMargin: "0px 0px -40px 0px" // start a bit before it fully enters
  };

  const onIntersect = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target); // animate once
      }
    });
  };

  const io = new IntersectionObserver(onIntersect, opts);

  document.querySelectorAll(".reveal").forEach(el => {
    io.observe(el);
  });
});
