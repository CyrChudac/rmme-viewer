<template>
  <span style="overflow-x: auto; resize: inherit;">
    <div
      v-for="(item, index) in files"
      :key="index"
      :active="index === value"
      :class="'d-flex justify-content-between btn align-items-center c-list-group-item-' + themeNum + '-' + variant(item) + active(index)"
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
      <span
        class="btn"
        pill
        @click.stop="onDelete(index)"
      >
        <font-awesome-icon icon="trash" />
      </span>
    </div>
  </span>
</template>

<script>
  import {selectIcon, selectColor, selectVariant} from "../data-status"

  export default {
    "name": "file-list",
    "props": {
      "files": {"type": Array, "required": true},
      "value": {"type": Number, "required": true},
      "themeNum": {"type": Number, "default": 2},
      "index": {"type": Number, "default": -1},
    },
    "methods": {
      "onSelect": function (index) {
        this.index = index;
        this.$emit("input", index);
      },
      "onDelete": function (index) {
        this.$emit("delete", index);
      },
      "variant": function (item){
        return selectVariant(item.status);
      },
      "active": function (index){
        if(this.index === index)
          return "-active";
        return "";
      },
      "icon": function (item){
        return selectIcon(item.status);
      },
      "color": function (item){
        return selectColor(item.status);
      },
    },
  }
</script>