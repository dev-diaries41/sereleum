export class SereleumError extends Error {
    code?: string;
    details?: Record<string, any>;

    constructor(message: string, options?: { code?: string; details?: Record<string, any> }) {
        super(message);
        this.name = "SereleumError";
        this.code = options?.code;
        Object.setPrototypeOf(this, SereleumError.prototype);
    }

    static get INVALID_PROMPT_FORMAT() {
        return new SereleumError("Invalid prompts file format", { code: "INVALID_PROMPT_FORMAT" });
    }

    static get EXCEEDED_MAX_PROMPTS() {
        return new SereleumError("Exceeded prompts limit", { code: "EXCEEDED_MAX_PROMPTS" });
    }

    static get UNAUTHORIZED() {
        return new SereleumError("Unauthorized access", { code: "UNAUTHORIZED" });
    }
}