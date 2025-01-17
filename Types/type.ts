export interface User {
  name: string;
}
export interface ImageInfo {
  url: string;
  id: number;
}
interface Url_Text {
  url: string;
  text: string;
}
export interface Option {
  options: Url_Text[];
  forpath?: string;
  isHover: boolean;
  setIsHover: (state: boolean) => void;
  getOptionsDivListScrollHeight: () => number | null;
}
