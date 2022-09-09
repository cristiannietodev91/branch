<template>
<div :class="{'theme-colors':true, 'shown' : isOpen}" @mouseenter="isMenuOver=true" @mouseleave="isMenuOver=false">
    <div class="p-4">
        <p class="text-muted mb-2">Light Theme</p>
        <div class="d-flex flex-row justify-content-between mb-4">
            <a href="#" v-for="(color,index) in colors.filter(x=>x.indexOf('light')>-1)" :key="`light_${index}`" :class="getIconClass(color)" @click.prevent="changeThemeColor(color)"></a>
        </div>
        <p class="text-muted mb-2">Dark Theme</p>
        <div class="d-flex flex-row justify-content-between">
            <a href="#" v-for="(color,index) in colors.filter(x=>x.indexOf('dark')>-1)" :key="`dark_${index}`" :class="getIconClass(color)" @click.prevent="changeThemeColor(color)"></a>
        </div>
    </div>
    <div class="pb-0 pl-4 pt-4">
        <b-form-group label="Border Radius">
            <b-form-radio-group name="radius" v-model="radius">
                <b-form-radio value="rounded" @change="changeRadius('rounded')">Rounded</b-form-radio>
                <b-form-radio value="flat" @change="changeRadius('flat')">Flat</b-form-radio>
            </b-form-radio-group>
        </b-form-group>
    </div>
    <a href="#" class="theme-button" @click.prevent="toggle">
        <i class="simple-icon-magic-wand"></i>
    </a>
</div>
</template>

<script>
import {
    colors,
    themeRadiusStorageKey
} from "../../constants/config";
export default {
    data() {
        return {
            isOpen: false,
            isMenuOver: false,
            selectedColor: "",
            colors,
            radius: localStorage.getItem(themeRadiusStorageKey) || 'rounded'
        };
    },
    methods: {
        getIconClass(color) {
            var classes = [
                "theme-color",
                "theme-color-" + color.split(".")[1]
            ];
            if (this.selectedColor === color) {
                classes.push("active");
            }
            return classes.join(" ");
        },

        addEvents() {
            document.addEventListener("click", this.handleDocumentClick);
            document.addEventListener("touchstart", this.handleDocumentClick);
        },
        removeEvents() {
            document.removeEventListener("click", this.handleDocumentClick);
            document.removeEventListener("touchstart", this.handleDocumentClick);
        },
        handleDocumentClick(e) {
            if (!this.isMenuOver) {
                this.toggle();
            }
        },
        toggle() {
            this.isOpen = !this.isOpen;
        },
        changeThemeColor(color) {
            localStorage.setItem('themeColor', color)
            this.toggle()
            setTimeout(() => {
                window.location.reload()
            }, 500)
        },
        changeRadius(radius) {
            if (radius === 'flat') {
                document.body.classList.remove('rounded');
            } else {
                document.body.classList.add('rounded');
            }
            localStorage.setItem(themeRadiusStorageKey, radius);
        }

    },
    watch: {
        isOpen(val) {
            if (val) {
                this.addEvents();
            } else {
                this.removeEvents();
            }
        }
    },
    beforeDestroy() {
        this.removeEvents();
    },
    mounted() {
        const color = localStorage.getItem("themeColor");
        if (color != null && colors.includes(color))
            this.selectedColor = color;
        else
            this.selectedColor = "light.blue";
        this.changeRadius(this.radius);
    }
};
</script>
