<template>
  <span class="dropdown" right>
    <span class="dropbtn view-menu-btn" @click="myToggle()">
      <font-awesome-icon class="view-menu-btn" icon="cog"/> ▾
    </span>
    <span 
      :class="'dropdown-content ' + noneIncluded(false)"
    >
      <span class="dropdown-item" @click="onAreaGraph">
        Area graph
      </span>
      <span class="dropdown-item" @click="onLineGraph">
        Line graph
      </span>
    </span>
  </span>
</template>

<script>
  let showViewMenu = { val: false };
  let quiet = true;
  export default {
    "name": "acgt-cycles-menu",
    "props": {
      "data": {"type": Object, "required": true},
    },
    "data": () => ({
      "classNone": {"type": Object, "default": showViewMenu},
    }),
    "methods": {
      "onAreaGraph": function () {
        this.data.graph = "area";
      },
      "onLineGraph": function () {
        this.data.graph = "line";
      },
      "myToggle": function(){
        this.classNone.val = ! this.classNone.val;
        if (!quiet){
          console.log("myToggle -> showViewMenu: " + this.classNone.val + " -> \"" + this.noneIncluded() + "\"");
        }
      },
      "noneIncluded": function(innerQuiet = true){
        if (!quiet && !innerQuiet){
          console.log("noneIncluded -> showViewMenu: " + this.classNone.val);
        }
        if(!this.classNone.val){
          return "none";
        }else{
          return "";
        }
      },
    },
    beforeMount(){
      this.classNone = showViewMenu;
    }
  }
  window.addEventListener("click", function(event) {
    let el = event.target;
    let succ = false;
    while(el != null){
      if(el.matches('.view-menu-btn')){
        succ = true;
        break;
      }
      el = el.parentElement;
    }
    if (!succ) {
      if (!quiet){
        console.log("clicked - showViewMenu.val = false");
      }
      showViewMenu.val = false;
    }
  });
</script>

<style scoped>
.none{
  display: none;;
}
</style>