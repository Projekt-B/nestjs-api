import { JobOptions } from 'bull';

export default (): { notifyQueue: JobOptions } => ({
    notifyQueue: {
        priority: parseInt(process.env.NOTIFY_QUEUE_PRIORITY) || 1,
        delay: parseInt(process.env.NOTIFY_QUEUE_DELAY) || 3000, // miliseconds
        attempts: parseInt(process.env.NOTIFY_QUEUE_ATTEMPTS) || 3,
        lifo: process.env.NOTIFY_QUEUE_LAST_IN_FIRST_OUT === 'true' || false,
        timeout: parseInt(process.env.NOTIFY_QUEUE_TIMEOUT) || 30, // seconds
        removeOnComplete:
            !!process.env.NOTIFY_QUEUE_REMOVE_ON_COMPLETE || false,
        removeOnFail: parseInt(process.env.NOTIFY_QUEUE_REMOVE_ON_FAIL) || 10,
        stackTraceLimit:
            parseInt(process.env.NOTIFY_QUEUE_STACK_TRACE_LIMIT) || 50,
    },
});
