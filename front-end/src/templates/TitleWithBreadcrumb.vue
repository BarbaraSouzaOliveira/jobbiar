<template>
  <div>
    <span v-for="(link, index) in breadcrumb" :key="index">
      <label style="display:inline" class="align-self-center">
        <router-link :to="link.href" :title="link.text">{{ link.text }}</router-link>
      </label>
      <label v-if="index < breadcrumb.length - 1" style="display:inline"> / </label>
    </span>
    <h1 class="padding align-self-center">{{ title }}</h1>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
  },

  computed: {
    breadcrumb() {
      let routes = this.$router.currentRoute.path.split('/');

      let breadcrumb = routes.reduce((result, route, index) => {
        if (route) {
          result.push({ 
            text: route,
            href: routes.reduce((href, insideRoute, insideIndex) => {
              if (insideIndex <= index && insideRoute) return `${href}/${insideRoute}`;
              return href;
            }, ''),
          });
        }

        if (result.length && result[result.length - 1].text === "editar"){
          result[result.length - 1].href = result[result.length - 1].href.split("editar")[0].slice(0, -1);
        }
        return result;
      }, []);

      return breadcrumb;
    }
  }
};
</script>

<style lang="scss" scoped>
$neutral-color-70: #5E627A;
$neutral-color-80: #35384D;

main {
  transition: all ease 0.3s;
}

a.router-link-active {
  color: $neutral-color-70; 
  text-decoration: none;
}

.padding {
  padding: 0;
  padding-top: 12px;
  padding-bottom: 26px;
  font-weight: 500;
}

h1 {
  font-size: 2rem;
  color: $neutral-color-80;
}

</style> 
  
