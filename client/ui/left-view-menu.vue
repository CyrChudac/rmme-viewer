<template>
  <div class="menu-container">
    <div class="menu-bar">
      <span
        :pressed="files"
        class="btn button"
        squared
        @click="$emit('toggleFiles')"
      >
        Files
      </span>
      <span
        :pressed="views"
        style="margin: 3rem 0 0 -0.3rem"
        class="button btn"
        squared
        @click="$emit('toggleViews')"
      >
        Views
      </span>
    </div>
  </div>
</template>

<script>
  export default {
    "name": "left-view-menu",
    "props": {
      "files": {"type": Boolean, "required": true},
      "views": {"type": Boolean, "required": true},
    }
  }
</script>

<style scoped>
  /* Make it of zero size to not break Bootstrap grid, but visible on top
     so a user can interact with it. */
  .menu-container {
    width: 0;
    overflow-x: visible;
    z-index: 1;
  }

  .menu-bar {
    margin-left: -0.5rem;
    margin-top: 1.0rem;
  }

  .button {
    transform: rotate(-90deg);
    border-radius: 0%;
    padding: 0.0rem 0.5rem 0.1rem 0.5rem;
    background-color: teal;
  }
</style>