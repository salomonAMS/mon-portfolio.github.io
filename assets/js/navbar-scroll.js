document.addEventListener('DOMContentLoaded', function () {
    var navbar = document.querySelector('.custom-navbar');
    var offset = 20;
    function onScroll() {
        if (window.scrollY > offset) {
            navbar.classList.add('affix');
        } else {
            navbar.classList.remove('affix');
        }
    }
    window.addEventListener('scroll', onScroll);
    onScroll();
});
