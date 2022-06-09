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
