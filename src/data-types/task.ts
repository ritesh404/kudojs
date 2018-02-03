import TaskType, {_of, _rejected} from "./task-type"

const Task: any = (f: Function) => new TaskType(f);
Task.of = _of;
Task.rejected = _rejected;

export default Task;