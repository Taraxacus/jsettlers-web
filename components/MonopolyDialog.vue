<template id="modal-template">
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">

          <div class="modal-header">
            <slot name="header">
              Choose a resource type you want to monopolize:
            </slot>
          </div>

          <div class="modal-body">
            <slot name="body">
              <img v-for="rt in resourceTypes" 
                :src="`doc/images/${getName(rt).toPascalCase()}Card.png`" 
                @click="pickResource(rt)"
                v-bind:class="{ selected: rt === resourceType }" />
            </slot>
          </div>

          <div class="modal-footer">
            <slot name="footer">
              <span v-if="resourceType === null">No resource type chosen yet</span>
              <span v-if="resourceType !== null">You selected {{getName(resourceType)}}.</span>
              <button class="modal-default-button" @click="$emit('close', resourceType)" :disabled="resourceType === null">
                <span v-if="resourceType === null">Can't do...</span>
                <span v-if="resourceType !== null">Mono the {{getName(resourceType)}}!</span>
              </button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import { jsettlers as pb } from "../src/generated/data";
  import {Util} from "../src/util.js";
  
  export default {
      name: 'monopoly-dialog',
      data() {
          return {
              resourceTypes: [
                  pb.ResourceType.Wheat,
                  pb.ResourceType.Timber,
                  pb.ResourceType.Ore,
                  pb.ResourceType.Sheep,
                  pb.ResourceType.Brick,
              ],
              resourceType: null
          }
      },
      methods: {
          getName: function(resourceType) {
              return Util.getEnumName(pb.ResourceType, resourceType);
          },
          pickResource(resourceType) {
              this.resourceType = resourceType;
          }
      }
  }
</script>

<style scoped>
img {
    height: 101px;
    width: 63px;
    border: 0.5em solid white;
    border-radius: 16px;
}
img:hover {
  cursor: pointer;
  border: 0.5em solid lightblue;
}
.selected, .selected:hover {
    border: 0.5em solid black;

}
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  /* transition: opacity .2s ease; */
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 600px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
  width: 10em;
  height: 2em;
}
</style>