/* Template: div-basic-09 — contact details and accessible form. */
(() => {
  const runtime = window.md2siteDivTemplates;
  if (!runtime) return;
  runtime.register('div-basic-09', (section) => {
    const { escapeHtml } = runtime.helpers;
    const meta = section.meta;
    const contacts = section.items.map((item) => `<div class="contact-item"><span>${escapeHtml(item.title)}</span><strong>${escapeHtml(item.description)}</strong></div>`).join('');
    return `<section class="section template-div template-div-basic-09"><div class="container contact-grid"><div><span class="eyebrow">${escapeHtml(meta.eyebrow || '')}</span><h2 class="title-lg">${escapeHtml(meta.title || '')}</h2><p class="lead">${escapeHtml(meta.description || '')}</p><div class="contact-list">${contacts}</div></div><div class="contact-form-slot" data-contact-form-slot><form id="contact-form" class="contact-form" data-contact-form novalidate><div class="form-grid"><div class="field"><label for="name">${escapeHtml(meta.form_name || 'Họ và tên *')}</label><input id="name" name="name" autocomplete="name" required></div><div class="field"><label for="email">${escapeHtml(meta.form_email || 'Email *')}</label><input id="email" name="email" type="email" autocomplete="email" required></div><div class="field full"><label for="company">${escapeHtml(meta.form_company || 'Công ty / dự án')}</label><input id="company" name="company" autocomplete="organization"></div><div class="field full"><label for="message">${escapeHtml(meta.form_message || 'Nội dung *')}</label><textarea id="message" name="message" required placeholder="${escapeHtml(meta.form_placeholder || '')}" aria-describedby="message-note"></textarea></div></div><button class="btn btn-primary form-submit" type="submit">${escapeHtml(meta.submit_label || 'Gửi nội dung')}</button><p class="form-note" id="message-note">${escapeHtml(meta.form_note || '')}</p><div class="form-status" data-form-status aria-live="polite"></div></form></div></div></section>`;
  });
})();
