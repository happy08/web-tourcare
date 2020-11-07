
const parentMixin = {
	data() {
		return {
			index: -1,
			currentIndex: this.index,
			childrenNumber: this.$children.length
		};
	},
	mounted() {
		this.updateIndex();
	},
	methods: {
		updateIndex() {
			if (!this.$children || !this.$children.length) return;
			this.childrenNumber = this.$children.length;
			let children = this.$children;
			for (let i = 0; i < children.length; i++) {
				children[i].currentIndex = i;
				if (children[i].currentSelected) {
					this.index = i;
				}
			}
		}
	},
	watch: {
		currentIndex(val, oldVal) {
			oldVal > -1 &&
				this.$children[oldVal] &&
				(this.$children[oldVal].currentSelected = false);
			val > -1 &&
				this.$children[val] &&
				(this.$children[val].currentSelected = true);
			this.$emit("input", val);
			this.$emit("onIndexChange", val, oldVal);
		},
		index(val) {
			this.currentIndex = val;
		},
		value(val) {
			this.index = val;
		}
	}
};

const childMixin = {
	props: {
		selected: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			currentIndex: -1,
			currentSelected: this.selected
		};
	},
	mounted() {
		this.$parent.updateIndex();
	},
	methods: {
		onItemClick(v) {
			if (this.$parent.preventDefault) {
				this.$parent.$emit("onBeforeIndexChange", this.currentIndex);
				return;
			}
			if (
				typeof this.disabled === "undefined" ||
				this.disabled === false
			) {
				this.currentSelected = true;
				this.$parent.currentIndex = this.currentIndex;
				this.$nextTick(() => {
					this.$emit("onItemClick", v);
				});
			}
		}
	},
	watch: {
		currentSelected(val) {
			if (val) {
				this.$parent.index = this.currentIndex;
			}
		},
		selected(val) {
			this.currentSelected = val;
		}
	},
	beforeDestroy() {
		const $parent = this.$parent;
		this.$nextTick(() => {
			$parent.updateIndex();
		});
	}
};

export { parentMixin, childMixin };
