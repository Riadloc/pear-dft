export enum HTTP_CODE {
  ERROR = -1,
  SUCCESS = 0
}

export enum TradeStatus {
  WAIT_BUYER_PAY = 'WAIT_BUYER_PAY',
  TRADE_CLOSED = 'TRADE_CLOSED',
  TRADE_SUCCESS = 'TRADE_SUCCESS',
  TRADE_FINISHED = 'TRADE_FINISHED',
}

/** 藏品类型 */
export enum GoodTypes {
  /** 常规 */
  NORMAL,
  /** 空投 */
  AIR_DROP,
  /** 盲盒 */
  BLINK_BOX,
  /** 盲盒-空投 */
  BLINK_BOX_AIR_DROP,
}

/** 订单状态 */
export enum OrderStatus {
  /** 待支付 */
  WAIT,
  /** 已购买 */
  PURCHASED,
  /** 交易超时关闭 */
  CLOSED,
  /** 交易错误关闭 */
  TERMINATED,
  /** 转卖中 */
  RESELL,
}

export enum OrderEnum {
  /** 正序 */
  ASC,
  /** 倒序 */
  DESC
}

export enum WalletRecordType {
  TRADE,
  TOP_UP,
  DRAW_CASH,
  APPLY_USER,
  ALL,
}

/** 连连支付个人开户状态 */
export enum LianlianSteps {
  /** 初始状态，未开户 */
  DEFAULT,
  /** 已提交申请单 */
  APPLYED,
  /** 已开户 */
  SUCCESSED,
  /** 开户失败 */
  FAILED,
}

/** 藏品能力 */
export enum GoodPowerEnum {
  /** 提前一个小时优先购买 */
  AHEAD_PURCHASE_ONE_HOUR,
  /** 手续费打8折 */
  DISCOUNT_BY_EIGHTY,
}

/** 用户角色 */
export enum UserRoles {
  /** 普通用户 */
  NORMAL,
  /** 管理员 */
  ADMIN,
}

/** 排行榜类型 */
export enum RankType {
  /** 消费日榜 */
  CONSUME_DAY,
  /** 消费总榜 */
  CONSUME_ALL,
  /** 邀新榜单 */
  INVITATION,
}

/** 支付订单状态 */
export enum PayOrderStatus {
  /** 等待中 */
  PENDING,
  /** 交易成功 */
  SUCCESSED,
  /** 交易失败 */
  FAILED,
  /** 提现-已代付 */
  DC_TRANSFERED,
  /** 提现-已申请 */
  DC_APPLYED,
  /** 提现-代付成功 申请失败 */
  DC_APPLY_FAILED,
  /** 提现-已申请 未填写验证码 */
  DC_APPLYED_WAIT,
  /** 提现-已申请 填写验证码 */
  DC_APPLYED_CHECKED,
}
