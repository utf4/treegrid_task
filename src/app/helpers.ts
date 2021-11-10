export function custompasteHelper(temArray: any[], selectedRowIndex: any[]) {
  for (let i = 0; i < selectedRowIndex.length; i++) {
    delete temArray[selectedRowIndex[i]];
  }
  temArray = temArray.filter((item) => item !== undefined);
  return temArray;
}
export const replacerFunc = () => {
  const visited = new WeakSet();
  return (_key: any, value: object | null) => {
    if (typeof value === "object" && value !== null) {
      if (visited.has(value)) {
        return;
      }
      visited.add(value);
    }
    return value;
  };
};
