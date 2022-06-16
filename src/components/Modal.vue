<script>
export default {
  props: {
    show: Boolean
  }
}
</script>

<template>
  <Transition name="modal">
    <div v-if="show" class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <slot name="header">default header</slot>
          </div>

          <div class="modal-body">
            <slot name="body">default body</slot>
          </div>

          <div class="modal-footer">
            <slot name="footer">
               <!-- <button
                class="modal-default-button"
                @click="$emit('close')"
                >Submit</button> -->
            </slot>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 300px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-header > input{
    width: 100%;
    -webkit-appearance: none;
    background-color: #fafbfc;
    border: none;
    border-radius: 3px;
    box-shadow: inset 0 0 0 2px #dfe1e6;
    box-sizing: border-box;
    display: block;
    line-height: 20px;
    margin-bottom: 12px;
    outline: none;
    padding: 8px 12px;
}

.modal-body {
  margin: 20px 0;
}

.modal-body textarea{
    width: 100%;
    -webkit-appearance: none;
    background-color: #fafbfc;
    border: none;
    border-radius: 3px;
    box-shadow: inset 0 0 0 2px #dfe1e6;
    box-sizing: border-box;
    display: block;
    line-height: 20px;
    margin-bottom: 12px;
    outline: none;
    padding: 8px 12px;
    transition-duration: 85ms;
    transition-timing-function: ease;
}

.modal-footer{
    justify-content: center;
    display: flex;
    
}

.modal-default-button{
    font-size: 14px;
    font-weight: 400;
    justify-content: center;
    line-height: 20px;
    padding: 6px 12px;
    text-decoration: none;
    transition-duration: 85ms;
    transition-timing-function: ease;
    white-space: normal;
    align-items: center;
    background-color: #091e420a;
    border: none;
    border-radius: 3px;
    box-shadow: none;
    box-sizing: border-box;
    color: #172b4d;
    cursor: pointer;
}


/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>