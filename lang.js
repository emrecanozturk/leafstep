// Shows one language at a time: the one in the address (#tr, #en or an anchor inside one),
// otherwise the reader's first preferred language (Turkish → tr, anything else → en).
// Without JavaScript both languages stay on the page, English first.
(function () {
  var articles = Array.prototype.slice.call(document.querySelectorAll('article[lang]'));
  var links = Array.prototype.slice.call(document.querySelectorAll('.langs a[data-lang]'));
  if (!articles.length) return;

  function chosen() {
    var id = decodeURIComponent(location.hash.slice(1));
    var target = id && document.getElementById(id);
    var article = target && target.closest('article[lang]');
    if (article) return article.id;
    var first = (navigator.languages && navigator.languages[0]) || navigator.language || 'en';
    return /^tr\b/i.test(first) ? 'tr' : 'en';
  }

  function show() {
    var id = chosen();
    articles.forEach(function (a) {
      var on = a.id === id;
      a.hidden = !on;
      if (on) {
        document.documentElement.lang = a.lang;
        if (a.dataset.title) document.title = a.dataset.title;
      }
    });
    links.forEach(function (l) {
      l.setAttribute('aria-current', l.dataset.lang === id ? 'true' : 'false');
    });
    // Links to the sibling page keep the language: support.html → support.html#tr.
    document.querySelectorAll('a[data-keep-lang]').forEach(function (a) {
      a.setAttribute('href', a.getAttribute('href').split('#')[0] + '#' + id);
    });
  }

  show();
  window.addEventListener('hashchange', function () {
    show();
    // Switching language (#tr, #en) starts the page from the top, with the switch in view.
    if (articles.some(function (a) { return '#' + a.id === location.hash; })) window.scrollTo(0, 0);
  });
})();
