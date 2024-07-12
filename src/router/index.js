import { createRouter, createWebHistory } from "vue-router";
import QuizView from "../views/QuizView.vue";
import SettingView from "../views/SettingView.vue"

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            name: "quiz",
            component: QuizView,
        },
        {
            path: "/setting",
            name: "setting",
            component: SettingView,
        },
    ],
});

export default router;