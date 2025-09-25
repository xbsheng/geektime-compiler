// https://time.geekbang.org/column/article/118378

// age >= 45

enum DfaState {
  /**
   * 初始状态
   */
  Initial,

  /**
   * 标识符状态
   */
  Id,

  /**
   * 数字字面量
   */
  IntLiteral,

  /**
   * 大于
   */
  GT,

  /**
   * 大于等于
   */
  GE,
}

interface Token {
  type: TokenType
  text: string
}

export enum TokenType {
  Id = 'Id',
  IntLiteral = 'IntLiteral',
  GT = 'GT',
  GE = 'GE',
}

/**
 * 是否为字母
 */
const isAlpha = (ch: string) => /[a-zA-Z]/.test(ch)

/**
 * 是否为数字
 */
const isDigit = (ch: string) => /[0-9]/.test(ch)

const scriptText1 = `   age   >=45`

export const simpleLexer = (script: string) => {
  const tokens: Token[] = []
  let state: DfaState = DfaState.Initial
  let token: Token | null = null

  const initToken = (ch: string) => {
    if (isAlpha(ch)) {
      state = DfaState.Id
      token = { type: TokenType.Id, text: ch }
      tokens.push(token)
    } else if (isDigit(ch)) {
      state = DfaState.IntLiteral
      token = { type: TokenType.IntLiteral, text: ch }
      tokens.push(token)
    } else if (ch === '>') {
      state = DfaState.GT
      token = { type: TokenType.GT, text: ch }
      tokens.push(token)
    } else {
      state = DfaState.Initial
    }
  }

  for (let i = 0; i < script.length; i++) {
    const ch = script[i]!

    switch (state) {
      case DfaState.Initial:
        initToken(ch)
        break

      // @ts-ignore
      case DfaState.Id:
        if (isAlpha(ch) || isDigit(ch) || ch === '_') {
          token!.text += ch
        } else {
          initToken(ch)
        }
        break

      // @ts-ignore
      case DfaState.IntLiteral:
        if (isDigit(ch)) {
          token!.text += ch
        } else {
          initToken(ch)
        }
        break

      // @ts-ignore
      case DfaState.GT:
        if (ch === '=') {
          state = DfaState.GE
          token!.text += ch
          token!.type = TokenType.GE
        } else {
          initToken(ch)
        }
        break

      // @ts-ignore
      case DfaState.GE:
        initToken(ch)
        break
    }
  }

  return tokens
}
