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

        $(function () {
            // 화면에서 마우스 움직일 때 실행
            // .cursor가 x, y축으로 따라 움직임
            $(window).on('mousemove', function (e) {
                let mouseX = e.pageX;
                let mouseY = e.pageY;

                console.log(mouseX)
                console.log(mouseY)
                $('.cursor').css({
                    'left': mouseX,
                    'top': mouseY
                });
            });

            // video에게 마우스를 올렸을 때 실행
            // .cursor에게 클래스명 active 추가
            $('video').on('mouseenter', function () {
                $('.cursor').addClass('active');
            });
            // video에게 마우스를 벗어났을 때 실행
            // .cursor에게 클래스명 active 삭제
            $('video').on('mouseleave', function () {
                $('.cursor').removeClass('active');
            });

        });//script end