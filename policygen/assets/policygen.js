/* policygen: fill a short form, get a privacy policy, terms, cookie, refund or disclaimer text. Everything is built in the browser. */
(function () {
  'use strict';
  var d = document, SYG = window.SYG, F = d.getElementById('pg');
  if (!F) return;
  var type = F.getAttribute('data-type'), out = d.getElementById('pg-out'), preset = {};
  try { preset = JSON.parse(F.getAttribute('data-preset') || '{}'); } catch (e) {}
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  function today() { var n = new Date(); return n.getDate() + ' ' + MONTHS[n.getMonth()] + ' ' + n.getFullYear(); }
  function v(id) { var e = F.elements[id]; return e ? e.value.trim() : ''; }
  function on(id) { var e = F.elements[id]; return !!(e && e.checked); }
  function list(a) { return a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1]; }
  function blank(s, hint) { return s || '[' + hint + ']'; }

  /* a document = array of blocks: {h: heading, p: [paragraphs], ul: [items]} */
  function collected() {
    var a = [];
    if (on('c_contact')) a.push('your name, email address and message when you use our contact form or write to us');
    if (on('c_news')) a.push('your email address if you subscribe to our newsletter or updates');
    if (on('c_account')) a.push('your name, email address and password (stored in a protected form) when you create an account');
    if (on('c_order')) a.push('your name, delivery address, phone number and order details when you place an order');
    if (on('c_comment')) a.push('the name, email address and comment you enter when you comment on our pages');
    if (on('c_ugc')) a.push('the content you upload or post, such as text, photos or files');
    if (on('c_analytics')) a.push('technical information about your visit, such as pages viewed, device type, browser, approximate location and referring site');
    if (on('c_ads')) a.push('information collected by advertising partners through cookies and similar technologies, such as your browsing on this site and the ads shown to you');
    return a;
  }
  function partners() {
    var a = [];
    [['t_ga', 'Google Analytics (website statistics)'], ['t_adsense', 'Google AdSense (advertising)'], ['t_pay', 'a payment provider such as Razorpay, Stripe or PayPal (payments)'],
     ['t_mail', 'an email service such as Mailchimp or Brevo (newsletters)'], ['t_video', 'YouTube or Vimeo (embedded videos)'], ['t_meta', 'Meta (Facebook and Instagram) pixel or plug-ins (social features)'],
     ['t_cf', 'Cloudflare (security and speed)'], ['t_host', 'our hosting provider (storing the site and its data)']].forEach(function (p) { if (on(p[0])) a.push(p[1]); });
    var other = v('t_other');
    if (other) other.split(',').forEach(function (s) { s = s.trim(); if (s) a.push(s); });
    return a;
  }
  function region() { return v('country'); }

  function privacy() {
    var name = blank(v('name'), 'Site name'), owner = blank(v('owner'), 'Your name or business'), email = blank(v('email'), 'Contact email'), url = v('url'), reg = region();
    var col = collected(), par = partners(), B = [];
    B.push({ h: 'Privacy Policy of ' + name, p: ['Last updated: ' + (v('date') || today()) + '.', 'This policy explains what personal information ' + owner + ' ("we", "us") collects through ' + name + (url ? ' (' + url + ')' : '') + ', why we collect it, who it may be shared with and what choices you have. By using the site you accept this policy. If you do not agree with it, please do not use the site.'] });
    B.push({ h: 'Information we collect', p: [col.length ? 'Depending on how you use the site, we may collect:' : 'We do not ask you to create an account or fill in forms on this site, and we do not knowingly collect personal information that identifies you directly. Like most websites, our server records standard technical logs such as IP address, browser type and the pages requested.'], ul: col.length ? col.map(function (x) { return x.charAt(0).toUpperCase() + x.slice(1) + '.'; }) : [] });
    var why = ['to run the site and provide the service you asked for'];
    if (on('c_contact')) why.push('to reply to your messages');
    if (on('c_news')) why.push('to send updates you subscribed to; every message has an unsubscribe link');
    if (on('c_order')) why.push('to process, deliver and support your orders, and to keep records the law requires');
    if (on('c_account')) why.push('to keep your account secure and let you sign in');
    if (on('c_analytics')) why.push('to understand which pages are useful and to improve the site');
    if (on('c_ads')) why.push('to show advertising, which helps keep the site free');
    why.push('to protect the site against spam, abuse and fraud');
    B.push({ h: 'How we use it', p: ['We use the information:'], ul: why.map(function (x) { return x.charAt(0).toUpperCase() + x.slice(1) + '.'; }) });
    B.push({ h: 'Cookies and similar technologies', p: [on('c_cookies') || on('c_analytics') || on('c_ads') ?
      'We and our partners use cookies, small files stored in your browser. Some are necessary for the site to work (for example to remember a setting). ' + (on('c_analytics') ? 'Others measure how the site is used. ' : '') + (on('c_ads') ? 'Others are used by advertising partners to show and measure ads, which may include ads based on your interests. ' : '') + 'You can block or delete cookies in your browser settings; some parts of the site may then work less well.' :
      'We do not use cookies for tracking. If a cookie or local storage is used, it is only to remember a setting such as light or dark mode on your own device.'] });
    if (par.length) B.push({ h: 'Who we share it with', p: ['We do not sell your personal information. We use the following services, which may process some information on our behalf under their own privacy terms:'], ul: par.map(function (x) { return x.charAt(0).toUpperCase() + x.slice(1) + '.'; }).concat(['We may also share information when the law requires it, or to protect our rights and the safety of others.']) });
    else B.push({ h: 'Who we share it with', p: ['We do not sell your personal information and we do not share it with third parties for marketing. We may share information when the law requires it, or to protect our rights and the safety of others.'] });
    var ret = v('retention');
    B.push({ h: 'How long we keep it', p: ['We keep personal information ' + (ret || 'only for as long as it is needed for the purposes above or as the law requires') + ', and then delete it or make it anonymous.'] });
    B.push({ h: 'Security', p: ['We take reasonable steps to protect information, including encrypted connections (HTTPS) and limited access. No method of transmission or storage is completely secure, so we cannot promise absolute security.'] });
    if (on('children')) B.push({ h: 'Children', p: ['The site is not meant for children under 13 (or the minimum age in your country), and we do not knowingly collect their information. If you believe a child has sent us personal information, write to us at ' + email + ' and we will delete it.'] });
    if (reg === 'in' || reg === 'all') B.push({ h: 'Your rights under Indian law', p: ['If you are in India, the Digital Personal Data Protection Act, 2023 gives you rights over your personal data. You may ask us for a summary of the personal data we process and the others it has been shared with, ask us to correct, complete, update or erase it, and withdraw consent you gave earlier. You may nominate another person to exercise these rights if you die or become unable to. To use a right or make a complaint, write to us at ' + email + '; we will answer grievances as quickly as we can and in any case within 90 days. If we do not resolve your grievance you may approach the Data Protection Board of India.'] });
    if (reg === 'eu' || reg === 'all') B.push({ h: 'Your rights in the EU, EEA and UK', p: ['If the GDPR (or the UK GDPR) applies to you, you have the right to access your data, correct it, have it erased, restrict or object to its use, receive it in a portable form and withdraw consent at any time. You may also complain to your local data protection authority. We process data on these legal bases: your consent, performance of a contract, our legitimate interests (running and securing the site) and compliance with legal obligations.'] });
    if (reg === 'us' || reg === 'all') B.push({ h: 'Your rights in the United States', p: ['Some US states, such as California, give residents the right to know what personal information a business collects, to ask for deletion or correction, and to opt out of the sale or sharing of personal information. We do not sell personal information. To use a right, write to us at ' + email + '. We will not treat you unfairly for doing so.'] });
    B.push({ h: 'Links to other sites', p: ['The site may link to other websites. We do not control them and are not responsible for their privacy practices. Please read their policies.'] });
    B.push({ h: 'Changes to this policy', p: ['We may update this policy from time to time. The date at the top shows when it was last changed. Continued use of the site after a change means you accept the updated policy.'] });
    B.push({ h: 'Contact us', p: ['For questions, requests or complaints about your personal information, write to ' + owner + ' at ' + email + (v('address') ? ' or at ' + v('address') : '') + '.'] });
    return B;
  }

  function terms() {
    var name = blank(v('name'), 'Site name'), owner = blank(v('owner'), 'Your name or business'), email = blank(v('email'), 'Contact email'), law = blank(v('law'), 'State or country whose law applies'), age = v('age') || '13', B = [];
    B.push({ h: 'Terms of Use of ' + name, p: ['Last updated: ' + (v('date') || today()) + '.', 'These terms are an agreement between you and ' + owner + ' ("we", "us") about your use of ' + name + (v('url') ? ' (' + v('url') + ')' : '') + '. By using the site you agree to them. If you do not agree, please do not use the site.'] });
    B.push({ h: 'Who may use the site', p: ['You must be at least ' + age + ' years old. If you are younger than 18, use the site with the knowledge of a parent or guardian. You must give correct information wherever the site asks for it.'] });
    B.push({ h: 'What you may and may not do', p: ['You may use the site for lawful, personal purposes. You agree not to:'], ul: ['break any law or the rights of others;', 'try to gain unauthorised access to the site, its servers or other users\' accounts;', 'upload viruses or send spam;', 'copy, scrape or resell the site\'s content in bulk without our written permission;', 'use the site in a way that harms it or other users.'] });
    if (on('ugc')) B.push({ h: 'Content you post', p: ['You keep ownership of what you post. By posting it you give us a non-exclusive, worldwide licence to display it on the site and to store and copy it as needed to run the site. You promise that you have the right to post it and that it does not break the law or anyone\'s rights. We may remove content, or close accounts, that break these terms.'] });
    B.push({ h: 'Our content', p: ['Unless a page says otherwise, the text, design, logo and other material on the site belong to us or are used with permission. You may share a link to a page and quote short extracts with credit, but you may not republish a whole page or the site\'s material as your own.'] });
    if (on('paid')) B.push({ h: 'Paid services', p: ['Prices are shown on the site and may change for future orders. Payment is taken through the payment provider named at checkout. Our refund policy forms part of these terms and is available on the site.'] });
    B.push({ h: 'No guarantee', p: ['We try to keep the site accurate and available, but it is provided "as is" without promises that it will be error-free, uninterrupted or suitable for a particular purpose. Information on the site is general and is not professional advice.'] });
    B.push({ h: 'Limit of liability', p: ['To the extent the law allows, we are not liable for any indirect or consequential loss, or for loss of data, profit or business, arising from your use of the site. Nothing in these terms limits liability that cannot be limited by law.'] });
    B.push({ h: 'Links to other sites', p: ['The site may link to websites run by others. We do not control them and are not responsible for them.'] });
    B.push({ h: 'Changes and ending access', p: ['We may change these terms or the site at any time. The date at the top shows the latest version. We may suspend or end your access if you break these terms.'] });
    B.push({ h: 'Governing law', p: ['These terms are governed by the law of ' + law + ', and the courts there have jurisdiction, unless your local consumer law gives you the right to go to the courts of your own country.'] });
    B.push({ h: 'Contact', p: ['Questions about these terms: ' + email + '.'] });
    return B;
  }

  function cookie() {
    var name = blank(v('name'), 'Site name'), owner = blank(v('owner'), 'Your name or business'), email = blank(v('email'), 'Contact email'), B = [];
    var rows = [['Necessary', 'Keep the site working, for example remembering your light or dark setting or keeping you signed in. They cannot be switched off here.']];
    if (on('c_analytics')) rows.push(['Statistics', 'Count visits and show which pages are used, so we can improve the site. Usually provided by ' + (on('t_ga') ? 'Google Analytics' : 'an analytics service') + '.']);
    if (on('c_ads')) rows.push(['Advertising', 'Used by advertising partners ' + (on('t_adsense') ? '(such as Google AdSense) ' : '') + 'to show ads and measure them, and sometimes to show ads based on your interests.']);
    if (on('t_video') || on('t_meta')) rows.push(['Embedded content', 'Set by videos or social features that we embed, such as ' + list([on('t_video') ? 'YouTube or Vimeo' : '', on('t_meta') ? 'Meta plug-ins' : ''].filter(Boolean)) + '.']);
    B.push({ h: 'Cookie Policy of ' + name, p: ['Last updated: ' + (v('date') || today()) + '.', owner + ' uses cookies and similar technologies on ' + name + '. This page explains what they are and how you can control them.'] });
    B.push({ h: 'What cookies are', p: ['A cookie is a small text file that a website stores in your browser. Similar technologies, such as local storage, work in the same way. Cookies let a site remember you between pages and visits.'] });
    B.push({ h: 'The kinds we use', p: ['The site uses these kinds of cookies:'], ul: rows.map(function (r) { return r[0] + ': ' + r[1]; }) });
    B.push({ h: 'Your choices', p: ['Where the law requires it, we ask for your consent before setting cookies that are not necessary. You can change your mind at any time by clearing cookies in your browser. All major browsers let you block or delete cookies from their settings or privacy menu. If you block all cookies, parts of the site may not work.', on('c_ads') ? 'You can also manage personalised advertising from the settings pages of the advertising partners, for example Google\'s ad settings, or opt out of interest-based ads through industry opt-out tools.' : ''].filter(Boolean) });
    B.push({ h: 'Changes', p: ['We may update this policy when we change the cookies we use. The date at the top shows the latest version.'] });
    B.push({ h: 'Contact', p: ['Questions about cookies: ' + email + '.'] });
    return B;
  }

  function refund() {
    var name = blank(v('name'), 'Store name'), owner = blank(v('owner'), 'Your name or business'), email = blank(v('email'), 'Contact email'), days = v('days') || '7', proc = v('proc') || '7', ship = v('ship'), B = [];
    B.push({ h: 'Refund and Return Policy of ' + name, p: ['Last updated: ' + (v('date') || today()) + '.', 'We want you to be happy with what you buy from ' + owner + '. This policy explains when you can return an item or get your money back.'] });
    if (on('physical')) B.push({ h: 'Physical goods', p: ['You may ask for a return or replacement within ' + days + ' days of receiving your order if the item is damaged, defective, not what you ordered or arrived incomplete. Please send photos of the item and the packing and keep the original packing. Items that are used, washed, altered or missing parts are not eligible unless they were faulty on arrival.' + (ship === 'we' ? ' We pay the return shipping when the problem is our mistake or the item is faulty.' : ship === 'you' ? ' Return shipping is paid by you unless the item is faulty or we sent the wrong item.' : '')] });
    if (on('digital')) B.push({ h: 'Digital products and downloads', p: ['Because a digital product can be copied once it is delivered, we do not give refunds after it has been downloaded or accessed, except where the file is faulty and we cannot fix it, or where the law gives you the right to a refund.'] });
    if (on('service')) B.push({ h: 'Services and bookings', p: ['If you cancel a booked service at least ' + days + ' days before the start date, we refund what you paid after any payment-provider charges. After that date, or once work has started, the part of the fee for work already done is not refunded.'] });
    B.push({ h: 'How to ask for a refund', p: ['Write to ' + email + ' with your order number, the reason and any photos. We will reply within 2 working days and tell you whether the request is accepted and what happens next.'] });
    B.push({ h: 'How and when you are paid back', p: ['Approved refunds go back to the original payment method within ' + proc + ' working days of approval. Your bank or card company may take a few more days to show it. Where you paid cash on delivery, we will ask for a bank account or UPI ID to send the money to.'] });
    B.push({ h: 'Cancelling an order', p: ['You may cancel an order before it is shipped by writing to us. Once it has shipped, please follow the return steps above.'] });
    B.push({ h: 'Your legal rights', p: ['This policy does not take away any right you have under the consumer law of your country.'] });
    return B;
  }

  function disclaimer() {
    var name = blank(v('name'), 'Site name'), owner = blank(v('owner'), 'Your name or business'), email = blank(v('email'), 'Contact email'), B = [];
    B.push({ h: 'Disclaimer of ' + name, p: ['Last updated: ' + (v('date') || today()) + '.', 'Please read this disclaimer before using ' + name + ', run by ' + owner + '.'] });
    B.push({ h: 'General information only', p: ['Everything on this site is published for general information. We try to keep it accurate and up to date, but we make no promise that it is complete or current. Please check important facts with an official source before you act on them.'] });
    if (on('d_pro')) B.push({ h: 'Not professional advice', p: ['The site is not a substitute for advice from a qualified lawyer, accountant, doctor or other professional. Nothing here creates a client or professional relationship.'] });
    if (on('d_health')) B.push({ h: 'Health', p: ['Health content is for education only. It does not diagnose or treat any condition. See a qualified doctor for your own situation, and do not delay or ignore medical advice because of something you read here.'] });
    if (on('d_money')) B.push({ h: 'Money and investments', p: ['Content about money, tax or investing is general and is not personal financial advice or a recommendation to buy or sell anything. Returns are not guaranteed and investments can lose value.'] });
    if (on('d_results')) B.push({ h: 'No guaranteed results', p: ['Examples, stories and results shown are not promises. Your results will depend on your own effort, circumstances and many other factors.'] });
    if (on('d_aff')) B.push({ h: 'Affiliate links', p: ['Some links on the site are affiliate links. If you buy through them we may earn a commission at no extra cost to you. It does not change our opinion, and we only recommend things we believe are useful.'] });
    if (on('d_ads')) B.push({ h: 'Advertising', p: ['The site shows advertisements from third parties. We do not control their content and do not endorse the products they advertise.'] });
    B.push({ h: 'External links', p: ['We link to other websites for your convenience. We are not responsible for their content or accuracy.'] });
    B.push({ h: 'Views', p: ['Opinions expressed are those of the author or commenter and not necessarily of anyone else.'] });
    B.push({ h: 'Use at your own risk', p: ['You use the site and its information at your own risk. To the extent the law allows, we are not liable for any loss arising from its use.'] });
    B.push({ h: 'Contact', p: ['Questions: ' + email + '.'] });
    return B;
  }

  var MAKE = { privacy: privacy, terms: terms, cookie: cookie, refund: refund, disclaimer: disclaimer };
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function toText(B) {
    return B.map(function (b, i) {
      var t = (i ? b.h.toUpperCase() : b.h) + '\n' + (b.p || []).join('\n\n');
      if (b.ul && b.ul.length) t += '\n' + b.ul.map(function (x) { return '- ' + x; }).join('\n');
      return t;
    }).join('\n\n');
  }
  function toHtml(B) {
    return B.map(function (b, i) {
      return '<h' + (i ? 2 : 1) + '>' + esc(b.h) + '</h' + (i ? 2 : 1) + '>\n' + (b.p || []).map(function (x) { return '<p>' + esc(x) + '</p>'; }).join('\n') +
        (b.ul && b.ul.length ? '\n<ul>' + b.ul.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' : '');
    }).join('\n');
  }
  var cur = [];
  function draw() {
    cur = MAKE[type]();
    var h = '';
    cur.forEach(function (b, i) {
      h += '<h' + (i ? 3 : 2) + '>' + esc(b.h) + '</h' + (i ? 3 : 2) + '>' + (b.p || []).map(function (x) { return '<p>' + esc(x).replace(/\[([^\]]+)\]/g, '<mark class="ph">[$1]</mark>') + '</p>'; }).join('') +
        (b.ul && b.ul.length ? '<ul>' + b.ul.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' : '');
    });
    out.innerHTML = h;
    var left = out.querySelectorAll('mark.ph').length, st = d.getElementById('pg-left');
    if (st) st.textContent = left ? left + ' blank' + (left > 1 ? 's' : '') + ' still to fill in (yellow)' : 'No blanks left. Read it once more before you publish.';
  }
  /* presets from the page (data-preset): set checkboxes and values */
  Object.keys(preset).forEach(function (k) {
    var e = F.elements[k]; if (!e) return;
    if (e.type === 'checkbox') e.checked = !!preset[k]; else e.value = preset[k];
  });
  try { var saved = JSON.parse(localStorage.getItem('pg-owner') || '{}'); ['owner', 'email', 'name', 'url', 'country', 'address'].forEach(function (k) { if (saved[k] && F.elements[k] && !F.elements[k].value) F.elements[k].value = saved[k]; }); } catch (e) {}
  F.addEventListener('input', function () {
    draw();
    try { var s = {}; ['owner', 'email', 'name', 'url', 'country', 'address'].forEach(function (k) { if (F.elements[k]) s[k] = F.elements[k].value; }); localStorage.setItem('pg-owner', JSON.stringify(s)); } catch (e) {}
  });
  F.addEventListener('submit', function (e) { e.preventDefault(); });
  d.addEventListener('click', function (e) {
    var b = e.target.closest('[data-act]'); if (!b) return;
    var a = b.getAttribute('data-act');
    if (a === 'copy') SYG.copy(toText(cur), 'Copied');
    else if (a === 'html') SYG.copy(toHtml(cur), 'Copied as HTML');
    else if (a === 'txt') {
      var blob = new Blob([toText(cur)], { type: 'text/plain' }), l = d.createElement('a');
      l.href = URL.createObjectURL(blob); l.download = type + '-policy.txt'; d.body.appendChild(l); l.click(); l.remove();
    } else if (a === 'print') { d.body.classList.add('pl'); window.print(); setTimeout(function () { d.body.classList.remove('pl'); }, 500); }
  });
  draw();
})();
