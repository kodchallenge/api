declare global {
    namespace NodeJS {
        interface ProcessEnv {
            JWT_SECRET: string;
            JWT_EXPIRES_IN: string;
            CODE_RUN_TIMEOUT: string;
        }
    }
}

export { };