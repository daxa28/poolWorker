type worker = {
    id: number;
    available: boolean;
  };
  
  type callback = () => Promise<void>;
  
  interface IPoolWorkers {
    workers: worker[];
    current: number;
    tasks: callback[];
    timeWorking: number;
    addTask: (callback: callback) => void;
    run: () => void;
    executeTask: () => void;
  }
  
  class PoolWorkers implements IPoolWorkers {
    workers: worker[];
    current: number;
    tasks: callback[];
    timeWorking: number;
  
    constructor(countWorkers = 0, timeWorking = 300000) {
      this.workers = [];
      this.current = 0;
      this.tasks = [];
      this.timeWorking = timeWorking;
  
      for (let i = 0; i < countWorkers; i++) {
        this.workers.push({ id: i, available: true });
      }
  
      this.run();
    }
  
    addTask(callback: callback) {
      this.tasks.push(callback);
    }
  
    run() {
      let interval = setInterval(() => {
        if (this.tasks.length != 0) {
          this.executeTask();
        }
        // else {
        //   console.log("Not found tasks.");
        // }
      }, 500);
      setTimeout(() => {
        clearInterval(interval);
        console.log("Pool Workers stopped processing tasks for execution.");
        if (this.tasks.length > 0) {
          console.log("But there are unfulfilled tasks!");
        } else {
          console.log(
            "All tasks are completed or are in the status of execution."
          );
        }
      }, this.timeWorking);
    }
  
    async executeTask() {
      if (this.workers.length === 0) {
        if (this.tasks.length !== 0) {
          let callback: callback | undefined = this.tasks.shift();
          if (callback !== undefined) {
            callback();
          }
        }
      } else {
        const worker = this.workers[this.current];
        if (worker.available === true) {
          worker.available = false;
          this.current++;
          if (this.current === this.workers.length) this.current = 0;
          if (this.tasks.length !== 0) {
            let callback: callback | undefined = this.tasks.shift();
            if (callback !== undefined) {
              callback().then(() => {
                worker.available = true;
              });
            }
          }
        }
      }
    }
  }
  
  // usage
  
  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
  
  const time = (): string => {
    let currentdate: Date = new Date();
    return (
      currentdate.getHours() +
      ":" +
      currentdate.getMinutes() +
      ":" +
      currentdate.getSeconds()
    );
  };
  
  const poolWorkers = new PoolWorkers(3, 14000);
  
  poolWorkers.addTask(async () => {
    console.log("Task 1 - start: " + time());
    await sleep(1000);
    console.log("Task 1 - stop: " + time());
  });
  poolWorkers.addTask(async () => {
    console.log("Task 2 - start: " + time());
    await sleep(2000);
    console.log("Task 2 - stop: " + time());
  });
  poolWorkers.addTask(async () => {
    console.log("Task 3 - start: " + time());
    await sleep(3000);
    console.log("Task 3 - stop: " + time());
  });
  poolWorkers.addTask(async () => {
    console.log("Task 4 - start: " + time());
    await sleep(4000);
    console.log("Task 4 - stop: " + time());
  });
  poolWorkers.addTask(async () => {
    console.log("Task 5 - start: " + time());
    await sleep(5000);
    console.log("Task 5 - stop: " + time());
  });
  poolWorkers.addTask(async () => {
    console.log("Task 6 - start: " + time());
    await sleep(6000);
    console.log("Task 6 - stop: " + time());
  });