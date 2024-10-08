export const formateFileName = (text: string) => {
  if (text.length < 15) return text;

  let textArr = text.split(".");

  let str1 = textArr[0];
  str1 = str1.slice(0, 4) + "..." + str1.slice(str1.length - 5, str1.length)+".";
  textArr[0] = str1;
  return textArr.concat();
};
