<template>
  <a-menu :style="style" class="contextmenu" v-show="visible" @click="handleClick" :selectedKeys="selectedKeys">
    <a-menu-item :key="item.key" v-for="item in itemList">
      <a-icon role="menuitemicon" v-if="item.icon" :type="item.icon" />{{item.text}}
    </a-menu-item>
  </a-menu>
</template>

<script lang="ts">

import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class ContextMenu extends Vue {
  @Prop({ default: false })
  private visible?: boolean

  @Prop({ default: [] })
  private itemList!: any[]

  left = 0
  top = 0
  target : EventTarget | null = null
  selectedKeys = []

  get style () {
    return {
      left: this.left + 'px',
      right: this.top + 'px'
    }
  }

  created () {
    window.addEventListener('mousedown', e => this.closeMenu(e))
    window.addEventListener('contextmenu', e => this.setPosition(e))
  }

  closeMenu (e:MouseEvent) {
    if (e.target) {
      const role = (e.target as HTMLElement).getAttribute('role')
      if (role) {
        if (['menuitemicon', 'menuitem'].indexOf(role) >= 0) {
          return
        }
      }
    }
    this.$emit('update:visible', false)
  }

  setPosition (e: MouseEvent) {
    this.left = e.clientX
    this.top = e.clientY
    this.target = e.target
  }

  handleClick (key: MouseEvent) {
    this.$emit('select', key, this.target)
    this.$emit('update:visible', false)
  }
}
</script>

<style lang="less" scoped>
.contextmenu {
  position: fixed;
  z-index: 10000;
  border: 1px solid #9e9e9e;
  border-radius: 4px;
  box-shadow: 2px 2px 10px #aaaaaa !important;
}
</style>
