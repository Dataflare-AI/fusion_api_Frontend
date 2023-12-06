<template>
    <div>
        <nav class="navbar navbar-dark bg-dark">
            <div class="container-fluid">
                <button class="navbar-toggler" type="button" @click="toggleSidebar">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <a class="navbar-brand" href="/">fusion_api</a>
            </div>
        </nav>

        <div class="container-fluid">
            <div class="row">
                <!-- Barra lateral -->
                <nav id="sidebar" :class="{ 'active': isSidebarActive, 'd-none': !isSidebarActive }">
                    <div class="position-sticky">
                        <ul class="nav flex-column">
                            <li class="nav-item">
                                <router-link to="/" class="nav-link" exact>
                                    Home
                                </router-link>
                            </li>
                            <li class="nav-item">
                                <router-link to="/about" class="nav-link">
                                    About
                                </router-link>
                            </li>
                            <li class="nav-item">
                                <router-link to="/import" class="nav-link">
                                    Importar
                                </router-link>
                            </li>
                            <li class="nav-item">
                                <router-link to="/viewFiles" class="nav-link">
                                    View Files
                                </router-link>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#">
                                    Support
                                </a>
                            </li>
                        </ul>
                    </div>
                </nav>

                <!-- Conteúdo principal -->
                <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4" :class="{ 'collapsed': !isSidebarActive }">
                    <router-view></router-view>
                </main>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            isSidebarActive: false,
        };
    },
    methods: {
        toggleSidebar() {
            this.isSidebarActive = !this.isSidebarActive;
        },
        handleResize() {
            this.isSidebarActive = window.innerWidth >= 768;
        },
    },
    mounted() {
        window.addEventListener("resize", this.handleResize);
        this.handleResize();
    },
    beforeDestroy() {
        window.removeEventListener("resize", this.handleResize);
    },
};
</script>

<style scoped>
#sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 230px;
    z-index: 1;
    padding-top: 60px;
    background-color: #212529;
    color: #ffffff;
    transition: width 0.3s ease;
}

.navbar {
    position: fixed;
    width: 100%;
    z-index: 2;
    background-color: #212529;
}

.nav-link {
    padding: 10px;
    text-decoration: none;
    color: #ffffff;
}

.nav-link:hover {
    background-color: #333;
}

/* Adicione outros estilos conforme necessário */

/* Adaptação para telas menores */
@media (max-width: 767px) {
    #sidebar {
        width: 0;
    }

    #sidebar.active {
        width: 230px;
    }

    .navbar-toggler {
        display: block;
    }

    main.collapsed {
        margin-left: 0;
    }
}

/* Esconde o botão hamburguer em telas maiores */
@media (min-width: 768px) {
    .navbar-toggler {
        display: none;
    }
}
</style>
