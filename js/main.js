// Ajoutez ici vos scripts personnalisés

document.addEventListener('DOMContentLoaded', function() {
    // Exemple : Animation d'apparition sur la section hero
    const hero = document.querySelector('.hero');
    if(hero) {
        hero.classList.add('animate__animated', 'animate__fadeInDown');
    }

    // Dashboard admin : graphique stats
    if(document.getElementById('adminStatsChart')) {
        const ctx = document.getElementById('adminStatsChart').getContext('2d');
        // Chart.js doit être inclus dans le HTML pour fonctionner
        new window.Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Utilisateurs', 'Publications', 'Données', 'Rendez-vous'],
                datasets: [{
                    label: 'Total',
                    data: [120, 45, 18, 7],
                    backgroundColor: [
                        'rgba(99,102,241,0.7)',
                        'rgba(6,182,212,0.7)',
                        'rgba(16,185,129,0.7)',
                        'rgba(251,191,36,0.7)'
                    ],
                    borderRadius: 8
                }]
            },
            options: {
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } }
            }
        });
    }

    // Recherche globale admin (filtrage simple)
    const globalSearch = document.querySelector('#adminDashboard form.d-flex');
    if(globalSearch) {
        globalSearch.addEventListener('submit', function(e) {
            e.preventDefault();
            const q = globalSearch.querySelector('input[type="search"]').value.toLowerCase();
            // Filtrage sur toutes les tables visibles (exemple simple)
            document.querySelectorAll('.admin-content table').forEach(table => {
                table.querySelectorAll('tbody tr').forEach(row => {
                    row.style.display = Array.from(row.cells).some(cell => cell.textContent.toLowerCase().includes(q)) ? '' : 'none';
                });
            });
        });
    }

    // Filtres dynamiques sur les sections admin (exemple pour utilisateurs)
    const userFilterForm = document.querySelector('#adminUsers form');
    if(userFilterForm) {
        userFilterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const search = userFilterForm.querySelector('#userSearch').value.toLowerCase();
            const role = userFilterForm.querySelector('#userRole').value;
            document.querySelectorAll('#adminUsers table tbody tr').forEach(row => {
                const matchSearch = row.cells[0].textContent.toLowerCase().includes(search) || row.cells[1].textContent.toLowerCase().includes(search);
                const matchRole = !role || row.cells[2].textContent === role;
                row.style.display = (matchSearch && matchRole) ? '' : 'none';
            });
        });
    }
    // Répéter la logique pour les autres sections (publications, données, etc.) si besoin

    // Sidebar admin : toggle responsive
    const sidebarToggle = document.getElementById('sidebarToggle');
    const adminSidebar = document.querySelector('.admin-sidebar');
    if(sidebarToggle && adminSidebar) {
        sidebarToggle.addEventListener('click', function() {
            adminSidebar.classList.toggle('active');
        });
        // Fermer la sidebar si on clique en dehors sur mobile
        document.addEventListener('click', function(e) {
            if(window.innerWidth < 992 && adminSidebar.classList.contains('active')) {
                if(!adminSidebar.contains(e.target) && e.target !== sidebarToggle && !sidebarToggle.contains(e.target)) {
                    adminSidebar.classList.remove('active');
                }
            }
        });
    }

    // Barre de recherche globale dynamique (toutes pages)
    const searchForms = document.querySelectorAll('form[role="search"]');
    searchForms.forEach(form => {
        const input = form.querySelector('input[type="search"]');
        // Création du conteneur suggestions
        let suggestionBox = document.createElement('div');
        suggestionBox.className = 'search-suggestions shadow rounded-4 position-absolute w-100 bg-white';
        suggestionBox.style.display = 'none';
        suggestionBox.style.top = '110%';
        suggestionBox.style.left = '0';
        suggestionBox.style.zIndex = '1000';
        form.appendChild(suggestionBox);

        // Suggestions fictives (à remplacer par une vraie recherche serveur si besoin)
        const suggestions = [
            'Données climatiques',
            'Publications récentes',
            'Partenaires',
            'Événements',
            'FAQ',
            'Contact',
            'Formation',
            'Projets à impact',
            'Utilisateurs',
            'Services premium'
        ];

        input.addEventListener('input', function() {
            const val = input.value.trim().toLowerCase();
            if(val.length > 1) {
                const filtered = suggestions.filter(s => s.toLowerCase().includes(val));
                if(filtered.length) {
                    suggestionBox.innerHTML = filtered.map(s => `<div class='suggestion-item px-3 py-2' tabindex="0">${s}</div>`).join('');
                    suggestionBox.style.display = 'block';
                } else {
                    suggestionBox.innerHTML = `<div class='px-3 py-2 text-muted'>Aucun résultat</div>`;
                    suggestionBox.style.display = 'block';
                }
            } else {
                suggestionBox.style.display = 'none';
            }
        });
        // Navigation clavier et clic sur suggestion
        suggestionBox.addEventListener('click', function(e) {
            if(e.target.classList.contains('suggestion-item')) {
                input.value = e.target.textContent;
                suggestionBox.style.display = 'none';
                form.submit();
            }
        });
        input.addEventListener('keydown', function(e) {
            const items = suggestionBox.querySelectorAll('.suggestion-item');
            let idx = Array.from(items).findIndex(i => i === document.activeElement);
            if(e.key === 'ArrowDown') {
                e.preventDefault();
                if(items.length) {
                    if(idx < items.length - 1) items[idx+1]?.focus();
                    else items[0].focus();
                }
            } else if(e.key === 'ArrowUp') {
                e.preventDefault();
                if(items.length) {
                    if(idx > 0) items[idx-1]?.focus();
                    else items[items.length-1].focus();
                }
            } else if(e.key === 'Escape') {
                suggestionBox.style.display = 'none';
            }
        });
        // Fermer suggestions si clic hors
        document.addEventListener('click', function(e) {
            if(!form.contains(e.target)) suggestionBox.style.display = 'none';
        });
        // Responsive : afficher la barre sur mobile (exemple)
        const mobileToggle = document.createElement('button');
        mobileToggle.className = 'btn btn-gradient d-lg-none ms-2';
        mobileToggle.type = 'button';
        mobileToggle.innerHTML = '<i class="fa fa-search"></i>';
        form.parentNode.insertBefore(mobileToggle, form);
        mobileToggle.addEventListener('click', function() {
            form.classList.toggle('show-mobile-search');
            input.focus();
        });
    });

    // Navbar responsive et dynamique
    var navbars = document.querySelectorAll('.premium-navbar');
    navbars.forEach(function(navbar) {
        var toggler = navbar.querySelector('.navbar-toggler');
        var collapse = navbar.querySelector('.navbar-collapse');
        // Overlay mobile
        var overlay = document.createElement('div');
        overlay.className = 'navbar-mobile-overlay';
        document.body.appendChild(overlay);

        // Animation burger
        toggler.addEventListener('click', function(e) {
            e.stopPropagation();
            collapse.classList.toggle('show');
            toggler.classList.toggle('active');
            overlay.classList.toggle('show');
            if(collapse.classList.contains('show')) {
                collapse.setAttribute('aria-expanded', 'true');
                overlay.style.display = 'block';
                setTimeout(function(){overlay.classList.add('fade-in');}, 10);
            } else {
                collapse.setAttribute('aria-expanded', 'false');
                overlay.classList.remove('fade-in');
                setTimeout(function(){overlay.style.display = 'none';}, 200);
            }
        });
        // Fermer au clic sur overlay ou lien
        overlay.addEventListener('click', closeMenu);
        collapse.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', closeMenu);
        });
        function closeMenu() {
            collapse.classList.remove('show');
            toggler.classList.remove('active');
            overlay.classList.remove('show','fade-in');
            setTimeout(function(){overlay.style.display = 'none';}, 200);
        }
        // Accessibilité : fermer au ESC
        document.addEventListener('keydown', function(e) {
            if(e.key === 'Escape' && collapse.classList.contains('show')) closeMenu();
        });
    });

    // Navbar responsive dynamique
    const burger = document.getElementById('navbarBurger');
    const menu = document.getElementById('navbarMenu');
    if (burger && menu) {
        burger.addEventListener('click', function() {
            burger.classList.toggle('active');
            menu.classList.toggle('open');
            // Empêche le scroll du body quand le menu est ouvert sur mobile
            if(menu.classList.contains('open')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        // Fermer le menu au clic sur un lien (mobile)
        menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if(window.innerWidth < 992) {
                    burger.classList.remove('active');
                    menu.classList.remove('open');
                    document.body.style.overflow = '';
                }
            });
        });
    }
});

