const sort = document.querySelector('.colab-sort');
const sortToggle = document.querySelector('.sort-toggle');
const sortOptions = document.querySelector('.sort-options');
const sortButtons = document.querySelectorAll('.sort-options > button');
const categoryButtons =
    document.querySelectorAll('.colab-category button');

const colabCards =
    document.querySelectorAll('.colab-grid .colab-card');

const emptyMessage =
    document.querySelector('.colab-empty');

// 카드 filtering
function filterCards(selectedCategory) {

    // visibleCount
    let visibleCount = 0;

    colabCards.forEach((card) => {

        const cardCategory =
            card.dataset.category;

        const matches =
            selectedCategory === 'all' ||
            cardCategory === selectedCategory;

        card.hidden = !matches;

        if (matches) {
            visibleCount++;
        }
    });

    // empty state
    if (visibleCount === 0) {
        emptyMessage.hidden = false;
    } else {
        emptyMessage.hidden = true;
    }
}

categoryButtons.forEach((button) => {

    button.addEventListener('click', () => {

        categoryButtons.forEach((optionButton) => {
            optionButton.setAttribute(
                'aria-pressed',
                'false'
            );
        });

        button.setAttribute(
            'aria-pressed',
            'true'
        );

        const selectedCategory =
            button.dataset.filter;

        filterCards(selectedCategory);
    });

});


function openSort() {
    sortToggle.setAttribute('aria-expanded', 'true');
    sortToggle.setAttribute('aria-label', '정렬 옵션 닫기');
    sortOptions.hidden = false;
}

function closeSort() {
    sortToggle.setAttribute('aria-expanded', 'false');
    sortToggle.setAttribute('aria-label', '정렬 옵션 열기');
    sortOptions.hidden = true;
}

function toggleSort() {
    const isOpen =
        sortToggle.getAttribute('aria-expanded') === 'true';

    if (isOpen) {
        closeSort();
    } else {
        openSort();
    }
}

sortToggle.addEventListener('click', toggleSort);

sortButtons.forEach((button) => {
    button.addEventListener('click', () => {

        sortButtons.forEach((optionButton) => {
            optionButton.setAttribute(
                'aria-pressed',
                'false'
            );
        });

        button.setAttribute(
            'aria-pressed',
            'true'
        );

        closeSort();
        sortToggle.focus();
    });
});

document.addEventListener('keydown', (event) => {
    const isOpen =
        sortToggle.getAttribute('aria-expanded') === 'true';

    if (event.key === 'Escape' && isOpen && sort.contains(document.activeElement)) {
        closeSort();
        sortToggle.focus();
    }
});

document.addEventListener('click', (event) => {
    const clickedOutside = !sort.contains(event.target);

    if (clickedOutside) {
        closeSort();
    }
});

sort.addEventListener('focusout', event => {
    if (event.relatedTarget && !sort.contains(event.relatedTarget)) closeSort();
});
