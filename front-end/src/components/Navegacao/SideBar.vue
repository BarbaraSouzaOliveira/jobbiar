<template>
  <aside class="d-flex side-nav" ref="aside">
    <nav class="py-3 px-2 d-flex flex-column align-items-center navbar-aside" ref="navbar-aside">
      <ul class="nav nav-body w-100 flex-column">
        <li
          class="nav-item"
          v-for="link in links"
          :key="link.name"
          :class="{ 'active': checkActive(link) }"
        >
          <router-link
            v-if="link.to"
            class="nav-link"
            :to="link.to"
            data-toggle="tooltip"
            data-placement="right"
            @click.native="navClick"
            v-b-tooltip.hover.right.viewport="originalWidth >= maxWidth - 30 ? null : link.name"
          >
            <component :is="`${link.icon || 'link2'}-icon`" />
            <p class="mb-0">{{link.name}}</p>
          </router-link>
          <b-dropdown
            v-else
            class="nav-link fixed-dd"
            toggle-class="text-decoration-none"
            dropright
            no-flip
            boundary="window"
            data-toggle="tooltip"
            v-b-tooltip.hover.top.viewport="originalWidth >= maxWidth - 30 ? null : link.name"
            variant="link"
          >
            <template slot="button-content">
              <component :is="`${link.icon || 'link2'}-icon`" />
              <p class="mb-0">{{link.name}}</p>
            </template>
            <b-dropdown-item v-for="link in link.children" :key="link.name" :to="link.to" @click.native.stop="navClick" class="nav-dd-item" :class="{'active': checkActive(link) }">
              <component :is="`${link.icon || 'link2'}-icon`" />
              <p class="mb-0">{{link.name}}</p>
            </b-dropdown-item>
          </b-dropdown>
        </li>
      </ul>
    </nav>

    <div
      class="splitter d-flex flex-column justify-content-center align-items-center"
      :class="{'is-expanded': !isBarMinimized}"
      @mousedown.prevent="startResize"
    >
      <div class="handle w-100 h-100"></div>
      <svg
        class="arrow"
        id="toggleSizeAsideNav"
        @click.stop="toggleNavBar"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path d="M9.984 6l6 6-6 6-1.406-1.406 4.594-4.594-4.594-4.594z" />
      </svg>
    </div>
  </aside>
</template>


<script>
export default {
  data() {
    return {
      isBarMinimized: true, // árvores
      originalWidth: 70,
      originalX: 0,
      originalMouseX: 0,
      minWidth: 0,
      refNav: "navbar-aside",
    };
  },
  props: {
    maxWidth: Number,
    hidden: Boolean,
    links: {
      type: Array,
      default: () => [],
    },
  },
  watch: {
    hidden: "setHiddenState",
    maxWidth: "setMaxWidth"
  },
  methods: {
    startResize(e) {
      const element = this.$refs[this.refNav];

      const resize = e => {
        const width = this.originalWidth + (e.pageX - this.originalMouseX);
        element.style.width = width + "px";
        this.isBarMinimized = width <= this.minWidth;
      };
      const stopResize = () => {
        window.removeEventListener("mousemove", resize);
        this.originalWidth = parseFloat(
          getComputedStyle(element, null)
            .getPropertyValue("width")
            .replace("px", "")
        );
      };

      this.originalWidth = parseFloat(
        getComputedStyle(element, null)
          .getPropertyValue("width")
          .replace("px", "")
      );
      this.originalX = element.getBoundingClientRect().left;
      this.originalMouseX = e.pageX;
      window.addEventListener("mousemove", resize);
      window.addEventListener("mouseup", stopResize);
    },
    toggleNavBar() {
      const element = this.$refs[this.refNav];

      this.originalWidth = parseFloat(
        getComputedStyle(element, null)
          .getPropertyValue("width")
          .replace("px", "")
      );
      element.classList.add("animw");
      if (this.originalWidth > this.minWidth) {
        // minimize
        element.style.width = this.minWidth + "px";
        this.isBarMinimized = true;
      } else {
        // maximize
        this.maximize();
      }
      setTimeout(() => {
        this.originalWidth = parseFloat(
          getComputedStyle(element, null)
            .getPropertyValue("width")
            .replace("px", "")
        );
        element.classList.remove("animw");
      }, 300);
    },
    maximize() {
      const element = this.$refs[this.refNav];
      element.style.width = this.maxWidth + "px";
      this.isBarMinimized = false;
      this.originalWidth = parseFloat(
        getComputedStyle(element, null)
          .getPropertyValue("width")
          .replace("px", "")
      );
    },
    setHiddenState() {
      const aside = this.$refs["aside"];
      if (this.hidden) {
        // oculta barra deslizando-a para a esquerda
        aside.style.transform = "translateX(-100%) translateX(-30px)";
      } else {
        // mostra barra deslizando-a para a direita
        aside.style.transform = "translateX(0)";
      }
    },
    setMaxWidth() {
      const element = this.$refs[this.refNav];
      element.style.maxWidth = this.maxWidth + "px";
    },
    navClick() {
      this.$emit("link");
    },
    checkActive(link) {
      if (link.to) {
        return link.to.name
          ? this.$route.name === link.to.name
          : this.$route.path.indexOf(link.to) === 0;
      } else if (link.children) {
        return link.children.some(this.checkActive);
      } else {
        return false;
      }
    },
    expandItem(link) {
      if (link.expanded === undefined) {
        this.$set(link, "expanded", false);
      }
      link.expanded = !link.expanded;
    }
  },
  mounted() {
    const element = this.$refs[this.refNav];
    this.minWidth = parseFloat(
      getComputedStyle(element, null)
        .getPropertyValue("min-width")
        .replace("px", "")
    );
    this.setHiddenState();
    this.setMaxWidth();
  }
};
</script>