// main.js - Nettoyé pour admin et user uniquement

document.addEventListener('DOMContentLoaded', function() {
    // Dashboard admin : graphique stats
    if(document.getElementById('adminStatsChart')) {
        const ctx = document.getElementById('adminStatsChart').getContext('2d');
        new window.Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Utilisateurs', 'Publications', 'Données', 'Rendez-vous'],
                datasets: [{
                    label: 'Total',
                    data: [120, 45, 18, 7],
                    backgroundColor: [
                        'rgba(99,102,241,0.7)',
                        'rgba(6,182,212,0.7)',
                        'rgba(16,185,129,0.7)',
                        'rgba(251,191,36,0.7)'
                    ],
                    borderRadius: 8
                }]
            },
            options: {
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } }
            }
        });
    }

    // Sidebar admin : toggle responsive
    const sidebarToggle = document.getElementById('sidebarToggle');
    const adminSidebar = document.querySelector('.admin-sidebar');
    if(sidebarToggle && adminSidebar) {
        sidebarToggle.addEventListener('click', function() {
            adminSidebar.classList.toggle('active');
        });
        document.addEventListener('click', function(e) {
            if(window.innerWidth < 992 && adminSidebar.classList.contains('active')) {
                if(!adminSidebar.contains(e.target) && e.target !== sidebarToggle && !sidebarToggle.contains(e.target)) {
                    adminSidebar.classList.remove('active');
                }
            }
        });
    }

    // Recherche globale admin (filtrage simple)
    const globalSearch = document.querySelector('#adminDashboard form.d-flex');
    if(globalSearch) {
        globalSearch.addEventListener('submit', function(e) {
            e.preventDefault();
            const q = globalSearch.querySelector('input[type="search"]').value.toLowerCase();
            document.querySelectorAll('.admin-content table').forEach(table => {
                table.querySelectorAll('tbody tr').forEach(row => {
                    row.style.display = Array.from(row.cells).some(cell => cell.textContent.toLowerCase().includes(q)) ? '' : 'none';
                });
            });
        });
    }

    // Filtres dynamiques sur les sections admin (exemple pour utilisateurs)
    const userFilterForm = document.querySelector('#adminUsers form');
    if(userFilterForm) {
        userFilterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const search = userFilterForm.querySelector('#userSearch').value.toLowerCase();
            const role = userFilterForm.querySelector('#userRole').value;
            document.querySelectorAll('#adminUsers table tbody tr').forEach(row => {
                const matchSearch = row.cells[0].textContent.toLowerCase().includes(search) || row.cells[1].textContent.toLowerCase().includes(search);
                const matchRole = !role || row.cells[2].textContent === role;
                row.style.display = (matchSearch && matchRole) ? '' : 'none';
            });
        });
    }
    // (Répéter la logique pour les autres sections si besoin)
});
