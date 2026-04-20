<template>
  <div v-if="visible" class="variable-modal-overlay" @click.self="closeModal">
    <div class="variable-modal">
      <div class="modal-header">
        <h3>添加变量</h3>
        <button class="close-btn" @click="closeModal">×</button>
      </div>
      
      <div class="modal-body">
        <div class="add-variable-form">
          <input 
            v-model="newVariable.name" 
            type="text" 
            placeholder="变量名称"
            class="variable-input"
            @keyup.enter="addVariable"
          />
          <select v-model="newVariable.domain" class="variable-select">
            <option value="global">全局变量</option>
            <option value="local">局部变量</option>
          </select>
          <select v-model="newVariable.type.type" class="variable-select">
            <option value="Integer">整数</option>
            <option value="Fixed">定点数</option>
            <option value="Boolean">布尔值</option>
            <option value="String">字符串</option>
            <option value="CreaturePreset">生物预设</option>
            <option value="ComponentPreset">组件预设</option>
            <option value="LogicBodyPreset">逻辑体预设</option>
            <option value="TriggerAreaPreset">触发区域预设</option>
            <option value="DecorationPreset">装饰物预设</option>
            <option value="ItemBoxPreset">道具箱预设</option>
            <option value="ComponentGroupPreset">组件组预设</option>
            
            <option value="Player">玩家</option>
            <option value="Vector">向量</option>
            <option value="CoordinatePoint">坐标点</option>
            <option value="CharacterEgg">角色蛋仔</option>
            <option value="Creature">生物</option>
            <option value="Component">组件</option>
            <option value="LogicBody">逻辑体</option>
            <option value="ItemBox">道具箱</option>
            <option value="TriggerArea">触发区域</option>
            <option value="UnitType">单位类型</option>
            <option value="PhysicsType">物理类型</option>
            <option value="AbilitySlot">能力槽位</option>
            <option value="SkillPreset">技能预设</option>
            <option value="LimitState">限制状态</option>
            <option value="Timestamp">时间戳</option>
            <option value="FactionID">阵营ID</option>
            <option value="Faction">阵营</option>
            <option value="Trigger">触发器</option>
            <option value="NativeInterface">原生界面</option>
            <option value="Effect">特效</option>
            <option value="Sound">音效</option>
            <option value="EffectPreset">效果预设</option>
            <option value="Skill">技能</option>
            <option value="EffectType">效果</option>
            <option value="Control">控件</option>
            <option value="SoundPreset">音效预设</option>
            <option value="Sound2DPreset">音效2D预设</option>
            <option value="CustomAudio">自定义音频</option>
            <option value="RotationAngle">旋转角</option>
            <option value="AIBaseCommand">AI基础命令</option>
            <option value="AIMovementMode">AI移动模式</option>
            <option value="AIPatrolType">AI巡逻类型</option>
            <option value="OldEffectPreset">旧特效预设</option>
            <option value="AIPathfindingMode">AI寻路模式</option>
            <option value="Timer">计时器</option>
            <option value="CustomVehicle">自定义载具</option>
            <option value="Vehicle">载具</option>
            <option value="SpecialVehicle">特殊载具</option>
            <option value="FashionSet">时尚套装</option>
            <option value="ExpressionPreset">表情预设</option>
            <option value="FacialExpressionNumber">面部表情编号</option>
            <option value="FactionRelationType">阵营关系类型</option>
            <option value="SkyLighting">天空光照</option>
            <option value="FilterData">滤镜数据</option>
            <option value="SkyFog">天空雾效</option>
            <option value="Path">路径</option>
            <option value="Waypoint">路点</option>
            <option value="DamageScheme">伤害方案</option>
            <option value="OneDimensionalTable">一维表</option>
            <option value="Table">表格</option>
            <option value="StoryPreset">剧情预设</option>
            <option value="AnimationPreset">动画预设</option>
            <option value="Color">颜色</option>
            <option value="InterfaceControl">界面控件</option>
            <option value="TextControl">文本控件</option>
            <option value="ImageControl">图片控件</option>
            <option value="ProgressBarControl">进度条控件</option>
            <option value="ButtonControl">按钮控件</option>
            <option value="CanvasControl">画布控件</option>
            <option value="UIInputNode">UI输入节点</option>
            <option value="SkillSlot">技能槽位</option>
            <option value="ItemSlot">物品槽位</option>
            <option value="ImagePreset">图片预设</option>
            <option value="FontPreset">字体预设</option>
            <option value="Item">物品</option>
            <option value="ItemPreset">物品预设</option>
            <option value="ItemID">物品ID</option>
            <option value="Shop">商店</option>
            <option value="ItemSlotType">物品槽位类型</option>
            <option value="ItemType">物品类型</option>
            <option value="EffectCategory">效果类型</option>
            <option value="Character|Creature">角色I生物</option>
            <option value="LifeBodyNumber">生命体编号</option>
            <option value="Joint">关节</option>
            <option value="JointType">关节类型</option>
            <option value="JointPreset">关节预设</option>
            <option value="BodyPart">部位</option>
            <option value="GameProgress">游玩进度</option>
            <option value="StoryAnimation">剧情动画</option>
            <option value="Card">牌面</option>
            <option value="FriendRelation">好友关系</option>
            <option value="IndependentCamera">独立相机</option>
            <option value="LevelPreset">关卡预设</option>
            <option value="GiftNumber">谢礼编号</option>
            <option value="DepthOfFieldData">景深数据</option>
            <option value="NoEntityNumber">无实体编号</option>
            <option value="VirtualBody">虚拟体</option>
            <option value="SceneText">场景文本</option>
            <option value="InteractionButton">互动按钮</option>
            <option value="Task">任务</option>
            <option value="TaskState">任务状态</option>
            <option value="TaskStep">任务步骤</option>
            <option value="TaskProgress">任务进度</option>
            <option value="Skeleton">骨骼</option>
            <option value="Decoration">装饰物</option>
            <option value="SceneInterface">场景界面</option>
            <option value="Shape">形状</option>
            <option value="SearchEnemyPriority">搜敌优先级</option>
            <option value="TextParameter">文本参数</option>
            <option value="ComponentSkin">组件皮肤</option>
          </select>
          <label class="checkbox-label">
            <input 
              v-model="newVariable.type.isArray" 
              type="checkbox" 
              :disabled="newVariable.type.isWeightPool"
            />
            数组
          </label>
          <label class="checkbox-label">
            <input 
              v-model="newVariable.type.isWeightPool" 
              type="checkbox" 
              :disabled="newVariable.type.isArray"
            />
            权重池
          </label>
          <button class="add-btn" @click="addVariable">添加</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useEventBus } from '@/composables/useEventBus'
