import { AxiosInstance } from 'axios'

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $axios: AxiosInstance
  }
}
