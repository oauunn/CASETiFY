// Existing Swiper retained. Inactive campaign links must not receive keyboard focus.
const viewport = document.querySelector('.hero-viewport');
const slides = [...document.querySelectorAll('.hero-slide')];
const count = document.querySelector('.hero-count');
function syncCampaign(activeIndex) {
    slides.forEach((slide, index) => { slide.inert = index !== activeIndex; });
    count.textContent = `${activeIndex + 1} / ${slides.length}`;
}
if (typeof Swiper !== 'undefined') {
    new Swiper(viewport, {
        loop: true,
        speed: matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 300,
        navigation: { nextEl: '.hero-button-next', prevEl: '.hero-button-prev' },
        a11y: { enabled: true, prevSlideMessage: '이전 슬라이드', nextSlideMessage: '다음 슬라이드' },
        on: { init(swiper) { syncCampaign(swiper.realIndex); }, slideChange(swiper) { syncCampaign(swiper.realIndex); } }
    });
} else {
    // A CDN failure still leaves all campaigns reachable through the existing controls.
    let active = 0;
    const show = () => { slides.forEach((slide, index) => { slide.hidden = index !== active; }); syncCampaign(active); };
    document.querySelector('.hero-button-prev').addEventListener('click', () => { active = (active + slides.length - 1) % slides.length; show(); });
    document.querySelector('.hero-button-next').addEventListener('click', () => { active = (active + 1) % slides.length; show(); });
    show();
}

// R5: native focus scrolling may reveal only part of the last snap card.
document.querySelector('.case-shortcut').addEventListener('focusin', event => {
    const link = event.target.closest('a');
    if (link) link.scrollIntoView({ block: 'nearest', inline: 'center' });
});
