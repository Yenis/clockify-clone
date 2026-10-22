// Switching between the pages of the app: Timer, Reports, and the privacy policy
// and terms of service.
// The page is part of the address (#timer, #reports, #privacy, #terms), so it stays the same
// after reloading, and the browser's Back button goes to the previous page.

const PAGES = ['timer', 'reports', 'privacy', 'terms'];
const PAGE_TITLES = {
  timer: 'Time Tracker',
  reports: 'Reports · Time Tracker',
  privacy: 'Privacy policy · Time Tracker',
  terms: 'Terms of service · Time Tracker',
};

// The page named in the address, or the timer when it names none we know.
function currentPage() {
  const name = location.hash.slice(1);
  return PAGES.includes(name) ? name : 'timer';
}

function showPage() {
  const page = currentPage();
  for (const section of document.querySelectorAll('[data-page]')) {
    section.hidden = section.dataset.page !== page;
  }
  for (const link of document.querySelectorAll('[data-page-link]')) {
    if (link.dataset.pageLink === page) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  }
  document.title = PAGE_TITLES[page];
  // The reports may have changed while another page was shown, for example after midnight.
  if (page === 'reports' && typeof renderReports === 'function') renderReports();
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', showPage);
showPage();
