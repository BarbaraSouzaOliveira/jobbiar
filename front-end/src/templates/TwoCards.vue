<template>
    <div class="container">
        <slot name=" header" />
        <b-row class="pl-0 px-3"> <!--classe alinha container com titulo-->> 
            <b-col :sm="sm" :md="md" :lg="lg" :xl="xl" class="pl-0">
                <slot name="one" />
            </b-col>
            <b-col
                class="pr-0"
                :sm="sm == 12 ? 12 : 12 - sm"
                :md="md == 12 ? 12 : 12 - md"
                :lg="lg == 12 ? 12 : 12 - lg"
                :xl="xl == 12 ? 12 : 12 - xl"
            >
                <slot name="two" />
            </b-col>
        </b-row>
    </div>
</template>
<script>

export default {
    props: {
        sm: {
            type: String,
            default: "12"
        },
        md: {
            type: String,
            default: "6"
        },
        lg: {
            type: String,
            default: "6"
        },
        xl: {
            type: String,
            default: "6"
        }
    }
}
</script>
<style scoped>
main {
    transition: all ease .3s;
}
</style>
