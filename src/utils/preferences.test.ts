import assert from "node:assert"
import { afterEach, beforeEach, describe, it } from "node:test"
import { loadPreferences, savePreferences } from "./preferences"
import { Difficulty, ClockDisplayMode } from "../types/basic"

describe("loadPreferences", () => {
  const originalWindow = globalThis.window
  const originalLocalStorage = globalThis.localStorage

  beforeEach(() => {
    delete (globalThis as { window?: unknown }).window
    globalThis.localStorage = {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
      length: 0,
      key: () => null,
    } as Storage
  })

  afterEach(() => {
    globalThis.window = originalWindow
    globalThis.localStorage = originalLocalStorage
  })

  it("should return default preferences when window is undefined", () => {
    const result = loadPreferences()

    assert.equal(result.difficulty, Difficulty.HOURS_ONLY)
    assert.equal(result.clockDisplayMode, ClockDisplayMode.ANALOG)
  })

  it("should return default preferences when localStorage is empty", () => {
    ;(globalThis as { window: unknown }).window = {}
    globalThis.localStorage.getItem = () => null

    const result = loadPreferences()

    assert.equal(result.difficulty, Difficulty.HOURS_ONLY)
    assert.equal(result.clockDisplayMode, ClockDisplayMode.ANALOG)
  })

  it("should return default preferences when stored data is invalid JSON", () => {
    ;(globalThis as { window: unknown }).window = {}
    globalThis.localStorage.getItem = () => "invalid json{"

    const result = loadPreferences()

    assert.equal(result.difficulty, Difficulty.HOURS_ONLY)
    assert.equal(result.clockDisplayMode, ClockDisplayMode.ANALOG)
  })

  it("should return default preferences when stored data does not match schema", () => {
    ;(globalThis as { window: unknown }).window = {}
    globalThis.localStorage.getItem = () => JSON.stringify({ difficulty: "invalid", clockDisplayMode: "invalid" })

    const result = loadPreferences()

    assert.equal(result.difficulty, Difficulty.HOURS_ONLY)
    assert.equal(result.clockDisplayMode, ClockDisplayMode.ANALOG)
  })

  it("should return parsed preferences when valid data exists", () => {
    ;(globalThis as { window: unknown }).window = {}
    const validPreferences = {
      difficulty: Difficulty.EXACT_TIME,
      clockDisplayMode: ClockDisplayMode.DIGITAL,
    }
    globalThis.localStorage.getItem = () => JSON.stringify(validPreferences)

    const result = loadPreferences()

    assert.equal(result.difficulty, Difficulty.EXACT_TIME)
    assert.equal(result.clockDisplayMode, ClockDisplayMode.DIGITAL)
  })
})

describe("savePreferences", () => {
  const originalWindow = globalThis.window
  const originalLocalStorage = globalThis.localStorage
  let savedItems: Record<string, string>

  beforeEach(() => {
    savedItems = {}
    delete (globalThis as { window?: unknown }).window
    globalThis.localStorage = {
      getItem: () => null,
      setItem: (key: string, value: string) => {
        savedItems[key] = value
      },
      removeItem: () => {},
      clear: () => {},
      length: 0,
      key: () => null,
    } as Storage
  })

  afterEach(() => {
    globalThis.window = originalWindow
    globalThis.localStorage = originalLocalStorage
  })

  it("should not save when window is undefined", () => {
    const preferences = {
      difficulty: Difficulty.EXACT_TIME,
      clockDisplayMode: ClockDisplayMode.DIGITAL,
    }

    savePreferences(preferences)

    assert.equal(Object.keys(savedItems).length, 0)
  })

  it("should save preferences to localStorage when window exists", () => {
    ;(globalThis as { window: unknown }).window = {}
    const preferences = {
      difficulty: Difficulty.HOURS_AND_HALF,
      clockDisplayMode: ClockDisplayMode.ANALOG,
    }

    savePreferences(preferences)

    assert.equal(Object.keys(savedItems).length, 1)
    const saved = JSON.parse(savedItems["learn-japanese-clock"])
    assert.equal(saved.difficulty, Difficulty.HOURS_AND_HALF)
    assert.equal(saved.clockDisplayMode, ClockDisplayMode.ANALOG)
  })
})
