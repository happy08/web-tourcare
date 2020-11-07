<template>
    <div
        class="cy-tab-item"
        :class="[currentSelected ? activeClass : '', {
      'cy-tab-selected': currentSelected,
      'cy-tab-disabled': disabled 
    }]"
        :style="style"
        @click="onItemClick"
    >
        <slot></slot>
    </div>
</template>

<script>
import { childMixin } from "../tab-mixin";

export default {
    name: "cy-tab-item",
    mixins: [childMixin],
    props: {
        activeClass: String,
        disabled: Boolean
    },
    computed: {
        style() {
            return {
                borderWidth: this.$parent.lineHeight + "px",
                borderColor: this.$parent.activeColor,
                color: this.currentSelected
                    ? this.$parent.activeColor
                    : this.disabled
                    ? this.$parent.disabledColor
                    : this.$parent.defaultColor,
                border: this.$parent.animate ? "none" : "auto"
            };
        }
    }
};
</script>
