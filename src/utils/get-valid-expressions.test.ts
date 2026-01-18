import assert from "node:assert"
import { describe, it } from "node:test"
import { getValidExpressions, findMatchingExpression } from "./get-valid-expressions"
import type { Expression } from "../types/basic"

describe("getValidExpressions", () => {
  it("should return combined expressions for valid timeId", () => {
    const result = getValidExpressions("0105")
    
    assert.equal(result.length, 2)
    assert.equal(result[0].hiragana, "いちじごふん")
    assert.equal(result[0].romaji, "ichi_ji_go-fun")
    assert.equal(result[1].hiragana, "ごぜんいちじごふん")
    assert.equal(result[1].romaji, "gozen_ichi_ji_go-fun")
  })

  it("should replace spaces with underscores in romaji. Required to build sound ID", () => {
    const result = getValidExpressions("0101")
    
    result.forEach(expr => {
      assert.equal(expr.romaji.includes(" "), false)
      assert.equal(expr.romaji.includes("_"), true)
    })
  })

  it("should combine multiple hour and minute expressions correctly", () => {
    const result = getValidExpressions("1230")

    assert.equal(result.length, 4)
    const hasHalf = result.some(expr => expr.hiragana.includes("はん"))
    assert.equal(hasHalf, true)
  })

  it("should throw error for invalid hour key", () => {
    assert.throws(() => {
      getValidExpressions("9905")
    }, /Coulnd not find expression for hours/)
  })

  it("should throw error for invalid minute key", () => {
    assert.throws(() => {
      getValidExpressions("0199")
    }, /Coulnd not find expression for hours/)
  })
})

describe("findMatchingExpression", () => {
  const validExpressions: Array<Expression> = [
    { hiragana: "いちじごふん", romaji: "ichi_ji_go-fun" },
    { hiragana: "ごぜんいちじごふん", romaji: "gozen_ichi_ji_go-fun" },
    { hiragana: "にじ", romaji: "ni_ji" },
  ]

  it("should find exact match", () => {
    const result = findMatchingExpression("いちじごふん", validExpressions)
    
    assert.notEqual(result, null)
    assert.equal(result?.hiragana, "いちじごふん")
    assert.equal(result?.romaji, "ichi_ji_go-fun")
  })

  it("should find match whitespace", () => {
    const result = findMatchingExpression("  いちじ ごふん ", validExpressions)
    
    assert.notEqual(result, null)
    assert.equal(result?.hiragana, "いちじごふん")
  })

  it("should return null when no match found", () => {
    const result = findMatchingExpression("ほげほげ", validExpressions)
    
    assert.equal(result, null)
  })

  it("should handle empty input string", () => {
    const result = findMatchingExpression("", validExpressions)
    
    assert.equal(result, null)
  })
})
