export type AnyFunction = (...args: any[]) => Promise<IHandlerFunctionResponse<any>>

export interface IHandlerFunctionResponse<T> {
  code: number
  data?: T
  headers?: any
  message: string
}
