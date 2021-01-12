<template>
    <main class="container">
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

.padding{
    padding: 36px;
    font-weight: 400;
}

</style>
