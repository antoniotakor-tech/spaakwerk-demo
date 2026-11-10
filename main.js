// Clickjacking guard (GitHub Pages cannot send frame-ancestors headers)
try { if (window.top !== window.self) window.top.location = window.self.location.href; } catch (e) { document.documentElement.style.display = 'none'; }

(function () {
  'use strict';

  // Background bicycle: respect reduced motion by freezing the SVG animation
  var ride = document.querySelector('.hero__ride');
  if (ride && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches && ride.pauseAnimations) { ride.pauseAnimations(); }



  var LANG = (document.documentElement.lang || 'en').slice(0, 2);
  var TX = {
    en: { hi: 'Hi Spaakwerk! I\u2019d like to book a repair.', bike: 'Bike: ', problem: 'Problem: ', day: 'Best day: ', you: '(you fill in)', pv: 'Your message: ',
          open: 'Open now until ', same: ' In before 11:00 means same day.', closed: 'Closed now. Opens ', today: 'today', tom: 'tomorrow', at: ' at ', days: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'] },
    it: { hi: 'Ciao Spaakwerk! Vorrei prenotare una riparazione.', bike: 'Bici: ', problem: 'Problema: ', day: 'Giorno preferito: ', you: '(da compilare)', pv: 'Il tuo messaggio: ',
          open: 'Aperto ora fino alle ', same: ' Se arrivi prima delle 11:00 è in giornata.', closed: 'Chiuso ora. Riapre ', today: 'oggi', tom: 'domani', at: ' alle ', days: ['dom','lun','mar','mer','gio','ven','sab'] },
    nl: { hi: 'Hoi Spaakwerk! Ik wil graag een reparatie inplannen.', bike: 'Fiets: ', problem: 'Probleem: ', day: 'Beste dag: ', you: '(vul zelf in)', pv: 'Jouw bericht: ',
          open: 'Nu open tot ', same: ' Voor 11:00 binnen is dezelfde dag.', closed: 'Nu gesloten. Opent ', today: 'vandaag', tom: 'morgen', at: ' om ', days: ['zo','ma','di','wo','do','vr','za'] }
  };
  var T = TX[LANG] || TX.en;
  var VAL = {
    it: { 'city bike': 'bici da città', 'e-bike': 'e-bike', 'cargo bike': 'cargo bike', 'flat tyre': 'gomma bucata', 'brakes': 'freni', 'chain': 'catena', 'a service': 'un tagliando', 'not sure, you tell me': 'non so, dimmelo tu' },
    nl: { 'city bike': 'stadsfiets', 'e-bike': 'e-bike', 'cargo bike': 'bakfiets', 'flat tyre': 'lekke band', 'brakes': 'remmen', 'chain': 'ketting', 'a service': 'onderhoud', 'not sure, you tell me': 'weet ik niet, jullie zeggen het maar' }
  };
  function val(v) { return (VAL[LANG] && VAL[LANG][v]) || v; }
  var PHONE = '31612345678';
  var state = { bike: '', problem: '' };

  function message() {
    var msg = T.hi;
    if (state.bike) { msg += '\n' + T.bike + val(state.bike) + '.'; }
    if (state.problem) { msg += '\n' + T.problem + val(state.problem) + '.'; }
    return msg + '\n' + T.day;
  }

  function waLink() {
    return 'https://wa.me/' + PHONE + '?text=' + encodeURIComponent(message());
  }

  function updateLinks() {
    var links = document.querySelectorAll('a[data-wa]');
    for (var i = 0; i < links.length; i++) { links[i].setAttribute('href', waLink()); }
    var pv = document.getElementById('preview');
    if (pv) { pv.textContent = T.pv + message().replace(/\n/g, ' ').replace(T.day, T.day + T.you); }
  }

  var chips = document.querySelectorAll('.chip');
  for (var i = 0; i < chips.length; i++) {
    chips[i].addEventListener('click', function () {
      var group = this.getAttribute('data-group');
      var siblings = document.querySelectorAll('.chip[data-group="' + group + '"]');
      var wasOn = this.getAttribute('aria-pressed') === 'true';
      for (var j = 0; j < siblings.length; j++) { siblings[j].setAttribute('aria-pressed', 'false'); }
      this.setAttribute('aria-pressed', wasOn ? 'false' : 'true');
      state[group] = wasOn ? '' : this.getAttribute('data-value');
      updateLinks();
    });
  }
  updateLinks();

  // "Open now" line, in Amsterdam time. Page works without it.
  var el = document.getElementById('open-now');
  var st = document.getElementById('status');
  function setOpen(o) { if (st) { st.classList.toggle('is-open', o); st.classList.toggle('is-closed', !o); } }
  if (!el || !window.Intl) { return; }
  try {
    var HOURS = { 1: [9, 18], 2: [9, 18], 3: [9, 18], 4: [9, 17], 5: [9, 18], 6: [10, 16] };
    var DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var SHOW = T.days;
    var parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Amsterdam', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
    var wd = '', h = 0, m = 0;
    for (var k = 0; k < parts.length; k++) {
      if (parts[k].type === 'weekday') { wd = parts[k].value; }
      if (parts[k].type === 'hour') { h = parseInt(parts[k].value, 10) % 24; }
      if (parts[k].type === 'minute') { m = parseInt(parts[k].value, 10); }
    }
    var day = DAYS.indexOf(wd);
    if (day < 0) { return; }
    var now = h + m / 60;
    var today = HOURS[day];
    function pad(n) { return (n < 10 ? '0' : '') + n; }
    if (today && now >= today[0] && now < today[1]) {
      var txt = T.open + pad(today[1]) + ':00.';
      if (now < 11) { txt += T.same; }
      el.textContent = txt;
      setOpen(true);
    } else {
      for (var d = 0; d < 7; d++) {
        var nd = (day + d) % 7, hrs = HOURS[nd];
        if (hrs && (d > 0 || now < hrs[0])) {
          setOpen(false);
          el.textContent = T.closed + (d === 0 ? T.today : (d === 1 ? T.tom : SHOW[nd])) + T.at + pad(hrs[0]) + ':00.';
          break;
        }
      }
    }
  } catch (e) { /* keep static hours text */ }
})();
