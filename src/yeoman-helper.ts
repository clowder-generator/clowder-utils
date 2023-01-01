export interface IYeomanGenerator {

    /**
     * Your initialization methods (checking current project state, getting configs, etc)
     */
    initializing?(): void,

    /**
     * Where you prompt users for options (where you’d call this.prompt())
     */
    prompting?(): void,

    /**
     * Saving configurations and configure the project (creating .editorconfig files and other metadata files)
     */
    configuring?(): void,

    /**
     * Where you write the generator specific files (routes, controllers, etc)
     */
    writing?(): void,

    /**
     * Where conflicts are handled (used internally)
     */
    conflicts?(): void,

    /**
     * Where installations are run (npm, bower)
     */
    install?(): void,

    /**
     * Called last, cleanup, say good bye, etc
     */
    end?(): void
}