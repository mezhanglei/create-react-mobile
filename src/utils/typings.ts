type NestedPath<T extends 'array' | 'object', P, C = undefined> = `${P & string}${T extends 'array' ? `[${number}]` : C extends string ? `.${C}` : ''}`
type DeepNested<V, K = ''> = V extends object[]
  ? NestedPath<'array', K, DeepPath<V[number]> | undefined>
  : V extends unknown[]
  ? NestedPath<'array', K>
  : V extends object
  ? NestedPath<'object', K, DeepPath<V>>
  : never
export type DeepPath<T> = {
  [K in keyof T]-?: K | DeepNested<T[K], K>
}[keyof T];
export type RemoveNever<T> = T extends never ? undefined : T;
export type PathHead<Path> = RemoveNever<Path> extends `[${number}].${string}`
  ? number
  : RemoveNever<Path> extends `[${number}]${string}`
  ? number
  : RemoveNever<Path> extends `${infer R}.${string}`
  ? R
  : Path;
export type PathRest<Path> = RemoveNever<Path> extends `[${number}].${infer R}`
  ? R
  : RemoveNever<Path> extends `[${number}]${infer R}`
  ? R
  : RemoveNever<Path> extends `${string}.${infer R}`
  ? R
  : undefined;
// 路径映射到目标值
export type PathValue<T, Path> = PathHead<Path> extends keyof T
  ? PathRest<Path> extends string
  ? PathValue<T[PathHead<Path>], PathRest<Path>>
  : T[PathHead<Path>]
  : undefined;
