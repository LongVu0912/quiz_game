<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const props = defineProps({
    tableHeaders: Array,
    dataFormat: Array,
    allData: Array,
    findByKeyword: String,
    itemsPerPage: {
        type: Number,
        default: 8
    }
})

const tableHeaders = ref([]);
const dataFormat = ref([]);
const allData = ref([]);
const currentPage = ref(1);
const itemsPerPage = ref(8);
const findByKeyword = ref('');
const searchQuery = ref('');

watch(() => props.allData, (newVal) => {
    allData.value = newVal;
});

watch(() => searchQuery.value, () => {
    currentPage.value = 1;
});

onMounted(() => {
    allData.value = props.allData;
    dataFormat.value = props.dataFormat;
    itemsPerPage.value = props.itemsPerPage;
    findByKeyword.value = props.findByKeyword;
    tableHeaders.value = props.tableHeaders;
});

const totalPages = computed(() => Math.ceil(allData.value.length / itemsPerPage.value));

const pages = computed(() => {
    const maxPagesToShow = 3;
    const current = currentPage.value;
    const total = totalPages.value;
    const half = Math.floor(maxPagesToShow / 2);
    let start = Math.max(1, current - half);
    let end = Math.min(total, current + half);

    if (end - start < maxPagesToShow - 1) {
        if (start === 1) {
            end = Math.min(start + maxPagesToShow - 1, total);
        } else {
            start = Math.max(end - maxPagesToShow + 1, 1);
        }
    }

    const range = [];
    for (let i = start; i <= end; i++) {
        range.push(i);
    }

    return range;
});

const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
    }
}

const filteredData = computed(() => {
    return allData.value.filter(data => {
        const valueAsString = String(data[findByKeyword.value]).toLowerCase();
        return valueAsString.includes(searchQuery.value.toLowerCase());
    });
});

const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return filteredData.value.slice(start, end);
});
</script>

<template>
    <div class="overflow-x-auto mx-12 mt-6 border border-primary rounded-md p-4">
        <div class="flex justify-between items-center">
            <input type="text" v-model="searchQuery" :placeholder="`Search by ${findByKeyword}`"
                   class="input input-bordered w-1/2 sm:w-auto" />
            <slot></slot>
        </div>
        <table class="table">
            <thead>
                <tr>
                    <th v-for="(header, index) in tableHeaders" :key="index" :class="header.class">
                        {{ header.key || header }}
                    </th>
                </tr>
            </thead>
            <tbody v-for="(data, index) in paginatedData" :key="index">
                <tr>
                    <td v-for="(format, formatIndex) in dataFormat" :key="formatIndex" :class="format.tdClass">
                        <!-- Text -->
                        <div v-if="format.type === 'text'"
                             :class="format.objectClass">
                            {{ data[format.key] }}
                        </div>
                        <!-- Button -->
                        <button v-else-if="format.type === 'button'"
                                :class="format.objectClass"
                                @click="format.click(data)">
                            {{ format.label }}
                        </button>
                        <!-- Custom -->
                        <div v-else-if="format.type === 'custom'">
                            <div v-if="data[format.key] == format.value" :class="format.trueClass">
                                {{ data[format.key] }}
                            </div>
                            <div v-else :class="format.falseClass">
                                {{ data[format.key] }}
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>

        <div class="flex justify-end mt-3">
            <div class="flex flex-row items-center">
                <div class="mr-2">Items per page:</div>
                <select class="select select-sm select-bordered mr-4" v-model="itemsPerPage">
                    <option value=5>5</option>
                    <option value=6>6</option>
                    <option value=7>7</option>
                    <option value=8>8</option>
                    <option value=9>9</option>
                    <option value=10>10</option>
                </select>
            </div>
            <div class="flex items-center space-x-1">
                <button
                        class="btn btn-square btn-sm"
                        :disabled="currentPage === 1"
                        @click="goToPage(1)">
                    <i class="fa-solid fa-angles-left"></i>
                </button>
                <button
                        class="btn btn-square btn-sm"
                        :disabled="currentPage === 1"
                        @click="goToPage(currentPage - 1)">
                    <i class="fa-solid fa-angle-left"></i>
                </button>
                <template v-if="pages[0] > 1">
                    <button class="btn btn-square btn-sm" @click="goToPage(1)">1</button>
                    <span>...</span>
                </template>
                <button v-for="page in pages" :key="page" class="btn btn-square btn-sm"
                        :class="{ 'btn-primary': currentPage === page }"
                        @click="goToPage(page)">
                    {{ page }}
                </button>
                <template v-if="pages[pages.length - 1] < totalPages">
                    <span>...</span>
                    <button class="btn btn-square btn-sm" @click="goToPage(totalPages)">{{ totalPages }}</button>
                </template>
                <button class="btn btn-square btn-sm" :disabled="currentPage === totalPages"
                        @click="goToPage(currentPage + 1)">
                    <i class="fa-solid fa-angle-right"></i>
                </button>
                <button class="btn btn-square btn-sm" :disabled="currentPage === totalPages"
                        @click="goToPage(totalPages)">
                    <i class="fa-solid fa-angles-right"></i>
                </button>
            </div>
        </div>
    </div>
</template>