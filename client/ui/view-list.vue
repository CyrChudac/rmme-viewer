<template>
  <span
    style="overflow-x: auto; resize: inherit;"
  >
    <div
      v-for="(item, index) in views"
      :key="index"
      :class="'btn c-list-group-item-' + themeNum + '-' + variant(item) + active(index)"
      @click="onSelect(index)"
    >
      <span 
        :style="'color: ' + color(item)"
      >
        <font-awesome-icon
          :icon="icon(item)"
        />
      </span>
      {{ item.label }}
    </div>
  </span>
</template>

<script>
  import {
   selectIcon,
   selectColor,
   selectVariant} from "./../data-status";

  export default {
    "name": "view-list",
    "props": {
      "views": {"type": Array, "required": true},
      "themeNum": {"type": Number, "default": 1},
      "index": {"type": Number, "default": -1},
    },
    "methods": {
      "onSelect": function (index) {
        this.index = index;
        this.$emit("change-view-index", index);
      },
      "variant": function (item){
        if(item.status){
          return selectVariant(item.status["status"]);
        }else{
          return selectVariant(undefined);
        }
      },
      "active": function (index){
        if(this.index === index)
          return "-active";
        return "";
      },
      "icon": function (item){
        if(item.status){
          return selectIcon(item.status["status"]);
        }else{
          return selectIcon(undefined);
        }
      },
      "color": function (item){
        if(item.status){
          return selectColor(item.status["status"]);
        }else{
          return selectColor(undefined);
        }
      },
    },
  } 

</script>