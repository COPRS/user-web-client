export function isArrayEqual(a: any[], b: any[]) {
  return (
    a?.length === b?.length && a.every((value, index) => value === b[index])
  );
}
