<script setup>
import { ref, onMounted } from 'vue';
import { capitalizeFirstLetter } from '../utils/index.js';

const themes = ["light", "dark", "cupcake", "bumblebee", "emerald", "corporate", "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden", "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black", "luxury", "dracula", "cmyk", "autumn", "business", "acid", "lemonade", "night", "coffee", "winter", "dim", "nord", "sunset"];
const currentTheme = ref(localStorage.getItem('theme') || "light");

const isDrawerOpen = ref(false);

const closeDrawer = () => {
    isDrawerOpen.value = false;
};

onMounted(() => {
    document.documentElement.setAttribute('data-theme', currentTheme.value);
});

const changeTheme = (theme) => {
    currentTheme.value = theme;
    localStorage.setItem('theme', currentTheme.value);
    document.documentElement.setAttribute('data-theme', currentTheme.value);
};

</script>

<template>
    <div class="navbar bg-base-200">
        <div class="flex">
            <input id="my-drawer" type="checkbox" class="drawer-toggle" v-model="isDrawerOpen" />
            <div class="drawer-content">
                <label for="my-drawer" class="btn drawer-button btn-square btn-ghost"><svg
                         xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                         class="inline-block w-5 h-5 stroke-current">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M4 6h16M4 12h16M4 18h16">
                        </path>
                    </svg>
                </label>
            </div>
            <div class="drawer-side">
                <label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
                <ul class="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
                    <li class="items-center font-bold text-xl">QUIZ</li>
                    <li class="font-medium mt-1" @click="closeDrawer">
                        <RouterLink to="/" active-class="bg-primary text-primary-content">
                            <i class="fa-regular fa-circle-question"></i>
                            Quiz
                        </RouterLink>
                    </li>
                    <li class="font-medium mt-1" @click="closeDrawer">
                        <RouterLink to="/setting" active-class="bg-primary text-primary-content">
                            <i class="fa-solid fa-gear"></i>
                            Setting
                        </RouterLink>
                    </li>
                </ul>
            </div>
        </div>
        <div class="flex-1">
            <a class="btn btn-ghost text-xl">QUIZ</a>
        </div>
        <div class="navbar-end">
            <div title="Change Theme" class="dropdown dropdown-end">
                <div tabIndex="0" role="button" class="btn mr-2 btn-neutral">{{ capitalizeFirstLetter(currentTheme) }}
                </div>
                <div tabindex="0"
                     class="dropdown-content z-[1] bg-base-200 text-base-content rounded-box top-px h-[28.6rem] max-h-[calc(100vh-10rem)] w-56 overflow-y-auto border border-white/5 shadow-2xl outline outline-1 outline-black/5 mt-16">
                    <div class="grid grid-cols-1 gap-3 p-3">
                        <span v-for="(theme, index) in themes" :key="index">
                            <button class="btn btn-outline btn-block"
                                    @click="changeTheme(theme)">{{ capitalizeFirstLetter(theme) }}</button>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.drawer-side {
    z-index: 1000;
}
</style>