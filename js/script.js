/**
 * Nitish's Travel Blog — Main JavaScript
 * ----------------------------------------
 * Features:
 *  1. Navbar scroll behaviour (transparent → white)
 *  2. Active nav-link highlighting based on scroll position
 *  3. Destination card filter
 *  4. Lightbox (photo gallery modal)
 *  5. Contact form validation & simulated submission
 *  6. Newsletter form quick-subscribe
 *  7. Back-to-top button
 *  8. Scroll-triggered fade-in animations
 *  9. Footer year auto-update
 *
 * No dependencies beyond Bootstrap 5 (already loaded via CDN).
 * All paths are relative — safe for AWS S3 + CloudFront hosting.
 */

'use strict';

/* ─── Wait for DOM ────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initActiveNavLinks();
    initDestinationFilter();
    initLightbox();
    initContactForm();
    initNewsletterForm();
    initBackToTop();
    initScrollAnimations();
    setFooterYear();
});

/* ─── 1. Navbar scroll behaviour ─────────────────────────────────────────── */
function initNavbar() {
    const nav = document.getElementById('mainNav');
    if (!nav) return;

    const onScroll = () => {
        if (window.scrollY > 60) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load
}

/* ─── 2. Active nav-link highlighting ────────────────────────────────────── */
function initActiveNavLinks() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('#mainNav .nav-link');

    if (!sections.length || !navLinks.length) return;

    const highlight = () => {
        let current = '';
        sections.forEach(sec => {
            // Activate the link when the section top is within the top 40% of the viewport
            if (window.scrollY >= sec.offsetTop - window.innerHeight * 0.4) {
                current = sec.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', highlight, { passive: true });
    highlight();
}

/* ─── 3. Destination card filter ─────────────────────────────────────────── */
function initDestinationFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const destItems = document.querySelectorAll('.dest-item');

    if (!filterBtns.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            destItems.forEach(item => {
                const match = filter === 'all' || item.dataset.category === filter;
                // Smooth toggle via CSS class
                if (match) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });
}

/* ─── 4. Lightbox (gallery modal) ────────────────────────────────────────── */
function initLightbox() {
    const modal = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCap = document.getElementById('lightboxCaption');
    const galleryLinks = document.querySelectorAll('.gallery-item');

    if (!modal || !lightboxImg) return;

    galleryLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const imgSrc = link.dataset.img || link.getAttribute('href');
            const caption = link.dataset.caption || '';

            lightboxImg.src = imgSrc;
            lightboxImg.alt = caption;
            if (lightboxCap) lightboxCap.textContent = caption;
        });
    });

    // Clear image src when modal closes (avoids flash of old image)
    modal.addEventListener('hidden.bs.modal', () => {
        lightboxImg.src = '';
        if (lightboxCap) lightboxCap.textContent = '';
    });
}

/* ─── 5. Contact form validation & simulated submission ──────────────────── */
function initContactForm() {
    const form = document.getElementById('contactForm');
    const alertBox = document.getElementById('formAlert');
    const submitBtn = document.getElementById('submitBtn');

    if (!form) return;

    form.addEventListener('submit', e => {
        e.preventDefault();
        e.stopPropagation();

        // Bootstrap built-in validation classes
        form.classList.add('was-validated');

        if (!form.checkValidity()) {
            showAlert(alertBox, 'danger', '<i class="bi bi-exclamation-circle me-2"></i>Please fill in all required fields.');
            return;
        }

        // Collect values (for real backend integration later)
        const payload = {
            name: document.getElementById('contactName').value.trim(),
            email: document.getElementById('contactEmail').value.trim(),
            subject: document.getElementById('contactSubject').value.trim(),
            message: document.getElementById('contactMessage').value.trim(),
            newsletter: document.getElementById('newsletterCheck').checked,
        };

        // Simulate async submission
        setSubmitLoading(submitBtn, true);

        setTimeout(() => {
            setSubmitLoading(submitBtn, false);
            form.reset();
            form.classList.remove('was-validated');
            showAlert(
                alertBox,
                'success',
                `<i class="bi bi-check-circle me-2"></i>Thanks, <strong>${escapeHtml(payload.name)}</strong>! Your message has been sent. I'll get back to you soon.`
            );
            console.info('Form payload (demo):', payload); // replace with fetch() call when backend is ready
        }, 1500);
    });
}

/** Toggle loading spinner on submit button */
function setSubmitLoading(btn, isLoading) {
    if (!btn) return;
    const text = btn.querySelector('.btn-text');
    const spinner = btn.querySelector('.btn-spinner');
    btn.disabled = isLoading;
    if (text) text.classList.toggle('d-none', isLoading);
    if (spinner) spinner.classList.toggle('d-none', !isLoading);
}

/** Show a Bootstrap alert inside the given container element */
function showAlert(container, type, html) {
    if (!container) return;
    container.className = `alert alert-${type} alert-dismissible fade show`;
    container.innerHTML = `${html}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>`;
    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/** Basic HTML escape to prevent XSS in alert message */
function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

/* ─── 6. Newsletter quick-subscribe (footer) ─────────────────────────────── */
function initNewsletterForm() {
    const form = document.getElementById('newsletterForm');
    if (!form) return;

    form.addEventListener('submit', e => {
        e.preventDefault();
        const emailInput = form.querySelector('input[type="email"]');
        const submitBtn = form.querySelector('button[type="submit"]');

        if (!emailInput || !emailInput.value) return;

        // Simulate subscription
        const original = submitBtn.textContent;
        submitBtn.textContent = '✓ Done!';
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.textContent = original;
            submitBtn.disabled = false;
            emailInput.value = '';
        }, 3000);
    });
}

/* ─── 7. Back-to-top button ──────────────────────────────────────────────── */
function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    }, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ─── 8. Scroll-triggered fade-in animations ─────────────────────────────── */
function initScrollAnimations() {
    // Add the animation class to the elements we want to animate
    const targets = [
        '.dest-card',
        '.tip-card',
        '.gallery-item',
        '.stat-card',
    ];

    targets.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.classList.add('animate-on-scroll');
        });
    });

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    // Once animated, stop observing to save resources
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12 } // trigger when 12% of element is visible
    );

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
}

/* ─── 9. Footer year ─────────────────────────────────────────────────────── */
function setFooterYear() {
    const el = document.getElementById('footerYear');
    if (el) el.textContent = new Date().getFullYear();
}
