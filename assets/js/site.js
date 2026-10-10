/* =========================================================
   APRODISC — fonctionnement du site
   (en principe, pas besoin de modifier ce fichier :
    les contenus se règlent dans donnees.js)
   ========================================================= */
(function () {
  "use strict";

  var D = window.APRODISC;
  var body = document.body;
  var RACINE = body.getAttribute("data-racine") || "";
  var PAGE = body.getAttribute("data-page") || "";

  /* ---------- Icônes (dessins simples) ---------- */
  var ICONES = {
    reparation: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.1L4 16.7 7.3 20l5.3-5.3a4 4 0 0 0 5.1-5.4l-2.6 2.6-2.3-.6-.6-2.3z"/>',
    arnaques: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
    cours: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
    word: '<path d="M6 3h9l4 4v14H6z"/><path d="M9 11l1.5 6L12 13l1.5 4L15 11"/>',
    excel: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 10h16M4 15h16M10 4v16"/>',
    fablab: '<path d="M4 20h16M6 20V9h12v11M9 9V5h6v4"/><path d="M10 15h4"/>',
    actualites: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 9h8M8 13h8M8 17h5"/>',
    calendrier: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    attention: '<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18v.5"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>'
  };
  function icone(nom, epaisseur) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (epaisseur || 2) +
      '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONES[nom] || "") + "</svg>";
  }

  /* ---------- Petits utilitaires ---------- */
  function echap(t) {
    return String(t).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function $(sel) { return document.querySelector(sel); }
  function rubrique(id) {
    for (var i = 0; i < D.rubriques.length; i++) if (D.rubriques[i].id === id) return D.rubriques[i];
    return null;
  }
  function info(valeur, texteManquant) {
    return valeur ? echap(valeur) : '<span class="a-completer">' + echap(texteManquant) + "</span>";
  }
  function lireDate(iso) { var p = iso.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function iso(d) {
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function majuscule(t) { return t.charAt(0).toUpperCase() + t.slice(1); }
  function dateLongue(d) {
    return majuscule(d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }));
  }
  function dateCourte(d) { return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }); }
  function sansAccents(t) { return t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase(); }

  /* ---------- Taille du texte (mémorisée sur l'appareil) ---------- */
  var TAILLES = [19, 21, 24, 27];
  function appliquerTaille(i) {
    document.documentElement.style.setProperty("--taille-texte", TAILLES[i] + "px");
    try { localStorage.setItem("aprodisc-taille", i); } catch (e) { /* stockage indisponible */ }
  }
  var tailleActuelle = 1;
  try {
    var memo = parseInt(localStorage.getItem("aprodisc-taille"), 10);
    if (memo >= 0 && memo < TAILLES.length) tailleActuelle = memo;
  } catch (e) { /* stockage indisponible */ }
  if (tailleActuelle !== 1) appliquerTaille(tailleActuelle);

  /* ---------- Permanences : calcul des prochaines dates ---------- */
  function prochainesPermanences(nombre) {
    var auj = new Date(); auj.setHours(0, 0, 0, 0);
    var fermees = D.permanences.fermetures || [];
    var dates = [];
    ["mardi", "samedi"].forEach(function (jour) {
      var conf = D.permanences[jour];
      if (!conf || !conf.reference) return;
      var d = lireDate(conf.reference);
      while (d < auj) d.setDate(d.getDate() + 14);
      while (d - auj > 0 && new Date(d.getTime() - 14 * 864e5) >= auj) d.setDate(d.getDate() - 14);
      for (var n = 0; n < nombre + fermees.length; n++) {
        var copie = new Date(d.getTime());
        copie.setDate(copie.getDate() + 14 * n);
        if (fermees.indexOf(iso(copie)) === -1) dates.push({ date: copie, jour: jour, horaire: conf.horaire });
      }
    });
    dates.sort(function (a, b) { return a.date - b.date; });
    return dates.slice(0, nombre);
  }
  function horaire(h) { return h ? echap(h) : '<span class="a-completer">horaire à compléter</span>'; }

  /* ---------- En-tête ---------- */
  function construireEntete() {
    var lien = function (href, texte, page) {
      return '<a href="' + RACINE + href + '"' + (PAGE === page ? ' aria-current="page"' : "") + ">" + texte + "</a>";
    };
    var html =
      '<a class="lien-evitement" href="#contenu">Aller au contenu</a>' +
      '<div class="barre-haut"><div class="wrap"><span>Ouvert un mardi sur deux et un samedi sur deux · ' +
        '<a href="' + RACINE + 'permanences.html">Voir les dates</a></span>' +
        '<span class="outils-texte">Taille du texte : <button type="button" data-taille="-1" aria-label="Réduire le texte">A-</button>' +
        '<button type="button" data-taille="1" aria-label="Agrandir le texte">A+</button></span></div></div>' +
      '<header class="entete"><div class="wrap">' +
        '<a class="logo" href="' + RACINE + 'index.html"><i></i><span>' + echap(D.infos.nom) +
          "<small>" + echap(D.infos.slogan) + "</small></span></a>" +
        '<button class="bouton-menu" type="button" aria-expanded="false" aria-controls="menu-principal">☰ Menu</button>' +
        '<nav class="menu" id="menu-principal" aria-label="Menu principal">' +
          lien("index.html", "Accueil", "accueil") +
          lien("permanences.html", "Nous rendre visite", "permanences") +
          lien("association.html", "L'association", "association") +
          '<a class="btn-rubriques" href="#rubriques" aria-expanded="false" aria-controls="panneau-rubriques">' +
            '<span style="width:22px;height:22px;display:inline-block">' + icone("menu", 2.5) + "</span>Toutes les rubriques</a>" +
        "</nav>" +
      "</div></header>" +
      '<div class="panneau-rubriques" id="panneau-rubriques" hidden><div class="wrap"><ul>' +
        D.rubriques.map(function (r) {
          return '<li><a href="' + RACINE + r.page + '"><span class="mini-ico ico-' + r.id + '">' + icone(r.id) +
            "</span>" + echap(r.titre) + "</a></li>";
        }).join("") +
      "</ul></div></div>";
    var cible = $("#entete");
    if (cible) cible.outerHTML = html;

    var btnMenu = $(".bouton-menu"), menu = $("#menu-principal");
    btnMenu.addEventListener("click", function () {
      var ouvert = menu.classList.toggle("ouvert");
      btnMenu.setAttribute("aria-expanded", ouvert);
    });
    var btnRub = $(".btn-rubriques"), panneau = $("#panneau-rubriques");
    btnRub.addEventListener("click", function (e) {
      e.preventDefault();
      panneau.hidden = !panneau.hidden;
      btnRub.setAttribute("aria-expanded", !panneau.hidden);
    });
    Array.prototype.forEach.call(document.querySelectorAll("[data-taille]"), function (b) {
      b.addEventListener("click", function () {
        tailleActuelle = Math.max(0, Math.min(TAILLES.length - 1, tailleActuelle + parseInt(b.getAttribute("data-taille"), 10)));
        appliquerTaille(tailleActuelle);
      });
    });
  }

  /* ---------- Pied de page ---------- */
  function construirePied() {
    var cible = $("#pied");
    if (!cible) return;
    cible.outerHTML =
      '<footer class="pied"><div class="wrap">' +
        "<div><h2>" + echap(D.infos.nom) + "</h2><p>" + echap(D.infos.slogan) + ".</p>" +
          "<p>Réparation, cours d'informatique et sensibilisation aux arnaques.</p></div>" +
        "<div><h2>Nous trouver</h2><p>" + info(D.infos.adresse, "adresse à compléter") + "</p>" +
          "<p>Un mardi sur deux et un samedi sur deux</p>" +
          '<p><a href="' + RACINE + 'permanences.html">Voir les prochaines dates</a></p></div>' +
        "<div><h2>Liens</h2><ul>" +
          '<li><a href="' + RACINE + 'association.html">L\'association</a></li>' +
          '<li><a href="' + RACINE + 'association.html#adherer">Adhérer</a></li>' +
          '<li><a href="' + RACINE + 'mentions-legales.html">Mentions légales</a></li>' +
        "</ul></div>" +
      "</div></footer>";
  }

  /* ---------- Blocs réutilisables ---------- */
  function ligneArticle(a) {
    var r = rubrique(a.rubrique) || { id: a.rubrique, titre: "" };
    return '<li><a href="' + RACINE + a.url + '"><span class="vign ico-' + r.id + '">' + icone(r.id) + "</span>" +
      "<span><b>" + echap(a.titre) + "</b><small>" + echap(r.titre) + " · " + echap(a.duree) + "</small></span></a></li>";
  }
  function lignePermanence(p) {
    var cls = p.jour === "mardi" ? "ico-cours" : "ico-reparation";
    var jj = p.date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" });
    return '<li><span class="ligne"><span class="vign ' + cls + '">' + jj + "</span>" +
      "<span><b>" + dateLongue(p.date) + "</b><small>" + horaire(p.horaire) + "</small></span></span></li>";
  }
  function carteArticle(a) {
    var r = rubrique(a.rubrique) || { id: a.rubrique };
    return '<a class="carte" href="' + RACINE + a.url + '"><span class="vign ico-' + r.id + '">' + icone(r.id) + "</span>" +
      "<span><h2>" + echap(a.titre) + "</h2><p>" + echap(a.resume) + '</p><p class="meta">' +
      dateCourte(lireDate(a.date)) + " · " + echap(a.duree) + "</p></span></a>";
  }
  function tuile(r) {
    return '<a class="tuile r-' + r.id + '" href="' + RACINE + r.page + '"><span class="ico">' + icone(r.id) + "</span>" +
      "<h3>" + echap(r.titre) + "</h3><p>" + echap(r.resume) + '</p><span class="go">' + echap(r.action) + " →</span></a>";
  }

  /* ---------- Page d'accueil ---------- */
  function pageAccueil() {
    var el;
    if ((el = $("#tuiles-mission"))) el.innerHTML = D.rubriques.filter(function (r) { return r.mission; }).map(tuile).join("");
    if ((el = $("#tuiles-autres"))) el.innerHTML = D.rubriques.filter(function (r) { return !r.mission; }).map(tuile).join("");
    if ((el = $("#derniers-articles"))) el.innerHTML = D.articles.slice(0, 4).map(ligneArticle).join("");
    var perms = prochainesPermanences(4);
    if ((el = $("#prochaines-permanences"))) el.innerHTML = perms.map(lignePermanence).join("");
    if ((el = $("#prochaine-date")) && perms[0]) {
      el.innerHTML = dateLongue(perms[0].date).toLowerCase();
    }
  }

  /* ---------- Page de rubrique ---------- */
  function pageRubrique(id) {
    var r = rubrique(id);
    if (!r) return;
    document.title = r.titre + " – " + D.infos.nom;
    var el;
    if ((el = $("#entete-rubrique"))) {
      el.className = "entete-page r-" + r.id;
      el.innerHTML = '<span class="ico">' + icone(r.id) + "</span><div><h1>" + echap(r.titre) + "</h1><p>" + echap(r.resume) + "</p></div>";
    }
    if ((el = $("#liste-articles"))) {
      var liste = D.articles.filter(function (a) { return a.rubrique === id; });
      el.innerHTML = liste.length
        ? liste.map(carteArticle).join("")
        : '<p class="vide">Aucun article pour le moment dans cette rubrique. Revenez bientôt !</p>';
    }
  }

  /* ---------- Page d'article ---------- */
  function pageArticle(id) {
    var r = rubrique(id);
    if (!r) return;
    var el;
    if ((el = $("#fil-ariane"))) {
      el.innerHTML = '<a href="' + RACINE + 'index.html">Accueil</a> › <a href="' + RACINE + r.page + '">' + echap(r.titre) + "</a>";
    }
    if ((el = $("#etiquette"))) { el.className = "etiquette ico-" + r.id; el.textContent = r.titre; }
    if ((el = $("#retour-rubrique"))) {
      el.href = RACINE + r.page;
      el.textContent = "← Tous les articles « " + r.titre + " »";
    }
  }

  /* ---------- Page permanences ---------- */
  function pagePermanences() {
    var el;
    if ((el = $("#liste-permanences"))) el.innerHTML = prochainesPermanences(8).map(lignePermanence).join("");
    if ((el = $("#horaire-mardi"))) el.innerHTML = horaire(D.permanences.mardi.horaire);
    if ((el = $("#horaire-samedi"))) el.innerHTML = horaire(D.permanences.samedi.horaire);
  }

  /* ---------- Recherche ---------- */
  function pageRecherche() {
    var q = new URLSearchParams(location.search).get("q") || "";
    var champ = $("#champ-recherche");
    if (champ) champ.value = q;
    var info = $("#resultats-info"), zone = $("#resultats");
    if (!q.trim()) { info.textContent = "Tapez un ou plusieurs mots, puis appuyez sur « Chercher »."; return; }
    var mots = sansAccents(q).split(/\s+/).filter(function (m) { return m.length > 1; });
    var res = D.articles.map(function (a) {
      var r = rubrique(a.rubrique) || { titre: "" };
      var texte = sansAccents([a.titre, a.resume, a.motsCles, r.titre].join(" "));
      var score = 0;
      mots.forEach(function (m) { if (texte.indexOf(m) !== -1) score++; });
      return { a: a, score: score };
    }).filter(function (x) { return x.score > 0; })
      .sort(function (x, y) { return y.score - x.score; });
    info.innerHTML = res.length
      ? res.length + " résultat" + (res.length > 1 ? "s" : "") + " pour « " + echap(q) + " »"
      : "Aucun résultat pour « " + echap(q) + " ». Essayez un autre mot, ou venez nous poser la question lors d'une permanence.";
    zone.innerHTML = res.map(function (x) { return carteArticle(x.a); }).join("");
  }

  /* ---------- Infos de l'association insérées dans les pages ---------- */
  function remplirInfos() {
    var manquants = {
      adresse: "adresse à compléter", lieu: "lieu précis à compléter",
      email: "e-mail à compléter", cotisation: "montant à compléter"
    };
    Array.prototype.forEach.call(document.querySelectorAll("[data-info]"), function (el) {
      var cle = el.getAttribute("data-info");
      var v = D.infos[cle];
      if (cle === "email" && v) el.innerHTML = '<a href="mailto:' + echap(v) + '">' + echap(v) + "</a>";
      else el.innerHTML = info(v, manquants[cle] || "à compléter");
    });
  }

  /* ---------- Lancement ---------- */
  construireEntete();
  construirePied();
  remplirInfos();
  if (PAGE === "accueil") pageAccueil();
  if (PAGE === "rubrique") pageRubrique(body.getAttribute("data-rubrique"));
  if (PAGE === "article") pageArticle(body.getAttribute("data-rubrique"));
  if (PAGE === "permanences") pagePermanences();
  if (PAGE === "recherche") pageRecherche();
})();
