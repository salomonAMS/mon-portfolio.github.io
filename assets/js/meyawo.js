/*!
=========================================================
* Meyawo Landing page
=========================================================

* Copyright: 2019 DevCRUD (https://devcrud.com)
* Licensed: (https://devcrud.com/licenses)
* Coded by www.devcrud.com

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// smooth scroll
$(document).ready(function(){
    $(".navbar .nav-link").on('click', function(event) {

        if (this.hash !== "") {

            event.preventDefault();

            var hash = this.hash;

            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 700, function(){
                window.location.hash = hash;
            });
        } 
    });
});

// navbar toggle
$('#nav-toggle').click(function(){
    $(this).toggleClass('is-active')
    $('ul.nav').toggleClass('show');
});

// Si vous souhaitez importer navbar-scroll.js ici, sinon laissez vide
// import './navbar-scroll.js';

// Script pour la navbar détachée au scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.custom-navbar');
    const scrollPosition = window.scrollY;
    
    if (scrollPosition > 100) {
        navbar.classList.add('navbar-detached');
    } else {
        navbar.classList.remove('navbar-detached');
    }
});

// Gestion du curseur unique
document.addEventListener('DOMContentLoaded', function() {
    const firstLine = document.querySelector('.typewriter');
    
    // Supprimer le curseur après 4 secondes (fin de l'animation + délai)
    setTimeout(() => {
        if (firstLine) {
            firstLine.style.borderRight = 'none';
        }
    }, 4000);
});
