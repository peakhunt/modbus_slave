<template>
<v-container grid-list-md fluid class="mt-0">
  <v-layout row wrap>
    <v-flex xs12>
      <v-card>
        <v-card-title>
          <v-toolbar>
            <v-toolbar-title>Setup</v-toolbar-title>

            <v-tooltip top v-show="!is_running">
              <v-btn slot="activator" fab small color="blue"
               @click.native="modbus_start">
                <v-icon>play_arrow</v-icon>
              </v-btn>
              <span>start simulator</span>
            </v-tooltip>

            <v-tooltip top v-show="is_running">
              <v-btn slot="activator" fab small color="blue"
               @click.native="modbus_stop">
                <v-icon>stop</v-icon>
              </v-btn>
              <span>stop simulator</span>
            </v-tooltip>

            <v-spacer></v-spacer>

            <v-tooltip top>
              <v-btn slot="activator" fab small color="blue"
               @click.native="save">
                <v-icon>save</v-icon>
              </v-btn>
              <span>save current setup</span>
            </v-tooltip>

            <v-tooltip top>
              <v-btn slot="activator" fab small color="red"
               @click.native="load">
                <v-icon>unarchive</v-icon>
              </v-btn>
              <span>load setup</span>
            </v-tooltip>

            <v-tooltip top>
              <v-btn slot="activator" color="pink" dark small fab
               @click.native="show_dialog_add_new_group = true"
              >
                <v-icon>add</v-icon>
              </v-btn>
              <span>add new group</span>
            </v-tooltip>

          </v-toolbar>
        </v-card-title>
         <v-layout row wrap>
          <v-flex xs6>
            <v-container >
                <v-layout row> <!-- slave ID -->
                  <v-flex xs4>
                    <v-subheader>Slave ID</v-subheader>
                  </v-flex>
                  <v-flex xs8>
                    <v-text-field
                     label="Slave ID"
                     v-model="slave_id"
                    ></v-text-field>
                  </v-flex>
                </v-layout>

                <v-layout row> <!-- protocol select -->
                  <v-flex xs4>
                    <v-subheader>Protocol</v-subheader>
                  </v-flex>
                  <v-flex xs8>
                    <v-select
                     v-bind:items="protocol_list"
                     label="Protocol"
                     bottom
                     v-model="protocol"
                    ></v-select>
                  </v-flex>
                </v-layout>
            </v-container>
          </v-flex>

          <v-flex xs6>
            <!-- tcp protocol parameters -->
            <v-container v-show="protocol === 'tcp'">
              <v-layout row>
                <v-flex xs4>
                  <v-subheader>TCP Port</v-subheader>
                </v-flex>
                <v-flex xs8>
                  <v-text-field
                   label="TCP Port"
                   v-model="protocol_param_tcp.port"
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>

            <!-- rtu protocol parameters -->
            <v-container v-show="protocol === 'rtu'">
              <v-layout row>
                <v-flex xs4>
                  <v-subheader>Serial Port</v-subheader>
                </v-flex>
                <v-flex xs8>
                  <v-select
                   v-bind:items="serial_ports"
                   label="Serial Port"
                   bottom
                   v-model="protocol_param_rtu.serial_port"
                  ></v-select>
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex xs4>
                  <v-subheader>Baud Rate</v-subheader>
                </v-flex>
                <v-flex xs8>
                  <v-select
                   v-bind:items="baud_rate_list"
                   label="Baud Rate"
                   bottom
                   v-model="protocol_param_rtu.baud_rate"
                  ></v-select>
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex xs4>
                  <v-subheader>Parity</v-subheader>
                </v-flex>
                <v-flex xs8>
                  <v-select
                   v-bind:items="parity_list"
                   label="Parity"
                   bottom
                   v-model="protocol_param_rtu.parity"
                  ></v-select>
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex xs4>
                  <v-subheader>Data Bit</v-subheader>
                </v-flex>
                <v-flex xs8>
                  <v-select
                   v-bind:items="data_bit_list"
                   label="Data Bit"
                   bottom
                   v-model="protocol_param_rtu.data_bit"
                  ></v-select>
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex xs4>
                  <v-subheader>Stop Bit</v-subheader>
                </v-flex>
                <v-flex xs8>
                  <v-select
                   v-bind:items="stop_bit_list"
                   label="Stop Bit"
                   bottom
                   v-model="protocol_param_rtu.stop_bit"
                  ></v-select>
                </v-flex>
              </v-layout>

            </v-container>
          </v-flex>
         </v-layout>

        </v-card-text>
      </v-card>
    </v-flex>

    <v-flex xs4 v-for="group in modbus_reg_groups" :key="group.name">
      <v-card>
        <v-card-title>
          <v-toolbar>
            <v-toolbar-title>{{group.name}}</v-toolbar-title>
            <v-spacer></v-spacer>

            <v-tooltip top>
              <v-btn slot="activator" icon @click.native="show_add_regs(group)">
                <v-icon>add</v-icon>
              </v-btn>
              <span>add new registers</span>
            </v-tooltip>

            <v-tooltip top>
              <v-btn slot="activator" icon @click.native="remove_group(group)">
                <v-icon>remove</v-icon>
              </v-btn>
              <span>delete this group</span>
            </v-tooltip>

          </v-toolbar>
        </v-card-title>

        <v-card-text> 
          <v-data-table
           v-bind:headers="reg_table_headers"
           :items="group.regs"
           class="elevation-1"
           hide-actions
          >
           <template slot="items" slot-scope="props">
            <tr v-on:click="show_edit_dialog(props.item, group)">
              <td>{{props.item.reg_type}}</td>
              <td>{{props.item.address}}</td>
              <td>{{props.item.desc}}</td>
              <td>{{props.item.value}}</td>
            </tr>
           </template>
          </v-data-table>
        </v-card-text>

      </v-card>
    </v-flex>

    <!-- add new group dialog -->
    <v-dialog v-model="show_dialog_add_new_group">
      <v-card>
        <v-card-title class="headline">Add New Register Group</v-card-title>
        <v-card-text>
          <v-layout row>
            <v-flex xs4>
              <v-subheader>Group Name</v-subheader>
            </v-flex>
            <v-flex xs8>
              <v-text-field
                label="Group Name"
                v-model="dialog_new_group_name"
                >
              </v-text-field>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" flat @click.native="show_dialog_add_new_group = false">Cancel</v-btn>
          <v-btn color="primary" flat @click.native="add_new_group">Add</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- register add dialog -->
    <v-dialog v-model="show_dialog_add_regs">
      <v-card>
        <v-card-title class="headline">Add Registers to group</v-card-title>
        <v-card-text>
          <v-layout row>
            <v-flex xs4>
              <v-subheader>Register Type</v-subheader>
            </v-flex>
            <v-flex xs8>
              <v-select
                v-bind:items="register_type_list"
                label="Register Type"
                bottom
                v-model="dialog_new_reg_type"
                >
              </v-select>
            </v-flex>
          </v-layout>

          <v-layout row>
            <v-flex xs4>
              <v-subheader>Start Address</v-subheader>
            </v-flex>
            <v-flex xs8>
              <v-text-field
                label="Start Address"
                v-model.number="dialog_start_address"
                >
              </v-text-field>
            </v-flex>
          </v-layout>

          <v-layout row>
            <v-flex xs4>
              <v-subheader>Number of Registers</v-subheader>
            </v-flex>
            <v-flex xs8>
              <v-text-field
                label="Number of Registers"
                v-model.number="dialog_num_regs"
                >
              </v-text-field>
            </v-flex>
          </v-layout>

        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" flat @click.native="show_dialog_add_regs = false">Cancel</v-btn>
          <v-btn color="primary" flat @click.native="add_registers_to_group">Add</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- error show dialog -->
    <v-dialog v-model="dialog_error_show" max-width="500px">
      <v-card>
        <v-card-title>
          <span>Error</span>
        </v-card-title>
        <v-card-text>
          <span>{{dialog_error_message}}</span>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" flat @click.stop="dialog_error_show = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- register edit dialog -->
    <v-dialog v-model="dialog_edit_show">
      <v-card>
        <v-card-title class="headline">Edit Register</v-card-title>
        <v-card-text>
          <v-layout row>
            <v-flex xs4>
              <v-subheader>Register Type</v-subheader>
            </v-flex>
            <v-flex xs8>
              <span>{{dialog_edit_selected.reg_type}}</span>
            </v-flex>
          </v-layout>

          <v-layout row>
            <v-flex xs4>
              <v-subheader>Address</v-subheader>
            </v-flex>
            <v-flex xs8>
              <span>{{dialog_edit_selected.address}}</span>
            </v-flex>
          </v-layout>

          <v-layout row>
            <v-flex xs4>
              <v-subheader>Description</v-subheader>
            </v-flex>
            <v-flex xs8>
              <v-text-field
               label="Description"
               v-model="dialog_edit_selected.desc"
              ></v-text-field>
            </v-flex>
          </v-layout>

          <v-layout row>
            <v-flex xs4>
              <v-subheader>Value</v-subheader>
            </v-flex>

            <v-flex xs8 v-show="dialog_edit_selected.reg_type === 'coil' ||
                                dialog_edit_selected.reg_type === 'discrete'">
              <v-select
               v-bind:items="true_false_list"
               label="Value"
               bottom
               v-model="dialog_edit_selected.value"
              ></v-select>
            </v-flex>
            <v-flex xs8 v-show="dialog_edit_selected.reg_type === 'holding' ||
                                dialog_edit_selected.reg_type === 'input'">
              <v-text-field
               label="value"
               v-model="dialog_edit_selected.value"
              ></v-text-field>
            </v-flex>
          </v-layout>

        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click.native="dialog_edit_show = false">Cancel</v-btn>
          <v-btn color="red" flat @click.native="delete_register">Delete</v-btn>
          <v-btn color="primary" flat @click.native="update_register">Update</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-layout>
