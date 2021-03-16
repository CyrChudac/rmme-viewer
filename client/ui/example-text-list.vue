<template>
  <span 
    class="dropdown" 
    right
    v-show="data.length > 0"
  >
    <span
     class="dropbtn example-btn"
     @click="toggleExamplesDropdown()"
     right
    >
        Examples ▾
    </span>
    <span
      :class="'dropdown-content ' + noneIncluded(false)"
    >
      <span 
        v-for="(item, index) in data"
        :key="index"
        @click="onSelect(index)"
        class="dropdown-item"
      >
        Example {{index + 1}}
      </span>
    </span>
  </span>
</template>

<script>
  let showExamples = { val: false };
  let quiet = true;
  export default {
    "name": "example-text-list",
    "props": {
      "data": {"type": Array, "required": true},
      "value": {"type": Number, "required": true},
    },
    "data": () => ({
      "classNone": {"type": Object, "default": showExamples}
    }),
    "methods": {
      "onSelect": function (value) {
        this.$emit("input", value);
      },
      "onDeselect": function () {
        this.$emit("input", -1)
      },
      "toggleExamplesDropdown": function(){
        this.classNone.val = ! this.classNone.val;
        if (!quiet){
          console.log("toggleExamplesDropdown -> showExamples: " + this.classNone.val + " -> \"" + this.noneIncluded() + "\"");
        }
      },
      "noneIncluded": function(innerQuiet = true){
        if (!quiet && !innerQuiet){
          console.log("noneIncluded -> showExamples: " + this.classNone.val);
        }
        if(!this.classNone.val){
          return "none";
        }else{
          return "";
        }
      },
    },
    beforeMount(){
      this.classNone = showExamples;
    }
  }
  window.addEventListener("click", function(event) {
    if (!event.target.matches('.example-btn')) {
      if (!quiet){
        console.log("clicked - showExamples.val = false");
      }
      showExamples.val = false;
    }
  });
</script>

<style scoped>
.none{
  display: none;
}
</style>