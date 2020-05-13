<template>
  <b-row>
    <b-colxx class="mecanicos-branch">
      <mecanicos-items
        v-for="(mecanico, index) in taller.mecanicos"
        :key="index"
        :data="mecanico"
      />
    </b-colxx>
  </b-row>
</template>

<script>
import { mapGetters } from "vuex";
import MecanicosItem from "../../../components/Listing/MecanicosListItem";
import ServicesCore from "../../../services/service";

export default {
  components: {
    "mecanicos-items": MecanicosItem
  },
  data() {
    return {
      taller: {}
    };
  },
  computed: {
    ...mapGetters({ currentUser: "currentUser" })
  },
  created() {
    ServicesCore.getTallerById(this.currentUser.IdTaller).then(response => {
      if (response.status == 200) {
        this.taller = response.data;
      }
    });
  }
};
</script>

<style></style>
