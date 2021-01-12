<template>
    <main class="card invision-card elevate-2 invision-top borderless container py-3">
        <slot />
    </main>
</template>
<script>

export default {
    props: ['width'],
}
</script>
<style scoped>
main {
    transition: all ease .3s;
}
</style>
