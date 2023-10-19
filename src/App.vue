<template>
  <div id="app" class="column">
    <Header/>
    <router-view/>
  </div>
</template>

<script>
  import Header from "./components/layout/Header";
  export default {
    name: "app",
    components: {
      Header
    },
    watch: {
      '$route':{
        handler: (to) => {
          document.title = to.meta.title || 'MULTIVERZE'
        },
        immediate: true
      }
    },
  }
</script>

<style>
.column {
  background-color: #C3E0E5;
}
</style>
