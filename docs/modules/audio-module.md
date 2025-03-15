# Audio Module

The Audio Module handles all sound and music playback in the game engine, including spatial audio for 3D environments.

## Purpose

This module will be responsible for:

- Sound effects playback
- Background music management
- Spatial audio in 3D environments
- Audio mixing and volume control
- Audio pooling for performance
- Configuration and settings

## Current Status

⚠️ **Planned for Implementation**: Basic audio loading exists in the ResourceManager but playback functionality needs to be implemented in a dedicated module.

## Planned Components

### AudioManager

The central service for audio playback and management:

```typescript
@injectable()
@singleton()
class AudioManager {
  // Sound effects
  playSound(id: string, options?: SoundOptions): AudioInstance;
  stopSound(id: string): void;

  // Music tracks
  playMusic(id: string, options?: MusicOptions): void;
  stopMusic(): void;
  crossfadeMusic(newTrackId: string, duration?: number): void;

  // Spatial audio
  playSpatialSound(
    id: string,
    position: Vector3,
    options?: SpatialOptions
  ): AudioInstance;

  // Volume control
  setMasterVolume(volume: number): void;
  setSoundVolume(volume: number): void;
  setMusicVolume(volume: number): void;

  // Audio state
  pauseAll(): void;
  resumeAll(): void;
  stopAll(): void;
}
```

### AudioInstance

Object representing a playing sound that can be controlled:

```typescript
interface AudioInstance {
  // Control
  play(): void;
  pause(): void;
  stop(): void;

  // Properties
  setVolume(volume: number): void;
  setPitch(pitch: number): void;
  setLoop(loop: boolean): void;

  // Spatial settings
  setPosition(position: Vector3): void;
  setVelocity(velocity: Vector3): void;
  setRange(min: number, max: number): void;

  // State
  isPlaying(): boolean;
  getDuration(): number;
  getCurrentTime(): number;
  setCurrentTime(time: number): void;

  // Events
  onEnded(callback: () => void): void;
}
```

### AudioListener

Component that represents the player's ears in the 3D world:

```typescript
@injectable()
class AudioListener {
  // Set the position and orientation of the listener
  setPosition(position: Vector3): void;
  setOrientation(forward: Vector3, up: Vector3): void;

  // Follow a camera or object
  follow(object: THREE.Object3D): void;
  stopFollowing(): void;
}
```

## Planned Features

- **Sound management**: Load, play, pause, stop sounds
- **Music system**: Background music with crossfading
- **Spatial audio**: 3D positioned sounds with distance attenuation
- **Audio pools**: Performance optimization for frequently used sounds
- **Effects**: Basic audio effects (reverb, filters, etc.)
- **Format support**: MP3, WAV, OGG formats
- **Streaming**: Streaming audio for large files
- **Adaptive audio**: Dynamic mixing based on game state

## Usage Examples

```typescript
// Basic sound playback
@injectable()
class GameScene {
  constructor(private audioManager: AudioManager) {}

  onPlayerJump(): void {
    // Play a simple sound effect
    this.audioManager.playSound('jump', { volume: 0.8 });
  }

  onLevelComplete(): void {
    // Play a sound and fade out the current music
    this.audioManager.playSound('level-complete');
    this.audioManager.crossfadeMusic('victory-theme', 2.0);
  }
}

// Spatial audio
@injectable()
class EnemyController {
  constructor(private audioManager: AudioManager) {}

  playFootstepSound(): void {
    // Play sound at the enemy's position in 3D space
    const position = this.gameObject.getObject3D().position;
    this.audioManager.playSpatialSound('footstep', position, {
      minDistance: 1,
      maxDistance: 20,
      volume: 0.5,
      randomPitch: true, // Slight random pitch variation
      pitchRange: [0.9, 1.1],
    });
  }
}
```

## Dependencies

- Web Audio API for sound processing
- Resources module for loading audio files
- THREE.js for spatial positioning

## Implementation Plan

1. Create the module directory structure (`src/modules/audio/`)
2. Implement the AudioManager with basic playback functionality
3. Add spatial audio features integrated with THREE.js
4. Create audio pooling system for performance
5. Add advanced features like effects and adaptive audio
