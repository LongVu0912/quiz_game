import { defineStore } from "pinia";

export const usePointStore = defineStore({
    id: "point",
    state: () => ({
        point: 0,
    }),
    getters: {},
    actions: {
        reset() {
            this.point = 0;
        },
        increment() {
            this.point++;
        },
    },
});
