/// <reference types="vite/client" />
import { InputRenderByVelocity, OutputRenderByVelocity } from './models'

declare global {
  interface Window {
    api: {
      renderByVelocity(input: InputRenderByVelocity): Promise<OutputRenderByVelocity>
    }
  }
}
