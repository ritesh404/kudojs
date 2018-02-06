import TaskType from "./task-type";

const Task: any = (f: (rej: Function, res: Function) => any) => new TaskType(f);
Task.of = TaskType.of;
Task.rejected = TaskType.rejected;

export default Task;
