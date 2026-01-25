import assert from "node:assert"
import { describe, it } from "node:test"
import { mergeClasses } from "./merge-classes"

describe("mergeClasses", () => {
  it("should merge simple class name strings", () => {
    const result = mergeClasses("foo", "bar", "baz")
    assert.equal(result, "foo bar baz")
  })

  it("should handle conditional classes using objects", () => {
    const result = mergeClasses(
      "base-class",
      { "active-class": true },
      { "disabled-class": false }
    )
    assert.equal(result, "base-class active-class")
  })

  it("should override conflicting Tailwind classes with later values", () => {
    const result = mergeClasses("px-2 py-3", "px-4")
    assert.equal(result, "py-3 px-4")
  })

  it("should resolve multiple conflicting Tailwind utilities", () => {
    const result = mergeClasses("px-2 py-3 text-red-500", "px-4 text-blue-500")
    assert.equal(result, "py-3 px-4 text-blue-500")
  })
})
