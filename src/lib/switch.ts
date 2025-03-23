import { UserStats } from "@/types/DBTypes";

export function switcher(stats: UserStats) {
  let state;
  switch (stats.user_exp) {
    case 5:
      state = "w-[5%]";
      break;
    case 10:
      state = "w-[10%]";
      break;
    case 15:
      state = "w-[15%]";
      break;
    case 20:
      state = "w-[20%]";
      break;
    case 25:
      state = "w-[25%]";
      break;
    case 30:
      state = "w-[30%]";
      break;
    case 35:
      state = "w-[35%]";
      break;
    case 45:
      state = "w-[35%]";
      break;
    case 50:
      state = "w-[50%]";
      break;
    case 55:
      state = "w-[55%]";
      break;
    case 60:
      state = "w-[60%]";
      break;
    case 65:
      state = "w-[65%]";
      break;
    case 70:
      state = "w-[70%]";
      break;
    case 75:
      state = "w-[75%]";
      break;
    case 80:
      state = "w-[80%]";
      break;
    case 85:
      state = "w-[85%]";
      break;
    case 90:
      state = "w-[90%]";
      break;
    case 95:
      state = "w-[95%]";
      break;
    default:
      state = "w-[0%]";
  }
  return state;
}
