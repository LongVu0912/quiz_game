<script setup>
import TheHeader from '../components/TheHeader.vue'
import TheLoading from '../components/TheLoading.vue';
import TheTable from '../components/TheTable.vue';
import { toastNotification } from '../utils';
import { ref, onMounted } from 'vue';

const isLoading = ref(true);
const allData = ref([]);

const fetchData = async () => {
    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbwURG2HkBRYPGwBxvfBpq8tkgSJBUapjxvvRjt3-1dwX1tujSzinRtxDchQ_X3lAdIN/exec');
        if (!response.ok) {
            toastNotification('Failed to fetch quiz data', "error", 2000);
        }
        const data = await response.json();
        allData.value = data;
    } catch (error) {
        toastNotification(error.message, "error", 2000);
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    fetchData();
});

// Answers
const currentQuestionId = ref(0);

const openAnswerModal = (question) => {
    currentQuestionId.value = question.id;
    answer_modal.showModal();
};

</script>

<template>
    <TheHeader />
    <TheLoading v-if="isLoading" />
    <TheTable v-else
              :tableHeaders="[
                { key: 'ID', class: '' },
                { key: 'QUESTION', class: '' },
                { key: 'ANSWERS', class: 'text-center' },
            ]"
              :dataFormat="[
                { type: 'text', key: 'id' },
                { type: 'text', key: 'question', tdClass: 'font-bold' },
                { type: 'button', label: 'Answers', tdClass: 'text-center', objectClass: 'btn btn-sm btn-primary', click: openAnswerModal },
            ]"
              :allData="allData"
              :itemsPerPage=8
              findByKeyword="question">
    </TheTable>

    <dialog id="answer_modal" class="modal">
        <div class="modal-box w-11/12 max-w-5xl">
            <form method="dialog">
                <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            <h3 class="text-lg font-bold">Question: {{ currentQuestionId }}</h3>
            <div class="flex flex-col">
                <div v-for="(answer, index) in allData[currentQuestionId - 1]?.answers" :key="index">
                    <div v-if="allData[currentQuestionId - 1]?.correctAnswer == index"
                         class="border-4 border-success rounded-md mt-3 p-2">
                        <strong>
                            Answer {{ index }}:
                        </strong>
                        {{ answer }}
                    </div>
                    <div v-else class="border-2 border-neutral rounded-md mt-3 p-2">
                        <strong>
                            Answer {{ index }}:
                        </strong>
                        {{ answer }}
                    </div>
                </div>
            </div>
        </div>
    </dialog>
</template>