// R1/R10/R12: small, local interactions. Main content is never cloned.
(() => {
    // Global Navigation / Drawer

    const menu = document.querySelector('.gnb');
    const trigger = document.querySelector('#menu-toggle');
    const drawer = document.querySelector('#site-drawer');
    const drawerPanel = drawer.querySelector('.site-drawer-panel');
    const drawerClose = drawer.querySelector('.drawer-close');
    const drawerBackdrop = drawer.querySelector('.drawer-backdrop');
    const drawerPrimary = drawer.querySelector('.drawer-primary');
    const deviceToggle = drawer.querySelector('.device-toggle');
    const devicePanel = drawer.querySelector('#drawer-device-panel');
    const compactHeader = matchMedia('(max-width: 1009px)');

    /* Responsive Primary Paths */
    function updateDrawerNavigation() {
        drawerPrimary.hidden = !compactHeader.matches;
    }

    /* Device Utility */
    function closeDevicePanel() {
        devicePanel.hidden = true;

        deviceToggle.setAttribute(
            'aria-expanded',
            'false'
        );
    }

    function toggleDevicePanel() {
        const open = deviceToggle.getAttribute('aria-expanded') !== 'true';

        deviceToggle.setAttribute(
            'aria-expanded',
            String(open)
        );

        devicePanel.hidden = !open;
    }

    deviceToggle.addEventListener(
        'click',
        toggleDevicePanel
    );


    /* Drawer */

    function openDrawer() {
        updateDrawerNavigation();

        drawer.hidden = false;

        closeDevicePanel();

        drawerPanel.scrollTop = 0;
        drawerPanel.classList.remove('is-scrolled');

        document.body.classList.add('drawer-open');

        trigger.setAttribute('aria-expanded', 'true');
        trigger.setAttribute('aria-label', '메뉴 닫기');

        drawerClose.focus({
            preventScroll: true
        });
    }


    function closeDrawer(returnFocus = false) {
        if (drawer.hidden) {
            return;
        }

        drawer.hidden = true;

        document.body.classList.remove(
            'drawer-open'
        );

        closeDevicePanel();

        drawerPanel.scrollTop = 0;
        drawerPanel.classList.remove(
            'is-scrolled'
        );

        trigger.setAttribute(
            'aria-expanded',
            'false'
        );

        trigger.setAttribute(
            'aria-label',
            '메뉴 열기'
        );

        if (returnFocus) {
            trigger.focus();
        }
    }

    function updateDrawerScrollState() {
        drawerPanel.classList.toggle(
            'is-scrolled',
            drawerPanel.scrollTop > 0
        );
    }

    drawerPanel.addEventListener(
        'scroll',
        updateDrawerScrollState,
        { passive: true }
    );

    /* Menu Button */

    trigger.addEventListener(
        'click',
        () => {

            if (drawer.hidden) {
                openDrawer();
                return;
            }

            closeDrawer(true);
        }
    );


    /* Close Button */

    drawerClose.addEventListener(
        'click',
        () => {
            closeDrawer(true);
        }
    );


    /* Backdrop */

    drawerBackdrop.addEventListener(
        'click',
        () => {
            closeDrawer(true);
        }
    );


    /* Escape */

    document.addEventListener(
        'keydown',
        (event) => {

            if (event.key !== 'Escape') {
                return;
            }

            /* Drawer가 열려 있다면 Drawer가 우선 */
            if (!drawer.hidden) {
                closeDrawer(true);
                return;
            }

            /*  Desktop Mega Menu
                1. Keyboard focus로 열린 GNB Item
                2. Pointer hover로 열린 GNB Item
                둘 다 Escape dismiss 대상으로 처리한다. */
            const focusedItem =
                menu.contains(document.activeElement)
                    ? document.activeElement.closest('.gnb-item')
                    : null;

            const hoveredItem =
                menu.querySelector('.gnb-item:hover');

            /* Focus / Hover 어느 쪽에서도 열린 항목이 없으면 종료 */
            const openItems =
                [
                    ...new Set(
                        [
                            focusedItem,
                            hoveredItem
                        ].filter(Boolean)
                    )
                ];
            if (!openItems.length) {
                return;
            }

            /* Keyboard로 submenu 내부에 있었다면 Prent Link로 focus를 돌린다.
                clss를 추가하기 전에 focus를 이동하는 이유:
                아래 focusin handler가 dismiss 상태를 즉지 제거하지 않도록 하기 위해서다. */
            if (focusedItem) {
                focusedItem
                    .querySelector(':scope > a')
                    ?.focus();
            }

            /* 실제 Dropdown dismiss */
            openItems.forEach((item) => {
                item.classList.add('is-dismissed');
            });
        }
    );


    /* Desktop Mega Menu */

    /* Keyboard로 새 GNB Item에 진입하면 이전 dismiss 상태를 해제한다.
        Hover Escape 이후 pointer가 아직 Item 위에 있어도
        사용자가 keyboard navigation으로 다시 진입한다면
        focus interaction을 정상적으로 사용할 수 있다. */
    menu.addEventListener('focusin', (event) => {
        const currentItem =
            event.target.closest('.gnb-item');

        currentItem
            ?.classList.remove('is-dismissed');
    });

    /* Focus와 pointer가 모두 항목을 벗어나면 dismiss 상태를 초기화한다.
       Pointer가 남아 있다면 focus 이동만으로 다시 열리지 않도록 유지한다. */
    menu.addEventListener('focusout', (event) => {
        const currentItem =
            event.target.closest('.gnb-item');

        if (
            currentItem &&
            !currentItem.contains(event.relatedTarget) &&
            !currentItem.matches(':hover')
        ) {
            currentItem.classList.remove('is-dismissed');
        }
    });

    /* pointerenter / pointerleave는 자식 요소 사이를 이동할 때 발생하지 않는다.
       Escape 이후 같은 항목 안에서 움직여도 닫힘을 유지하고,
       항목 밖으로 나갔다가 재진입하면 pointer 접근을 다시 허용한다. */
    menu.querySelectorAll('.gnb-item')
        .forEach((item) => {
            item.addEventListener('pointerenter', () => {
                item.classList.remove('is-dismissed');
            });

            item.addEventListener('pointerleave', () => {
                /* Escape로 Parent에 복귀한 focus가 남아 있으면
                   pointer 이탈만으로 :focus-within 메뉴가 다시 열리지 않게 한다. */
                if (!item.contains(document.activeElement)) {
                    item.classList.remove('is-dismissed');
                }
            });
        });


    /* =========================
       Drawer Focus Trap
    ========================= */

    drawer.addEventListener(
        'keydown',
        (event) => {

            if (event.key !== 'Tab') {
                return;
            }

            const focusable =
                [
                    ...drawer.querySelectorAll(
                        `
                    a[href],
                    button:not([disabled]):not([tabindex="-1"])
                    `
                    )
                ]
                    .filter((element) => {

                        return (
                            !element.closest('[hidden]') &&
                            element.offsetParent !== null
                        );
                    });


            if (!focusable.length) {
                return;
            }


            const first =
                focusable[0];

            const last =
                focusable[
                focusable.length - 1
                ];


            /*
                Shift + Tab
                first → last
            */

            if (
                event.shiftKey &&
                document.activeElement === first
            ) {
                event.preventDefault();
                last.focus();
                return;
            }


            /*
                Tab
                last → first
            */

            if (
                !event.shiftKey &&
                document.activeElement === last
            ) {
                event.preventDefault();
                first.focus();
            }
        }
    );

    let desktopNavHadFocus = false;

    menu.addEventListener('focusin', () => {
        if (!compactHeader.matches) {
            desktopNavHadFocus = true;
        }
    });

    menu.addEventListener('focusout', () => {
        requestAnimationFrame(() => {
            if (
                !compactHeader.matches &&
                !menu.contains(document.activeElement)
            ) {
                desktopNavHadFocus = false;
            }
        });
    });


    /* Breakpoint Change */
    compactHeader.addEventListener('change', (event) => {
        const focusWasInDesktopNav =
            event.matches && desktopNavHadFocus;

        const focusWasInDrawer =
            !drawer.hidden &&
            drawer.contains(document.activeElement);

        const shouldRestoreFocusToMenu =
            focusWasInDesktopNav || focusWasInDrawer;

        if (!drawer.hidden) {
            closeDrawer();
        }

        updateDrawerNavigation();

        if (shouldRestoreFocusToMenu) {
            requestAnimationFrame(() => {
                trigger.focus({ preventScroll: true });
                desktopNavHadFocus = false;
            });
        }
    });


    updateDrawerNavigation();

    const compactFooter = matchMedia('(max-width: 720px)');
    const toggles = [...document.querySelectorAll('.footer-toggle')];
    const company = document.querySelector('.footer-company');
    const locale = document.querySelector('.locale-selector');
    const bottom = document.querySelector('.footer-bottom');
    const footer = document.querySelector('.site-footer');
    let footerFocusedElement = null;
    let footerWasCompact = compactFooter.matches;

    // Keep ownership through a breakpoint-induced blur, as the Header does.
    document.addEventListener('focusin', (event) => {
        footerFocusedElement = footer.contains(event.target) ? event.target : null;
    });
    footer.addEventListener('focusout', () => {
        if (compactFooter.matches === footerWasCompact) {
            footerFocusedElement = null;
            return;
        }
        requestAnimationFrame(() => {
            if (!footer.contains(document.activeElement)) footerFocusedElement = null;
        });
    });

    function updateFooter() {
        const focusedElement = footer.contains(document.activeElement)
            ? document.activeElement
            : footerFocusedElement;
        let focusTarget = company.contains(focusedElement) ? focusedElement : null;

        // Move the existing group to keep visual and keyboard reading order identical.
        if (compactFooter.matches) bottom.prepend(company);
        else locale.after(company);
        toggles.forEach(button => {
            const panel = document.getElementById(button.getAttribute('aria-controls'));
            if (compactFooter.matches && panel.contains(focusedElement)) focusTarget = button;
            if (!compactFooter.matches && focusedElement === button) focusTarget = panel.querySelector('a[href]') || locale;
            button.disabled = !compactFooter.matches;
            button.setAttribute('aria-expanded', String(!compactFooter.matches));
            button.querySelector('span').textContent = '+';
            panel.hidden = compactFooter.matches;
        });

        // Restore only after the destination is visible and enabled.
        footerWasCompact = compactFooter.matches;
        focusTarget?.focus();
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
        closeDrawer();
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
        if (searchMatch) searchMatch.scrollIntoView({ block: 'center' });
        searchMatch = null;
    });

    const buttons =
        [...document.querySelectorAll('.header-right button')];

    buttons[0].addEventListener('click', () => {
        openUtility(
            buttons[0],
            '페이지 내 검색',
            `
        <form id="site-search">
            <label>
                검색어
                <input
                    type="search"
                    name="query"
                    required
                    placeholder="상품·컬렉션 이름"
                >
            </label>

            <button type="submit">
                이 페이지에서 찾기
            </button>

            <p id="search-status" role="status"></p>
        </form>
        `
        );

        document
            .querySelector('#site-search')
            .addEventListener('submit', (event) => {
                event.preventDefault();

                const query =
                    event.target.elements.query.value
                        .trim()
                        .toLocaleLowerCase();

                const candidates =
                    [...document.querySelectorAll('main a')]
                        .filter((link) => {
                            const hiddenParent =
                                link.closest('[hidden], [inert]');

                            return !hiddenParent;
                        });

                const match =
                    candidates.find((link) => {
                        const text =
                            link.textContent
                                .trim()
                                .toLocaleLowerCase();

                        return text.includes(query);
                    });

                const status =
                    document.querySelector('#search-status');

                if (!query || !match) {
                    status.textContent =
                        '현재 표시된 콘텐츠에서 일치하는 항목을 찾지 못했습니다.';
                    return;
                }

                searchMatch = match;
                dialog.close();
            });
    });
    buttons[1].addEventListener('click', () => {
        openUtility(buttons[1], '계정 · 포트폴리오 데모',
            '<p>계정 화면 안내용 데모입니다. 실제 로그인 및 회원 정보 처리는 지원하지 않습니다.</p>');
    });
    buttons[2].addEventListener('click', () => {
        openUtility(buttons[2], '장바구니 · 포트폴리오 데모',
            '<p>장바구니 안내용 데모입니다. 상품 저장, 주문 및 결제는 지원하지 않습니다.</p>');
    });
    locale.addEventListener('click', () => {
        openUtility(locale, '국가 및 통화 · 포트폴리오 데모',
            '<p>현재 표시는 한국 (KRW)입니다. 실제 국가 및 통화 변경은 지원하지 않습니다.</p>');
    });
    document.querySelectorAll('.request-form, .newsletter-form').forEach(form => {
        form.addEventListener('submit', event => {
            event.preventDefault();
            form.querySelector('[role="status"]').textContent =
                '포트폴리오 데모입니다. 입력 내용은 실제 전송되거나 저장되지 않습니다.';
        });
    });
})();
