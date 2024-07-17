<script setup>
import { useRouter } from 'vue-router';
import { usePointStore } from '../stores/point'
import TheHeader from '../components/TheHeader.vue';

const pointStore = usePointStore();
const router = useRouter();

const goHome = () => {
    router.push('/');
};

</script>

<template>
    <TheHeader />
    <section class="py-32 px-4 mx-auto max-w-screen-xl">
        <div class="mx-auto max-w-screen-sm text-center">
            <h1
                class="mb-4 text-7xl tracking-tight font-extrabold text-base-content">
                {{ pointStore.point }}
            </h1>
            <p class="mb-4 text-3xl tracking-tight font-bold text-base-content">Your Point</p>
            <button class="btn btn-primary btn-md mt-4" @click="goHome">HOME</button>
        </div>
    </section>
</template>