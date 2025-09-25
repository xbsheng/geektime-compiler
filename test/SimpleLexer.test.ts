import { expect, test, describe } from 'vitest'
import { simpleLexer, TokenType } from '../src/SimpleLexer'

describe('SimpleLexer 测试', () => {
  // 基础测试用例
  describe('基础功能测试', () => {
    test('单个标识符', () => {
      const script = 'age'
      expect(simpleLexer(script)).toEqual([{ type: TokenType.Id, text: 'age' }])
    })

    test('单个数字', () => {
      const script = '35'
      expect(simpleLexer(script)).toEqual([
        { type: TokenType.IntLiteral, text: '35' },
      ])
    })

    test('单个大于号', () => {
      const script = '>'
      expect(simpleLexer(script)).toEqual([{ type: TokenType.GT, text: '>' }])
    })

    test('大于等于号', () => {
      const script = '>='
      expect(simpleLexer(script)).toEqual([{ type: TokenType.GE, text: '>=' }])
    })
  })

  // 组合测试用例
  describe('组合表达式测试', () => {
    test('age >= 35', () => {
      const script = 'age >= 35'
      expect(simpleLexer(script)).toEqual([
        { type: TokenType.Id, text: 'age' },
        { type: TokenType.GE, text: '>=' },
        { type: TokenType.IntLiteral, text: '35' },
      ])
    })

    test('score > 100', () => {
      const script = 'score > 100'
      expect(simpleLexer(script)).toEqual([
        { type: TokenType.Id, text: 'score' },
        { type: TokenType.GT, text: '>' },
        { type: TokenType.IntLiteral, text: '100' },
      ])
    })

    test('name >= 0', () => {
      const script = 'name >= 0'
      expect(simpleLexer(script)).toEqual([
        { type: TokenType.Id, text: 'name' },
        { type: TokenType.GE, text: '>=' },
        { type: TokenType.IntLiteral, text: '0' },
      ])
    })
  })

  // 复杂表达式测试
  describe('复杂表达式测试', () => {
    test('多个标识符和数字', () => {
      const script = 'age >= 35 score > 100'
      expect(simpleLexer(script)).toEqual([
        { type: TokenType.Id, text: 'age' },
        { type: TokenType.GE, text: '>=' },
        { type: TokenType.IntLiteral, text: '35' },
        { type: TokenType.Id, text: 'score' },
        { type: TokenType.GT, text: '>' },
        { type: TokenType.IntLiteral, text: '100' },
      ])
    })

    test('连续操作符', () => {
      const script = 'a > b >= c'
      expect(simpleLexer(script)).toEqual([
        { type: TokenType.Id, text: 'a' },
        { type: TokenType.GT, text: '>' },
        { type: TokenType.Id, text: 'b' },
        { type: TokenType.GE, text: '>=' },
        { type: TokenType.Id, text: 'c' },
      ])
    })

    test('数字开头的标识符', () => {
      const script = 'age123 >= 35'
      expect(simpleLexer(script)).toEqual([
        { type: TokenType.Id, text: 'age123' },
        { type: TokenType.GE, text: '>=' },
        { type: TokenType.IntLiteral, text: '35' },
      ])
    })
  })

  // 空白字符处理测试
  describe('空白字符处理测试', () => {
    test('包含多个空格', () => {
      const script = '  age   >=   35  '
      expect(simpleLexer(script)).toEqual([
        { type: TokenType.Id, text: 'age' },
        { type: TokenType.GE, text: '>=' },
        { type: TokenType.IntLiteral, text: '35' },
      ])
    })

    test('包含制表符', () => {
      const script = '\tage\t>=\t35\t'
      expect(simpleLexer(script)).toEqual([
        { type: TokenType.Id, text: 'age' },
        { type: TokenType.GE, text: '>=' },
        { type: TokenType.IntLiteral, text: '35' },
      ])
    })

    test('包含换行符', () => {
      const script = 'age\n>=\n35'
      expect(simpleLexer(script)).toEqual([
        { type: TokenType.Id, text: 'age' },
        { type: TokenType.GE, text: '>=' },
        { type: TokenType.IntLiteral, text: '35' },
      ])
    })
  })

  // 边界情况测试
  describe('边界情况测试', () => {
    test('空字符串', () => {
      const script = ''
      expect(simpleLexer(script)).toEqual([])
    })

    test('只有空格', () => {
      const script = '   '
      expect(simpleLexer(script)).toEqual([])
    })

    test('只有制表符和换行符', () => {
      const script = '\t\n\r'
      expect(simpleLexer(script)).toEqual([])
    })

    test('单个字符标识符', () => {
      const script = 'a'
      expect(simpleLexer(script)).toEqual([{ type: TokenType.Id, text: 'a' }])
    })

    test('单个数字字符', () => {
      const script = '7'
      expect(simpleLexer(script)).toEqual([
        { type: TokenType.IntLiteral, text: '7' },
      ])
    })
  })

  // 特殊字符测试
  describe('特殊字符处理测试', () => {
    test('包含下划线的标识符', () => {
      const script = 'user_name >= 0'
      expect(simpleLexer(script)).toEqual([
        { type: TokenType.Id, text: 'user_name' },
        { type: TokenType.GE, text: '>=' },
        { type: TokenType.IntLiteral, text: '0' },
      ])
    })
  })
})