<style lang="scss" scoped>
//colors
$black_30: rgba(0, 0, 0, 0.15);
$white: #ffffff;
$primary-color-50: #209F85;
$primary-color-10: #E5FEF8;
$neutral-color-80: #35384D;
$black_8: rgba(0, 0, 0, 0.08);
$white_5: rgba(255, 255, 255, 0.05);
$white_40: rgba(255, 255, 255, 0.4);
$white_50: rgba(255, 255, 255, 0.5);
$color_dove_gray_approx: #696969;
$black_5: rgba(0, 0, 0, 0.05);
$black_6: rgba(0, 0, 0, 0.06);
$white_6: rgba(255, 255, 255, 0.06);
$black_4: rgba(0, 0, 0, 0.04);
$black: black;

//@extend-elements
//original selectors
//.side-nav nav .nav-header img, .side-nav nav .nav-footer img
%extend_1 {
  width: 100%;
  max-width: 80px;
  display: block;
}

//original selectors
//.retract .children .nav-link, .side-nav nav .nav-body .nav-item
%extend_2 {
  //Instead of the line below you could use @include border-radius($radius, $vertical-radius)
  border-radius: 10px;
  cursor: pointer;
  //Instead of the line below you could use @include transition($transition-1, $transition-2, $transition-3, $transition-4, $transition-5, $transition-6, $transition-7, $transition-8, $transition-9, $transition-10)
  transition: 0.3s;
  width: 100%;
}

//original selectors
//.retract .children .nav-link.active, .side-nav nav .nav-body .nav-item.active
%extend_3 {
  background-color: $primary-color-10; ///// mudar a cor de fundo do item ativo
  color: $primary-color-50; 
  //Instead of the line below you could use @include box-shadow($shadow-1, $shadow-2, $shadow-3, $shadow-4, $shadow-5, $shadow-6, $shadow-7, $shadow-8, $shadow-9, $shadow-10)
}

//original selectors
///deep/.fixed-dd button, .side-nav nav .nav-body .nav-link
%extend_4 {
  display: flex;
  align-items: center;
  width: 100%;
}


