<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router'
import TheHeader from '../components/TheHeader.vue';
import TheLoading from '../components/TheLoading.vue';
import { toastNotification } from '../utils/index.js';

var timePerQuestion = 5;

const router = useRouter();
const isLoading = ref(true);
const isStart = ref(false);
const allData = ref([]);
const currentQuestionId = ref(1);
const timeCounter = ref(timePerQuestion);
const showAnswer = ref(false);
const selectedAnswerIndex = ref(null);
const pointCounter = ref(0);

let timer = null;

const fetchData = async () => {
    try {
        const response = await fetch('/quiz.json');
        if (!response.ok) {
            toastNotification('Failed to fetch quiz data', 'error', 2000);
        }
        const data = await response.json();
        allData.value = data;

        const setting = await fetch('/setting.json');
        if (!setting.ok) {
            toastNotification('Failed to fetch setting data', 'error', 2000);
        }
        const settingData = await setting.json();

        timePerQuestion = settingData.timePerQuestion;

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
    else {
        toastNotification('This is the first question', 'info', 2000);
    }
};

const nextQuestion = () => {
    selectedAnswerIndex.value = null;
    if (currentQuestionId.value < allData.value.length) {
        currentQuestionId.value++;
        startTimer();
    }
    else {
        toastNotification("This is the last question", 'info', 2000);
        setTimeout(() => {
            router.push('/point/' + pointCounter.value);
        }, 2000);
    }
};

onMounted(() => {
    fetchData();
});

watch(isStart, () => {
    if (isStart.value) {
        startTimer();
    }
});

watch(currentQuestionId, () => {
    startTimer();
});

watch(showAnswer, () => {
    if (showAnswer.value) {
        if (selectedAnswerIndex.value === allData.value[currentQuestionId.value - 1]?.correctAnswer) {
            pointCounter.value++;
            toastNotification('Correct answer', 'success', 2000);
        }
        else {
            toastNotification('Wrong answer', 'error', 2000);
        }
    }
});

// Check answer button
const checkAnswer = () => {
    if (timeCounter.value == 0) {
        toastNotification('Answer already shown', 'info', 2000);
    }

    clearTimeout(timer);
    showAnswer.value = true;
    timeCounter.value = 0;
};

</script>

<template>
    <TheHeader />
    <TheLoading v-if="isLoading" />
    <div v-else-if="!isStart" class="flex flex-col items-center mt-32">
        <button @click="isStart = true" class="btn btn-primary btn-lg" aria-label="Start Quiz">Start</button>
    </div>
    <div v-else>
        <div class="text-center font-bold text-6xl pt-4 text-primary">{{ timeCounter }}</div>
        <div class="overflow-x-auto mx-20 mt-4 rounded-md p-4">
            <div v-if="allData.length > 0">
                <div class="text-center font-medium text-2xl">
                    Question {{ currentQuestionId }}: {{ allData[currentQuestionId - 1].question }}
                </div>
                <div v-for="(answer, index) in allData[currentQuestionId - 1]?.answers" :key="index">
                    <div @click="selectedAnswerIndex = index"
                         :class="{
                            'border-4 border-error rounded-md mt-6 p-2 text-xl': selectedAnswerIndex === index && showAnswer && allData[currentQuestionId - 1]?.correctAnswer !== index, // Show wrong answer
                            'border-4 border-success rounded-md mt-6 p-2 text-xl': showAnswer && allData[currentQuestionId - 1]?.correctAnswer == index, // Show correct answer
                            'border-4 border-warning rounded-md mt-6 p-2 text-xl': selectedAnswerIndex === index && !showAnswer, // Show selected answer
                            'border-2 border-neutral rounded-md mt-6 p-2 text-xl': !(showAnswer && allData[currentQuestionId - 1]?.correctAnswer == index) && selectedAnswerIndex !== index // Show default
                        }">
                        <strong>Answer {{ index }}:</strong> {{ answer }}
                    </div>
                </div>
                <div class="flex justify-between mt-6">
                    <div class="font-bold text-2xl">Point: {{ pointCounter }}</div>
                    <button class="btn btn-success btn-md text-white" @click="checkAnswer">Check</button>
                    <div>
                        <button @click="previousQuestion" class="btn btn-md btn-neutral mr-2"
                                aria-label="Previous question">
                            <i class="fa-solid fa-arrow-left"></i>
                        </button>
                        <button @click="nextQuestion" class="btn btn-md btn-neutral" aria-label="Next question">
                            <i class="fa-solid fa-arrow-right"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div v-else>
                No questions available.
            </div>
        </div>
    </div>
</template>