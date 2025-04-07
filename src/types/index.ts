export interface Task {
  text: string;
  done: boolean;
}

export interface Checkup {
  id: string;
  text: string;
  checked: boolean;
}

// Unified type that can be used for both Todo and Checklist items
export interface ListItem {
  id: string;      // Unique identifier
  text: string;    // Item text content
  completed: boolean; // Whether item is completed/checked/done
  
  // Optional fields specific to different list types
  metadata?: {
    [key: string]: any; // Additional metadata specific to list type
  };
}

// Helper functions to convert between specific and unified types
export const toListItem = (item: Task | Checkup, itemType: 'todo' | 'checkup'): ListItem => {
  if (itemType === 'todo') {
    const todoItem = item as Task;
    return {
      id: Math.random().toString(36).substring(2), // Generate an ID for Task objects
      text: todoItem.text,
      completed: todoItem.done
    };
  } else {
    const checkupItem = item as Checkup;
    return {
      id: checkupItem.id,
      text: checkupItem.text,
      completed: checkupItem.checked
    };
  }
};

// Convert back to specific types if needed
export const toTask = (item: ListItem): Task => ({
  text: item.text,
  done: item.completed
});

export const toCheckup = (item: ListItem): Checkup => ({
  id: item.id,
  text: item.text,
  checked: item.completed
});
