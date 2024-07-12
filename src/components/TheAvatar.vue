<script setup>

const props = defineProps({
    imageSrc: String,
    name: String,
    role: String
});

</script>

<template>
    <div class="flex items-center gap-3">
        <div class="avatar">
            <div class="mask mask-squircle w-12 h-12">
                <img :src="props.imageSrc"
                     alt="none" />
            </div>
        </div>
        <div>
            <div class="font-bold">{{ props.name }}</div>
            <div class="text-sm opacity-50">{{ props.role }}</div>
        </div>
    </div>
</template>