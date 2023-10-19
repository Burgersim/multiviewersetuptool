<template>
    <header class="header">
        <h1 class="title is-1 has-text-light">MULTIVERZE</h1>
        <h2 class="subtitle is-3 has-text-light">LAY-Z</h2>
<!--        <div id="nav">
            <router-link to="/">Home</router-link> |
            <router-link to="/phase">Phase Status</router-link>
        </div>-->
    </header>
</template>

<script>
    export default {
        name: "Header"
    }
</script>

<style scoped>
    .header {
        background: #274472;
        color: #fff;
        text-align: center;
        padding: 10px;
        margin-bottom: 20px;
    }
    .header a {
        color: #fff;
        padding-right: 5px;
        text-decoration: none;
    }
</style>
