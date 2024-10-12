export const FormateTime = (time: Date) => {
  return `${
    time.getHours() + (time.getHours() > 12 ? -12 : 0)
  }:${time.getMinutes()}${time.getHours() > 12 ? 'PM' : 'AM'}`;
};

export const FormateDurtaion = (milis: number) => {
  let min = milis / (1000 * 60);
  let sec = ~~(60 * (min - Math.floor(min)));

  return `${~~min < 10 ? '0' : ''}${~~min}:${sec < 10 ? '0' : ''}${sec}`;
};
