import TaskType from "./task-type"

const Task = (f: Function) => new TaskType(f);

export default Task;