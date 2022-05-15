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
}