</v-container>
</template>

<script>

const dialog = require('electron').remote.dialog
const jsonfile = require('jsonfile')
const modbus = require('modbus-serial')

export default {
  methods: {
    update_register: function (selected) {
      this.dialog_edit_show = false

      this.dialog_edit_selected_instance.desc = this.dialog_edit_selected.desc

      if (this.dialog_edit_selected_instance.reg_type === 'coil' ||
          this.dialog_edit_selected_instance.reg_type === 'discrete') {
        this.dialog_edit_selected_instance.value = this.dialog_edit_selected.value === 'true'
      } else {
        this.dialog_edit_selected_instance.value = this.dialog_edit_selected.value
      }
    },
    delete_register: function () {
      this.dialog_edit_show = false

      this.rem_register(this.dialog_edit_selected_instance)

      this.rem_register_from_group(this.dialog_edit_selected_instance,
        this.dialog_selected_group)
    },
    show_edit_dialog: function (selected, group) {
      this.dialog_edit_selected = {
        'reg_type': selected.reg_type,
        'address': selected.address,
        'desc': selected.desc
      }
      this.dialog_edit_selected_instance = selected
      this.dialog_selected_group = group

      if (selected.reg_type === 'coil' || selected.reg_type === 'discrete') {
        this.dialog_edit_selected.value = '' + selected.value
      } else {
        this.dialog_edit_selected.value = selected.value
      }
      this.dialog_edit_show = true
    },
    show_error_dialog: function (msg) {
      this.dialog_error_message = msg
      this.dialog_error_show = true
    },
    get_register_hash: function (regType) {
      switch (regType) {
        case 'coil':
          return this.modbus_reg_coils

        case 'discrete':
          return this.modbus_reg_discrete_inputs

        case 'holding':
          return this.modbus_reg_holdings

        case 'input':
          return this.modbus_reg_inputs
      }
      return null
    },

    add_register: function (reg) {
      var regHash = this.get_register_hash(reg.reg_type)

      regHash[reg.address] = reg
    },
    rem_register: function (reg) {
      var regHash = this.get_register_hash(reg.reg_type)

      delete regHash[reg.address]
    },
    check_reg_exists: function (regType, regAddr) {
      var regHash = this.get_register_hash(regType)

      if (regHash[regAddr] === undefined) {
        return false
      }
      return true
    },
    group_name_exists: function (name) {
      var i

      for (i = 0; i < this.modbus_reg_groups.length; i++) {
        if (this.modbus_reg_groups[i].name === name) {
          return true
        }
      }
      return false
    },
    add_new_group: function () {
      this.show_dialog_add_new_group = false

      if (this.group_name_exists(this.dialog_new_group_name)) {
        this.show_error_dialog(this.dialog_new_group_name + ' already exists!!!')
        return
      }

      this.modbus_reg_groups.push({
        name: this.dialog_new_group_name,
        regs: [
        ]
      })
    },
    remove_group: function (group) {
      console.log('======== removing group ' + group.name)
      const ndx = this.modbus_reg_groups.indexOf(group)

      // remove group from group list
      if (ndx > -1) {
        this.modbus_reg_groups.splice(ndx, 1)
      }

      console.log(group)

      // remove all the registers inside the group
      for (var i = 0; i < group.regs.length; i++) {
        console.log('delete :' + i)
        this.rem_register(group.regs[i])
      }
      group.regs = []
    },
    show_add_regs: function (group) {
      this.dialog_selected_group = group
      this.show_dialog_add_regs = true
    },
    add_registers_to_group: function () {
      var addr
      var v
      var regList = []
      var i

      this.show_dialog_add_regs = false

      for (i = 0; i < this.dialog_num_regs; i++) {
        addr = this.dialog_start_address + i

        switch (this.dialog_new_reg_type) {
          case 'coil':
          case 'discrete':
            v = false
            break

          case 'holding':
          case 'input':
            v = 0
            break
        }

        if (this.check_reg_exists(this.dialog_new_reg_type, addr) === true) {
          this.show_error_dialog('Register ' + this.dialog_new_reg_type + ':' + addr + ' already exists!!!')
          return
        }

        var reg = {
          'reg_type': this.dialog_new_reg_type,
          'address': addr,
          'desc': this.dialog_new_reg_type + ' ' + addr,
          'value': v
        }

        regList.push(reg)
      }

      for (i = 0; i < regList.length; i++) {
        this.dialog_selected_group.regs.push(regList[i])
        this.add_register(regList[i])
      }
      console.log('======== add regs to ' + this.dialog_selected_group.name)
      console.log(this.dialog_selected_group)
    },
    rem_register_from_group: function (reg, group) {
      const ndx = group.regs.indexOf(reg)

      console.log('remove reg ndx: ' + ndx)
      group.regs.splice(ndx, 1)
    },
    reset_to_default: function () {
      // clear up internal data structures
      this.slave_id = 1
      this.protocol = 'tcp'
      this.protocol_param_tcp = {
        port: 1502
      }
      this.protocol_param_rtu = {
        serial_port: '/dev/ttyUSB0',
        baud_rate: 115200,
        parity: 'None',
        data_bit: 8,
        stop_bit: 1
      }
      this.modbus_reg_groups = []
      this.modbus_reg_coils = { }
      this.modbus_reg_discrete_inputs = {}
      this.modbus_reg_holdings = {}
      this.modbus_reg_inputs = {}
    },
    save: function () {
      var json = {
        'slave_id': this.slave_id,
        'protocol': this.protocol
      }

      console.log(dialog)

      switch (this.protocol) {
        case 'tcp':
          json['protocol_param'] = this.protocol_param_tcp
          break

        case 'rtu':
          json['protocol_param'] = this.protocol_param_rtu
          break
      }

      json['modbus_reg_groups'] = this.modbus_reg_groups

      dialog.showSaveDialog({
        'title': 'Save Current Setup',
        'filters': [
          { name: 'Modbus Slave Setting', extensions: ['json'] }
        ]
      }, function (filename) {
        console.log('saving to ' + filename)
        console.log(json)
        jsonfile.writeFileSync(filename, json, {
          spaces: 2
        })
      })
    },
    load: function () {
      var self = this

      dialog.showOpenDialog({
        'title': 'Open Saved Setup',
        'filters': [
          { name: 'Modbus Slave Setting', extensions: ['json'] }
        ]
      }, function (filePaths) {
        console.log(filePaths)
        jsonfile.readFile(filePaths[0], function (err, json) {
          if (err) {
            console.log(err)
            return
          }

          // clear up internal data structures
          self.reset_to_default()

          self.slave_id = json.slave_id
          self.protocol = json.protocol

          if (self.protocol === 'tcp') {
            self.protocol_param_tcp = json.protocol_param
          } else {
            self.protocol_param_rtu = json.protocol_param
          }

          self.modbus_reg_groups = json.modbus_reg_groups

          for (var i = 0; i < self.modbus_reg_groups.length; i++) {
            for (var j = 0; j < self.modbus_reg_groups[i].regs.length; j++) {
              self.add_register(self.modbus_reg_groups[i].regs[j])
            }
          }
        })
      })
    },
    modbus_get_reg: function (unitID, regType, addr) {
      if (unitID !== this.slave_id) {
        console.log('slave id mismatch for get ' + regType + ' register:' + unitID)
        return
      }

      var reg = this.get_register_hash(regType)[addr]

      if (reg === undefined) {
        console.log('get ' + regType + ' register for unknown address:' + addr)
        return 0
      }

      console.log('get req:', unitID, regType, addr, reg.value)
      return reg.value
    },
    modbus_cb_get_input_register: function (addr, unitID) {
      return this.modbus_get_reg(unitID, 'input', addr)
    },
    modbus_cb_get_holding_register: function (addr, unitID) {
      return this.modbus_get_reg(unitID, 'holding', addr)
    },
    modbus_cb_get_coil: function (addr, unitID) {
      return this.modbus_get_reg(unitID, 'coil', addr)
    },
    modbus_cb_get_discrete: function (addr, unitID) {
      return this.modbus_get_reg(unitID, 'discrete', addr)
    },
    modbus_cb_set_register: function (addr, value, unitID) {
      console.log('set hodling req:', unitID, addr, value)
      if (unitID !== this.slave_id) {
        console.log('slave id mismatch for set holding register:' + unitID)
        return
      }

      if (this.get_register_hash('holding')[addr] !== undefined) {
        this.get_register_hash('holding')[addr].value = value
      }
    },
    modbus_cb_set_coil: function (addr, value, unitID) {
      console.log('set coil req:', unitID, addr, value)
      if (unitID !== this.slave_id) {
        console.log('slave id mismatch for set coil register:' + unitID)
        return
      }

      if (this.get_register_hash('coil')[addr] !== undefined) {
        this.get_register_hash('coil')[addr].value = value
      }
    },

    modbus_start: function () {
      var self = this
      var vector = {
        getInputRegister: this.modbus_cb_get_input_register,
        getHoldingRegister: this.modbus_cb_get_holding_register,
        getCoil: this.modbus_cb_get_coil,
        getDiscreteInput: this.modbus_cb_get_discrete,
        setRegister: this.modbus_cb_set_register,
        setCoil: this.modbus_cb_set_coil
      }

      this.modbus = new modbus.ServerTCP(vector, {
        host: '0.0.0.0',
        port: this.protocol_param_tcp.port,
        unitID: this.slave_id
      })
      this.modbus.on('socketError', function (sock) {
        console.log('socketError event')
        const ndx = self.modbus_clients.indexOf(sock)

        self.modbus_clients.splice(ndx, 1)
        sock.destroy()
      })

      this.modbus.on('socketConnect', function (sock) {
        console.log('socketConnect event')
        self.modbus_clients.push(sock)

        sock.on('close', function () {
          console.log('socket close event')
          const ndx = self.modbus_clients.indexOf(sock)

          self.modbus_clients.splice(ndx, 1)
          sock.destroy()
        })
      })
      this.is_running = true
    },

    modbus_stop: function () {
      if (this.modbus != null) {
        console.log(this.modbus)
        for (var i = 0; i < this.modbus_clients.length; i++) {
          this.modbus_clients[i].destroy()
        }
        this.modbus.close()
        this.modbus = null
        this.modbus_clients = []
      }
      this.is_running = false
    }
  },
  data () {
    return {
      modbus: null,
      modbus_clients: [],

      is_running: false,
      fab: false,
      slave_id: 1,
      protocol: 'tcp',
      protocol_param_tcp: {
        port: 1502
      },
      protocol_param_rtu: {
        serial_port: '/dev/ttyUSB0',
        baud_rate: 115200,
        parity: 'None',
        data_bit: 8,
        stop_bit: 1
      },

      protocol_list: ['tcp', 'rtu'],
      serial_ports: ['/dev/ttyUSB0', '/dev/ttyUSB1'],
      baud_rate_list: [9600, 19200, 38400, 57600, 115200],
      parity_list: ['None', 'Even', 'Odd'],
      data_bit_list: [5, 6, 7, 8],
      stop_bit_list: [1, 2],

      show_dialog_add_new_group: false,
      dialog_new_group_name: '',

      show_dialog_add_regs: false,
      register_type_list: ['coil', 'discrete', 'holding', 'input'],
      dialog_new_reg_type: 'coil',
      dialog_start_address: 0,
      dialog_num_regs: 1,
      dialog_selected_group: null,

      true_false_list: ['true', 'false'],
      dialog_error_message: '',
      dialog_error_show: false,

      dialog_edit_show: false,
      dialog_edit_selected: {
        'reg_type': 'unknown',
        'address': -1,
        'desc': 'bullshit',
        'value': 'bullshit'
      },
      dialog_edit_selected_instance: null,

      reg_table_headers: [
        { text: 'Type', align: 'left', sortable: false, value: 'reg_type' },
        { text: 'Address', align: 'left', sortable: false, value: 'address' },
        { text: 'Desc', align: 'left', sortable: false, value: 'desc' },
        { text: 'Value', align: 'left', sortable: false, value: 'value' }
      ],

      modbus_reg_groups: [
      ],
      modbus_reg_coils: {
      },
      modbus_reg_discrete_inputs: {
      },
      modbus_reg_holdings: {
      },
      modbus_reg_inputs: {
      }
    }
  }
}
</script>

<style scoped>
.fab-container {
  position: fixed;
  top: 45px;
  right: 25px;
  z-index: 255;
}
</style>
