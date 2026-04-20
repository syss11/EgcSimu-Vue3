export type EgcType = 'action' | 'event'  | 'controll' | EgcValue
export type EgcValue = 'value' | 'boolean'

export type BaseValueType = 'all' |'Unit' | 'Integer' | 'Fixed' | 'Boolean'
 | 'String' | 'UnitPreset' | 'CreaturePreset' | 
  'ComponentPreset' | 'LogicBodyPreset' | 'TriggerAreaPreset' |
   'DecorationPreset' | 'ItemBoxPreset' | 'ComponentGroupPreset' | 
   'PlayerID' | 'Player' | 'Vector' | 'CoordinatePoint' | 'CharacterEgg' 
   | 'Creature' | 'Component' | 'LogicBody' | 'ItemBox' | 'TriggerArea' 
   | 'UnitType' | 'PhysicsType' | 'AbilitySlot' | 'SkillPreset' |
    'LimitState' | 'Timestamp' | 'FactionID' | 'Faction' | 'Trigger' 
    | 'NativeInterface' | 'Effect' | 'Sound' | 'EffectPreset' | 'Skill' 
    | 'EffectType' | 'Control' | 'SoundPreset' | 'Sound2DPreset' | 
    'CustomAudio' | 'RotationAngle' | 'AIBaseCommand' | 'AIMovementMode' 
    | 'AIPatrolType' | 'OldEffectPreset' | 'AIPathfindingMode' | 'Timer'
     | 'CustomVehicle' | 'Vehicle' | 'SpecialVehicle' | 'FashionSet' | 
     'ExpressionPreset' | 'FacialExpressionNumber' | 'FactionRelationType'
      | 'SkyLighting' | 'FilterData' | 'SkyFog' | 'Path' | 'Waypoint' | 
      'DamageScheme' | 'OneDimensionalTable' | 'Table' | 'StoryPreset' | 
      'AnimationPreset' | 'Color' | 'InterfaceControl' | 'TextControl' | 
      'ImageControl' | 'ProgressBarControl' | 'ButtonControl' 
      | 'CanvasControl' | 'UIInputNode' | 'SkillSlot' | 'ItemSlot' 
      | 'ImagePreset' | 'FontPreset' | 'Item' | 'ItemPreset' | 'ItemID' 
      | 'Shop' | 'ItemSlotType' | 'ItemType' | 'EffectCategory' | 
      'Character|Creature' | 'LifeBodyNumber' | 'Joint' | 'JointType' | 
      'JointPreset' | 'BodyPart' | 'GameProgress' | 'StoryAnimation' | 
      'Card' | 'FriendRelation' | 'IndependentCamera' | 'LevelPreset' | 
      'GiftNumber' | 'DepthOfFieldData' | 'NoEntityNumber' | 'VirtualBody' 
      | 'SceneText' | 'InteractionButton' | 'Task' | 'TaskState' | 
      'TaskStep' | 'TaskProgress' | 'Skeleton' | 'Decoration' | 
      'SceneInterface' | 'Shape' | 'SearchEnemyPriority' | 
      'TextParameter' | 'ComponentSkin' | 'NumericComparator' | 'TriggerAreaType' | 'Operator'

