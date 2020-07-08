// 公共方法
export function timerangeToString(timerange){
  switch (timerange) {
    case 1:
      return "今日";
    case 2:
      return "本周";
    case 3:
      return "本月";
    case 4:
      return "今年";
    default:
      return timerange;
  }
}