/* Fun Zone — quotes and the incidents */
document.addEventListener("site:ready", function () {
  var fun = window.SITE.funZone || {};

  if ((fun.quotes || []).length) {
    document.getElementById("quotes-grid").innerHTML = fun.quotes.map(function (q) {
      return '<blockquote class="card reveal is-in" style="margin:0">' +
               '<span class="material-symbols-outlined" style="color:var(--gold)">format_quote</span>' +
               '<p class="note" style="font-size:20px;margin:12px 0 0">' + Render.esc(q.text) + '</p>' +
               (q.said ? '<footer class="label-caps muted" style="margin-top:16px">— ' +
                          Render.esc(q.said) + '</footer>' : '') +
             '</blockquote>';
    }).join("");
    document.getElementById("quotes-placeholder").remove();
  }

  if ((fun.jokes || []).length) {
    document.getElementById("jokes-grid").innerHTML = fun.jokes.map(function (j) {
      return '<article class="card reveal is-in">' +
               '<h3 class="headline-md" style="font-size:20px;margin:0 0 8px">' + Render.esc(j.title) + '</h3>' +
               '<p class="body-sm muted" style="margin:0">' + Render.esc(j.body) + '</p>' +
             '</article>';
    }).join("");
    document.getElementById("jokes-placeholder").remove();
  }
});
