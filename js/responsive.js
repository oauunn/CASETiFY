// R1/R10/R12: small, local interactions. Main content is never cloned.
(() => {
    const menu = document.querySelector('.gnb');
    const trigger = document.querySelector('#menu-toggle');
    const compactHeader = matchMedia('(max-width: 1009px)');
    function closeMenu(returnFocus = false) {
        menu.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
        trigger.setAttribute('aria-label', '메뉴 열기');
        if (returnFocus) trigger.focus();
    }
    trigger.addEventListener('click', () => {
        const open = trigger.getAttribute('aria-expanded') !== 'true';
        menu.classList.toggle('is-open', open);
        menu.classList.remove('is-dismissed');
        trigger.setAttribute('aria-expanded', String(open));
        trigger.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
        if (open) menu.querySelector('a').focus();
    });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && menu.classList.contains('is-open')) closeMenu(true);
        else if (event.key === 'Escape' && menu.contains(document.activeElement)) {
            menu.classList.add('is-dismissed');
            document.activeElement.closest('.gnb-item').querySelector('a').focus();
        }
    });
    menu.addEventListener('focusout', event => {
        if (!menu.contains(event.relatedTarget)) { closeMenu(); menu.classList.remove('is-dismissed'); }
    });
    menu.addEventListener('pointerover', () => menu.classList.remove('is-dismissed'));
    document.addEventListener('click', event => {
        if (!menu.contains(event.target) && !trigger.contains(event.target)) closeMenu();
    });
    compactHeader.addEventListener('change', () => closeMenu(menu.contains(document.activeElement)));

    const compactFooter = matchMedia('(max-width: 720px)');
    const toggles = [...document.querySelectorAll('.footer-toggle')];
    const company = document.querySelector('.footer-company');
    const locale = document.querySelector('.locale-selector');
    const bottom = document.querySelector('.footer-bottom');
    function updateFooter() {
        // Move the existing group to keep visual and keyboard reading order identical.
        if (compactFooter.matches) bottom.prepend(company);
        else locale.after(company);
        toggles.forEach(button => {
            const panel = document.getElementById(button.getAttribute('aria-controls'));
            button.disabled = false;
            if (compactFooter.matches && panel.contains(document.activeElement)) button.focus();
            if (!compactFooter.matches && document.activeElement === button) panel.querySelector('a')?.focus();
            button.disabled = !compactFooter.matches;
            button.setAttribute('aria-expanded', String(!compactFooter.matches));
            button.querySelector('span').textContent = '+';
            panel.hidden = compactFooter.matches;
        });
    }
    toggles.forEach(button => button.addEventListener('click', () => {
        const open = button.getAttribute('aria-expanded') !== 'true';
        button.setAttribute('aria-expanded', String(open));
        button.querySelector('span').textContent = open ? '−' : '+';
        document.getElementById(button.getAttribute('aria-controls')).hidden = !open;
    }));
    compactFooter.addEventListener('change', updateFooter);
    updateFooter();

    const dialog = document.querySelector('.utility-dialog');
    let opener;
    function openUtility(button, title, html) {
        closeMenu();
        opener = button;
        document.querySelector('#utility-title').textContent = title;
        document.querySelector('#utility-content').innerHTML = html;
        dialog.showModal();
    }
    document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
    let searchMatch;
    dialog.addEventListener('close', () => {
        const target = searchMatch || opener;
        target?.focus();
        if (searchMatch) searchMatch.scrollIntoView({block: 'center'});
        searchMatch = null;
    });
    const buttons = [...document.querySelectorAll('.header-right button')];
    buttons[0].addEventListener('click', () => {
        openUtility(buttons[0], '상품 검색', '<form id="site-search"><label>검색어<input type="search" name="query" required placeholder="케이스, 스트랩…"></label><button type="submit">이 페이지에서 찾기</button><p id="search-status" role="status"></p></form>');
        document.querySelector('#site-search').addEventListener('submit', event => {
            event.preventDefault();
            const query = event.target.elements.query.value.trim().toLocaleLowerCase();
            const match = [...document.querySelectorAll('main .product-card-link, main .case-shortcut a, main .product-shortcut a')].find(a => a.textContent.toLocaleLowerCase().includes(query));
            if (!query || !match) document.querySelector('#search-status').textContent = '일치하는 상품이 없습니다. 영문 상품명이나 다른 검색어로 다시 찾아보세요.';
            else { searchMatch = match; dialog.close(); }
        });
    });
    buttons[1].addEventListener('click', () => openUtility(buttons[1], '계정', '<p>회원 서비스는 CASETiFY 공식 사이트에서 이용할 수 있습니다.</p><a href="https://www.casetify.com/user/orders">공식 사이트 주문 현황 확인 →</a>'));
    buttons[2].addEventListener('click', () => openUtility(buttons[2], '장바구니', '<p>이 포트폴리오에서는 장바구니와 결제를 제공하지 않습니다. 상품 카드를 선택하면 공식 상품 페이지로 이동합니다.</p><a href="https://www.casetify.com/phone-cases?DG=Phones">공식 사이트에서 쇼핑하기 →</a>'));
    locale.addEventListener('click', () => openUtility(locale, '국가 및 통화', '<p>현재 포트폴리오는 한국어 · KRW 화면입니다. 국가별 서비스는 공식 사이트에서 선택할 수 있습니다.</p><a href="https://www.casetify.com/">공식 사이트 방문 →</a>'));
    document.querySelector('.newsletter-form').addEventListener('submit', event => {
        event.preventDefault();
        document.querySelector('#newsletter-status').textContent = '포트폴리오 데모입니다. 입력한 이메일은 전송·저장되지 않으며 실제 구독은 신청되지 않습니다.';
    });
})();