export const bvtToChinese:Record<BaseValueType,string> = {
    'all': '任意值',
    'Unit': '单位',
    'Integer': '整数',
    'Fixed': '定点数',
    'Boolean': '布尔值',
    'String': '字符串',
    'UnitPreset': '单位预设',
    'CreaturePreset': '生物预设',
    'ComponentPreset': '组件预设',
    'LogicBodyPreset': '逻辑体预设',
    'TriggerAreaPreset': '触发区域预设',
    'DecorationPreset': '装饰物预设',
    'ItemBoxPreset': '道具箱预设',
    'ComponentGroupPreset': '组件组预设',
    'PlayerID': '玩家ID',
    'Player': '玩家',
    'Vector': '向量',
    'CoordinatePoint': '坐标点',
    'CharacterEgg': '角色蛋仔',
    'Creature': '生物',
    'Component': '组件',
    'LogicBody': '逻辑体',
    'ItemBox': '道具箱',
    'TriggerArea': '触发区域',
    'UnitType': '单位类型',
    'PhysicsType': '物理类型',
    'AbilitySlot': '能力槽位',
    'SkillPreset': '技能预设',
    'LimitState': '限制状态',
    'Timestamp': '时间戳',
    'FactionID': '阵营ID',
    'Faction': '阵营',
    'Trigger': '触发器',
    'NativeInterface': '原生界面',
    'Effect': '特效',
    'Sound': '音效',
    'EffectPreset': '效果预设',
    'Skill': '技能',
    'EffectType': '效果',
    'Control': '控件',
    'SoundPreset': '音效预设',
    'Sound2DPreset': '音效2D预设',
    'CustomAudio': '自定义音频',
    'RotationAngle': '旋转角',
    'AIBaseCommand': 'AI基础命令',
    'AIMovementMode': 'AI移动模式',
    'AIPatrolType': 'AI巡逻类型',
    'OldEffectPreset': '旧特效预设',
    'AIPathfindingMode': 'AI寻路模式',
    'Timer': '计时器',
    'CustomVehicle': '自定义载具',
    'Vehicle': '载具',
    'SpecialVehicle': '特殊载具',
    'FashionSet': '时尚套装',
    'ExpressionPreset': '表情预设',
    'FacialExpressionNumber': '面部表情编号',
    'FactionRelationType': '阵营关系类型',
    'SkyLighting': '天空光照',
    'FilterData': '滤镜数据',
    'SkyFog': '天空雾效',
    'Path': '路径',
    'Waypoint': '路点',
    'DamageScheme': '伤害方案',
    'OneDimensionalTable': '一维表',
    'Table': '表格',
    'StoryPreset': '剧情预设',
    'AnimationPreset': '动画预设',
    'Color': '颜色',
    'InterfaceControl': '界面控件',
    'TextControl': '文本控件',
    'ImageControl': '图片控件',
    'ProgressBarControl': '进度条控件',
    'ButtonControl': '按钮控件',
    'CanvasControl': '画布控件',
    'UIInputNode': 'UI输入节点',
    'SkillSlot': '技能槽位',
    'ItemSlot': '物品槽位',
    'ImagePreset': '图片预设',
    'FontPreset': '字体预设',
    'Item': '物品',
    'ItemPreset': '物品预设',
    'ItemID': '物品ID',
    'Shop': '商店',
    'ItemSlotType': '物品槽位类型',
    'ItemType': '物品类型',
    'EffectCategory': '效果类型',
    'Character|Creature': '角色I生物',
    'LifeBodyNumber': '生命体编号',
    'Joint': '关节',
    'JointType': '关节类型',
    'JointPreset': '关节预设',
    'BodyPart': '部位',
    'GameProgress': '游玩进度',
    'StoryAnimation': '剧情动画',
    'Card': '牌面',
    'FriendRelation': '好友关系',
    'IndependentCamera': '独立相机',
    'LevelPreset': '关卡预设',
    'GiftNumber': '谢礼编号',
    'DepthOfFieldData': '景深数据',
    'NoEntityNumber': '无实体编号',
    'VirtualBody': '虚拟体',
    'SceneText': '场景文本',
    'InteractionButton': '互动按钮',
    'Task': '任务',
    'TaskState': '任务状态',
    'TaskStep': '任务步骤',
    'TaskProgress': '任务进度',
    'Skeleton': '骨骼',
    'Decoration': '装饰物',
    'SceneInterface': '场景界面',
    'Shape': '形状',
    'SearchEnemyPriority': '搜敌优先级',
    'TextParameter': '文本参数',
    'ComponentSkin': '组件皮肤',
    'NumericComparator': '数值比较符',
    'TriggerAreaType': '触发区域类型',
    'Operator': '运算符',
}

export type ValueType = {
    type: BaseValueType,
    isArray: boolean,
    isWeightPool: boolean,
}

export type ParamTypes = Record<number, ValueType[]>

export type Element ={
    type:'text',
    text:string,
}|{
    type:'param',
    index:number,
}
export type Signature = Element[]

// 将 ValueType 对象转换为中文显示
export function valueTypeToChinese(valueType: ValueType): string {
  let result = bvtToChinese[valueType.type] || valueType.type
  
  // 处理数组类型
  if (valueType.isArray) {
    result += '列表'
  }
  
  // 处理权重池类型
  if (valueType.isWeightPool) {
    result += '权重池'
  }
  
  return result
}
