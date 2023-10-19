<template>
  <div id="home" class="columns is-centered">
    <div class="column is-two-thirds-widescreen is-half-fullhd is-full-tablet">
      <Multiverze  v-if="this.dataRbtvIsReady === true && this.dataRbtvIsReady === true" v-bind:allLivePrograms="allLivePrograms"/>
    </div>
  </div>
</template>

<script>
console.log();
import Multiverze from "../components/Multiverze";
// import AddTodo from "../components/AddTodo";
import axios from "axios";

export default {
  name: 'home',
  components: {
    Multiverze
  },
  data() {
    return {
      allLivePrograms: {
        rbtv: [],
        stv: []
      },
      dataIsReady: false,
      dataStvIsReady: false,
      dataRbtvIsReady: false,
    }
  },
  methods: {

  },
  created() {
    //axios.get('http://localhost:5050/multiviewer/v1/getHlsFromLivebible')
    axios.get('https://bcs-dmcr-services.herokuapp.com/multiviewer/v1/getHlsFromLivebible')
        .then((res) => {
              this.allLivePrograms.rbtv = res.data.data;
              this.dataRbtvIsReady = true
        })
        .then(this.dataIsReady = true)
        .catch(err => console.log((err)))
    axios.get('https://bcs-dmcr-services.herokuapp.com/multiviewer/v1/getHlsFromSTVLivebible')
        .then((res) => {
              this.allLivePrograms.stv = res.data.data;
              this.dataStvIsReady = true
        })
        .catch(err => console.log((err)))
  }
}
</script>

<style>
  body {
    background-color: #C3E0E5;
  }

</style>
