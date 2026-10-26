const bannerViewport = document.querySelector('.header-banner-viewport');
const bannerSlides = [...document.querySelectorAll('.header-banner-slide')];

// 현재 공지만 키보드로 접근할 수 있도록 처리
function syncBanner(activeIndex) {
    bannerSlides.forEach((slide, index) => {
        slide.inert = index !== activeIndex;
    });
}

if (bannerViewport && typeof Swiper !== 'undefined') {
    const banner = bannerViewport.closest('.header-banner');
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    const bannerSwiper = new Swiper(bannerViewport, {
        loop: true,
        speed: reducedMotion.matches ? 0 : 300,

        autoplay: reducedMotion.matches ? false : {
            delay: 5000,
            disableOnInteraction: true
        },

        navigation: {
            prevEl: '.header-banner-prev',
            nextEl: '.header-banner-next',
            addIcons: false
        },

        a11y: {
            prevSlideMessage: '이전 공지 보기',
            nextSlideMessage: '다음 공지 보기',
            slideRole: 'listitem',
            itemRoleDescriptionMessage: '공지',
            slideLabelMessage: '{{index}} / {{slidesLength}}'
        },

        on: {
            init(swiper) {
                syncBanner(swiper.realIndex);
            },
            slideChange(swiper) {
                syncBanner(swiper.realIndex);
            }
        }
    });

    // 읽거나 조작하기 시작하면 자동 전환을 멈추고 다시 시작하지 않음
    const stopBannerAutoplay = () => bannerSwiper.autoplay.stop();
    banner.addEventListener('focusin', stopBannerAutoplay);
    banner.addEventListener('pointerdown', stopBannerAutoplay);

    reducedMotion.addEventListener('change', () => {
        bannerSwiper.params.speed = reducedMotion.matches ? 0 : 300;
        if (reducedMotion.matches) stopBannerAutoplay();
    });
}
