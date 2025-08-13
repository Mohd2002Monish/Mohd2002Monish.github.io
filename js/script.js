new WOW().init();

var frm = document.querySelector("#contact");
frm.addEventListener("submit", (e) => {
    e.preventDefault();
    let name = document.getElementById("name").value;
    let messege = document.getElementById("messege").value;
    var win = window.open(`https://wa.me/+918532083765?text=Hi%20I%27m%20${name},%20${messege}`, "_blank");
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute("href")).scrollIntoView({
            behavior: "smooth",
            block: "center",
        });
    });
});

var typed = new Typed("#typed", {
    stringsElement: "#typed-strings",
    typeSpeed: 70,
    backSpeed: 10,
    loop: true,
});
//

const work = new Siema({
    selector: ".siema",
    duration: 200,
    easing: "ease-out",
    perPage: 1,
    startIndex: 0,
    draggable: true,
    multipleDrag: true,
    threshold: 20,
    loop: true,
    rtl: false,
    onInit: () => {},
    onChange: () => {},
});
setInterval(() => work.next(), 3000);

const skills = new Siema({
    perPage: {
        768: 1,
        992: 3,
    },
    selector: "",
    duration: 150,
    easing: "",
    startIndex: 0,
    draggable: true,
    multipleDrag: true,
    threshold: 20,
    loop: true,
    rtl: false,
    onInit: () => {},
    onChange: () => {},
});
setInterval(() => skills.next(), 2000);

// New Responsive Navbar JavaScript
document.addEventListener("DOMContentLoaded", function () {
    const navToggle = document.getElementById("nav-toggle");
    const navMenu = document.getElementById("nav-menu");
    const navbar = document.querySelector(".new-navbar");

    // Toggle mobile menu
    if (navToggle && navMenu) {
        navToggle.addEventListener("click", function () {
            navMenu.classList.toggle("active");
            navToggle.classList.toggle("active");
        });

        // Close menu when clicking on a nav link
        const navLinks = document.querySelectorAll(".nav-link");
        navLinks.forEach((link) => {
            link.addEventListener("click", function () {
                navMenu.classList.remove("active");
                navToggle.classList.remove("active");
            });
        });

        // Close menu when clicking outside
        document.addEventListener("click", function (e) {
            if (!navbar.contains(e.target)) {
                navMenu.classList.remove("active");
                navToggle.classList.remove("active");
            }
        });
    }

    // Navbar scroll effect
    window.addEventListener("scroll", function () {
        if (window.scrollY > 100) {
            navbar.style.background = "rgba(255, 255, 255, 0.98)";
            navbar.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.15)";
        } else {
            navbar.style.background = "rgba(255, 255, 255, 0.95)";
            navbar.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)";
        }
    });

    // Smooth scrolling for nav links
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    navLinks.forEach((link) => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            const targetId = this.getAttribute("href");
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: "smooth",
                });
            }
        });
    });
});
