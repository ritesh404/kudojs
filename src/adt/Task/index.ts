import TaskType from "./task-type";

// tslint:disable-next-line
const Task = (f: (rej: Function, res: Function) => any) => new TaskType(f);
Task.of = TaskType.of;
Task.rejected = TaskType.rejected;

export default Task;
