<template>
  <div>
    <b-list-group>
      <b-list-group-item
        :key="index"
        v-for="(item,index) in list"
        :class="{ 'item-active' : getIfItemIsActive(index) }"
      >
        <font-awesome-icon icon="check-circle" class="float-left" v-if="getIfItemWasAlreadyDone(index)" />
        <label v-else>{{ index + 1 }}</label>
        {{item.title}}
        <font-awesome-icon
          @click="toggleItemDetails(index)"
          :icon="`chevron-${ item.expanded || getIfItemIsActive(index) ? 'down' : 'left'}`"
          class="float-right"
        />
        <div v-if="item.expanded || getIfItemIsActive(index)">
          <b-list-group-item
            :key="subIndex"
            v-for="(subItem, subIndex) in item.subItems"
            class="text-black"
            :class="subItem.page == currentPage ? 'text-bold' : ''"
          >{{subItem.title}}
            <font-awesome-icon
              v-if="subItem.page < currentPage"
              icon="check-circle"
              class="float-right"
            />
          </b-list-group-item>
        </div>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [],
    };
  },

  props: {
    items: {
      type: Array,
      required: true,
    },
    currentPage: {
      type: Number,
      required: true,
    },
  },

  created() {
    let page = 0;
    this.list = this.items.map((item, index) => {
      return {
        title: item.title,
        expanded: false,
        subItems: item.subItems.map((subItem, subIndex) => {
          page++;
          return {
            title: subItem.title,
            page: page,
          };
        }),
      };
    });
  },

  methods: {
    toggleItemDetails(index) {
      if (this.getIfItemIsActive(index)) return;
      
      this.list[index].expanded = !this.list[index].expanded;
    },

    getIfItemIsActive(index) {
      for (let subIndex in this.list[index].subItems) {
        let item = this.list[index].subItems[subIndex];
        if (item.page == this.currentPage) return true;
      }

      return false;
    },

    getIfItemWasAlreadyDone(index){
      let maxPage = 0;
      for (let subIndex in this.list[index].subItems) {
        let item = this.list[index].subItems[subIndex];
        if (item.page > maxPage) maxPage = item.page;
      }

      if (maxPage < this.currentPage) return true;
      else return false;
    }
  },
};
</script>

<style scoped>
.item-active {
  color: green;
}

.text-black {
  color: black;
}
.text-bold{
  font-weight: bold;
}
</style>