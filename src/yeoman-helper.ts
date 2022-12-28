export interface IYeomanGenerator {
    initializing?(): void,
    prompting?(): void,
    configuring?(): void,
    writing?(): void,
    conflicts?(): void,
    install?(): void,
    end?(): void
}