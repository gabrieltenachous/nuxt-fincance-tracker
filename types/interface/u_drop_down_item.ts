interface DropdownItem {
    label: string;
    icon?: string;
    onClick?: () => void;
  }
  
  export type ItemsType = DropdownItem[][];
  