import type { BaseValueType } from '@/types/egcTypes'

const { on, emit, EventTypes } = useEventBus()

const visible = ref(false)

const newVariable = ref({
  name: '',
  domain: 'global' as 'global' | 'local',
  type: {
    type: 'String' as BaseValueType,
    isArray: false,
    isWeightPool: false
  }
})

on(EventTypes.OPEN_VARIABLE_MODAL, () => {
  visible.value = true
})

function closeModal() {
  visible.value = false
}

function addVariable() {
  if (!newVariable.value.name.trim()) {
    alert('请输入变量名称')
    return
  }
  
  if (/^\d/.test(newVariable.value.name)) {
    alert('变量名称不能以数字开头')
    return
  }
  
  emit(EventTypes.ADD_VARIABLE_TO_SELECTOR, {
    variable: {
      name: newVariable.value.name,
      domain: newVariable.value.domain,
      type: {
        type: newVariable.value.type.type,
        isArray: newVariable.value.type.isArray,
        isWeightPool: newVariable.value.type.isWeightPool
      }
    }
  })
  
  closeModal()
  
  newVariable.value.name = ''
  newVariable.value.type = {
    type: 'String' as BaseValueType,
    isArray: false,
    isWeightPool: false
  }
}
</script>

<style scoped lang="scss">
@use 'sass:map';
@use '@/styles/variables.scss' as *;

.variable-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.variable-modal {
  background-color: $surface;
  border-radius: $border-radius-lg;
  width: 800px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: $shadow-xl;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-lg;
  border-bottom: 1px solid $border-color;
  
  h3 {
    margin: 0;
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
    color: $text-primary;
  }
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: $text-secondary;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: $text-primary;
  }
}

.modal-body {
  padding: $spacing-lg;
  overflow-y: auto;
  flex: 1;
}

.add-variable-form {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;
  align-items: center;
  padding-bottom: $spacing-lg;
  border-bottom: 1px solid $border-color;
  margin-bottom: $spacing-lg;
}

.variable-input {
  flex: 1;
  min-width: 150px;
  padding: $spacing-sm;
  border: 1px solid $border-color;
  border-radius: $border-radius-sm;
  font-size: $font-size-sm;
  
  &:focus {
    outline: none;
    border-color: $primary;
  }
}

.variable-select {
  padding: $spacing-sm;
  border: 1px solid $border-color;
  border-radius: $border-radius-sm;
  font-size: $font-size-sm;
  background-color: $surface;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: $primary;
  }
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  font-size: $font-size-sm;
  cursor: pointer;
  
  input {
    cursor: pointer;
  }
}

.add-btn {
  padding: $spacing-sm $spacing-md;
  background-color: $primary;
  color: white;
  border: none;
  border-radius: $border-radius-sm;
  cursor: pointer;
  font-size: $font-size-sm;
  transition: background-color $transition-fast;
  
  &:hover {
    background-color: map.get($colors, ocean, 600);
  }
}
</style>
