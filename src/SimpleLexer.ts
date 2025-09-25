// https://time.geekbang.org/column/article/118378

enum DfaState {
  Initial,

  /**
   * 标识符状态
   */
  Id,

  /**
   * 整数状态
   */
  ID_int1,
  ID_int2,
  ID_int3,

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

  /**
   * 赋值
   */
  Assignment,

  /**
   * 等于
   */
  EQ,

  /**
   * +
   */
  Plus,

  /**
   * -
   */
  Minus,

  /**
   * \*
   */
  Star,

  /**
   * /
   */
  Slash,
}

/**
 * Token 接口定义
 */
export interface Token {
  /** Token 类型 */
  type: TokenType
  /** Token 文本内容 */
  text: string
}

export enum TokenType {
  Id = 'Id',
  Int = 'Int',
  IntLiteral = 'IntLiteral',
  GT = 'GT',
  GE = 'GE',
  Assignment = 'Assignment',
  EQ = 'EQ',
  Plus = 'Plus',
  Minus = 'Minus',
  Star = 'Star',
  Slash = 'Slash',
}

// 预编译正则表达式以提高性能
const ALPHA_REGEX = /[a-zA-Z]/
const DIGIT_REGEX = /[0-9]/
const WHITESPACE_REGEX = /[\s\t\n\r]/
const IDENTIFIER_REGEX = /[a-zA-Z0-9_]/

/**
 * 是否为字母
 */
const isAlpha = (ch: string): boolean => ALPHA_REGEX.test(ch)

/**
 * 是否为数字
 */
const isDigit = (ch: string): boolean => DIGIT_REGEX.test(ch)

/**
 * 是否为空白字符
 */
const isWhitespace = (ch: string): boolean => WHITESPACE_REGEX.test(ch)

/**
 * 是否为标识符字符（字母、数字、下划线）
 */
const isIdentifierChar = (ch: string): boolean => IDENTIFIER_REGEX.test(ch)

/**
 * 创建新的 token
 */
const createToken = (type: TokenType, text: string): Token => ({
  type,
  text,
})

/**
 * 初始化新 token 并设置状态
 */
const initToken = (
  ch: string,
  tokens: Token[]
): { state: DfaState; token: Token } => {
  let state: DfaState = DfaState.Initial
  let tokenType!: TokenType

  if (isAlpha(ch)) {
    if (ch === 'i') {
      state = DfaState.ID_int1
      tokenType = TokenType.Int
    } else {
      tokenType = TokenType.Id
      state = DfaState.Id
    }
  } else if (isDigit(ch)) {
    tokenType = TokenType.IntLiteral
    state = DfaState.IntLiteral
  } else if (ch === '>') {
    tokenType = TokenType.GT
    state = DfaState.GT
  } else if (ch === '=') {
    tokenType = TokenType.Assignment
    state = DfaState.Assignment
  } else if (ch === '+') {
    tokenType = TokenType.Plus
    state = DfaState.Plus
  } else if (ch === '-') {
    tokenType = TokenType.Minus
    state = DfaState.Minus
  } else if (ch === '*') {
    tokenType = TokenType.Star
    state = DfaState.Star
  } else if (ch === '/') {
    tokenType = TokenType.Slash
    state = DfaState.Slash
  }

  const token = createToken(tokenType, ch)
  tokens.push(token)

  return { state, token }
}

/**
 * 词法分析器错误类
 */
export class LexerError extends Error {
  constructor(
    message: string,
    public position: number,
    public character: string
  ) {
    super(message)
    this.name = 'LexerError'
  }
}

/**
 * 验证输入字符串
 */
const validateInput = (script: string): void => {
  if (typeof script !== 'string') {
    throw new LexerError('输入必须是字符串', 0, '')
  }
}

/**
 * 处理无效字符
 */
const handleInvalidCharacter = (ch: string, position: number): void => {
  console.warn(`警告: 位置 ${position} 处的无效字符 '${ch}' 被忽略`)
}

/**
 * 词法分析器结果接口
 */
export interface LexerResult {
  /** 解析出的 tokens */
  tokens: Token[]
  /** 是否成功解析 */
  success: boolean
  /** 错误信息（如果有） */
  error?: string
}

/**
 * 简单的词法分析器
 * @param script 要分析的源代码字符串
 * @returns 解析出的 token 数组
 * @throws {LexerError} 当输入无效时抛出错误
 */
export const simpleLexer = (script: string): Token[] => {
  // 输入验证
  validateInput(script)

  const tokens: Token[] = []
  let state: DfaState = DfaState.Initial
  let token: Token | null = null

  for (let i = 0; i < script.length; i++) {
    const ch = script[i]!

    // 跳过空白字符
    if (isWhitespace(ch)) {
      if (state !== DfaState.Initial) {
        state = DfaState.Initial
        token = null
      }
      continue
    }

    // 检查是否为有效字符
    if (
      !isAlpha(ch) &&
      !isDigit(ch) &&
      !['>', '=', '+', '-', '*', '/', '_'].includes(ch)
    ) {
      handleInvalidCharacter(ch, i)
      continue
    }

    if (!token) {
      const result = initToken(ch, tokens)
      state = result.state
      token = result.token
      continue
    }

    switch (state) {
      case DfaState.Initial:

      case DfaState.GE:
      case DfaState.EQ:

      // 计算符号
      case DfaState.Plus:
      case DfaState.Minus:
      case DfaState.Star:
      case DfaState.Slash: {
        const result = initToken(ch, tokens)
        state = result.state
        token = result.token
        break
      }

      case DfaState.Id: {
        if (isIdentifierChar(ch)) {
          token.text += ch
        } else {
          const result = initToken(ch, tokens)
          state = result.state
          token = result.token
        }
        break
      }

      case DfaState.ID_int1: {
        if (ch === 'n') {
          token.text += ch
          state = DfaState.ID_int2
        } else {
          token.type = TokenType.Id
          token.text += ch
          state = DfaState.Id
        }
        break
      }

      case DfaState.ID_int2: {
        if (ch === 't') {
          token.text += ch
          state = DfaState.ID_int3
        } else {
          token.type = TokenType.Id
          token.text += ch
          state = DfaState.Id
        }

        break
      }

      case DfaState.ID_int3: {
        if (isWhitespace(ch)) {
          state = DfaState.Initial
          token = null
        } else {
          token.type = TokenType.Id
          token.text += ch
          state = DfaState.Id
        }

        break
      }

      case DfaState.IntLiteral: {
        if (isDigit(ch)) {
          token.text += ch
        } else {
          const result = initToken(ch, tokens)
          state = result.state
          token = result.token
        }
        break
      }

      case DfaState.GT: {
        if (ch === '=') {
          state = DfaState.GE
          token.text += ch
          token.type = TokenType.GE
        } else {
          const result = initToken(ch, tokens)
          state = result.state
          token = result.token
        }
        break
      }

      case DfaState.Assignment: {
        if (ch === '=') {
          state = DfaState.EQ
          token.text += ch
          token.type = TokenType.EQ
        } else {
          const result = initToken(ch, tokens)
          state = result.state
          token = result.token
        }
        break
      }

      default: {
        throw new LexerError('无效的字符', i, ch)
      }
    }
  }

  return tokens
}

/**
 * 安全的词法分析器，不会抛出错误
 * @param script 要分析的源代码字符串
 * @returns 包含 tokens 和状态信息的结果对象
 */
export const safeSimpleLexer = (script: string): LexerResult => {
  try {
    const tokens = simpleLexer(script)
    return {
      tokens,
      success: true,
    }
  } catch (error) {
    return {
      tokens: [],
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
    }
  }
}
