import { create } from 'zustand'

type CameraState = {
  rotation: { x: number; y: number; z: number }
  setRotation: (r: { x: number; y: number; z: number }) => void
}

export const useCameraStore = create<CameraState>((set) => ({
  rotation: { x: 0, y: 0, z: 0 },
  setRotation: (rotation) => set({ rotation }),
}))