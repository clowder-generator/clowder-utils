/**
 * Define methods expected by a Yeoman generator.
 * A Yeoman generator expects the following methods that will
 * be executed in this exact order:
 *
 *      1) initializing
 *      2) prompting
 *      3) configuring
 *      4) default
 *      5) writing
 *      6) conflicts
 *      7) install
 *      8) end
 *
 * If a generator contains a method preceded by an underscore "_",
 * this method will not be automatically called.
 *
 * If a method does not start by "_" but does not match one of the previous
 * listed methods, it will be invoked between "configuring" and "writing",
 * in the default group.
 */
export interface IYeomanGenerator {

    /**
     * Your initialization methods (checking current project state, getting configs, etc)
     */
    initializing?: () => void;

    /**
     * Where you prompt users for options (where you’d call this.prompt())
     */
    prompting?: () => void;

    /**
     * Saving configurations and configure the project (creating .editorconfig files and other metadata files)
     */
    configuring?: () => void;

    /**
     * If the method name does not match a priority, it will be pushed to this group.
     */
    default?: () => void;

    /**
     * Where you write the generator-specific files (routes, controllers, etc)
     */
    writing?: () => void;

    /**
     * Where conflicts are handled (used internally)
     */
    conflicts?: () => void;

    /**
     * Where installations are run (npm, bower)
     */
    install?: () => void;

    /**
     * Called last, cleanup, say goodbye, etc
     */
    end?: () => void;
}

/**
 * This is a default interface to hold Context definition in Yeoman
 * TemplateData is an internal type use for Yeoman, so the name was kept
 * instead of IContext to avoid confusion
 */
export type ITemplateData = Record<string, any>;
