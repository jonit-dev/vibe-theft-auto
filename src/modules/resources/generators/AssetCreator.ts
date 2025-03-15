import * as THREE from 'three';

/**
 * Utility class to create placeholder assets for demonstration
 */
export class AssetCreator {
  /**
   * Create a placeholder crate texture
   * @returns Canvas with rendered crate texture
   */
  public static createCrateTexture(): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error('Cannot get 2D context for texture creation');
      return canvas;
    }

    // Fill background
    ctx.fillStyle = '#8B4513'; // Brown
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw wood grain
    ctx.strokeStyle = '#5D2906';
    ctx.lineWidth = 3;

    // Horizontal lines
    for (let y = 24; y < canvas.height; y += 64) {
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x += 4) {
        const wavyY = y + Math.sin(x * 0.05) * 5;
        ctx.moveTo(x, wavyY);
        ctx.lineTo(x + 2, wavyY);
      }
      ctx.stroke();
    }

    // Vertical lines
    for (let x = 24; x < canvas.width; x += 64) {
      ctx.beginPath();
      for (let y = 0; y < canvas.height; y += 4) {
        const wavyX = x + Math.sin(y * 0.05) * 5;
        ctx.moveTo(wavyX, y);
        ctx.lineTo(wavyX, y + 2);
      }
      ctx.stroke();
    }

    // Draw frame
    ctx.lineWidth = 16;
    ctx.strokeRect(8, 8, canvas.width - 16, canvas.height - 16);

    // Add nails at corners
    ctx.fillStyle = '#444';
    [
      [32, 32],
      [canvas.width - 32, 32],
      [32, canvas.height - 32],
      [canvas.width - 32, canvas.height - 32],
    ].forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fill();

      // Highlight
      ctx.fillStyle = '#888';
      ctx.beginPath();
      ctx.arc(x - 2, y - 2, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#444';
    });

    return canvas;
  }

  /**
   * Save the crate texture to assets folder
   */
  public static saveCrateTexture(): void {
    const canvas = this.createCrateTexture();

    // Get data URL and convert to blob
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);

    // Create a download link
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'crate.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log(
      'Created placeholder crate texture, please save it to assets/textures/crate.jpg'
    );
  }

  /**
   * Create a placeholder GLTF model (cube)
   * @returns Three.js group containing the model
   */
  public static createCubeModel(): THREE.Group {
    const group = new THREE.Group();

    // Create a simple cube
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x45aaf2 });
    const cube = new THREE.Mesh(geometry, material);

    // Add details to make it look more like a model
    // Add frame edges
    const edgesGeometry = new THREE.EdgesGeometry(geometry);
    const edgesMaterial = new THREE.LineBasicMaterial({
      color: 0x000000,
      linewidth: 2,
    });
    const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);

    // Add to group
    group.add(cube);
    group.add(edges);

    return group;
  }

  /**
   * Create a simple audio buffer for demo
   * @returns AudioBuffer with a simple tone
   */
  public static createAudioBuffer(
    audioContext: AudioContext,
    duration: number = 1,
    frequency: number = 440
  ): AudioBuffer {
    const sampleRate = audioContext.sampleRate;
    const buffer = audioContext.createBuffer(
      1,
      sampleRate * duration,
      sampleRate
    );

    // Fill the buffer with a simple sine wave
    const data = buffer.getChannelData(0);
    for (let i = 0; i < buffer.length; i++) {
      // Simple sine wave
      data[i] = Math.sin((2 * Math.PI * frequency * i) / sampleRate);

      // Apply fade in/out
      const fadeTime = 0.1; // 100ms fade
      const fadeSamples = fadeTime * sampleRate;
      if (i < fadeSamples) {
        // Fade in
        data[i] *= i / fadeSamples;
      } else if (i > buffer.length - fadeSamples) {
        // Fade out
        data[i] *= (buffer.length - i) / fadeSamples;
      }
    }

    return buffer;
  }
}