.nav-link {
  text-overflow: ellipsis;
  &.dropdown {
    padding: 0;
  }
}
/deep/ {
  &.fixed-dd {
    button {
      text-overflow: ellipsis;
      overflow: hidden;
      margin: 0;
      border: 0;
      padding: 0.5rem 1rem;
      text-align: left;
      //Instead of the line below you could use @include border-radius($radius, $vertical-radius)
      border-radius: 0;
      @extend %extend_4;
    }
    ul {
      position: fixed !important;
    }
  }
  &.nav-item {
    button::after {
      //Instead of the line below you could use @include transition($transition-1, $transition-2, $transition-3, $transition-4, $transition-5, $transition-6, $transition-7, $transition-8, $transition-9, $transition-10)
      transition: all 0.3s ease-in-out;
    }
    .dropdown-toggle::after {
      margin-left: 0.5rem;
      color: $primary-color-50;
    }
    &.active .dropdown-toggle::after {
      color: $white;
      font-weight: 900;
    }
  }
  &.nav-dd-item .dropdown-item {
    display: flex;
    align-items: center;
  }
}
.side-nav {
  position: fixed;
  z-index: 1000;
  //Instead of the line below you could use @include transition($transition-1, $transition-2, $transition-3, $transition-4, $transition-5, $transition-6, $transition-7, $transition-8, $transition-9, $transition-10)
  transition: 0.3s ease-in-out;
  height: 100%;
  //Instead of the line below you could use @include transform($scale, $rotate, $transx, $transy, $skewx, $skewy, $originx, $originy)
  transform: translateX(-100%) translateX(-30px);
  nav {
    //Instead of the line below you could use @include box-shadow($shadow-1, $shadow-2, $shadow-3, $shadow-4, $shadow-5, $shadow-6, $shadow-7, $shadow-8, $shadow-9, $shadow-10)
    box-shadow: 0 10px 10px $black_30;
    background-color: $white;
    flex: 0 0 auto;
    $primary-color-50-space: nowrap;
    height: 100%;
    position: relative;
    z-index: 1;
    min-width: 70px;
    //Instead of the line below you could use @include transition($transition-1, $transition-2, $transition-3, $transition-4, $transition-5, $transition-6, $transition-7, $transition-8, $transition-9, $transition-10)
    transition: box-shadow 0.6s;
    .nav-body {
      .nav-item {
        margin-bottom: 12px;
        padding: 2px 0px;
        @extend %extend_2;
        p {
          font-weight: 400;
          color: $neutral-color-80;
        }
        &:hover {
          background-color: #F7F7FA; ////
        }
        svg {
          min-width: 24px;
          max-width: 24px;

          color: $neutral-color-80;
        }
        &.active {
          @extend %extend_3;
          &:hover {
            background-color:  #F7F7FA; ///
          }
          svg {
            color: $primary-color-50;
          }
          p {
            color: $primary-color-50;
            font-weight: 500;
          }
        }
        &.open.active {
          background-color: $white_5;
          color: $primary-color-50;
          //Instead of the line below you could use @include box-shadow($shadow-1, $shadow-2, $shadow-3, $shadow-4, $shadow-5, $shadow-6, $shadow-7, $shadow-8, $shadow-9, $shadow-10)
          box-shadow: 0 0 20px $black_8;
          svg {
            color: $primary-color-50;
          }
          p {
            color: $primary-color-50;
            font-weight: inherit;
          }
        }
      }
      .nav-link {
        @extend %extend_4;
      }
      p {
        opacity: 1;
        padding-left: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      hr {
        display: block;
        border-top: 2px solid $white_40;
        padding: 0.5rem 1rem;
      }
      .nav-dd-item {
        &.active {
          p {
            font-weight: 500 !important;
          }
        }
        p {
          color: $black !important;
          font-weight: 500 !important;
        }
        svg {
          color: $black !important;
        }
      }
    }
    .nav-footer {
      position: relative;
      overflow: hidden;
      img {
        @extend %extend_1;
      }
      div {
        border-right: 2px solid $white_50;
        height: 70%;
      }
    }
    .nav-header img {
      @extend %extend_1;
    }
    &:hover ~ .splitter {
      padding: 8px;
    }
  }
  &._hide {
    //Instead of the line below you could use @include transform($scale, $rotate, $transx, $transy, $skewx, $skewy, $originx, $originy)
    transform: translateX(-100%);
  }
  .compressed {
    width: 70px;
  }
  .expanded {
    width: 100%;
  }
}
.retract {
  .children {
    background-color: $white_6;
    //Instead of the line below you could use @include border-radius($radius, $vertical-radius)
    border-radius: 5px 5px 10px 10px;
    .nav-link {
      @extend %extend_2;
      //Instead of the line below you could use @include border-radius($radius, $vertical-radius)
      border-radius: 5px 5px 10px 10px;
      &:hover {
        background-color: #E3E4E5;
      }
      &.active {
        @extend %extend_3;
      }
    }
    > div {
      padding: 50px;
    }
  }
  .retract-icon {
    //Instead of the line below you could use @include transition($transition-1, $transition-2, $transition-3, $transition-4, $transition-5, $transition-6, $transition-7, $transition-8, $transition-9, $transition-10)
    transition: all 0.25s ease-in-out;
  }
  &.open .retract-icon {
    //Instead of the line below you could use @include transform($scale, $rotate, $transx, $transy, $skewx, $skewy, $originx, $originy)
    transform: rotate(90deg);
  }
  .nav-link.active {
    background-color: $black_4;
  }
}
.nav-item {
  //Instead of the line below you could use @include transition($transition-1, $transition-2, $transition-3, $transition-4, $transition-5, $transition-6, $transition-7, $transition-8, $transition-9, $transition-10)
  transition: all 0.3s ease-in-out;
  svg {
    //Instead of the line below you could use @include transition($transition-1, $transition-2, $transition-3, $transition-4, $transition-5, $transition-6, $transition-7, $transition-8, $transition-9, $transition-10)
    transition: all 0.3s ease-in-out;
  }
  p {
    //Instead of the line below you could use @include transition($transition-1, $transition-2, $transition-3, $transition-4, $transition-5, $transition-6, $transition-7, $transition-8, $transition-9, $transition-10)
    transition: all 0.3s ease-in-out;
  }
  &.open {
    background-color: $black_6;
    &.active .retract .children .nav-link.active {
      svg {
        color: $white;
      }
      p {
        color: $white;
        font-weight: 500;
      }
    }
  }
}
.splitter {
  flex: 0 0 auto;
  //Instead of the line below you could use @include transition($transition-1, $transition-2, $transition-3, $transition-4, $transition-5, $transition-6, $transition-7, $transition-8, $transition-9, $transition-10)
  transition: 0.5s;
  cursor: col-resize;
  position: relative;
  z-index: 1001;
  height: 100vh;
  padding: 1px;
  &:hover {
    padding: 8px;
  }
  &:active {
    padding: 8px;
  }
  .handle {
    position: absolute;
  }
  .arrow {
    position: absolute;
    width: 200%;
    height: 30px;
    cursor: pointer;
    fill: $white;
    //Instead of the line below you could use @include transition($transition-1, $transition-2, $transition-3, $transition-4, $transition-5, $transition-6, $transition-7, $transition-8, $transition-9, $transition-10)
    transition: width 0.6s, fill 0.3s;
    //Instead of the line below you could use @include border-radius($radius, $vertical-radius)
    border-radius: 50px;
    background-color: #21CCA9;
    //Instead of the line below you could use @include transform($scale, $rotate, $transx, $transy, $skewx, $skewy, $originx, $originy)
    transform: translateX(-25%);
    //Instead of the line below you could use @include box-shadow($shadow-1, $shadow-2, $shadow-3, $shadow-4, $shadow-5, $shadow-6, $shadow-7, $shadow-8, $shadow-9, $shadow-10)
    box-shadow: 0 0 10px $black_5;
    &:hover {
      fill: $white;
    }
    &.active {
      fill: $white;
    }
    &.expanded {
      //Instead of the line below you could use @include transform($scale, $rotate, $transx, $transy, $skewx, $skewy, $originx, $originy)
      transform: translateX(-25%) rotate(180deg);
    }
  }
  svg path {
    //Instead of the line below you could use @include transition($transition-1, $transition-2, $transition-3, $transition-4, $transition-5, $transition-6, $transition-7, $transition-8, $transition-9, $transition-10)
    transition: transform 0.3s ease-in-out;
  }
  &.is-expanded svg path {
    //Instead of the line below you could use @include transform($scale, $rotate, $transx, $transy, $skewx, $skewy, $originx, $originy)
    transform: scaleX(-1) translateX(-98%);
  }
}
.navbar-aside {
  width: 70px;
  overflow-y: auto;
  &.animw {
    //Instead of the line below you could use @include transition($transition-1, $transition-2, $transition-3, $transition-4, $transition-5, $transition-6, $transition-7, $transition-8, $transition-9, $transition-10)
    transition: width 0.3s ease-in-out;
  }
  .nav {
    display: block;
  }
}
@media(max-width: 790px) {
  .splitter {
    display: none !important;
  }
  .side-nav {
    width: 50%;
  }
  .navbar-aside {
    max-width: 100% !important;
    width: 100% !important;
  }
}
</style>
