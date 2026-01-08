export function createTodo(
  id: number | string,
  userId: string,
  title: string,
  description: string,
  status: string,
  dueDate: string,
  createdAt: string,
  updatedAt: string
) {
  return {
    id: id,
    userId: userId,
    title: title,
    description: description,
    status: status,
    dueDate: dueDate,
    createdAt: createdAt,
    updatedAt: updatedAt,
  };
}

export const todos = [
  createTodo(
    1,
    "userId1",
    "Grocery Shopping",
    "Bread, eggs, milk, tomatoes, lettuce",
    "complete",
    "2025-11-18T00:05:56.330Z",
    "2025-11-18T00:05:56.330Z",
    "2025-11-18T00:05:56.330Z"
  ),
  createTodo(
    2,
    "userId1",
    "Make Dinner",
    "Pasta, salad, tea",
    "incomplete",
    "2025-11-22T01:43:16.000Z",
    "2025-11-22T01:45:00.889Z",
    "2025-11-22T01:45:00.889Z"
  ),
  createTodo(
    3,
    "userId1",
    "Chores",
    "Laundry, dishes",
    "incomplete",
    "2025-11-24T00:46:52.757Z",
    "2025-11-24T00:55:10.616Z",
    "2025-11-24T00:55:10.616Z"
  ),
];