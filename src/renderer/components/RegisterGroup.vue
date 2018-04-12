<template>
<v-card>
  <v-card-title>
    <v-toolbar>
      <v-toolbar-title>{{group.name}}</v-toolbar-title>
        <v-spacer></v-spacer>
       <v-btn icon>
         <v-icon>add</v-icon>
       </v-btn>
       <v-btn icon>
         <v-icon>remove</v-icon>
       </v-btn>
    </v-toolbar>
  </v-card-title>

  <v-card-text> 
    <v-data-table
     v-bind:headers="reg_table_headers"
     v-bind:items="group.regs"
     class="elevation-1"
     hide-actions
    >
     <template slot="items" slot-scope="props"></template>
    </v-data-table>
  </v-card-text>

</v-card>
</template>

<script>
export default {
  name: 'RegisterGroup',
  data () {
    console.log(this.group)
    return {
      reg_table_headers: [
        { text: 'Type', align: 'left', sortable: false, value: 'reg_type' },
        { text: 'Address', align: 'left', sortable: false, value: 'address' },
        { text: 'Desc', align: 'left', sortable: false, value: 'desc' },
        { text: 'Value', align: 'left', sortable: false, value: 'value' }
      ]
    }
  },
  props: ['group', 'reg_list']
}
</script>

<style scoped>
</style>
