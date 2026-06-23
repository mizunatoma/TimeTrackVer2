import winston from 'winston'

const isProd = process.env.NODE_ENV === 'production'

export const logger = winston.createLogger({
  level: isProd ? 'info' : 'debug', // 本番はinfoまで／開発は全部
  format: winston.format.combine(
    winston.format.errors({ stack: true }), // Errorオブジェクトから message と stack を自動で抜き出す
    winston.format.timestamp(),
    isProd
      ? winston.format.json() // 検索しやすく
      : winston.format.simple(), // 人間が読む開発用
  ),
  transports: [new winston.transports.Console()],
})
