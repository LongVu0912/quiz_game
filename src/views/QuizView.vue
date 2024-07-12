<script setup>
import { ref, onMounted, watch } from 'vue';
import TheHeader from '../components/TheHeader.vue';
import TheLoading from '../components/TheLoading.vue';

const timePerQuestion = 5;

const isLoading = ref(true);
const allData = ref([]);
const currentQuestionId = ref(1);
const timeCounter = ref(timePerQuestion);
const showAnswer = ref(false);
const selectedAnswerIndex = ref(null);

let timer = null;

const fetchData = async () => {
    try {
        const response = await fetch('/quiz.json');
        if (!response.ok) {
            throw new Error('Failed to fetch quiz data');
        }
        const data = await response.json();
        allData.value = data;
    } catch (error) {
        console.error('Error fetching quiz data:', error);
    } finally {
        isLoading.value = false;
    }
};

const startTimer = () => {
    clearTimeout(timer);
    timeCounter.value = timePerQuestion;
    showAnswer.value = false;

    timer = setInterval(() => {
        if (timeCounter.value > 0) {
            timeCounter.value--;
        } else {
            showAnswer.value = true;
            clearInterval(timer);
        }
    }, 1000);
};

const previousQuestion = () => {
    selectedAnswerIndex.value = null;
    if (currentQuestionId.value > 1) {
        currentQuestionId.value--;
        startTimer();
    }
};

const nextQuestion = () => {
    selectedAnswerIndex.value = null;
    if (currentQuestionId.value < allData.value.length) {
        currentQuestionId.value++;
        startTimer();
    }
};

onMounted(() => {
    fetchData();
    startTimer();
});

watch(currentQuestionId, () => {
    startTimer();
});

</script>

<template>
    <TheHeader />
    <TheLoading v-if="isLoading" />
    <div v-else>
        <div class="text-center font-bold text-3xl pt-4">{{ timeCounter }}</div>
        <div class="overflow-x-auto mx-20 mt-4 rounded-md p-4">
            <div v-if="allData.length > 0">
                <div class="text-center font-medium text-xl">
                    Question {{ currentQuestionId }}: {{ allData[currentQuestionId - 1].question }}
                </div>
                <div v-for="(answer, index) in allData[currentQuestionId - 1]?.answers" :key="index">
                    <div @click="selectedAnswerIndex = index"
                         :class="{
                            'border-4 border-error rounded-md mt-6 p-2': selectedAnswerIndex === index && showAnswer && allData[currentQuestionId - 1]?.correctAnswer !== index, // Show wrong answer
                            'border-4 border-success rounded-md mt-6 p-2': showAnswer && allData[currentQuestionId - 1]?.correctAnswer == index, // Show correct answer
                            'border-4 border-warning rounded-md mt-6 p-2': selectedAnswerIndex === index && !showAnswer, // Show selected answer
                            'border-2 border-primary rounded-md mt-6 p-2': !(showAnswer && allData[currentQuestionId - 1]?.correctAnswer == index) && selectedAnswerIndex !== index // Show default
                        }">
                        <strong>Answer {{ index }}:</strong> {{ answer }}
                    </div>
                </div>
                <div class="flex justify-end mt-4">
                    <button @click="previousQuestion" class="btn btn-sm btn-neutral mr-2">
                        <i class="fa-solid fa-arrow-left"></i>
                    </button>
                    <button @click="nextQuestion" class="btn btn-sm btn-neutral">
                        <i class="fa-solid fa-arrow-right"></i>
                    </button>
                </div>
            </div>
            <div v-else>
                No questions available.
            </div>
        </div>
    </div>
</template>