
/* 메뉴 */
$(function () {
    
            // 메뉴 버튼 클릭 시 토글
            $('.menu-btn').on('click', function (e) {
                e.stopPropagation(); // 이벤트 전파 방지
                $('.menu-nav').toggleClass('active');
                $('body').toggleClass('active');
            });

            // 문서 전체 클릭 시
            $(document).on('click', function (e) {
                // 메뉴가 열려 있고, 클릭한 곳이 메뉴 내부나 버튼이 아닐 때 닫기
                if (
                    $('.menu-nav').hasClass('active') &&
                    !$(e.target).closest('.menu-nav, .menu-btn').length
                ) {
                    $('.menu-nav').removeClass('active');
                    $('body').removeClass('active');
                }
            });
        });