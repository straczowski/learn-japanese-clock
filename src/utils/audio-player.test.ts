import assert from "node:assert"
import { afterEach, beforeEach, describe, it } from "node:test"
import { createAudioPlayer } from "./audio-player"

describe("audioPlayer", () => {
  const originalAudio = globalThis.Audio
  const originalImportMeta = import.meta.env
  let mockAudioInstances: Array<{ play: () => void; currentTime: number; src: string }>
  let audioPlayer: ReturnType<typeof createAudioPlayer>

  beforeEach(() => {
    mockAudioInstances = []
    ;(globalThis as { Audio: unknown }).Audio = createMockAudioClass()
    setupImportMeta()
    audioPlayer = createAudioPlayer()
  })

  afterEach(() => {
    globalThis.Audio = originalAudio
    restoreImportMeta()
  })

  describe("playExpression", () => {
    it("should construct correct audio URL with spaces replaced", () => {
      audioPlayer.playExpression("0105", "ichi ji go-fun")

      assert.equal(mockAudioInstances.length, 1)
      assert.equal(mockAudioInstances[0].src, "/sound/voice/0105_ichi_ji_go-fun.webm")
    })

    it("should reuse cached audio on second call", () => {
      audioPlayer.playExpression("0105", "ichi ji")
      audioPlayer.playExpression("0105", "ichi ji")

      assert.equal(mockAudioInstances.length, 1)
    })

    it("should reset currentTime when reusing cached audio", () => {
      audioPlayer.playExpression("0105", "ichi ji")
      const firstAudio = mockAudioInstances[0]
      firstAudio.currentTime = 10

      audioPlayer.playExpression("0105", "ichi ji")

      assert.equal(mockAudioInstances[0].currentTime, 0)
    })
  })

  describe("playActionSound", () => {
    it("should construct correct audio URL for start sound", () => {
      audioPlayer.playStartSound()

      assert.equal(mockAudioInstances.length, 1)
      assert.equal(mockAudioInstances[0].src, "/sound/action/game-start.mp3")
    })

    it("should construct correct audio URL for success sound", () => {
      audioPlayer.playSuccessSound()

      assert.equal(mockAudioInstances.length, 1)
      assert.equal(mockAudioInstances[0].src, "/sound/action/success.mp3")
    })

    it("should construct correct audio URL for fail sound", () => {
      audioPlayer.playFailSound()

      assert.equal(mockAudioInstances.length, 1)
      assert.equal(mockAudioInstances[0].src, "/sound/action/fail.mp3")
    })

    it("should reuse cached audio for same action sound", () => {
      audioPlayer.playStartSound()
      audioPlayer.playStartSound()

      assert.equal(mockAudioInstances.length, 1)
    })
  })

  const createMockAudioClass = () => {
    return class MockAudio {
      src = ""
      currentTime = 0
      play = () => {}
      constructor(url: string) {
        this.src = url
        mockAudioInstances.push(this)
      }
    } as unknown as typeof Audio
  }

  const setupImportMeta = () => {
    Object.defineProperty(import.meta, "env", {
      value: { BASE_URL: "/" },
      writable: true,
      configurable: true,
    })
  }

  const restoreImportMeta = () => {
    Object.defineProperty(import.meta, "env", {
      value: originalImportMeta,
      writable: true,
      configurable: true,
    })
  }
})
