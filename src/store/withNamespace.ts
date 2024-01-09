// 给对象添加命名空间（根据实际再考虑要不要使用）
export default function withNameSpace<T>(obj: T, namespace: string) {
  return Object.fromEntries(Object.entries(obj).map(([key, data]) => ([`${namespace}/${key}`, data]))) as T;
};
